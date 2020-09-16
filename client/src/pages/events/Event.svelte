<script>
	import moment from 'moment';
	export let currentRoute;
	import {Route, Navigate} from 'svelte-router-spa';
	import { Button } from 'svelma';
	import Chip from "../../component/chip/Chip.svelte";
	import {getClient, query} from "svelte-apollo";
	const client = getClient();
	import {EVENT_QUERY} from './data';
	const event = query(client, { query: EVENT_QUERY, variables: {eventId: currentRoute.namedParams.id}});
</script>

<Route {currentRoute} />
{#await $event}
	{:then currentEvent}
	<div class="event-detail">
		<Navigate to="events">
			<p class="back">{"<- Back"}</p>
		</Navigate>
		<div class="top_nav">
			<p class="event_id">
				EVENT ID: #{currentRoute.namedParams.id}
			</p>
		</div>
		<div class="event-card">
			<div class="wrapper">
				<div class="card__meta">
					<p>{currentEvent.data.event.name}</p>
				</div>
				<article>
					<!--<h5 class="card__title">
						{currentEvent.data.event.organization.name}
					</h5>-->
				</article>
				<article>
					<p class="card__description">
						Event start at:
						<time>{moment(currentEvent.data.event.start_date).format("DD.MM.Y")}</time>
					</p>
					<p class="card__description">
						Event end at:
						<time>{moment(currentEvent.data.event.end_date).format("DD.MM.Y")}</time>
					</p>
					<p class="card__description">
						On this event you can find rooms:
						{#each currentEvent.data.event.location.rooms || [] as room}
							{room.name}
							With this talk:
							{#each room.talks || [] as talk}
								{talk.id}
								{talk.duration}
								{talk.title}
								{talk.level}
							{/each}
						{/each}
					</p>
				</article>
			</div>
		</div>
	</div>
{:catch error}
	<li>ERROR: {error}</li>
{/await}

<style type="text/scss">
	.event-detail {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: space-between;
		position: relative;
		margin: 7em auto 0;
		width: 60%;

		.back {
			text-align: center;
		}

		.underline {
			color: grey;
			text-decoration: underline
		}

		.top_nav {
			margin: 3em 0 1em 0;
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
		.event-card {
			height: 240px;
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
