import {expect} from '@loopback/testlab';
import {
  autoMigrateEnabled,
  checkStartupConfig,
  ConfigError,
  corsOrigins,
} from '../../config';

describe('startup config', () => {
  const production = {
    NODE_ENV: 'production',
    DB_HOST: 'db',
    DB_USER: 'app',
    DB_PASSWORD: 'secret',
    DB_DATABASE: 'conference',
    AUTH0_ISSUER: 'https://tenant.auth0.com/',
    AUTH0_AUDIENCE: 'https://pac-api',
    CORS_ORIGINS: 'https://pac.example',
  };

  it('accepts a complete production config', () => {
    expect(checkStartupConfig(production)).to.eql([]);
  });

  it('refuses AUTH_DISABLED in production', () => {
    expect(() =>
      checkStartupConfig({...production, AUTH_DISABLED: 'true'}),
    ).to.throw(ConfigError, /AUTH_DISABLED/);
  });

  it('refuses production without database or Auth0 settings', () => {
    expect(() => checkStartupConfig({NODE_ENV: 'production'})).to.throw(
      /AUTH0_ISSUER[\s\S]*DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE/,
    );
  });

  it('only warns about missing Auth0 settings in development', () => {
    expect(checkStartupConfig({NODE_ENV: 'development'})).to.match([
      /AUTH0_ISSUER/,
    ]);
  });

  it('refuses malformed numbers and flags', () => {
    expect(() =>
      checkStartupConfig({
        AUTH_DISABLED: 'true',
        DB_PORT: '54x',
        AUTO_MIGRATE: 'yes',
      }),
    ).to.throw(/DB_PORT[\s\S]*AUTO_MIGRATE/);
  });

  it('migrates on start by default except in production', () => {
    expect(autoMigrateEnabled({})).to.be.true();
    expect(autoMigrateEnabled({NODE_ENV: 'production'})).to.be.false();
    expect(
      autoMigrateEnabled({NODE_ENV: 'production', AUTO_MIGRATE: 'true'}),
    ).to.be.true();
    expect(autoMigrateEnabled({AUTO_MIGRATE: 'false'})).to.be.false();
  });

  it('parses CORS_ORIGINS and falls back to local dev origins', () => {
    expect(
      corsOrigins({CORS_ORIGINS: ' https://a.example, https://b.example ,'}),
    ).to.eql(['https://a.example', 'https://b.example']);
    expect(corsOrigins({})).to.containEql('http://localhost:5173');
  });
});
