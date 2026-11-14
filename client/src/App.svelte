<script>
  import {router, matchRoute} from './lib/router.svelte.js';
  import {auth, initAuth} from './lib/auth.svelte.js';
  import {routes, notFound} from './routes.js';

  initAuth();

  const match = $derived(
    matchRoute(routes, router.path) ?? {route: notFound, params: {}},
  );
  const Page = $derived(match.route.component);
  const Layout = $derived(match.route.layout);
</script>

<main>
  {#if auth.ready}
    {#key router.path}
      {#if Layout}
        <Layout>
          <Page params={match.params} />
        </Layout>
      {:else}
        <Page params={match.params} />
      {/if}
    {/key}
  {/if}
</main>
