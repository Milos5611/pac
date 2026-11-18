<script>
  import Icon from '../icon/Icon.svelte';

  /**
   * @type {{
   *   id: string,
   *   tags?: string[],
   *   placeholder?: string,
   * }}
   */
  let {id, tags = $bindable([]), placeholder = 'Add and press Enter'} =
    $props();

  let draft = $state('');

  function commit() {
    const name = draft.trim().replace(/,+$/, '').trim();
    draft = '';
    if (!name) return;
    if (tags.some(t => t.toLowerCase() === name.toLowerCase())) return;
    tags = [...tags, name];
  }

  /** @param {string} name */
  function remove(name) {
    tags = tags.filter(t => t !== name);
  }

  /** @param {KeyboardEvent} e */
  function onkeydown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      tags = tags.slice(0, -1);
    }
  }
</script>

<div class="tag-input">
  {#each tags as tag (tag)}
    <span class="tag">
      {tag}
      <button type="button" aria-label="Remove {tag}" onclick={() => remove(tag)}>
        <Icon name="x" size={12} />
      </button>
    </span>
  {/each}
  <input
    {id}
    bind:value={draft}
    {onkeydown}
    onblur={commit}
    placeholder={tags.length ? '' : placeholder}
    autocomplete="off" />
</div>

<style>
  .tag-input {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    min-height: 46px;
    padding: 6px 8px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--surface);
    cursor: text;
    transition:
      border-color 0.2s var(--ease),
      box-shadow 0.2s var(--ease);
  }

  .tag-input:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--ring);
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 4px 4px 10px;
    border-radius: 999px;
    background: var(--primary-soft);
    color: var(--primary-text);
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .tag button {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .tag button:hover {
    background: var(--primary);
    color: var(--on-primary);
  }

  input {
    flex: 1;
    min-width: 120px;
    padding: 6px;
    border: 0;
    background: none;
    font-size: 1rem;
  }

  input:focus {
    outline: none;
  }

  input::placeholder {
    color: var(--text-3);
  }
</style>
