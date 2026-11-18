<script>
  import Link from '../../component/link/Link.svelte';
  import Avatar from '../../component/avatar/Avatar.svelte';
  import Icon from '../../component/icon/Icon.svelte';
  import Modal from '../../component/modal/Modal.svelte';
  import NameForm from '../../component/forms/NameForm.svelte';
  import EmptyState from '../../component/state/EmptyState.svelte';
  import SpeakerForm from './SpeakerForm.svelte';
  import {auth} from '../../lib/auth.svelte.js';
  import {toast} from '../../lib/toast.svelte.js';
  import {gql} from '../../lib/graphql.js';
  import {levelClass} from '../../lib/format.js';
  import {PERSON_QUERY, UPDATE_ORGANIZATION} from './data.js';

  /**
   * @typedef {{
   *   id: string,
   *   name: string,
   *   organizationId?: string,
   *   talkId?: string,
   *   organization?: {id: string, name: string} | null,
   *   talk?: {id?: string, title?: string, duration?: number, level?: string, language?: string} | null,
   * }} Speaker
   */

  /** @type {{params: {id: string}}} */
  let {params} = $props();

  /** @type {{person: Speaker | null} | undefined} */
  let data = $state();
  /** @type {Error | null} */
  let loadError = $state(null);

  async function load() {
    try {
      data = await gql(PERSON_QUERY, {personId: params.id});
      loadError = null;
    } catch (error) {
      const err = /** @type {Error} */ (error);
      if (/not found/i.test(err.message)) data = {person: null};
      else loadError = err;
    }
  }
  load();

  const speaker = $derived(data?.person ?? null);
  const canEdit = $derived(Boolean(auth.user));

  let editing = $state(false);
  let renamingOrg = $state(false);

  /** @param {string} name */
  async function saveOrganization(name) {
    await gql(UPDATE_ORGANIZATION, {
      id: speaker?.organization?.id,
      organization: {name},
    });
    renamingOrg = false;
    await load();
    toast('Organization renamed');
  }
</script>

<svelte:head>
  <title>{speaker?.name ?? 'Speaker'} · Eventio</title>
</svelte:head>

<div class="container page narrow">
  <Link to="/persons" class="back-link">
    <Icon name="arrow-left" size={16} />
    All speakers
  </Link>

  {#if loadError}
    <EmptyState
      tone="error"
      title="Couldn’t load this speaker"
      message={loadError.message}>
      <button type="button" class="btn btn-secondary" onclick={load}>
        Try again
      </button>
    </EmptyState>
  {:else if data === undefined}
    <div class="card profile" aria-busy="true" aria-label="Loading speaker">
      <div class="skeleton" style:width="88px" style:height="88px" style:border-radius="50%"></div>
      <div class="lines">
        <div class="skeleton" style:height="28px" style:width="220px"></div>
        <div class="skeleton" style:height="16px" style:width="140px"></div>
      </div>
    </div>
  {:else if speaker}
    <section class="card profile fade-up">
      <Avatar name={speaker.name} size={88} />
      <div class="lines">
        <p class="eyebrow">Speaker</p>
        <h1>{speaker.name}</h1>
        {#if speaker.organization?.name}
          <p class="org">
            <Icon name="building" size={16} />
            {speaker.organization.name}
            {#if canEdit}
              <button
                type="button"
                class="inline-edit"
                aria-label="Rename organization {speaker.organization.name}"
                title="Rename organization"
                onclick={() => (renamingOrg = true)}>
                <Icon name="pencil" size={13} />
              </button>
            {/if}
          </p>
        {/if}
      </div>
      {#if canEdit}
        <button
          type="button"
          class="btn btn-secondary btn-sm edit"
          onclick={() => (editing = true)}>
          <Icon name="pencil" size={14} />
          Edit
        </button>
      {/if}
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

    <Modal bind:open={editing} title="Edit speaker">
      <SpeakerForm
        person={speaker}
        onsaved={async () => {
          editing = false;
          await load();
          toast('Speaker updated');
        }}
        oncancel={() => (editing = false)} />
    </Modal>

    {#if speaker.organization}
      <Modal
        bind:open={renamingOrg}
        title="Rename organization"
        description="The new name shows for every speaker from {speaker
          .organization.name}.">
        <NameForm
          label="Organization name"
          value={speaker.organization.name}
          required="Give the organization a name."
          submitLabel="Save"
          save={saveOrganization}
          oncancel={() => (renamingOrg = false)} />
      </Modal>
    {/if}
  {:else}
    <EmptyState
      icon="users"
      title="Speaker not found"
      message="They may have been removed or the link is wrong.">
      <Link to="/persons" class="btn btn-secondary">Browse speakers</Link>
    </EmptyState>
  {/if}
</div>

<style>
  .narrow {
    max-width: 760px;
  }

  .profile {
    position: relative;
  }

  .edit {
    align-self: center;
  }

  @media (min-width: 560px) {
    .edit {
      position: absolute;
      top: 20px;
      right: 20px;
    }

    .profile:has(.edit) .lines {
      padding-right: 72px;
    }
  }

  .inline-edit {
    display: inline-grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    color: var(--text-3);
  }

  .inline-edit:hover {
    background: var(--surface-2);
    color: var(--primary-text);
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
