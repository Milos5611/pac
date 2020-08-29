<script>
	import {Route} from 'svelte-router-spa';
	export let currentRoute;
	import moment from 'moment';
	import { onMount } from 'svelte';
	import {
		Button
	} from 'smelte';
	import {getClient, query} from "svelte-apollo";
	const client = getClient();
	import {EVENT_QUERY} from './data';
	console.log("currentRoute", currentRoute);
	const event = query(client, { query: EVENT_QUERY, variables: {eventId: currentRoute.namedParams.id}});
</script>

<Route {currentRoute} />
{#await $event}
	{:then $event}
	{console.log("$event", $event)}
	{#if $event.data.event}
		<div class="events-detail">
			<div class="top_nav">
				<p class="event_id">
					EVENT ID: #{$event.data.event}
				</p>
			</div>
		<div class="event-card">
				<div class="wrapper">
					<div class="card__meta">
						<time>{moment(event.start_date).format("DD.MM.Y")}</time>
						<time>-</time>
						<time>{moment(event.end_date).format("DD.MM.Y")}</time>
					</div>
					<article>
						<h5 class="card__title">
							{event.name}
						</h5>
						<p class="card__description">
							{event.location_name}
						</p>
					</article>
				</div>

			<div class="event-action">
				<div class="p-2">
					<Button color="blue" text>Check details</Button>
				</div>
			</div>
		</div>
		</div>
	{/if}
{/await}

<style type="text/scss">
	.events-detail {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		position: relative;
		margin: 7em auto 0;;

		.top_nav {
			margin: 3em 0 2em 1em;
			flex: 1 0 50%;

			.event_id {
				font-size: 12px;
				font-weight: 600;
				line-height: 2;
				letter-spacing: 1px;
				color: #a9aeb4;
				float: left;
			}
		}
	}
	.event-card {
		float: left;
		width: 65%;
		height: 340px;
		align-items: stretch;
		position: relative;
		overflow: hidden;
		@extend %transitionTopBlue;
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
	.event-action {
		margin-top: auto;
	}

	time {
		font-size: 14px;
		line-height: 1.71;
		color: #cacdd0;
	}

	.toolbar-wrapper {
		padding: 0 10px 10px;
		font-size: 14px;
		font-weight: bold;
	}

	%transitionTopBlue {
		 transform: perspective(1px) translateZ(0);
	&:hover:before {
		 transform: translateY(0);
	 }

	&:before {
		 content: "";
		 position: absolute;
		 z-index: -1;
		 left: 0;
		 right: 0;
		 top: 0;
		 background: #2098D1;
		 height: 4px;
		 transform: translateY(-4px);
		 transition-property: transform;
		 transition-duration: 0.3s;
		 transition-timing-function: ease-out;
	 }
	}

</style>
