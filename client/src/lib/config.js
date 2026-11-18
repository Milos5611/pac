const runtime = window.APP_CONFIG ?? {};

const buildTime = {
  SVELTE_APP_BE_URL: import.meta.env.SVELTE_APP_BE_URL,
  SVELTE_APP_ISSUER: import.meta.env.SVELTE_APP_ISSUER,
  SVELTE_APP_CLIENT_ID: import.meta.env.SVELTE_APP_CLIENT_ID,
  SVELTE_APP_REDIRECT_URL: import.meta.env.SVELTE_APP_REDIRECT_URL,
  SVELTE_APP_AUDIENCE: import.meta.env.SVELTE_APP_AUDIENCE,
};

/**
 * @param {keyof typeof buildTime} key
 * @param {string} fallback
 */
function setting(key, fallback) {
  for (const value of [runtime[key], buildTime[key]]) {
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
  }
  return fallback;
}

export const config = {
  graphqlUrl: setting('SVELTE_APP_BE_URL', 'http://localhost:3000/graphql'),
  oidcIssuer: setting('SVELTE_APP_ISSUER', ''),
  oidcClientId: setting('SVELTE_APP_CLIENT_ID', ''),
  oidcRedirectUri: setting('SVELTE_APP_REDIRECT_URL', window.location.origin),
  oidcAudience: setting('SVELTE_APP_AUDIENCE', ''),
};
