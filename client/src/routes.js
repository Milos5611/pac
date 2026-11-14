import Home from './pages/home/Home.svelte';
import Events from './pages/events/Events.svelte';
import Event from './pages/events/Event.svelte';
import Persons from './pages/persons/Persons.svelte';
import Person from './pages/persons/Person.svelte';
import NotFound from './pages/not-found/NotFound.svelte';
import PublicLayout from './component/layout/PublicLayout.svelte';

/** @type {import('./lib/router.svelte.js').Route[]} */
export const routes = [
  {path: '/', component: Home},
  {path: '/events', component: Events, layout: PublicLayout},
  {path: '/event/:id', component: Event, layout: PublicLayout},
  {path: '/persons', component: Persons, layout: PublicLayout},
  {path: '/person/:id', component: Person, layout: PublicLayout},
];

export const notFound = {path: '*', component: NotFound, layout: PublicLayout};
