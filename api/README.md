# PAC Belgrade 2020 - Backend

## Points of Contact

| Role            | Name          | Email                                                                | Teams          |
| --------------- | ------------- | -------------------------------------------------------------------- | -------------- |
| _Product Owner_ | Darko Krizic  | [darko.krizic@prodyna.com](mailto:darko.krizic@prodyna.com)          | @Darko Krizic  |
| _Maintainer_    | Milos Nikolic | [milos.nikolic@prodyna.com](mailto:milos.nikolic@prodyna.com)        | @Milos Nikolic |

## Stack

- TypeScript, Node.js 22 / 24 / 26
- LoopBack 4 (`@loopback/core` 8) with `@loopback/graphql` (type-graphql 2, Apollo Server 5)
- PostgreSQL (`loopback-connector-postgresql`)
- Auth0 access-token verification (`jsonwebtoken` + `jwks-rsa`)
- Docker

## Installation

```
npm install
cp .env.example .env
```

`.env` is loaded by Node's `--env-file-if-exists` in the npm scripts.

## Tasks

| Task              | Command                         | Description                                                  |
| ----------------- | ------------------------------- | ------------------------------------------------------------ |
| Dev               | `npm run dev`                   | Rebuild and restart on change, debugger on port 9202         |
| Start             | `npm start`                     | Build, then run `dist/`                                      |
| Build             | `npm run build`                 | Compile to `dist/`                                           |
| Test              | `npm test`                      | Build, run tests in `dist/__tests__`, then lint              |
| Lint              | `npm run lint` / `lint:fix`     | Prettier + ESLint                                            |
| Migrate           | `npm run migrate`               | Create or alter tables (run `build` first)                   |
| Rebuild schema    | `npm run migrate -- --rebuild`  | Drop all tables, then create them again                      |
| Seed              | `npm run seed`                  | Insert sample data into empty tables (run `build` first)     |
| Docker build      | `npm run docker:build`          | Build image `pac_mnikolic_api`                               |
| Docker run        | `npm run docker:run`            | Run the image on port 3000                                   |

Run one test file after `npm run build`: `npx lb-mocha --allow-console-logs dist/__tests__/acceptance/graphql.acceptance.js`.
The tests use an in-memory database, so they need no Postgres.

## Endpoints

- `POST /graphql`: GraphQL API. `GET /graphql` in a browser opens the Apollo Sandbox.
- `GET /metrics`: Prometheus metrics.
- `GET /`: static start page.

## Environment variables

| Variable        | Default            | Description                                                         |
| --------------- | ------------------ | ------------------------------------------------------------------- |
| DB_HOST         | `localhost`        | Postgres host                                                       |
| DB_PORT         | `5432`             | Postgres port                                                       |
| DB_USER         | `postgres`         | Postgres user                                                       |
| DB_PASSWORD     | `postgres`         | Postgres password                                                   |
| DB_DATABASE     | `postgres`         | Postgres database                                                   |
| PORT / HOST     | `3000` / all       | HTTP listen port and host                                           |
| AUTH0_ISSUER    | (none)             | Auth0 issuer, e.g. `https://dev-a6i1rkcd4ax8jbrq.us.auth0.com/`. Without it every mutation is rejected. |
| AUTH0_AUDIENCE  | (none)             | Auth0 API identifier, e.g. `https://pac-api`. Without it every mutation is rejected. |
| AUTH_DISABLED   | `false`            | `true` skips the token check for mutations. Local development only. |
| AUTO_MIGRATE    | `true`             | `false` skips schema migration and seeding on start                 |
| NODE_ENV        |                    | `production` switches logs to JSON                                  |
| LOG_LEVEL       | `info`             | Winston log level                                                   |

### Repository structure

```
api/
├─ public/                  # Static start page
└─ src/
   ├─ __tests__/            # Acceptance tests
   ├─ auth/                 # Auth0 token check for mutations
   ├─ datasources/          # Postgres datasource + migration mixin
   ├─ graphql-resolvers/    # GraphQL resolvers
   ├─ graphql-types/        # Models: LoopBack entity + GraphQL type in one class
   ├─ repositories/         # Database access and relation includes
   ├─ seed-data/            # Sample data
   ├─ services/             # Seed service
   ├─ index.ts              # Start: migrate, seed, serve
   ├─ migrate.ts            # npm run migrate
   └─ seed.ts               # npm run seed
```
