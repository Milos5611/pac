<script>
  import Link from '../../component/link/Link.svelte';
  import Avatar from '../../component/avatar/Avatar.svelte';
  import Icon from '../../component/icon/Icon.svelte';
  import SearchField from '../../component/search/SearchField.svelte';
  import CardSkeletons from '../../component/state/CardSkeletons.svelte';
  import EmptyState from '../../component/state/EmptyState.svelte';
  import Modal from '../../component/modal/Modal.svelte';
  import SpeakerForm from './SpeakerForm.svelte';
  import {auth} from '../../lib/auth.svelte.js';
  import {navigate} from '../../lib/router.svelte.js';
  import {toast} from '../../lib/toast.svelte.js';
  import {gql} from '../../lib/graphql.js';
  import {levelClass, matches, plural} from '../../lib/format.js';
  import {PERSONS_QUERY} from './data.js';

  /**
   * @typedef {{
   *   id: string,
   *   name: string,
   *   organization?: {name: string} | null,
   *   talk?: {id?: string, title?: string, duration?: number, level?: string, language?: string} | null,
   * }} Person
   */

  /** @type {Promise<{persons: Person[]}>} */
  const request = gql(PERSONS_QUERY);
  let query = $state('');
  let creating = $state(false);

  /** @param {Person[]} persons */
  function byName(persons) {
    return [...persons].sort((a, b) => a.name.localeCompare(b.name));
  }
</script>

<svelte:head>
  <title>Speakers · Eventio</title>
</svelte:head>

<div class="container page">
  <header class="page-header">
    <div>
      <p class="eyebrow">People</p>
      <h1>Speakers</h1>
      {#await request then data}
        {@const orgs = new Set(
          data.persons.map(p => p.organization?.name).filter(Boolean),
        )}
        <p class="muted summary">
          {plural(data.persons.length, 'speaker')} from {plural(
            orgs.size,
            'organization',
          )}
        </p>
      {/await}
    </div>
    <div class="header-actions">
      <SearchField
        bind:value={query}
        placeholder="Search names, companies, talks"
        label="Search speakers" />
      {#if auth.user}
        <button
          type="button"
          class="btn btn-primary"
          onclick={() => (creating = true)}>
          <Icon name="plus" size={16} />
          New speaker
        </button>
      {/if}
    </div>
  </header>

  <Modal bind:open={creating} title="New speaker">
    <SpeakerForm
      onsaved={id => {
        creating = false;
        toast('Speaker added');
        navigate(`/person/${id}`);
      }}
      oncancel={() => (creating = false)} />
  </Modal>

  {#await request}
    <CardSkeletons count={6} />
  {:then data}
    {@const persons = byName(data.persons).filter(p =>
      matches(query, [p.name, p.organization?.name, p.talk?.title]),
    )}
    {#if persons.length}
      <ul class="grid">
        {#each persons as person, i (person.id)}
          <li class="fade-up" style:animation-delay="{Math.min(i, 8) * 40}ms">
            <Link to="/person/{person.id}" class="card-link">
              <article class="person">
                <div class="who">
                  <Avatar name={person.name} size={48} />
                  <div class="who-text">
                    <h2>{person.name}</h2>
                    {#if person.organization?.name}
                      <p class="org">
                        <Icon name="building" size={14} />
                        {person.organization.name}
                      </p>
                    {/if}
                  </div>
                </div>

                {#if person.talk?.title}
                  <div class="talk">
                    <span class="label">Talk</span>
                    <p class="talk-title">{person.talk.title}</p>
                  </div>
                {/if}

                <footer>
                  <span class="facts">
                    {#if person.talk?.level}
                      <span class="badge {levelClass(person.talk.level)}">
                        {person.talk.level}
                      </span>
                    {/if}
                    {#if person.talk?.duration}
                      <span class="meta">
                        <Icon name="clock" size={14} />
                        {person.talk.duration} min
                      </span>
                    {/if}
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
        title="No speakers match “{query}”"
        message="Try another name, company or talk title.">
        <button
          type="button"
          class="btn btn-secondary"
          onclick={() => (query = '')}>
          Clear search
        </button>
      </EmptyState>
    {:else}
      <EmptyState
        icon="users"
        title="No speakers yet"
        message="Speakers will show up here once they are added." />
    {/if}
  {:catch error}
    <EmptyState
      tone="error"
      title="Couldn’t load speakers"
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

  .person {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 18px;
    padding: 20px;
  }

  .who {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .who-text {
    min-width: 0;
  }

  h2 {
    font-size: 1.0625rem;
    font-weight: 650;
    line-height: 1.3;
  }

  .org {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
    color: var(--text-2);
    font-size: 0.875rem;
  }

  .org :global(.icon) {
    color: var(--text-3);
  }

  .talk {
    padding: 12px 14px;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
  }

  .label {
    color: var(--text-3);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .talk-title {
    display: -webkit-box;
    margin-top: 2px;
    overflow: hidden;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.4;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    color: var(--text-3);
  }

  .facts {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .meta {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-2);
    font-size: 0.8125rem;
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
