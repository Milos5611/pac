import {config} from './config.js';
import {getAccessToken} from './auth.svelte.js';

/**
 * @param {string} query
 * @param {Record<string, unknown>} [variables]
 * @returns {Promise<any>}
 */
export async function gql(query, variables = {}) {
  /** @type {Record<string, string>} */
  const headers = {'Content-Type': 'application/json'};
  const token = await getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(config.graphqlUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({query, variables}),
  });

  // GraphQL errors arrive in the JSON body, often with HTTP 200, so read the
  // body first and fall back to the status only when there is no message
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`GraphQL request failed: HTTP ${response.status}`);
  }
  if (body.errors?.length) {
    throw new Error(body.errors.map(e => e.message).join('; '));
  }
  if (!response.ok) {
    throw new Error(`GraphQL request failed: HTTP ${response.status}`);
  }
  return body.data;
}

/**
 * Message for a failed mutation, with auth failures in plain words.
 * @param {unknown} error
 */
export function errorMessage(error) {
  const text = error instanceof Error ? error.message : String(error);
  if (/Authorization header|Invalid access token|not configured/i.test(text)) {
    return 'You need to be logged in to make changes. Log in and try again.';
  }
  return text;
}
