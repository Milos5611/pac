/**
 * Environment settings read once at startup, so a broken deployment fails
 * before it serves traffic instead of on the first request.
 */

const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:8080',
];

export class ConfigError extends Error {}

export function isProduction(env = process.env): boolean {
  return env.NODE_ENV === 'production';
}

/** Schema migration and seeding on start: on by default except in production. */
export function autoMigrateEnabled(env = process.env): boolean {
  if (!env.AUTO_MIGRATE) return !isProduction(env);
  return env.AUTO_MIGRATE === 'true';
}

/** Browser origins allowed by CORS, from comma-separated `CORS_ORIGINS`. */
export function corsOrigins(env = process.env): string[] {
  const origins = (env.CORS_ORIGINS ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
  return origins.length ? origins : DEV_ORIGINS;
}

/**
 * Throws a ConfigError listing every setting that makes the server unsafe or
 * unusable. Returns warnings for settings that only limit what works.
 */
export function checkStartupConfig(env = process.env): string[] {
  const errors: string[] = [];
  const warnings: string[] = [];
  const production = isProduction(env);

  for (const name of [
    'PORT',
    'DB_PORT',
    'DB_POOL_MAX',
    'DB_STATEMENT_TIMEOUT_MS',
  ]) {
    const value = env[name];
    if (value && !/^\d+$/.test(value)) {
      errors.push(`${name} must be a whole number, got "${value}"`);
    }
  }

  if (env.AUTO_MIGRATE && !['true', 'false'].includes(env.AUTO_MIGRATE)) {
    errors.push(
      `AUTO_MIGRATE must be true or false, got "${env.AUTO_MIGRATE}"`,
    );
  }

  if (env.AUTH_DISABLED === 'true') {
    if (production) {
      errors.push('AUTH_DISABLED=true is not allowed when NODE_ENV=production');
    } else {
      warnings.push('AUTH_DISABLED=true: mutations skip the login check');
    }
  } else if (!env.AUTH0_ISSUER || !env.AUTH0_AUDIENCE) {
    (production ? errors : warnings).push(
      'AUTH0_ISSUER and AUTH0_AUDIENCE are not set, so every mutation fails',
    );
  }

  if (production) {
    const missing = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'].filter(
      name => !env[name],
    );
    if (missing.length) {
      errors.push(`${missing.join(', ')} must be set when NODE_ENV=production`);
    }
    if (!env.CORS_ORIGINS) {
      warnings.push(
        `CORS_ORIGINS is not set, so browsers can only call the API from ${DEV_ORIGINS.join(', ')}`,
      );
    }
  }

  if (errors.length) {
    throw new ConfigError(`Invalid configuration:\n- ${errors.join('\n- ')}`);
  }
  return warnings;
}
