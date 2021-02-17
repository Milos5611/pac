<script>
  import {
    OidcContext,
    login
  } from '@dopry/svelte-oidc';
  import 'smelte/src/tailwind.css' ;
  import {Router} from 'svelte-router-spa';
  import {routes} from './routes';

  import graphQLClient from '../config/graphQLClient';
  import {setClient} from 'svelte-apollo';

  const client = graphQLClient();
  setClient(client);
</script>

<main>
  <OidcContext
    issuer="process.env.SVELTE_APP_ISSUER"
    client_id="process.env.SVELTE_APP_CLIENT_ID"
    redirect_uri="process.env.SVELTE_APP_REDIRECT_OKTA_URL"
    post_logout_redirect_uri="process.env.SVELTE_APP_REDIRECT_OKTA_URL"
  >
    <Router {routes} />
  </OidcContext>
</main>

<style type='text/scss'>
  @import "./App.scss";

  :global(body) {
    background: #f3f3f3;
    font-family: 'Roboto', sans-serif;
  }
</style>
