<script>
  import Icon from '../icon/Icon.svelte';

  /**
   * Native <dialog>: focus trap, Esc to close and top-layer rendering for free.
   * @type {{
   *   open?: boolean,
   *   title: string,
   *   description?: string,
   *   children?: import('svelte').Snippet,
   * }}
   */
  let {open = $bindable(false), title, description = '', children} = $props();

  /** @type {HTMLDialogElement | undefined} */
  let dialog = $state();
  const titleId = `modal-${Math.random().toString(36).slice(2, 9)}`;

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // showModal() would focus the close button; start on the first field
      /** @type {HTMLElement | null} */ (
        dialog.querySelector('input, select, textarea')
      )?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  });

  /** @param {MouseEvent} event */
  function onBackdrop(event) {
    // Clicks on the dialog element itself (not its content) hit the backdrop
    if (event.target === dialog) open = false;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  aria-labelledby={titleId}
  onclose={() => (open = false)}
  onclick={onBackdrop}>
  {#if open}
    <div class="sheet">
      <header>
        <div>
          <h2 id={titleId}>{title}</h2>
          {#if description}
            <p class="description">{description}</p>
          {/if}
        </div>
        <button
          type="button"
          class="close"
          aria-label="Close"
          onclick={() => (open = false)}>
          <Icon name="x" size={18} />
        </button>
      </header>
      {@render children?.()}
    </div>
  {/if}
</dialog>

<style>
  dialog {
    width: min(100% - 32px, 540px);
    max-height: min(90dvh, 820px);
    padding: 0;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 20px;
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow-lg);
    overscroll-behavior: contain;
  }

  dialog::backdrop {
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(3px);
  }

  dialog[open] {
    animation: pop 0.22s var(--ease);
  }

  dialog[open]::backdrop {
    animation: fade 0.22s ease;
  }

  /* Bottom sheet on phones */
  @media (max-width: 559px) {
    dialog {
      width: 100%;
      max-width: 100%;
      max-height: 92dvh;
      margin: auto 0 0;
      border-radius: 20px 20px 0 0;
      border-bottom: 0;
    }

    dialog[open] {
      animation: slide-up 0.26s var(--ease);
    }
  }

  .sheet {
    padding: 22px 22px calc(22px + env(safe-area-inset-bottom));
  }

  @media (min-width: 560px) {
    .sheet {
      padding: 28px;
    }
  }

  header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 22px;
  }

  h2 {
    font-size: 1.25rem;
  }

  .description {
    margin-top: 6px;
    color: var(--text-2);
    font-size: 0.9375rem;
  }

  .close {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    margin: -6px -6px 0 0;
    border-radius: 50%;
    color: var(--text-3);
  }

  .close:hover {
    background: var(--surface-2);
    color: var(--text);
  }

  @keyframes pop {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.98);
    }
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
  }
</style>
