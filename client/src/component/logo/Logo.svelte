<script>
  /** @type {{size?: number, wordmark?: boolean, class?: string}} */
  let {size = 32, wordmark = true, class: className = ''} = $props();
</script>

<span class="logo {className}">
  <span class="mark" style:width="{size}px" style:height="{size}px">
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M10 10.5h12M10 16h8.5M10 21.5h12"
        fill="none"
        stroke="#fff"
        stroke-width="2.8"
        stroke-linecap="round" />
    </svg>
  </span>
  {#if wordmark}
    <span class="word">Eventio</span>
  {/if}
</span>

<style>
  .logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .mark {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    border-radius: 30%;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #ec4899 120%);
    box-shadow: 0 6px 16px -6px rgba(99, 102, 241, 0.7);
  }

  .mark svg {
    width: 100%;
    height: 100%;
  }

  .word {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
  }
</style>
