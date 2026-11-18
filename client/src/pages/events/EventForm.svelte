<script>
  import {untrack} from 'svelte';
  import Icon from '../../component/icon/Icon.svelte';
  import {gql, errorMessage} from '../../lib/graphql.js';
  import {fromDateInput, toDateInput} from '../../lib/format.js';
  import {
    CREATE_EVENT,
    CREATE_LOCATION,
    LOCATIONS_QUERY,
    UPDATE_EVENT,
  } from './data.js';

  /**
   * @type {{
   *   event?: {id: string, name: string, start_date?: string, end_date?: string, locationId?: string} | null,
   *   onsaved: (id: string) => void,
   *   oncancel: () => void,
   * }}
   */
  let {event = null, onsaved, oncancel} = $props();

  const NEW = '__new__';
  const initial = untrack(() => event);

  let name = $state(initial?.name ?? '');
  let start = $state(toDateInput(initial?.start_date));
  let end = $state(toDateInput(initial?.end_date));
  let locationId = $state(initial?.locationId ?? '');
  let newLocation = $state('');

  /** @type {{id: string, name: string}[]} */
  let locations = $state([]);
  let loadingLocations = $state(true);
  let saving = $state(false);
  let submitted = $state(false);
  let error = $state('');

  gql(LOCATIONS_QUERY)
    .then(data => {
      locations = [...data.locations].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      if (!locationId && locations.length === 0) locationId = NEW;
    })
    .catch(err => (error = errorMessage(err)))
    .finally(() => (loadingLocations = false));

  const problems = $derived({
    name: name.trim() ? '' : 'Give the event a name.',
    start: start ? '' : 'Pick a start date.',
    end: !end
      ? 'Pick an end date.'
      : start && end < start
        ? 'The end date can’t be before the start date.'
        : '',
    location: !locationId
      ? 'Choose where the event takes place.'
      : locationId === NEW && !newLocation.trim()
        ? 'Name the new location.'
        : '',
  });

  /** @param {SubmitEvent} e */
  async function submit(e) {
    e.preventDefault();
    submitted = true;
    if (Object.values(problems).some(Boolean)) return;

    saving = true;
    error = '';
    try {
      // A new location has to exist before the event can reference it
      let location = locationId;
      if (location === NEW) {
        const created = await gql(CREATE_LOCATION, {
          location: {name: newLocation.trim()},
        });
        location = created.createLocation.id;
      }
      const input = {
        name: name.trim(),
        start_date: fromDateInput(start),
        end_date: fromDateInput(end),
        locationId: location,
      };
      if (event) {
        await gql(UPDATE_EVENT, {id: event.id, event: input});
        onsaved(event.id);
      } else {
        const created = await gql(CREATE_EVENT, {event: input});
        onsaved(created.createEvent.id);
      }
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
    <label for="event-name">Name</label>
    <input
      id="event-name"
      class="input"
      bind:value={name}
      placeholder="e.g. Frontend Days 2027"
      autocomplete="off"
      aria-invalid={submitted && !!problems.name} />
    {#if submitted && problems.name}
      <p class="field-error">{problems.name}</p>
    {/if}
  </div>

  <div class="field-row">
    <div class="field">
      <label for="event-start">Starts</label>
      <input
        id="event-start"
        class="input"
        type="date"
        bind:value={start}
        aria-invalid={submitted && !!problems.start} />
      {#if submitted && problems.start}
        <p class="field-error">{problems.start}</p>
      {/if}
    </div>
    <div class="field">
      <label for="event-end">Ends</label>
      <input
        id="event-end"
        class="input"
        type="date"
        bind:value={end}
        min={start || undefined}
        aria-invalid={submitted && !!problems.end} />
      {#if submitted && problems.end}
        <p class="field-error">{problems.end}</p>
      {/if}
    </div>
  </div>

  <div class="field">
    <label for="event-location">Location</label>
    <select
      id="event-location"
      class="input"
      bind:value={locationId}
      disabled={loadingLocations}
      aria-invalid={submitted && !!problems.location && locationId !== NEW}>
      <option value="" disabled>
        {loadingLocations ? 'Loading locations…' : 'Choose a location'}
      </option>
      {#each locations as location (location.id)}
        <option value={location.id}>{location.name}</option>
      {/each}
      <option value={NEW}>+ New location…</option>
    </select>
    {#if submitted && problems.location && locationId !== NEW}
      <p class="field-error">{problems.location}</p>
    {/if}
  </div>

  {#if locationId === NEW}
    <div class="field">
      <label for="event-new-location">New location name</label>
      <input
        id="event-new-location"
        class="input"
        bind:value={newLocation}
        placeholder="e.g. Zagreb"
        autocomplete="off"
        aria-invalid={submitted && !!problems.location} />
      {#if submitted && problems.location}
        <p class="field-error">{problems.location}</p>
      {/if}
    </div>
  {/if}

  <div class="form-actions">
    <button type="button" class="btn btn-secondary" onclick={oncancel}>
      Cancel
    </button>
    <button type="submit" class="btn btn-primary" disabled={saving}>
      {saving ? 'Saving…' : event ? 'Save changes' : 'Create event'}
    </button>
  </div>
</form>
