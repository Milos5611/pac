<script>
	import "smelte/src/tailwind.css" ;
	import { Router } from 'svelte-router-spa'
	import { routes } from './routes';

	import graphQLClient from '../config/graphQLClient';
	import { setClient } from 'svelte-apollo';
	const client = graphQLClient();
	setClient(client);
</script>

<main>
	<Router {routes} />
</main>

<style type="text/scss">
	@import "./App.scss";
	:global(body) {
		background: #f3f3f3;
		font-family: 'Roboto', sans-serif;
	}
</style>
