<script>
  import Icon from '../icon/Icon.svelte';

  /**
   * @type {{
   *   title: string,
   *   message?: string,
   *   icon?: import('../icon/Icon.svelte').IconName,
   *   tone?: 'neutral' | 'error',
   *   children?: import('svelte').Snippet,
   * }}
   */
  let {title, message = '', icon = 'search', tone = 'neutral', children} =
    $props();
</script>

<div
  class="empty card fade-up"
  class:error={tone === 'error'}
  role={tone === 'error' ? 'alert' : 'status'}>
  <span class="icon-wrap">
    <Icon name={tone === 'error' ? 'alert' : icon} size={22} />
  </span>
  <h2>{title}</h2>
  {#if message}
    <p class="muted">{message}</p>
  {/if}
  {#if children}
    <div class="actions">{@render children()}</div>
  {/if}
</div>

<style>
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 48px 24px;
    text-align: center;
  }

  .icon-wrap {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
    border-radius: 14px;
    background: var(--primary-soft);
    color: var(--primary-text);
  }

  .error .icon-wrap {
    background: var(--danger-soft);
    color: var(--danger);
  }

  h2 {
    font-size: 1.125rem;
  }

  p {
    max-width: 44ch;
    overflow-wrap: anywhere;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 12px;
  }
</style>
