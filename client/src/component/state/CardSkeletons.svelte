<script>
  /** @type {{count?: number}} */
  let {count = 6} = $props();
</script>

<ul class="grid" aria-busy="true" aria-label="Loading">
  {#each {length: count}, i (i)}
    <li class="card placeholder">
      <div class="row">
        <div class="skeleton square"></div>
        <div class="lines">
          <div class="skeleton line" style:width="85%"></div>
          <div class="skeleton line" style:width="55%"></div>
        </div>
      </div>
      <div class="skeleton line" style:width="70%"></div>
      <div class="pills">
        <div class="skeleton pill"></div>
        <div class="skeleton pill"></div>
        <div class="skeleton pill short"></div>
      </div>
    </li>
  {/each}
</ul>

<style>
  .placeholder {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 20px;
    min-height: 200px;
  }

  .row {
    display: flex;
    gap: 14px;
  }

  .square {
    width: 52px;
    height: 56px;
    border-radius: 12px;
    flex-shrink: 0;
  }

  .lines {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    padding-top: 4px;
  }

  .line {
    height: 14px;
  }

  .pills {
    display: flex;
    gap: 8px;
    margin-top: auto;
  }

  .pill {
    width: 72px;
    height: 24px;
    border-radius: 999px;
  }

  .pill.short {
    width: 44px;
  }
</style>
