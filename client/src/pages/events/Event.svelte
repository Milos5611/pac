<script>
  import Link from '../../component/link/Link.svelte';
  import Chip from '../../component/chip/Chip.svelte';
  import Icon from '../../component/icon/Icon.svelte';
  import Avatar from '../../component/avatar/Avatar.svelte';
  import Modal from '../../component/modal/Modal.svelte';
  import EmptyState from '../../component/state/EmptyState.svelte';
  import EventForm from './EventForm.svelte';
  import RoomForm from './RoomForm.svelte';
  import TalkForm from './TalkForm.svelte';
  import SpeakerForm from '../persons/SpeakerForm.svelte';
  import {auth} from '../../lib/auth.svelte.js';
  import {navigate} from '../../lib/router.svelte.js';
  import {toast} from '../../lib/toast.svelte.js';
  import {gql, errorMessage} from '../../lib/graphql.js';
  import {
    cleanTitle,
    dayCount,
    formatDateRange,
    levelClass,
    plural,
  } from '../../lib/format.js';
  import {DELETE_EVENT, EVENT_QUERY} from './data.js';
  import {eventRooms, eventTalks} from './helpers.js';

  /** @typedef {import('./helpers.js').ConferenceEvent} ConferenceEvent */
  /** @typedef {import('./helpers.js').Room} Room */
  /** @typedef {import('./helpers.js').Talk} Talk */

  /** @type {{params: {id: string}}} */
  let {params} = $props();

  /** @type {{event: ConferenceEvent | null} | undefined} */
  let data = $state();
  /** @type {Error | null} */
  let loadError = $state(null);

  async function load() {
    try {
      data = await gql(EVENT_QUERY, {eventId: params.id});
      loadError = null;
    } catch (error) {
      const err = /** @type {Error} */ (error);
      // The API reports unknown ids as an error rather than null
      if (/not found/i.test(err.message)) data = {event: null};
      else loadError = err;
    }
  }
  load();

  const event = $derived(data?.event ?? null);
  const canEdit = $derived(Boolean(auth.user));
  const title = $derived(event ? cleanTitle(event.name) : 'Event');

  let editing = $state(false);
  let confirmingDelete = $state(false);
  let addingRoom = $state(false);
  let addingTalk = $state(false);
  let addingSpeaker = $state(false);
  /** @type {Room | null} */
  let targetRoom = $state(null);
  /** @type {{id: string, title: string} | null} */
  let targetTalk = $state(null);

  let deleting = $state(false);
  let deleteError = $state('');

  /** @param {string} message */
  async function savedAndReload(message) {
    await load();
    toast(message);
  }

  /** @param {Room} room */
  function openAddTalk(room) {
    targetRoom = room;
    addingTalk = true;
  }

  /** @param {Talk} talk */
  function openAddSpeaker(talk) {
    targetTalk = {id: talk.id ?? '', title: talk.title ?? ''};
    addingSpeaker = true;
  }

  async function deleteEvent() {
    if (!event) return;
    deleting = true;
    deleteError = '';
    try {
      await gql(DELETE_EVENT, {id: event.id});
      confirmingDelete = false;
      toast('Event deleted');
      navigate('/events');
    } catch (err) {
      deleteError = errorMessage(err);
    } finally {
      deleting = false;
    }
  }
</script>

<svelte:head>
  <title>{title} · Eventio</title>
</svelte:head>

