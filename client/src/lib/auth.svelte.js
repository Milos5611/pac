import {Auth0Client, GenericError} from '@auth0/auth0-spa-js';
import {config} from './config.js';
import {navigate} from './router.svelte.js';

/** @typedef {import('@auth0/auth0-spa-js').User} User */

/** @type {{ready: boolean, user: User | null, error: string | null}} */
export const auth = $state({ready: false, user: null, error: null});

/** Errors that just mean "no usable session": treat the user as logged out. */
const SESSION_GONE = new Set([
  'login_required',
  'consent_required',
  'interaction_required',
  'missing_refresh_token',
  'invalid_grant',
]);

const client = createClient();

/** Login is available only when Auth0 is configured and the SDK could start. */
export const authEnabled = client !== null;

/** @returns {Auth0Client | null} */
function createClient() {
  if (!config.oidcIssuer || !config.oidcClientId) return null;
  try {
    return new Auth0Client({
      // SVELTE_APP_ISSUER is the tenant URL; the SDK wants the bare host
      domain: new URL(config.oidcIssuer).host,
      clientId: config.oidcClientId,
      authorizationParams: {
        redirect_uri: config.oidcRedirectUri,
        ...(config.oidcAudience ? {audience: config.oidcAudience} : {}),
      },
      // Survive page reloads without third-party cookies; refresh tokens rotate
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      useRefreshTokensFallback: true,
    });
  } catch (error) {
    // The SDK needs window.crypto.subtle, i.e. https or localhost
    console.warn('Login disabled:', error);
    return null;
  }
}

/** @param {unknown} error */
function message(error) {
  if (error instanceof GenericError) return error.error_description || error.error;
  return error instanceof Error ? error.message : String(error);
}

export async function initAuth() {
  if (!client) {
    auth.ready = true;
    return;
  }
  try {
    // Auth0 redirects back with ?code&state on success or ?error&state on
    // failure; exchange it for tokens, then drop the query from the URL.
    // Otherwise refresh the cached session; failing that just means "guest".
    const params = new URLSearchParams(window.location.search);
    if (params.has('state') && (params.has('code') || params.has('error'))) {
      const {appState} = await client.handleRedirectCallback();
      navigate(appState?.returnTo ?? '/', {replace: true});
    } else {
      await client.checkSession().catch(() => {});
    }
    auth.user = (await client.isAuthenticated())
      ? ((await client.getUser()) ?? null)
      : null;
  } catch (error) {
    auth.error = message(error);
    navigate(window.location.pathname, {replace: true});
  } finally {
    auth.ready = true;
  }
}

export async function login() {
  if (!client) return;
  auth.error = null;
  const returnTo = window.location.pathname + window.location.search;
  await client.loginWithRedirect({appState: {returnTo}});
}

export async function logout() {
  if (!client) return;
  await client.logout({logoutParams: {returnTo: config.oidcRedirectUri}});
}

/**
 * A valid access token for the API, renewed with the refresh token when it
 * has expired. Null for guests or when the session can no longer be renewed.
 * @returns {Promise<string | null>}
 */
export async function getAccessToken() {
  if (!client || !auth.user) return null;
  try {
    return (await client.getTokenSilently()) ?? null;
  } catch (error) {
    if (error instanceof GenericError && SESSION_GONE.has(error.error)) {
      auth.user = null;
      return null;
    }
    throw error;
  }
}
