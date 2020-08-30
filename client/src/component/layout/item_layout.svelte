<script>
	import { Route, Navigate } from 'svelte-router-spa'
	import Header from '../header/Header.svelte';
	export let currentRoute;
	const parentRoute = currentRoute.name.split("/")[1];
	console.log("currentRoute", currentRoute);
</script>

<div class="app">
	<Header />
    <Navigate to="/{parentRoute}">
		<p class="back">{"<- Back"}</p>
    </Navigate>
	<section class="section">
		<Route {currentRoute} />
	</section>
</div>

<style>
    .section {
        position: relative;
    }
	.back {
		position: absolute;
		left: 50%;
		z-index: 1;
	}
</style>
