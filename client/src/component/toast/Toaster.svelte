<script>
  import {fly} from 'svelte/transition';
  import Icon from '../icon/Icon.svelte';
  import {toasts, dismiss} from '../../lib/toast.svelte.js';
</script>

<div class="toaster" aria-live="polite" aria-atomic="false">
  {#each toasts as item (item.id)}
    <div
      class="toast"
      class:error={item.tone === 'error'}
      role={item.tone === 'error' ? 'alert' : 'status'}
      transition:fly={{y: 16, duration: 220}}>
      <span class="dot" aria-hidden="true"></span>
      <span class="message">{item.message}</span>
      <button
        type="button"
        class="close"
        aria-label="Dismiss"
        onclick={() => dismiss(item.id)}>
        <Icon name="x" size={16} />
      </button>
    </div>
  {/each}
</div>

<style>
  .toaster {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px var(--gutter) calc(16px + env(safe-area-inset-bottom));
    pointer-events: none;
  }

  @media (min-width: 640px) {
    .toaster {
      left: auto;
      align-items: flex-end;
    }
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    max-width: 380px;
    padding: 12px 12px 12px 16px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--surface);
    box-shadow: var(--shadow-lg);
    font-size: 0.9375rem;
    font-weight: 500;
    pointer-events: auto;
  }

  .dot {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #22c55e;
  }

  .error .dot {
    background: var(--danger);
  }

  .message {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .close {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 50%;
    color: var(--text-3);
  }

  .close:hover {
    background: var(--surface-2);
    color: var(--text);
  }
</style>
