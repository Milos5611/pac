<script>
  /** @type {{name: string, muted?: boolean}} */
  let {name, muted = false} = $props();
</script>

<span class="chip" class:muted>{name}</span>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--primary-soft);
    color: var(--primary-text);
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.4;
    white-space: nowrap;
  }

  .chip.muted {
    background: var(--surface-2);
    color: var(--text-2);
  }
</style>