<div class="container page narrow">
  <Link to="/events" class="back-link">
    <Icon name="arrow-left" size={16} />
    All events
  </Link>

  {#if loadError}
    <EmptyState
      tone="error"
      title="Couldn’t load this event"
      message={loadError.message}>
      <button type="button" class="btn btn-secondary" onclick={load}>
        Try again
      </button>
    </EmptyState>
  {:else if data === undefined}
    <div class="card hero" aria-busy="true" aria-label="Loading event">
      <div class="skeleton" style:height="14px" style:width="80px"></div>
      <div class="skeleton" style:height="34px" style:width="70%"></div>
      <div class="skeleton" style:height="18px" style:width="45%"></div>
    </div>
  {:else if event}
    {@const rooms = eventRooms(event)}
    {@const talks = eventTalks(event)}
    {@const minutes = talks.reduce((sum, t) => sum + (t.duration ?? 0), 0)}
    {@const days = dayCount(event.start_date, event.end_date)}

    <section class="card hero fade-up">
      <div class="hero-top">
        <p class="eyebrow">Event</p>
        {#if canEdit}
          <div class="hero-actions">
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              onclick={() => (editing = true)}>
              <Icon name="pencil" size={14} />
              Edit
            </button>
            <button
              type="button"
              class="btn btn-ghost btn-sm danger-text"
              onclick={() => {
                deleteError = '';
                confirmingDelete = true;
              }}>
              <Icon name="trash" size={14} />
              Delete
            </button>
          </div>
        {/if}
      </div>
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
      <div class="section-head">
        <h2 class="section-title">Programme</h2>
        {#if canEdit && event.location?.id}
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            onclick={() => (addingRoom = true)}>
            <Icon name="plus" size={14} />
            Add room
          </button>
        {/if}
      </div>

      {#each rooms as room, r (room.id ?? room.name)}
        <div class="room fade-up" style:animation-delay="{r * 60}ms">
          <header class="room-head">
            <span class="room-icon"><Icon name="door" size={18} /></span>
            <h3>{room.name}</h3>
            <span class="room-count">
              {plural(room.talks?.length ?? 0, 'talk')}
            </span>
            {#if canEdit && room.id}
              <button
                type="button"
                class="btn btn-ghost btn-sm"
                aria-label="Add talk to {room.name}"
                onclick={() => openAddTalk(room)}>
                <Icon name="plus" size={14} />
                <span class="hide-xs">Add talk</span>
              </button>
            {/if}
          </header>

          {#if room.talks?.length}
            <ul class="talks">
              {#each room.talks as talk (talk.id ?? talk.title)}
                <li class="card talk">
                  <div class="talk-top">
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
                  </div>

                  {#if talk.persons?.length || (canEdit && talk.id)}
                    <div class="speakers">
                      {#each talk.persons ?? [] as person (person.id)}
                        <Link to="/person/{person.id}" class="speaker">
                          <Avatar name={person.name} size={26} />
                          <span>{person.name}</span>
                        </Link>
                      {/each}
                      {#if canEdit && talk.id}
                        <button
                          type="button"
                          class="add-speaker"
                          onclick={() => openAddSpeaker(talk)}>
                          <Icon name="user-plus" size={14} />
                          Add speaker
                        </button>
                      {/if}
                    </div>
                  {/if}
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
          message={canEdit
            ? 'Add a room to start building the programme.'
            : 'The programme for this event hasn’t been published.'} />
      {/each}
    </section>

    <Modal bind:open={editing} title="Edit event">
      <EventForm
        {event}
        onsaved={async () => {
          editing = false;
          await savedAndReload('Event updated');
        }}
        oncancel={() => (editing = false)} />
    </Modal>

    <Modal
      bind:open={confirmingDelete}
      title="Delete this event?"
      description="“{cleanTitle(event.name)}” will be removed. This can’t be undone. Rooms and talks stay with the venue {event
        .location?.name ?? ''}.">
      {#if deleteError}
        <p class="form-error" role="alert">
          <Icon name="alert" size={18} />
          <span>{deleteError}</span>
        </p>
      {/if}
      <div class="form-actions">
        <button
          type="button"
          class="btn btn-secondary"
          onclick={() => (confirmingDelete = false)}>
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-danger"
          disabled={deleting}
          onclick={deleteEvent}>
          {deleting ? 'Deleting…' : 'Delete event'}
        </button>
      </div>
    </Modal>

    {#if event.location?.id}
      <Modal
        bind:open={addingRoom}
        title="Add a room"
        description="Rooms belong to the venue {event.location
          .name}, so this room also appears in other events held there.">
        <RoomForm
          locationId={event.location.id}
          onsaved={async () => {
            addingRoom = false;
            await savedAndReload('Room added');
          }}
          oncancel={() => (addingRoom = false)} />
      </Modal>
    {/if}

    <Modal
      bind:open={addingTalk}
      title="Add a talk"
      description={targetRoom ? `In ${targetRoom.name}` : ''}>
      {#if targetRoom?.id}
        <TalkForm
          roomId={targetRoom.id}
          onsaved={async () => {
            addingTalk = false;
            await savedAndReload('Talk added');
          }}
          oncancel={() => (addingTalk = false)} />
      {/if}
    </Modal>

    <Modal bind:open={addingSpeaker} title="Add a speaker">
      <SpeakerForm
        talk={targetTalk}
        onsaved={async () => {
          addingSpeaker = false;
          await savedAndReload('Speaker added');
        }}
        oncancel={() => (addingSpeaker = false)} />
    </Modal>
  {:else}
    <EmptyState
      icon="calendar"
      title="Event not found"
      message="It may have been removed or the link is wrong.">
      <Link to="/events" class="btn btn-secondary">Browse events</Link>
    </EmptyState>
  {/if}
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

  .hero-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .hero-top .eyebrow {
    margin-bottom: 0;
  }

  .hero-actions {
    display: flex;
    gap: 6px;
  }

  .danger-text {
    color: var(--danger);
  }

  .danger-text:hover {
    background: var(--danger-soft);
    color: var(--danger);
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

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
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
    flex-shrink: 0;
    border-radius: 10px;
    background: var(--surface-2);
    color: var(--text-2);
  }

  h3 {
    min-width: 0;
    font-size: 1.0625rem;
    font-weight: 650;
  }

  .room-count {
    margin-left: auto;
    color: var(--text-3);
    font-size: 0.875rem;
    white-space: nowrap;
  }

  @media (max-width: 420px) {
    .hide-xs {
      display: none;
    }
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

  .talk-top {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  @media (min-width: 640px) {
    .talk-top {
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

  .speakers {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }

  .speakers :global(.speaker) {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 3px 12px 3px 3px;
    border-radius: 999px;
    background: var(--surface-2);
    font-size: 0.8125rem;
    font-weight: 500;
    transition: background-color 0.2s var(--ease);
  }

  .speakers :global(.speaker:hover) {
    background: var(--primary-soft);
    color: var(--primary-text);
  }

  .add-speaker {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 32px;
    padding: 0 12px;
    border: 1px dashed var(--border-strong);
    border-radius: 999px;
    color: var(--text-2);
    font-size: 0.8125rem;
    font-weight: 500;
    transition:
      border-color 0.2s var(--ease),
      color 0.2s var(--ease);
  }

  .add-speaker:hover {
    border-color: var(--primary);
    color: var(--primary-text);
  }

  .no-talks {
    padding: 16px 18px;
    border: 1px dashed var(--border-strong);
    border-radius: var(--radius);
    color: var(--text-3);
    font-size: 0.9375rem;
  }
</style>
