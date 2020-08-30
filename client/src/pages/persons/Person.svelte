<script>
	import {Route} from 'svelte-router-spa';
	export let currentRoute;
	import {getClient, query} from "svelte-apollo";
	const client = getClient();
	import {PERSON_QUERY} from './data';
	const person = query(client, { query: PERSON_QUERY, variables: {personId: currentRoute.namedParams.id}});
</script>

<Route {currentRoute} />
{#await $person}
	{:then $person}
	{#if $person && $person.data.person}
		<div class="person-detail">
			<div class="top_nav">
				<p class="person_id">
					PERSON ID: #{$person.data.person.id}
				</p>
			</div>
		<div class="person-card">
				<div class="wrapper">
					<div class="card__meta">
						<p>{$person.data.person.name}</p>
					</div>
					<article>
						<h5 class="card__title">
							{$person.data.person.organization.name}
						</h5>
					</article>
					<article>
						<p class="card__description">
							He will give a talk about:
							<span style="color: grey; text-decoration: underline">{$person.data.person.talk.title}</span>
						</p>
					</article>
				</div>
			</div>
		</div>
	{/if}
{/await}

<style type="text/scss">
	.person-detail {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: space-between;
		position: relative;
		margin: 7em auto 0;
		width: 60%;

		.top_nav {
			margin: 3em 0 2em 1em;
			flex: 1 0 50%;

			.person_id {
				font-size: 12px;
				font-weight: 600;
				line-height: 2;
				letter-spacing: 1px;
				color: #a9aeb4;
				float: left;
			}
		}
		.person-card {
			height: 340px;
			align-items: stretch;
			position: relative;
			overflow: hidden;
			background-color: #fff;
		}
	}
	.wrapper {
		overflow: hidden;
		max-width: 100%;
		margin-right: 17px;
		padding: 2.6em 0 1.6em 1.6em;
	}

    .card__description {
		font-size: 16px;
		line-height: 1.5;
		color: #949ea8;
	}

	.toolbar-wrapper {
		padding: 0 10px 10px;
		font-size: 14px;
		font-weight: bold;
	}

</style>
