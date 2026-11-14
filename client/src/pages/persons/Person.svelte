<script>
  import Link from '../../component/link/Link.svelte';
  import {gql} from '../../lib/graphql.js';
  import {PERSON_QUERY} from './data.js';

  /** @type {{params: {id: string}}} */
  let {params} = $props();

  const request = $derived(gql(PERSON_QUERY, {personId: params.id}));
</script>

{#await request then data}
  <div class="person-detail">
    <Link to="/persons">
      <p class="back">{'<- Back'}</p>
    </Link>
    <div class="top_nav">
      <p class="person_id">SPEAKER ID: #{params.id}</p>
    </div>
    {#if data.person}
      {@const speaker = data.person}
      <div class="person-card">
        <div class="wrapper">
          <div class="card__meta">
            <p>{speaker.name}</p>
          </div>
          <article>
            <h5 class="card__title">
              {speaker.organization?.name ?? ''}
            </h5>
          </article>
          {#if speaker.talk}
            <article>
              <p class="card__description">
                He will give a talk about:
                <span class="underline">{speaker.talk.title}</span>
              </p>
              <p class="card__description">
                It will last for about:
                <span class="underline">{speaker.talk.duration}</span>
                min
              </p>
              <p class="card__description">
                This talk is require
                <span class="underline">{speaker.talk.level}</span>
                level understanding of topic and will be held in
                <span class="underline">{speaker.talk.language}</span>
              </p>
            </article>
          {/if}
        </div>
      </div>
    {:else}
      <p class="card__description">Speaker not found.</p>
    {/if}
  </div>
{:catch error}
  <p class="error load-error">Could not load speaker: {error.message}</p>
{/await}

<style lang="scss">
  .person-detail {
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
      text-decoration: underline;
    }

    .top_nav {
      margin: 3em 0 1em 0;
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
