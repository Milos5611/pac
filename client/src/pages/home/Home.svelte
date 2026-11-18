<script>
  import Link from '../../component/link/Link.svelte';
  import Logo from '../../component/logo/Logo.svelte';
  import Icon from '../../component/icon/Icon.svelte';
  import {auth, authEnabled, login} from '../../lib/auth.svelte.js';

  const loggedIn = $derived(Boolean(auth.user));
  const userName = $derived(
    auth.user?.given_name ??
      auth.user?.name ??
      auth.user?.nickname ??
      auth.user?.email ??
      '',
  );

  const shortcuts = [
    {
      to: '/events',
      icon: /** @type {const} */ ('calendar'),
      title: 'Events',
      text: 'Dates, venues, rooms and the full programme.',
    },
    {
      to: '/persons',
      icon: /** @type {const} */ ('mic'),
      title: 'Speakers',
      text: 'Who is talking, where they work and what about.',
    },
  ];
</script>

<svelte:head>
  <title>Eventio · Conference management</title>
</svelte:head>

<div class="home">
  <aside class="hero" aria-label="Quote">
    <figure class="quote fade-up">
      <blockquote>“Let’s keep a little optimism here.”</blockquote>
      <figcaption>Milos Nikolic</figcaption>
    </figure>
  </aside>

  <main class="panel">
    <div class="panel-inner">
      <Logo size={40} />

      <section class="welcome fade-up">
        <p class="eyebrow">Conference platform</p>
        <h1>
          {#if loggedIn}
            Welcome back{userName ? `, ${userName}` : ''}
          {:else}
            Welcome to Eventio
          {/if}
        </h1>
        <p class="lead">
          Browse events, rooms, talks and the speakers behind them, on any
          device.
        </p>

        {#if auth.error}
          <p class="alert" role="alert">
            <Icon name="alert" size={18} />
            <span>Login failed: {auth.error}</span>
          </p>
        {/if}

        <div class="actions">
          {#if loggedIn}
            <Link to="/events" class="btn btn-primary btn-lg">
              Go to events
              <Icon name="arrow-right" size={18} />
            </Link>
          {:else}
            {#if authEnabled}
              <button
                type="button"
                class="btn btn-primary btn-lg"
                onclick={() => login()}>
                <Icon name="log-in" size={18} />
                Log in
              </button>
            {/if}
            <Link to="/events" class="btn btn-secondary btn-lg">
              Continue as guest
            </Link>
          {/if}
        </div>
        {#if !loggedIn}
          <p class="hint">No account needed to browse.</p>
        {/if}
      </section>

      <nav class="shortcuts" aria-label="Explore">
        {#each shortcuts as item (item.to)}
          <Link to={item.to} class="card-link shortcut">
            <span class="shortcut-icon"><Icon name={item.icon} size={20} /></span>
            <span class="shortcut-text">
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </span>
            <Icon name="arrow-right" size={18} class="shortcut-arrow" />
          </Link>
        {/each}
      </nav>
    </div>
  </main>
</div>

<style>
  .home {
    display: grid;
    min-height: 100dvh;
  }

  @media (min-width: 960px) {
    .home {
      grid-template-columns: minmax(360px, 42%) 1fr;
    }
  }

  .hero {
    position: relative;
    display: flex;
    align-items: flex-end;
    min-height: 240px;
    padding: 28px var(--gutter);
    overflow: hidden;
    background: #1e1b4b url('/images/str.png') center 30% / cover no-repeat;
    isolation: isolate;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%),
      linear-gradient(135deg, rgba(79, 70, 229, 0.55), rgba(236, 72, 153, 0.25));
  }

  @media (min-width: 960px) {
    .hero {
      position: sticky;
      top: 0;
      height: 100dvh;
      padding: 56px;
    }
  }

  .quote {
    max-width: 22ch;
    color: #fff;
  }

  blockquote {
    font-size: clamp(1.5rem, 3.4vw, 2.5rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  figcaption {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.875rem;
    font-weight: 500;
  }

  figcaption::before {
    content: '';
    width: 24px;
    height: 2px;
    border-radius: 2px;
    background: #a5b4fc;
  }

  .panel {
    display: flex;
    justify-content: center;
    padding: 32px var(--gutter) calc(40px + env(safe-area-inset-bottom));
  }

  @media (min-width: 960px) {
    .panel {
      align-items: center;
      padding: 56px;
    }
  }

  .panel-inner {
    display: flex;
    flex-direction: column;
    gap: 36px;
    width: 100%;
    max-width: 480px;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 800;
    letter-spacing: -0.035em;
  }

  .lead {
    margin-top: 12px;
    color: var(--text-2);
    font-size: 1.0625rem;
  }

  .alert {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin-top: 20px;
    padding: 12px 14px;
    border-radius: var(--radius-sm);
    background: var(--danger-soft);
    color: var(--danger);
    font-size: 0.9375rem;
    overflow-wrap: anywhere;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }

  @media (max-width: 480px) {
    .actions > :global(*) {
      flex: 1 1 100%;
    }
  }

  .hint {
    margin-top: 14px;
    color: var(--text-3);
    font-size: 0.875rem;
  }

  .shortcuts {
    display: grid;
    gap: 12px;
  }

  .shortcuts :global(.shortcut) {
    flex-direction: row;
    align-items: center;
    gap: 14px;
    padding: 16px;
  }

  .shortcut-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--primary-soft);
    color: var(--primary-text);
  }

  .shortcut-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  .shortcut-text strong {
    font-weight: 600;
  }

  .shortcut-text span {
    color: var(--text-2);
    font-size: 0.875rem;
  }

  .shortcuts :global(.shortcut-arrow) {
    color: var(--text-3);
    transition:
      transform 0.25s var(--ease),
      color 0.25s var(--ease);
  }

  .shortcuts :global(.shortcut:hover .shortcut-arrow) {
    color: var(--primary-text);
    transform: translateX(3px);
  }
</style>
