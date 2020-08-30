import Events from './pages/events/Events.svelte';
import Persons from './pages/persons/Persons.svelte';
import Person from './pages/persons/Person.svelte';
import PublicLayout from './component/layout/public_layout.svelte';
import ItemLayout from './component/layout/item_layout.svelte';

const routes = [
    {
        name: '/',
        component: Events,
        layout: PublicLayout
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
];

export { routes }
