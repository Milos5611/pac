<script>
  import Link from '../../component/link/Link.svelte';
  import Chip from '../../component/chip/Chip.svelte';
  import Icon from '../../component/icon/Icon.svelte';
  import SearchField from '../../component/search/SearchField.svelte';
  import CardSkeletons from '../../component/state/CardSkeletons.svelte';
  import EmptyState from '../../component/state/EmptyState.svelte';
  import {gql} from '../../lib/graphql.js';
  import {
    cleanTitle,
    dateBadge,
    formatDateRange,
    matches,
    plural,
  } from '../../lib/format.js';
  import {EVENTS_QUERY} from './data.js';
  import {
    eventRooms,
    eventTalks,
    eventTopics,
    sortByStart,
  } from './helpers.js';

  const MAX_TOPICS = 3;

  /** @type {Promise<{events: import('./helpers.js').ConferenceEvent[]}>} */
  const request = gql(EVENTS_QUERY);
  let query = $state('');

  /** @param {import('./helpers.js').ConferenceEvent} event */
  function searchable(event) {
    return [
      event.name,
      event.location?.name,
      ...eventTopics(event),
      ...eventTalks(event).map(talk => talk.title),
    ];
  }
</script>

<svelte:head>
  <title>Events · Eventio</title>
</svelte:head>

<div class="container page">
  <header class="page-header">
    <div>
      <p class="eyebrow">Programme</p>
      <h1>Events</h1>
      {#await request then data}
        {@const cities = new Set(data.events.map(e => e.location?.name).filter(Boolean))}
        <p class="muted summary">
          {plural(data.events.length, 'event')} in {plural(
            cities.size,
            'city',
            'cities',
          )}
        </p>
      {/await}
    </div>
    <SearchField
      bind:value={query}
      placeholder="Search events, cities, topics"
      label="Search events" />
  </header>

  {#await request}
    <CardSkeletons count={6} />
  {:then data}
    {@const events = sortByStart(data.events).filter(e =>
      matches(query, searchable(e)),
    )}
    {#if events.length}
      <ul class="grid">
        {#each events as event, i (event.id)}
          {@const badge = dateBadge(event.start_date)}
          {@const topics = eventTopics(event)}
          {@const talks = eventTalks(event).length}
          {@const rooms = eventRooms(event).length}
          <li class="fade-up" style:animation-delay="{Math.min(i, 8) * 40}ms">
            <Link to="/event/{event.id}" class="card-link">
              <article class="event">
                <div class="top">
                  <div class="date" aria-hidden="true">
                    <span class="month">{badge.month}</span>
                    <span class="day">{badge.day}</span>
                  </div>
                  <div class="heading">
                    <h2>{cleanTitle(event.name)}</h2>
                    <p class="meta">
                      <Icon name="calendar" size={15} />
                      {formatDateRange(event.start_date, event.end_date)}
                    </p>
                    {#if event.location?.name}
                      <p class="meta">
                        <Icon name="map-pin" size={15} />
                        {event.location.name}
                      </p>
                    {/if}
                  </div>
                </div>

                {#if topics.length}
                  <ul class="tags" aria-label="Topics">
                    {#each topics.slice(0, MAX_TOPICS) as topic (topic)}
                      <li><Chip name={topic} /></li>
                    {/each}
                    {#if topics.length > MAX_TOPICS}
                      <li>
                        <Chip name="+{topics.length - MAX_TOPICS}" muted />
                      </li>
                    {/if}
                  </ul>
                {/if}

                <footer>
                  <span>
                    <Icon name="presentation" size={15} />
                    {plural(talks, 'talk')} · {plural(rooms, 'room')}
                  </span>
                  <Icon name="arrow-right" size={18} class="go" />
                </footer>
              </article>
            </Link>
          </li>
        {/each}
      </ul>
    {:else if query}
      <EmptyState
        title="No events match “{query}”"
        message="Try another event name, city, topic or talk title.">
        <button
          type="button"
          class="btn btn-secondary"
          onclick={() => (query = '')}>
          Clear search
        </button>
      </EmptyState>
    {:else}
      <EmptyState
        icon="calendar"
        title="No events yet"
        message="Events will show up here once they are added." />
    {/if}
  {:catch error}
    <EmptyState
      tone="error"
      title="Couldn’t load events"
      message={error.message}>
      <button
        type="button"
        class="btn btn-secondary"
        onclick={() => location.reload()}>
        Try again
      </button>
    </EmptyState>
  {/await}
</div>

<style>
  .summary {
    margin-top: 6px;
  }

  .event {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 18px;
    padding: 20px;
  }

  .top {
    display: flex;
    gap: 14px;
  }

  .date {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 58px;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--primary-soft);
    color: var(--primary-text);
    line-height: 1;
  }

  .month {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .day {
    margin-top: 4px;
    font-size: 1.375rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .heading {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  h2 {
    margin-bottom: 4px;
    font-size: 1.0625rem;
    font-weight: 650;
    line-height: 1.35;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-2);
    font-size: 0.875rem;
  }

  .meta :global(.icon) {
    color: var(--text-3);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    color: var(--text-3);
    font-size: 0.8125rem;
    font-weight: 500;
  }

  footer span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  footer :global(.go) {
    transition:
      transform 0.25s var(--ease),
      color 0.25s var(--ease);
  }

  :global(.card-link:hover) footer :global(.go) {
    color: var(--primary-text);
    transform: translateX(3px);
  }
</style>
