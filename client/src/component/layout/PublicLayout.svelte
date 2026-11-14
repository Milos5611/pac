<script>
  import Header from '../header/Header.svelte';

  /** @type {{children?: import('svelte').Snippet}} */
  let {children} = $props();
</script>

<div class="app">
  <Header />
  <section class="section">
    {@render children?.()}
  </section>
</div>

<style>
  .section {
    position: relative;
  }
</style>
