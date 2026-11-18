<script>
  import Link from '../link/Link.svelte';
  import Logo from '../logo/Logo.svelte';
  import Avatar from '../avatar/Avatar.svelte';
  import Icon from '../icon/Icon.svelte';
  import {router} from '../../lib/router.svelte.js';
  import {auth, authEnabled, login, logout} from '../../lib/auth.svelte.js';

  const links = [
    {to: '/events', label: 'Events', match: /^\/events?(\/|$)/},
    {to: '/persons', label: 'Speakers', match: /^\/persons?(\/|$)/},
  ];

  const userName = $derived(
    auth.user?.name ?? auth.user?.nickname ?? auth.user?.email ?? 'Account',
  );
</script>

<header class="site-header">
  <div class="container bar">
    <Link to="/" class="brand" aria-label="Eventio home">
      <Logo size={32} />
    </Link>

    <nav aria-label="Main">
      {#each links as link (link.to)}
        {@const active = link.match.test(router.path)}
        <Link
          to={link.to}
          class="nav-link{active ? ' active' : ''}"
          aria-current={active ? 'page' : undefined}>
          {link.label}
        </Link>
      {/each}
    </nav>

    <div class="account">
      {#if auth.user}
        <span class="user" title={userName}>
          <Avatar name={userName} size={32} />
          <span class="user-name">{userName}</span>
        </span>
        <button
          type="button"
          class="btn btn-ghost icon-btn"
          aria-label="Log out"
          title="Log out"
          onclick={() => logout()}>
          <Icon name="log-out" />
        </button>
      {:else if authEnabled}
        <button
          type="button"
          class="btn btn-primary login"
          onclick={() => login()}>
          <Icon name="log-in" size={16} class="login-icon" />
          Log in
        </button>
      {/if}
    </div>
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 20;
    padding-top: env(safe-area-inset-top);
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--bg) 78%, transparent);
    backdrop-filter: saturate(180%) blur(14px);
    -webkit-backdrop-filter: saturate(180%) blur(14px);
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 12px;
    height: var(--header-h);
  }

  .bar :global(.brand) {
    display: inline-flex;
    margin-right: 8px;
    border-radius: 10px;
  }

  nav {
    display: flex;
    gap: 4px;
  }

  nav :global(.nav-link) {
    padding: 8px 12px;
    border-radius: 999px;
    color: var(--text-2);
    font-size: 0.9375rem;
    font-weight: 500;
    transition:
      background-color 0.2s var(--ease),
      color 0.2s var(--ease);
  }

  nav :global(.nav-link:hover) {
    background: var(--surface-2);
    color: var(--text);
  }

  nav :global(.nav-link.active) {
    background: var(--primary-soft);
    color: var(--primary-text);
    font-weight: 600;
  }

  .account {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  }

  .user {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .user-name {
    max-width: 180px;
    overflow: hidden;
    color: var(--text-2);
    font-size: 0.875rem;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon-btn {
    width: 40px;
    padding: 0;
  }

  .login {
    min-height: 36px;
    padding: 0 14px;
    font-size: 0.875rem;
  }

  @media (max-width: 720px) {
    .user-name {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .bar {
      gap: 4px;
    }

    .bar :global(.brand .word),
    .login :global(.login-icon) {
      display: none;
    }

    nav :global(.nav-link) {
      padding: 8px 10px;
    }
  }
</style>
