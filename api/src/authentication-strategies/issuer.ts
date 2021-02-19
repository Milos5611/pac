/*
 *
 REFERENCE: https://github.com/okta/okta-oidc-js/blob/master/packages/jwt-verifier/lib.js
 *
 */
import debugFactory from 'debug';
const OktaJwtVerifier = require('@okta/jwt-verifier');
const debug = debugFactory('loopback:multi-tenancy:sso:cognito:issuer');
type IssuerUri = string;
export class Issuer {
  private static instance: Issuer;
  private oktaJwtVerifier: any;
  private issuerUri: IssuerUri = "https://dev-26276100.okta.com/oauth2/default";
  private constructor() {
    debug('Creating Issuer...', this.issuerUri);
    this.oktaJwtVerifier = new OktaJwtVerifier({
      issuer: this.issuerUri,
    });
  }
  public static getInstance(): Issuer {
    if (!Issuer.instance) {
      Issuer.instance = new Issuer();
    }
    return Issuer.instance;
  }
  async verifyAccessToken(accessTokenString: string, apiDefault?: string) {
    return await this.oktaJwtVerifier.verifyAccessToken(accessTokenString, "api://default") as any;
  }
}