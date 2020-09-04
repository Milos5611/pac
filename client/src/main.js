import App from './App.svelte';

const app = new App({
	target: document.body,
	hydratable: true,
	props: {
		conference: __conference
	}
});

export default app;
