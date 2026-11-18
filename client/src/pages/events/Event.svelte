<script>
  import Link from '../../component/link/Link.svelte';
  import Chip from '../../component/chip/Chip.svelte';
  import Icon from '../../component/icon/Icon.svelte';
  import EmptyState from '../../component/state/EmptyState.svelte';
  import {gql} from '../../lib/graphql.js';
  import {
    cleanTitle,
    dayCount,
    formatDateRange,
    levelClass,
    plural,
  } from '../../lib/format.js';
  import {EVENT_QUERY} from './data.js';
  import {eventRooms, eventTalks} from './helpers.js';

  /** @type {{params: {id: string}}} */
  let {params} = $props();

  /** @type {Promise<{event: import('./helpers.js').ConferenceEvent | null}>} */
  const request = $derived(gql(EVENT_QUERY, {eventId: params.id}));

  let title = $state('Event');
  $effect(() => {
    request
      .then(data => {
        if (data.event) title = cleanTitle(data.event.name);
      })
      .catch(() => {});
  });
</script>

<svelte:head>
  <title>{title} · Eventio</title>
</svelte:head>

<div class="container page narrow">
  <Link to="/events" class="back-link">
    <Icon name="arrow-left" size={16} />
    All events
  </Link>

  {#await request}
    <div class="card hero" aria-busy="true" aria-label="Loading event">
      <div class="skeleton" style:height="14px" style:width="80px"></div>
      <div class="skeleton" style:height="34px" style:width="70%"></div>
      <div class="skeleton" style:height="18px" style:width="45%"></div>
    </div>
  {:then data}
    {#if data.event}
      {@const event = data.event}
      {@const rooms = eventRooms(event)}
      {@const talks = eventTalks(event)}
      {@const minutes = talks.reduce((sum, t) => sum + (t.duration ?? 0), 0)}
      {@const days = dayCount(event.start_date, event.end_date)}

      <section class="card hero fade-up">
        <p class="eyebrow">Event</p>
        <h1>{cleanTitle(event.name)}</h1>
        <ul class="facts">
          <li>
            <Icon name="calendar" size={16} />
            {formatDateRange(event.start_date, event.end_date)}
          </li>
          {#if event.location?.name}
            <li>
              <Icon name="map-pin" size={16} />
              {event.location.name}
            </li>
          {/if}
          {#if days}
            <li>
              <Icon name="clock" size={16} />
              {plural(days, 'day')}
            </li>
          {/if}
        </ul>

        <dl class="stats">
          <div>
            <dt>Rooms</dt>
            <dd>{rooms.length}</dd>
          </div>
          <div>
            <dt>Talks</dt>
            <dd>{talks.length}</dd>
          </div>
          <div>
            <dt>Minutes</dt>
            <dd>{minutes}</dd>
          </div>
        </dl>
      </section>

      <section class="programme">
        <h2 class="section-title">Programme</h2>

        {#each rooms as room, r (room.name)}
          <div class="room fade-up" style:animation-delay="{r * 60}ms">
            <header class="room-head">
              <span class="room-icon"><Icon name="door" size={18} /></span>
              <h3>{room.name}</h3>
              <span class="room-count">
                {plural(room.talks?.length ?? 0, 'talk')}
              </span>
            </header>

            {#if room.talks?.length}
              <ul class="talks">
                {#each room.talks as talk (talk.id ?? talk.title)}
                  <li class="card talk">
                    <div class="talk-main">
                      <h4>{talk.title}</h4>
                      {#if talk.topics?.length}
                        <ul class="tags" aria-label="Topics">
                          {#each talk.topics as topic (topic.name)}
                            <li><Chip name={topic.name} /></li>
                          {/each}
                        </ul>
                      {/if}
                    </div>
                    <div class="talk-meta">
                      {#if talk.level}
                        <span class="badge {levelClass(talk.level)}">
                          {talk.level}
                        </span>
                      {/if}
                      {#if talk.duration}
                        <span class="meta">
                          <Icon name="clock" size={14} />
                          {talk.duration} min
                        </span>
                      {/if}
                      {#if talk.language}
                        <span class="meta">
                          <Icon name="globe" size={14} />
                          {talk.language}
                        </span>
                      {/if}
                    </div>
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="no-talks">No talks scheduled in this room yet.</p>
            {/if}
          </div>
        {:else}
          <EmptyState
            icon="door"
            title="No rooms yet"
            message="The programme for this event hasn’t been published." />
        {/each}
      </section>
    {:else}
      <EmptyState
        icon="calendar"
        title="Event not found"
        message="It may have been removed or the link is wrong.">
        <Link to="/events" class="btn btn-secondary">Browse events</Link>
      </EmptyState>
    {/if}
  {:catch error}
    <EmptyState
      tone="error"
      title="Couldn’t load this event"
      message={error.message}>
      <Link to="/events" class="btn btn-secondary">Browse events</Link>
    </EmptyState>
  {/await}
</div>

<style>
  .narrow {
    max-width: 880px;
  }

  .hero {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
    background:
      radial-gradient(
        120% 140% at 100% 0%,
        var(--primary-soft) 0%,
        transparent 55%
      ),
      var(--surface);
  }

  @media (min-width: 640px) {
    .hero {
      padding: 36px;
    }
  }

  h1 {
    font-size: clamp(1.75rem, 4.5vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .facts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    color: var(--text-2);
    font-size: 0.9375rem;
  }

  .facts li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .facts :global(.icon) {
    color: var(--primary-text);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 12px;
  }

  .stats div {
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface);
  }

  dt {
    color: var(--text-3);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  dd {
    margin-top: 2px;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .programme {
    display: flex;
    flex-direction: column;
    gap: 28px;
    margin-top: 40px;
  }

  .section-title {
    font-size: 1.375rem;
  }

  .room-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .room-icon {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: var(--surface-2);
    color: var(--text-2);
  }

  h3 {
    font-size: 1.0625rem;
    font-weight: 650;
  }

  .room-count {
    margin-left: auto;
    color: var(--text-3);
    font-size: 0.875rem;
  }

  .talks {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .talk {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px 18px;
    border-left: 3px solid var(--primary);
  }

  @media (min-width: 640px) {
    .talk {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }
  }

  .talk-main {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .talk-meta {
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 0;
    align-items: center;
    gap: 8px 14px;
  }

  .meta {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-2);
    font-size: 0.8125rem;
    white-space: nowrap;
  }

  .no-talks {
    padding: 16px 18px;
    border: 1px dashed var(--border-strong);
    border-radius: var(--radius);
    color: var(--text-3);
    font-size: 0.9375rem;
  }
</style>
