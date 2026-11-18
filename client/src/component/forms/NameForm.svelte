<script>
  import {untrack} from 'svelte';
  import Icon from '../icon/Icon.svelte';
  import {errorMessage} from '../../lib/graphql.js';

  /**
   * One-field form for things that only have a name (rooms, venues,
   * organizations). The caller does the actual save.
   * @type {{
   *   label: string,
   *   value?: string,
   *   placeholder?: string,
   *   submitLabel: string,
   *   required?: string,
   *   save: (name: string) => Promise<void>,
   *   oncancel: () => void,
   * }}
   */
  let {
    label,
    value = '',
    placeholder = '',
    submitLabel,
    required = 'Enter a name.',
    save,
    oncancel,
  } = $props();

  const id = `name-${Math.random().toString(36).slice(2, 9)}`;
  let name = $state(untrack(() => value));
  let saving = $state(false);
  let submitted = $state(false);
  let error = $state('');

  const problem = $derived(name.trim() ? '' : required);

  /** @param {SubmitEvent} e */
  async function submit(e) {
    e.preventDefault();
    submitted = true;
    if (problem) return;
    saving = true;
    error = '';
    try {
      await save(name.trim());
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
    <label for={id}>{label}</label>
    <input
      {id}
      class="input"
      bind:value={name}
      {placeholder}
      autocomplete="off"
      aria-invalid={submitted && !!problem} />
    {#if submitted && problem}
      <p class="field-error">{problem}</p>
    {/if}
  </div>

  <div class="form-actions">
    <button type="button" class="btn btn-secondary" onclick={oncancel}>
      Cancel
    </button>
    <button type="submit" class="btn btn-primary" disabled={saving}>
      {saving ? 'Saving…' : submitLabel}
    </button>
  </div>
</form>
