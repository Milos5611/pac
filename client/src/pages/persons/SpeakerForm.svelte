<script>
  import {untrack} from 'svelte';
  import Icon from '../../component/icon/Icon.svelte';
  import {gql, errorMessage} from '../../lib/graphql.js';
  import {
    CREATE_ORGANIZATION,
    CREATE_PERSON,
    SPEAKER_OPTIONS_QUERY,
    UPDATE_PERSON,
  } from './data.js';

  /**
   * Pass `person` to edit a speaker. Pass `talk` to add a speaker to that
   * talk; otherwise the user picks the talk.
   * @type {{
   *   person?: {id: string, name: string, organizationId?: string, talkId?: string} | null,
   *   talk?: {id: string, title: string} | null,
   *   onsaved: (id: string) => void,
   *   oncancel: () => void,
   * }}
   */
  let {person = null, talk = null, onsaved, oncancel} = $props();

  const NEW = '__new__';
  const editing = untrack(() => person);
  const fixedTalk = untrack(() => talk);

  let name = $state(editing?.name ?? '');
  let organizationId = $state(editing?.organizationId ?? '');
  let newOrganization = $state('');
  let talkId = $state(fixedTalk?.id ?? editing?.talkId ?? '');

  /** @type {{id: string, name: string}[]} */
  let organizations = $state([]);
  /** @type {{id: string, title: string}[]} */
  let talks = $state([]);
  let loading = $state(true);
  let saving = $state(false);
  let submitted = $state(false);
  let error = $state('');

  gql(SPEAKER_OPTIONS_QUERY)
    .then(data => {
      organizations = [...data.organizations].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      talks = [...data.talks].sort((a, b) => a.title.localeCompare(b.title));
      if (organizations.length === 0) organizationId = NEW;
    })
    .catch(err => (error = errorMessage(err)))
    .finally(() => (loading = false));

  const problems = $derived({
    name: name.trim() ? '' : 'Enter the speaker’s name.',
    organization: !organizationId
      ? 'Choose where the speaker works.'
      : organizationId === NEW && !newOrganization.trim()
        ? 'Name the new organization.'
        : '',
    talk: talkId ? '' : 'Choose the talk this speaker gives.',
  });

  /** @param {SubmitEvent} e */
  async function submit(e) {
    e.preventDefault();
    submitted = true;
    if (Object.values(problems).some(Boolean)) return;
    saving = true;
    error = '';
    try {
      // A new organization has to exist before the person can reference it
      let organization = organizationId;
      if (organization === NEW) {
        const created = await gql(CREATE_ORGANIZATION, {
          organization: {name: newOrganization.trim()},
        });
        organization = created.createOrganization.id;
      }
      const input = {name: name.trim(), organizationId: organization, talkId};
      if (editing) {
        await gql(UPDATE_PERSON, {id: editing.id, person: input});
        onsaved(editing.id);
      } else {
        const created = await gql(CREATE_PERSON, {person: input});
        onsaved(created.createPerson.id);
      }
    } catch (err) {
      error = errorMessage(err);
    } finally {
      saving = false;
    }
  }
</script>

<form class="form" onsubmit={submit} novalidate>
  {#if error}
    <p class="form-error" role="alert">
      <Icon name="alert" size={18} />
      <span>{error}</span>
    </p>
  {/if}

  <div class="field">
    <label for="speaker-name">Full name</label>
    <input
      id="speaker-name"
      class="input"
      bind:value={name}
      placeholder="e.g. Jane Doe"
      autocomplete="off"
      aria-invalid={submitted && !!problems.name} />
    {#if submitted && problems.name}
      <p class="field-error">{problems.name}</p>
    {/if}
  </div>

  <div class="field">
    <label for="speaker-org">Organization</label>
    <select
      id="speaker-org"
      class="input"
      bind:value={organizationId}
      disabled={loading}
      aria-invalid={submitted &&
        !!problems.organization &&
        organizationId !== NEW}>
      <option value="" disabled>
        {loading ? 'Loading…' : 'Choose an organization'}
      </option>
      {#each organizations as org (org.id)}
        <option value={org.id}>{org.name}</option>
      {/each}
      <option value={NEW}>+ New organization…</option>
    </select>
    {#if submitted && problems.organization && organizationId !== NEW}
      <p class="field-error">{problems.organization}</p>
    {/if}
  </div>

  {#if organizationId === NEW}
    <div class="field">
      <label for="speaker-new-org">New organization name</label>
      <input
        id="speaker-new-org"
        class="input"
        bind:value={newOrganization}
        placeholder="e.g. Acme"
        autocomplete="off"
        aria-invalid={submitted && !!problems.organization} />
      {#if submitted && problems.organization}
        <p class="field-error">{problems.organization}</p>
      {/if}
    </div>
  {/if}

  <div class="field">
    {#if fixedTalk}
      <span class="label">Talk</span>
      <p class="readonly-value">{fixedTalk.title}</p>
    {:else}
      <label for="speaker-talk">Talk</label>
      <select
        id="speaker-talk"
        class="input"
        bind:value={talkId}
        disabled={loading || talks.length === 0}
        aria-invalid={submitted && !!problems.talk}>
        <option value="" disabled>
          {loading
            ? 'Loading…'
            : talks.length
              ? 'Choose a talk'
              : 'No talks yet'}
        </option>
        {#each talks as option (option.id)}
          <option value={option.id}>{option.title}</option>
        {/each}
      </select>
      {#if !loading && talks.length === 0}
        <p class="hint">Add a talk from an event’s programme first.</p>
      {:else if submitted && problems.talk}
        <p class="field-error">{problems.talk}</p>
      {/if}
    {/if}
  </div>

  <div class="form-actions">
    <button type="button" class="btn btn-secondary" onclick={oncancel}>
      Cancel
    </button>
    <button type="submit" class="btn btn-primary" disabled={saving}>
      {saving ? 'Saving…' : editing ? 'Save changes' : 'Add speaker'}
    </button>
  </div>
</form>
