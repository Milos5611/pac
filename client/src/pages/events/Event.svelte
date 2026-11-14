<script>
  import Link from '../../component/link/Link.svelte';
  import {gql} from '../../lib/graphql.js';
  import {formatDate} from '../../lib/format.js';
  import {EVENT_QUERY} from './data.js';

  /** @type {{params: {id: string}}} */
  let {params} = $props();

  const request = $derived(gql(EVENT_QUERY, {eventId: params.id}));
</script>

{#await request then data}
  <div class="event-detail">
    <Link to="/events">
      <p class="back">{'<- Back'}</p>
    </Link>
    <div class="top_nav">
      <p class="event_id">EVENT ID: #{params.id}</p>
    </div>
    {#if data.event}
      {@const event = data.event}
      <div class="event-card">
        <div class="wrapper">
          <div class="card__meta">
            <p>{event.name}</p>
          </div>
          <article>
            <p class="card__description">
              Event start at:
              <time>{formatDate(event.start_date)}</time>
            </p>
            <p class="card__description">
              Event end at:
              <time>{formatDate(event.end_date)}</time>
            </p>
            <p class="card__description">
              On this event you can find rooms:
              {#each event.location?.rooms ?? [] as room}
                {room.name}
                With this talk:
                {#each room.talks ?? [] as talk}
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
    {:else}
      <p class="card__description">Event not found.</p>
    {/if}
  </div>
{:catch error}
  <p class="error load-error">Could not load event: {error.message}</p>
{/await}

<style lang="scss">
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

  .load-error {
    margin: 10em auto 0;
    text-align: center;
  }
</style>
