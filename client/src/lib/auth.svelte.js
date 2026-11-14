import {UserManager, WebStorageStateStore} from 'oidc-client-ts';
import {config} from './config.js';
import {navigate} from './router.svelte.js';

export const authEnabled = Boolean(config.oidcIssuer && config.oidcClientId);

/** @type {{ready: boolean, user: import('oidc-client-ts').User | null, error: string | null}} */
export const auth = $state({ready: false, user: null, error: null});

const manager = authEnabled
  ? new UserManager({
      authority: config.oidcIssuer,
      client_id: config.oidcClientId,
      redirect_uri: config.oidcRedirectUri,
      post_logout_redirect_uri: config.oidcRedirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      userStore: new WebStorageStateStore({store: window.sessionStorage}),
    })
  : null;

export async function initAuth() {
  if (!manager) {
    auth.ready = true;
    return;
  }
  manager.events.addUserLoaded(user => {
    auth.user = user;
  });
  manager.events.addUserUnloaded(() => {
    auth.user = null;
  });
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('state') && (params.has('code') || params.has('error'))) {
      const user = await manager.signinRedirectCallback();
      const state = /** @type {{returnTo?: string} | undefined} */ (user.state);
      navigate(state?.returnTo ?? '/', {replace: true});
    }
    const user = await manager.getUser();
    auth.user = user && !user.expired ? user : null;
  } catch (error) {
    auth.error = error instanceof Error ? error.message : String(error);
    navigate(window.location.pathname, {replace: true});
  } finally {
    auth.ready = true;
  }
}

export async function login() {
  if (!manager) return;
  const returnTo = window.location.pathname + window.location.search;
  await manager.signinRedirect({state: {returnTo}});
}

export async function logout() {
  if (!manager) return;
  try {
    await manager.signoutRedirect();
  } catch {
    await manager.removeUser();
    navigate('/');
  }
}

export function accessToken() {
  const user = auth.user;
  return user && !user.expired ? user.access_token : null;
}
