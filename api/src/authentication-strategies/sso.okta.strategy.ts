import {Issuer} from './issuer';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import jwt_decode from 'jwt-decode';
import debugFactory from 'debug';
import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
import {injectable} from '@loopback/core';
const debug = debugFactory('loopback:multi-tenancy:sso:okta');

@injectable(asAuthStrategy)
class SSOOktaStrategy implements AuthenticationStrategy {
  name = 'sso.okta';
  async authenticate(request: any): Promise<UserProfile> {
    const token: string = this.extractCredentials(request);
    const userProfile: UserProfile = await this.verifyToken(token);
    return userProfile;
  }
  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }
    // for example : Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }
    //split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    const token = parts[1];
    return token;
  }
  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }
    let userProfile: UserProfile;
    const decoded = jwt_decode(token) as any;
    debug('decodedAccessToken', decoded);
    const issuer = Issuer.getInstance();
    // const clientId = process.env.CLIENT_ID || "0oa5v4cgxUyPfnyUR5d6";
    try {
      const decodedAccessToken = await issuer.verifyAccessToken(token) as any;
      debug('decodedAccessToken after verification', decodedAccessToken);
      console.log(decodedAccessToken);
      userProfile = Object.assign(
        {
          email: decodedAccessToken.claims.sub,
        },
      );
      debug('userProfile', userProfile);
    } catch (error) {
      throw new Error(error)
    }
    return userProfile;
  }
}

export default new SSOOktaStrategy();
