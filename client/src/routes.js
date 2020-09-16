import Events from './pages/events/Events.svelte';
import Event from './pages/events/Event.svelte';
import Persons from './pages/persons/Persons.svelte';
import Person from './pages/persons/Person.svelte';
import Home from './pages/home/Home.svelte';
import PublicLayout from './component/layout/public_layout.svelte';

const routes = [
    {
        name: '/',
        component: Home,
    },
    {
        name: 'events',
        component: Events,
        layout: PublicLayout,
    },
    {
        name: 'persons',
        component: Persons,
        layout: PublicLayout,
    },
    {
        name: 'person/:id',
        component: Person,
        layout: PublicLayout,
    },
    {
        name: 'event/:id',
        component: Event,
        layout: PublicLayout,
    },
];

export { routes }
