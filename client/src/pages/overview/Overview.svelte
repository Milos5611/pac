<script>
	import moment from 'moment';
	import {onMount} from 'svelte';
	import { Button } from 'smelte';
	import {getClient, query} from "svelte-apollo";
	const client = getClient();
	import {FILTER_EVENTS_QUERY} from './data';
	let filter = {locationId: "1"}
	const events = query(client, { query: FILTER_EVENTS_QUERY, variables: {...filter}});
</script>

<section style="position: absolute; right: 300px">
	<Button type="is-primary" >
		Click!:
	</Button>
</section>


{#await $events}
	<p>...waiting</p>
{:then number}
	<p>The number is {number}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
