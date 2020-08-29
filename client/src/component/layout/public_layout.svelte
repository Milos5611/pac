<script>
	import { Route } from 'svelte-router-spa'
	import Header from '../header/Header.svelte';
	export let currentRoute;
	const params = {};
</script>

<div class="app">
	<Header />
	<section class="section">
		<Route {currentRoute}  {params} />
	</section>
</div>
