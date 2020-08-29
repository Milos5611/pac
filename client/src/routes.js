import Events from './pages/events/Events.svelte';
import Event from './pages/event/Event.svelte';
import PublicLayout from './component/layout/public_layout.svelte';

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
        nestedRoutes: [
            {
                name: ':id',
                component: Event,
            },
        ]
    },
];

export { routes }
