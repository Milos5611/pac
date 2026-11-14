import OktaJwtVerifier from '@okta/jwt-verifier';
import {GraphQLContext} from '../helper';

export interface AuthenticatedUser {
  sub: string;
}

let verifier: OktaJwtVerifier | undefined;

function getVerifier(issuer: string): OktaJwtVerifier {
  verifier ??= new OktaJwtVerifier({issuer});
  return verifier;
}

export class AuthenticationError extends Error {
  readonly extensions = {code: 'UNAUTHENTICATED'};
}

export async function requireUser(
  context: GraphQLContext,
): Promise<AuthenticatedUser> {
  if (process.env.AUTH_DISABLED === 'true') {
    return {sub: 'local-dev'};
  }

  const issuer = process.env.OKTA_ISSUER;
  if (!issuer) {
    throw new AuthenticationError(
      'Authentication is not configured on the server (OKTA_ISSUER is not set)',
    );
  }

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
    const jwt = await getVerifier(issuer).verifyAccessToken(
      token,
      process.env.OKTA_AUDIENCE ?? 'api://default',
    );
    return {sub: String(jwt.claims.sub)};
  } catch (err) {
    throw new AuthenticationError(
      `Invalid access token: ${(err as Error).message}`,
    );
  }
}
