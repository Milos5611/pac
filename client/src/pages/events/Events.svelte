<script>
	import moment from 'moment';
	import {Navigate} from 'svelte-router-spa';
	import { Button } from 'svelma';
	import Chip from "../../component/chip/Chip.svelte";
	import {getClient, query} from "svelte-apollo";
	const client = getClient();
	import {EVENTS_QUERY} from './data';
	const events = query(client, { query: EVENTS_QUERY});
</script>

{#await $events}
	{:then allEvents}
<div class="event-cards">
	<div class="toolbar-wrapper">
		<p class="all--events">ALL EVENTS</p>
	</div>
	{#each allEvents.data.events as event}
		<div class="event-card">
				<div class="wrapper">
					<div class="card__meta">
						<time>{moment(event.start_date).format("DD.MM.Y")}</time>
						<time>-</time>
						<time>{moment(event.end_date).format("DD.MM.Y")}</time>
					</div>
					<article>
						<Navigate to="/event/{event.id}">
							<h5 class="card__title">
								{event.name}
							</h5>
						</Navigate>
						<p class="card__description">
							{event.location.name}
						</p>
						<p class="card__description">
							Topic that will be covered
						</p>
						{#if event.location.rooms}
							{#each event.location.rooms as rooms}
								{#each rooms.talks || [] as talk}
									{#each talk.topics || [] as topic}
										<Chip name="{topic.name}" />
									{/each}
								{/each}
							{/each}
						{/if}
					</article>
				</div>
		</div>
	{/each}
</div>
{/await}

<style type="text/scss">
	.event-cards {
		width: 70%;
		margin: 10em auto 0;
		z-index: 2;
	}
	.event-card {
		width: 31%;
		height: 300px;
		float: left;
		margin-bottom: 15px;
		margin-left: .5em;
		margin-right: .5em;
		border-radius: 2px;
		background-color: #fff;
		box-shadow: 0 2px 3px 0 rgba(0,0,0,.11);
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
		@extend %transitionTopBlue;

		&:nth-of-type(3n - 1) {
			clear: left;
		}
	}
	.wrapper {
		overflow: hidden;
		padding: 2.6em 1.6em 0;
	}

    .card__description {
		font-size: 16px;
		line-height: 1.5;
		color: #949ea8;

		&:last-of-type {
			margin-bottom: 20px;
		}
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
