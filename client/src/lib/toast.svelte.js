/** @typedef {{id: number, message: string, tone: 'success' | 'error'}} Toast */

/** @type {Toast[]} */
export const toasts = $state([]);

let nextId = 1;

/**
 * @param {string} message
 * @param {'success' | 'error'} [tone]
 */
export function toast(message, tone = 'success') {
  const id = nextId++;
  toasts.push({id, message, tone});
  setTimeout(() => dismiss(id), tone === 'error' ? 6000 : 3500);
}

/** @param {number} id */
export function dismiss(id) {
  const index = toasts.findIndex(t => t.id === id);
  if (index !== -1) toasts.splice(index, 1);
}
