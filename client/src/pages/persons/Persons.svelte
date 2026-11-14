<script>
  import Link from '../../component/link/Link.svelte';
  import {gql} from '../../lib/graphql.js';
  import {PERSONS_QUERY} from './data.js';

  const request = gql(PERSONS_QUERY);
</script>

{#await request then data}
  <div class="person-cards">
    <div class="toolbar-wrapper">
      <p class="all--persons">ALL SPEAKERS</p>
    </div>
    {#each data.persons as person (person.id)}
      <div class="person-card">
        <div class="wrapper">
          <article>
            <h5 class="card__title">
              {person.name}
            </h5>
            <p class="card__description">
              {person.organization?.name ?? ''}
            </p>
            <p class="card__description">
              {person.talk?.title ?? ''}
            </p>
          </article>
        </div>

        <div class="person-action">
          <div class="action-padding">
            <Link to="/person/{person.id}" class="btn-text">Person detail</Link>
          </div>
        </div>
      </div>
    {/each}
  </div>
{:catch error}
  <p class="error load-error">Could not load speakers: {error.message}</p>
{/await}

<style lang="scss">
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
  .action-padding {
    padding: 0.5rem;
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
