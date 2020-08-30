<script>
	import {onMount} from 'svelte';
	import moment from 'moment';
	import {
		Button
	} from 'smelte';
	import {Navigate} from "svelte-router-spa";
	import {getClient, query} from "svelte-apollo";
	const client = getClient();
	import {PERSONS_QUERY} from './data';
	const persons = query(client, { query: PERSONS_QUERY});
</script>

{#await $persons}
	<p>...loading</p>
{:then $persons}

	<div class="person-cards">
		<div class="toolbar-wrapper">
			<p class="all--persons">ALL PEOPLE</p>
		</div>
		{#each $persons.data.persons as person}
			<div class="person-card">
				<div class="wrapper">
					<article>
						<h5 class="card__title">
							{person.talk.title}
						</h5>
					</article>
				</div>

				<div class="person-action">
					<div class="p-2">
						<Navigate to="person/{person.id}">
							<Button text>
								Person detail
							</Button>
						</Navigate>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/await}

<style type="text/scss">
	.person-cards {
		width: 70%;
		margin: 10em auto 0;
		z-index: 2;
	}
	.person-card {
		width: 31%;
		height: 260px;
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
	}
	.wrapper {
		overflow: hidden;
		padding: 2.6em 1.6em 1.6em;
	}

	.card__description {
		font-size: 16px;
		line-height: 1.5;
		color: #949ea8;
	}
	.person-action {
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
