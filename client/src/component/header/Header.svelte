<script>
  import Link from '../link/Link.svelte';
  import {auth, logout} from '../../lib/auth.svelte.js';
</script>

<div class="header">
  <Link to="/" class="anchor" title="Home">
    <span class="black-logo navigation-logo-img"></span>
  </Link>

  <Link to="/events" class="anchor" title="Events">
    <p>Events</p>
  </Link>

  <Link to="/persons" class="anchor" title="Persons">
    <p>Persons</p>
  </Link>

  {#if auth.user}
    <button class="anchor" type="button" onclick={() => logout()}>
      <p>Logout</p>
    </button>
  {/if}
</div>

<style lang="scss">
  .header {
    background-color: transparent;
    position: fixed;
    box-sizing: border-box;
    padding: 24px 24px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    top: 0;
    z-index: 1;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.71;
    color: rgb(148, 158, 168);

    :global(.anchor p),
    :global(.anchor span) {
      margin-bottom: 20px;
    }

    .navigation-logo-img {
      background: url('/images/spritesheet.png') no-repeat;
      display: block;
      width: 29px;
      height: 28px;

      &.black-logo {
        background-position: -89px -32px;
      }
    }
  }
</style>
