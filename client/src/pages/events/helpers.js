/**
 * @typedef {{name: string}} Topic
 * @typedef {{id?: string, title?: string, duration?: number, level?: string, language?: string, topics?: Topic[] | null}} Talk
 * @typedef {{name: string, talks?: Talk[] | null}} Room
 * @typedef {{id: string, name: string, start_date?: string, end_date?: string, location?: {name: string, rooms?: Room[] | null} | null}} ConferenceEvent
 */

/** @param {ConferenceEvent} event */
export function eventRooms(event) {
  return event.location?.rooms ?? [];
}

/** @param {ConferenceEvent} event */
export function eventTalks(event) {
  return eventRooms(event).flatMap(room => room.talks ?? []);
}

/**
 * Unique topic names across all talks of an event.
 * @param {ConferenceEvent} event
 */
export function eventTopics(event) {
  const names = new Set();
  for (const talk of eventTalks(event)) {
    for (const topic of talk.topics ?? []) names.add(topic.name);
  }
  return /** @type {string[]} */ ([...names]);
}

/**
 * Earliest start first; events without a start date go last.
 * @param {ConferenceEvent[]} events
 */
export function sortByStart(events) {
  const time = (/** @type {ConferenceEvent} */ e) =>
    e.start_date ? new Date(e.start_date).getTime() : Infinity;
  return [...events].sort((a, b) => time(a) - time(b));
}
