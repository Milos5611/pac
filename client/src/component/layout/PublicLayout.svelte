<script>
  import Header from '../header/Header.svelte';

  /** @type {{children?: import('svelte').Snippet}} */
  let {children} = $props();
</script>

<div class="layout">
  <Header />
  <main class="layout-main">
    {@render children?.()}
  </main>
  <footer class="site-footer">
    <div class="container">Eventio · conference management POC</div>
  </footer>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  .layout-main {
    flex: 1;
  }

  .site-footer {
    padding-block: 24px calc(24px + env(safe-area-inset-bottom));
    border-top: 1px solid var(--border);
    color: var(--text-3);
    font-size: 0.8125rem;
  }
</style>
