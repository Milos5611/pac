# PAC Belgrade 2020 - Frontend


## Points of Contact

| Role            | Name          | Email                                                                | Teams          |
| --------------- | ------------- | -------------------------------------------------------------------- | -------------- |
| _Product Owner_ | Darko Krizic  | [darko.krizic@prodyna.com](mailto:darko.krizic@prodyna.com)          | @Darko Krizic  |
| _Maintainer_    | Milos Nikolic | [milos.nikolic@prodyna.com](mailto:milos.nikolic@prodyna.com)        | @Milos Nikolic |

## Stack

- [Svelte 5](https://svelte.dev/) (runes)
- [Vite](https://vite.dev/)
- [@auth0/auth0-spa-js](https://github.com/auth0/auth0-spa-js) for Auth0 login (authorization code + PKCE, rotating refresh tokens)
- Sass for component styles
- A small built-in history router (`src/lib/router.svelte.js`) and `fetch`-based GraphQL client (`src/lib/graphql.js`)

Requires Node.js 22.12 or newer (CI and the Docker build use Node 26 LTS). npm is the only package manager; `package-lock.json` is the lockfile.

## Installation

```
npm install
```

## Environment tasks

| Environment   |      Command             | Description                                        |
| ------------- | :----------------------: | -------------------------------------------------- |
| Local         |  **npm run dev**         | Vite dev server with hot reload on http://localhost:5173 |
| Prod build    |  **npm run build**       | Production build into `dist/`                      |
| Local Prod    |  **npm run preview**     | Serve the `dist/` build on http://localhost:4173   |
| Check         |  **npm run check**       | Type and template checks with `svelte-check`       |

The API must be running (default `http://localhost:3000/graphql`) for pages to load data.

## Other tasks

| Task          |          Command          | Description                                      |
| ------------- | :-----------------------: | ------------------------------------------------ |
| Docker build  |  **npm run docker:build** | Build the nginx image `pac_mnikolic_web`         |
| Docker run    |  **npm run docker:run**   | Run the image on http://localhost:8080           |

## Environment variables

| Variable                       | Description                    | Default                         |
| ------------------------------ | :----------------------------- | ------------------------------- |
| SVELTE_APP_BE_URL              | GraphQL endpoint of the API    | `http://localhost:3000/graphql` |
| SVELTE_APP_ISSUER              | OIDC issuer (Auth0 tenant URL) | empty: login disabled           |
| SVELTE_APP_CLIENT_ID           | OIDC client ID                 | empty: login disabled           |
| SVELTE_APP_REDIRECT_URL        | Redirect URI after login/logout | current origin                 |
| SVELTE_APP_AUDIENCE            | API audience sent at login (Auth0 needs it for a JWT access token) | empty: not sent |

Values are resolved in this order:

1. **Runtime**: `window.APP_CONFIG` from `/config.js`. The Docker image writes this file at container start from the variables above, so one image works in every environment (`docker run -e SVELTE_APP_BE_URL=... pac_mnikolic_web`).
2. **Build time**: `SVELTE_APP_*` from `.env`, inlined by Vite. Used by `npm run dev` and local builds. The Docker build ignores `.env`.
3. The defaults in the table.

When the issuer or client ID is empty, the Login button is hidden and the app runs in guest mode. Guests can browse everything; login only adds a `Bearer` token to API requests.

To log in during local development, add `http://localhost:5173` to Allowed Callback URLs, Allowed Logout URLs and Allowed Web Origins in the Auth0 application. Login needs a secure origin (https or `localhost`); elsewhere the SDK cannot start and the app stays in guest mode.

### Repository structure

```
/
|
├─ client/
|  |
|  ├─ docker/        # Container start script that writes config.js
|  ├─ public/        # Static files copied as-is (config.js, global.css, images)
|  |
|  ├─ src/
|  |    ├─ component/    # Reusable widgets (header, layout, link, chip)
|  |    ├─ lib/          # Config, auth, router, GraphQL client, formatting
|  |    ├─ pages/        # One folder per page; queries live in data.js
|  |    ├─ App.svelte    # Root component: auth bootstrap and routing
|  |    ├─ main.js       # Application start
|  |    ├─ routes.js     # Route table
|  |
|  ├─ index.html     # Vite entry HTML
|  ├─ nginx.conf     # nginx config for the Docker image (SPA fallback)
|  ├─ vite.config.js # Vite config
├─ Dockerfile        # Container definition
├─ .gitignore        # List of files and folders not tracked by Git
├─ package.json      # Project manifest
├─ package-lock.json # Locked dependency versions
└─ README.md         # This file
```
