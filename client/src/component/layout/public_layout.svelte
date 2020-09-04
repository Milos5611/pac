<script>
	import { Route } from 'svelte-router-spa'
	import Header from '../header/Header.svelte';
	export let currentRoute;
</script>

<div class="app">
	<Header />
	<section class="section" style="position: relative">
		<Route {currentRoute} />
	</section>
</div>
