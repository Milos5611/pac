<script>
  import Link from '../../component/link/Link.svelte';
  import Chip from '../../component/chip/Chip.svelte';
  import {gql} from '../../lib/graphql.js';
  import {formatDate} from '../../lib/format.js';
  import {EVENTS_QUERY} from './data.js';

  const request = gql(EVENTS_QUERY);
</script>

{#await request then data}
  <div class="event-cards">
    <div class="toolbar-wrapper">
      <p class="all--events">ALL EVENTS</p>
    </div>
    {#each data.events as event (event.id)}
      <div class="event-card">
        <div class="wrapper">
          <div class="card__meta">
            <time>{formatDate(event.start_date)}</time>
            <time>-</time>
            <time>{formatDate(event.end_date)}</time>
          </div>
          <article>
            <Link to="/event/{event.id}">
              <h5 class="card__title">
                {event.name}
              </h5>
            </Link>
            <p class="card__description">
              {event.location?.name ?? ''}
            </p>
            <p class="card__description">Topic that will be covered</p>
            {#each event.location?.rooms ?? [] as room}
              {#each room.talks ?? [] as talk}
                {#each talk.topics ?? [] as topic}
                  <Chip name={topic.name} />
                {/each}
              {/each}
            {/each}
          </article>
        </div>
      </div>
    {/each}
  </div>
{:catch error}
  <p class="error load-error">Could not load events: {error.message}</p>
{/await}

<style lang="scss">
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
    margin-left: 0.5em;
    margin-right: 0.5em;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.11);
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

  .load-error {
    margin: 10em auto 0;
    text-align: center;
  }

  %transitionTopBlue {
    transform: perspective(1px) translateZ(0);
    &:hover:before {
      transform: translateY(0);
    }

    &:before {
      content: '';
      position: absolute;
      z-index: -1;
      left: 0;
      right: 0;
      top: 0;
      background: #2098d1;
      height: 4px;
      transform: translateY(-4px);
      transition-property: transform;
      transition-duration: 0.3s;
      transition-timing-function: ease-out;
    }
  }
</style>
