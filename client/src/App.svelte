<script>
	import {
		OidcContext,
		authError,
		idToken,
		isAuthenticated,
		isLoading,
		userInfo,
		accessToken
	} from '@dopry/svelte-oidc';
	import "smelte/src/tailwind.css" ;
	import { Router } from 'svelte-router-spa'
	import { routes } from './routes';

	import graphQLClient from '../config/graphQLClient';
	import { setClient } from 'svelte-apollo';
	const client = graphQLClient();
	setClient(client);
</script>

<main>
	<OidcContext
			issuer="https://dev-269607.okta.com"
			client_id="0oaup7oeuqIcBZjyw4x6"
			redirect_uri="http://localhost:5000"
			post_logout_redirect_uri="http://localhost:5000"
	>
		<Router {routes} />
	</OidcContext>
</main>

<style type="text/scss">
	@import "./App.scss";
	:global(body) {
		background: #f3f3f3;
		font-family: 'Roboto', sans-serif;
	}
</style>
