import jwt, {JwtHeader, JwtPayload, SigningKeyCallback} from 'jsonwebtoken';
import {JwksClient} from 'jwks-rsa';
import {GraphQLContext} from '../helper';

export interface AuthenticatedUser {
  sub: string;
}

export class AuthenticationError extends Error {
  readonly extensions = {code: 'UNAUTHENTICATED'};
}

let jwks: {issuer: string; client: JwksClient} | undefined;

/** Auth0 publishes its signing keys at `<issuer>.well-known/jwks.json`. */
function getJwksClient(issuer: string): JwksClient {
  if (jwks?.issuer !== issuer) {
    jwks = {
      issuer,
      client: new JwksClient({
        jwksUri: `${issuer}.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
      }),
    };
  }
  return jwks.client;
}

function verifyAccessToken(
  token: string,
  issuer: string,
  audience: string,
): Promise<JwtPayload> {
  // jsonwebtoken asks for the public key matching the token's `kid`;
  // jwks-rsa fetches it from Auth0 once and caches it
  const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
    getJwksClient(issuer)
      .getSigningKey(header.kid)
      .then(
        key => callback(null, key.getPublicKey()),
        err => callback(err as Error),
      );
  };

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {issuer, audience, algorithms: ['RS256']},
      (err, payload) => {
        if (err) reject(err);
        else if (!payload || typeof payload === 'string') {
          reject(new Error('token payload is not a JSON object'));
        } else resolve(payload);
      },
    );
  });
}

export async function requireUser(
  context: GraphQLContext,
): Promise<AuthenticatedUser> {
  // main() already refuses this in production; repeated here for code paths
  // that create the app without main()
  if (
    process.env.AUTH_DISABLED === 'true' &&
    process.env.NODE_ENV !== 'production'
  ) {
    return {sub: 'local-dev'};
  }

  const issuerSetting = process.env.AUTH0_ISSUER;
  const audience = process.env.AUTH0_AUDIENCE;
  if (!issuerSetting || !audience) {
    throw new AuthenticationError(
      'Authentication is not configured on the server (AUTH0_ISSUER and AUTH0_AUDIENCE must be set)',
    );
  }
  // Auth0 issuers always end with a slash, and `iss` must match exactly
  const issuer = issuerSetting.replace(/\/*$/, '/');

  const header = context.req?.headers?.authorization;
  if (!header) {
    throw new AuthenticationError('Authorization header not found');
  }
  const [scheme, token, ...rest] = header.split(' ');
  if (scheme !== 'Bearer' || !token || rest.length) {
    throw new AuthenticationError(
      "Authorization header must follow the pattern 'Bearer <token>'",
    );
  }

  try {
    const claims = await verifyAccessToken(token, issuer, audience);
    return {sub: String(claims.sub)};
  } catch (err) {
    throw new AuthenticationError(
      `Invalid access token: ${(err as Error).message}`,
    );
  }
}
