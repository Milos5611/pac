<script>
  import Link from '../../component/link/Link.svelte';
  import Icon from '../../component/icon/Icon.svelte';
</script>

<svelte:head>
  <title>Page not found · Eventio</title>
</svelte:head>

<div class="container page not-found fade-up">
  <p class="code">404</p>
  <h1>Page not found</h1>
  <p class="muted">The page you’re looking for doesn’t exist or has moved.</p>
  <div class="actions">
    <Link to="/events" class="btn btn-primary">
      Browse events
      <Icon name="arrow-right" size={16} />
    </Link>
    <Link to="/" class="btn btn-secondary">Go home</Link>
  </div>
</div>

<style>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding-top: 15vh;
    text-align: center;
  }

  .code {
    background: linear-gradient(135deg, #6366f1, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-size: clamp(4rem, 14vw, 7rem);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 1;
  }

  h1 {
    font-size: 1.75rem;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 18px;
  }
</style>
