<script>
	import {getClient, query} from "svelte-apollo";
	import {gql} from "apollo-boost";
	const EVENTS = gql`
		{
		  events{
			id
		  }
		}
	`;
	const client = getClient();
	const events = query(client, { query: EVENTS});
</script>
<h1>Todos</h1>

{#await $events}
	Loading...
{:then result}
{JSON.stringify(result)}
{:catch error}
{error}
{/await}
{#each result.data.events as event }
	<p>{event.name}</p>
{/each}
