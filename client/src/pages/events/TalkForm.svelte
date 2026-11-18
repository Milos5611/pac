<script>
  import {untrack} from 'svelte';
  import Icon from '../../component/icon/Icon.svelte';
  import TagInput from '../../component/forms/TagInput.svelte';
  import {gql, errorMessage} from '../../lib/graphql.js';
  import {CREATE_TALK, CREATE_TOPIC, DELETE_TOPIC, UPDATE_TALK} from './data.js';

  /**
   * Pass `talk` to edit it; without it a new talk is created in `roomId`.
   * @type {{
   *   roomId: string,
   *   talk?: import('./helpers.js').Talk | null,
   *   onsaved: () => void,
   *   oncancel: () => void,
   * }}
   */
  let {roomId, talk = null, onsaved, oncancel} = $props();

  const LEVELS = ['Junior', 'Intermediate', 'Senior'];
  const LANGUAGES = ['English', 'German', 'Serbian', 'French', 'Spanish'];

  const initial = untrack(() => talk);
  const existingTopics = (initial?.topics ?? []).filter(t => t.id);

  let title = $state(initial?.title ?? '');
  let duration = $state(initial?.duration ?? 30);
  let level = $state(initial?.level ?? 'Intermediate');
  let language = $state(initial?.language ?? 'English');
  let topics = $state(existingTopics.map(t => t.name));
  let saving = $state(false);
  let submitted = $state(false);
  let error = $state('');

  const problems = $derived({
    title: title.trim() ? '' : 'Give the talk a title.',
    duration:
      Number.isFinite(duration) && duration >= 5 && duration <= 480
        ? ''
        : 'Use a length between 5 and 480 minutes.',
    language: language.trim() ? '' : 'Say which language the talk is in.',
  });

  /**
   * Topics are rows of their own, so saving the tag list means diffing it
   * against what the talk had: create the new names, delete the dropped ones.
   * @param {string} talkId
   */
  async function syncTopics(talkId) {
    const keep = new Set(topics.map(t => t.toLowerCase()));
    const had = new Set(existingTopics.map(t => t.name.toLowerCase()));
    await Promise.all([
      ...topics
        .filter(name => !had.has(name.toLowerCase()))
        .map(name => gql(CREATE_TOPIC, {topic: {name, talkId}})),
      ...existingTopics
        .filter(t => !keep.has(t.name.toLowerCase()))
        .map(t => gql(DELETE_TOPIC, {id: t.id})),
    ]);
  }

  /** @param {SubmitEvent} e */
  async function submit(e) {
    e.preventDefault();
    submitted = true;
    if (Object.values(problems).some(Boolean)) return;
    saving = true;
    error = '';
    const input = {
      title: title.trim(),
      duration: Math.round(duration),
      level,
      language: language.trim(),
      roomId,
    };
    try {
      let talkId = initial?.id;
      if (talkId) {
        await gql(UPDATE_TALK, {id: talkId, talk: input});
      } else {
        const created = await gql(CREATE_TALK, {talk: input});
        talkId = created.createTalk.id;
      }
      await syncTopics(/** @type {string} */ (talkId));
      onsaved();
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
    <label for="talk-title">Title</label>
    <input
      id="talk-title"
      class="input"
      bind:value={title}
      placeholder="e.g. Accessible forms in practice"
      autocomplete="off"
      aria-invalid={submitted && !!problems.title} />
    {#if submitted && problems.title}
      <p class="field-error">{problems.title}</p>
    {/if}
  </div>

  <div class="field-row">
    <div class="field">
      <label for="talk-duration">Length (minutes)</label>
      <input
        id="talk-duration"
        class="input"
        type="number"
        inputmode="numeric"
        min="5"
        max="480"
        step="5"
        bind:value={duration}
        aria-invalid={submitted && !!problems.duration} />
      {#if submitted && problems.duration}
        <p class="field-error">{problems.duration}</p>
      {/if}
    </div>
    <div class="field">
      <label for="talk-level">Level</label>
      <select id="talk-level" class="input" bind:value={level}>
        {#each LEVELS as option (option)}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="field">
    <label for="talk-language">Language</label>
    <input
      id="talk-language"
      class="input"
      list="talk-languages"
      bind:value={language}
      autocomplete="off"
      aria-invalid={submitted && !!problems.language} />
    <datalist id="talk-languages">
      {#each LANGUAGES as option (option)}
        <option value={option}></option>
      {/each}
    </datalist>
    {#if submitted && problems.language}
      <p class="field-error">{problems.language}</p>
    {/if}
  </div>

  <div class="field">
    <label for="talk-topics">Topics</label>
    <TagInput id="talk-topics" bind:tags={topics} placeholder="e.g. GraphQL" />
    <p class="hint">Press Enter or comma after each topic.</p>
  </div>

  <div class="form-actions">
    <button type="button" class="btn btn-secondary" onclick={oncancel}>
      Cancel
    </button>
    <button type="submit" class="btn btn-primary" disabled={saving}>
      {saving ? 'Saving…' : initial ? 'Save changes' : 'Add talk'}
    </button>
  </div>
</form>
