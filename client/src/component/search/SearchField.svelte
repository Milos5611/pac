<script>
  import Icon from '../icon/Icon.svelte';

  /** @type {{value?: string, placeholder?: string, label?: string}} */
  let {value = $bindable(''), placeholder = 'Search', label = 'Search'} =
    $props();
</script>

<div class="search">
  <Icon name="search" size={18} class="search-icon" />
  <input
    type="search"
    bind:value
    {placeholder}
    aria-label={label}
    autocomplete="off"
    spellcheck="false" />
  {#if value}
    <button
      type="button"
      class="clear"
      aria-label="Clear search"
      onclick={() => (value = '')}>
      <Icon name="x" size={16} />
    </button>
  {/if}
</div>

<style>
  .search {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  @media (min-width: 640px) {
    .search {
      width: 320px;
    }
  }

  .search :global(.search-icon) {
    position: absolute;
    left: 14px;
    color: var(--text-3);
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 44px;
    padding: 0 40px 0 42px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    font-size: 0.9375rem;
    transition:
      border-color 0.2s var(--ease),
      box-shadow 0.2s var(--ease);
  }

  input::placeholder {
    color: var(--text-3);
  }

  input::-webkit-search-cancel-button {
    display: none;
  }

  input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--ring);
  }

  .clear {
    position: absolute;
    right: 8px;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: var(--text-3);
  }

  .clear:hover {
    background: var(--surface-2);
    color: var(--text);
  }
</style>
