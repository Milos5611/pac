export const router = $state({path: window.location.pathname});

window.addEventListener('popstate', () => {
  router.path = window.location.pathname;
});

/**
 * @param {string} to
 * @param {{replace?: boolean}} [options]
 */
export function navigate(to, {replace = false} = {}) {
  if (replace) window.history.replaceState(null, '', to);
  else window.history.pushState(null, '', to);
  router.path = window.location.pathname;
  window.scrollTo(0, 0);
}

/** @typedef {{path: string, component: any, layout?: any}} Route */

/**
 * @param {Route[]} routes
 * @param {string} path
 * @returns {{route: Route, params: Record<string, string>} | null}
 */
export function matchRoute(routes, path) {
  const segments = trim(path).split('/');
  for (const route of routes) {
    const pattern = trim(route.path).split('/');
    if (pattern.length !== segments.length) continue;
    /** @type {Record<string, string>} */
    const params = {};
    const ok = pattern.every((part, i) => {
      if (part.startsWith(':')) {
        params[part.slice(1)] = decodeURIComponent(segments[i]);
        return segments[i] !== '';
      }
      return part === segments[i];
    });
    if (ok) return {route, params};
  }
  return null;
}

/** @param {string} path */
function trim(path) {
  return path.replace(/^\/+|\/+$/g, '');
}
