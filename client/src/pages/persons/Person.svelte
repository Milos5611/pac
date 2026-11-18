<script>
  import Link from '../../component/link/Link.svelte';
  import Avatar from '../../component/avatar/Avatar.svelte';
  import Icon from '../../component/icon/Icon.svelte';
  import EmptyState from '../../component/state/EmptyState.svelte';
  import {gql} from '../../lib/graphql.js';
  import {levelClass} from '../../lib/format.js';
  import {PERSON_QUERY} from './data.js';

  /** @type {{params: {id: string}}} */
  let {params} = $props();

  /**
   * @type {Promise<{person: {
   *   name: string,
   *   organization?: {name: string} | null,
   *   talk?: {title?: string, duration?: number, level?: string, language?: string} | null,
   * } | null}>}
   */
  const request = $derived(gql(PERSON_QUERY, {personId: params.id}));

  let title = $state('Speaker');
  $effect(() => {
    request
      .then(data => {
        if (data.person) title = data.person.name;
      })
      .catch(() => {});
  });
</script>

<svelte:head>
  <title>{title} · Eventio</title>
</svelte:head>

<div class="container page narrow">
  <Link to="/persons" class="back-link">
    <Icon name="arrow-left" size={16} />
    All speakers
  </Link>

  {#await request}
    <div class="card profile" aria-busy="true" aria-label="Loading speaker">
      <div class="skeleton" style:width="88px" style:height="88px" style:border-radius="50%"></div>
      <div class="lines">
        <div class="skeleton" style:height="28px" style:width="220px"></div>
        <div class="skeleton" style:height="16px" style:width="140px"></div>
      </div>
    </div>
  {:then data}
    {#if data.person}
      {@const speaker = data.person}
      <section class="card profile fade-up">
        <Avatar name={speaker.name} size={88} />
        <div class="lines">
          <p class="eyebrow">Speaker</p>
          <h1>{speaker.name}</h1>
          {#if speaker.organization?.name}
            <p class="org">
              <Icon name="building" size={16} />
              {speaker.organization.name}
            </p>
          {/if}
        </div>
      </section>

      <section class="talk-section fade-up" style:animation-delay="80ms">
        <h2 class="section-title">Talk</h2>
        {#if speaker.talk}
          <article class="card talk">
            <span class="talk-icon"><Icon name="mic" size={20} /></span>
            <div class="talk-body">
              <h3>{speaker.talk.title}</h3>
              <dl class="details">
                {#if speaker.talk.level}
                  <div>
                    <dt>Level</dt>
                    <dd>
                      <span class="badge {levelClass(speaker.talk.level)}">
                        {speaker.talk.level}
                      </span>
                    </dd>
                  </div>
                {/if}
                {#if speaker.talk.duration}
                  <div>
                    <dt>Duration</dt>
                    <dd>
                      <Icon name="clock" size={15} />
                      {speaker.talk.duration} min
                    </dd>
                  </div>
                {/if}
                {#if speaker.talk.language}
                  <div>
                    <dt>Language</dt>
                    <dd>
                      <Icon name="globe" size={15} />
                      {speaker.talk.language}
                    </dd>
                  </div>
                {/if}
              </dl>
            </div>
          </article>
        {:else}
          <p class="no-talk">This speaker has no talk scheduled yet.</p>
        {/if}
      </section>
    {:else}
      <EmptyState
        icon="users"
        title="Speaker not found"
        message="They may have been removed or the link is wrong.">
        <Link to="/persons" class="btn btn-secondary">Browse speakers</Link>
      </EmptyState>
    {/if}
  {:catch error}
    <EmptyState
      tone="error"
      title="Couldn’t load this speaker"
      message={error.message}>
      <Link to="/persons" class="btn btn-secondary">Browse speakers</Link>
    </EmptyState>
  {/await}
</div>

<style>
  .narrow {
    max-width: 760px;
  }

  .profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding: 28px 24px;
    text-align: center;
    background:
      radial-gradient(
        120% 140% at 100% 0%,
        var(--primary-soft) 0%,
        transparent 55%
      ),
      var(--surface);
  }

  @media (min-width: 560px) {
    .profile {
      flex-direction: row;
      gap: 24px;
      padding: 32px;
      text-align: left;
    }
  }

  .lines {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  .lines .eyebrow {
    margin-bottom: 0;
  }

  h1 {
    font-size: clamp(1.75rem, 4.5vw, 2.25rem);
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .org {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--text-2);
  }

  @media (min-width: 560px) {
    .org {
      justify-content: flex-start;
    }
  }

  .talk-section {
    margin-top: 36px;
  }

  .section-title {
    margin-bottom: 14px;
    font-size: 1.375rem;
  }

  .talk {
    display: flex;
    gap: 16px;
    padding: 20px;
  }

  @media (min-width: 560px) {
    .talk {
      padding: 24px;
    }
  }

  .talk-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--primary-soft);
    color: var(--primary-text);
  }

  .talk-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 650;
    line-height: 1.35;
  }

  .details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 12px;
  }

  dt {
    color: var(--text-3);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  dd {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    color: var(--text-2);
    font-size: 0.9375rem;
    font-weight: 500;
  }

  .no-talk {
    padding: 18px;
    border: 1px dashed var(--border-strong);
    border-radius: var(--radius);
    color: var(--text-3);
  }
</style>
