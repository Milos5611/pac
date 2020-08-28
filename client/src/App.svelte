<script>
	import ApolloClient from "apollo-boost";
	import { setClient } from 'svelte-apollo';
	import Todos from "./Todos.svelte";

	const client = new ApolloClient({ uri: "http://localhost:3000/graphql" });
	setClient(client);
</script>

<main>
	<Todos />
</main>
