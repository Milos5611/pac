import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import autoPreprocess from 'svelte-preprocess';
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;
const defaultRedirectUri = production ? 'http://conference.frontend/' : 'http://localhost:5000';

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		replace({
			'process.env.SVELTE_APP_BE_URL': process.env.SVELTE_APP_BE_URL || 'http://localhost:3000',
			'process.env.SVELTE_APP_ISSUER': process.env.SVELTE_APP_ISSUER || 'https://dev-26276100.okta.com/',
			'process.env.SVELTE_APP_CLIENT_ID': process.env.SVELTE_APP_CLIENT_ID || '0oa5v4cgxUyPfnyUR5d6',
			'process.env.SVELTE_APP_REDIRECT_OKTA_URL': process.env.SVELTE_APP_REDIRECT_OKTA_URL || defaultRedirectUri,
			'pkg.version': pkg.version,
		}),
		svelte({
			preprocess: autoPreprocess(),
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('public/build/bundle.css');
			}
		}),
		postcss(),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
