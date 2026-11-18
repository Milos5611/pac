<script>
  import Icon from '../../component/icon/Icon.svelte';
  import {gql, errorMessage} from '../../lib/graphql.js';
  import {CREATE_TALK} from './data.js';

  /** @type {{roomId: string, onsaved: () => void, oncancel: () => void}} */
  let {roomId, onsaved, oncancel} = $props();

  const LEVELS = ['Junior', 'Intermediate', 'Senior'];
  const LANGUAGES = ['English', 'German', 'Serbian', 'French', 'Spanish'];

  let title = $state('');
  let duration = $state(30);
  let level = $state('Intermediate');
  let language = $state('English');
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

  /** @param {SubmitEvent} e */
  async function submit(e) {
    e.preventDefault();
    submitted = true;
    if (Object.values(problems).some(Boolean)) return;
    saving = true;
    error = '';
    try {
      await gql(CREATE_TALK, {
        talk: {
          title: title.trim(),
          duration: Math.round(duration),
          level,
          language: language.trim(),
          roomId,
        },
      });
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

  <div class="form-actions">
    <button type="button" class="btn btn-secondary" onclick={oncancel}>
      Cancel
    </button>
    <button type="submit" class="btn btn-primary" disabled={saving}>
      {saving ? 'Adding…' : 'Add talk'}
    </button>
  </div>
</form>
