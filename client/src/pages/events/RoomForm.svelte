<script>
  import Icon from '../../component/icon/Icon.svelte';
  import {gql, errorMessage} from '../../lib/graphql.js';
  import {CREATE_ROOM} from './data.js';

  /** @type {{locationId: string, onsaved: () => void, oncancel: () => void}} */
  let {locationId, onsaved, oncancel} = $props();

  let name = $state('');
  let saving = $state(false);
  let submitted = $state(false);
  let error = $state('');

  const problem = $derived(name.trim() ? '' : 'Give the room a name.');

  /** @param {SubmitEvent} e */
  async function submit(e) {
    e.preventDefault();
    submitted = true;
    if (problem) return;
    saving = true;
    error = '';
    try {
      await gql(CREATE_ROOM, {room: {name: name.trim(), locationId}});
      onsaved();
    } catch (err) {
      error = errorMessage(err);
    } finally {
      saving = false;
    }
  }
</script>

<form class="form" onsubmit={submit} novalidate>
  {#if error}
    <p class="form-error" role="alert">
      <Icon name="alert" size={18} />
      <span>{error}</span>
    </p>
  {/if}

  <div class="field">
    <label for="room-name">Room name</label>
    <input
      id="room-name"
      class="input"
      bind:value={name}
      placeholder="e.g. Hall A"
      autocomplete="off"
      aria-invalid={submitted && !!problem} />
    {#if submitted && problem}
      <p class="field-error">{problem}</p>
    {/if}
  </div>

  <div class="form-actions">
    <button type="button" class="btn btn-secondary" onclick={oncancel}>
      Cancel
    </button>
    <button type="submit" class="btn btn-primary" disabled={saving}>
      {saving ? 'Adding…' : 'Add room'}
    </button>
  </div>
</form>
