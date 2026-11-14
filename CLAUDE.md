# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Conference-management POC (events, locations, rooms, talks, topics, persons, organizations). Three independent parts. There is no root `package.json`, so install and run each part from its own directory. npm is the only package manager; do not add yarn or pnpm files.

- `api/` — LoopBack 4 (`@loopback/core` 8) + `@loopback/graphql` (type-graphql 2, Apollo Server 5) on Postgres 18, TypeScript 6 (via `@loopback/build`).
- `client/` — Svelte 5 (runes) SPA built with Vite 8, `oidc-client-ts` for Okta login, plain `fetch` for GraphQL.
- `infrastructure/` — Terraform that installs local Helm charts plus a Postgres Deployment into Minikube.

Node 22, 24 or 26. Docker images and CI use Node 26.

## Commands

### Whole stack

```bash
docker compose up --build      # postgres :5432, api :3000, web :8080
docker compose down -v         # stop and delete the DB volume
```

`devenv/.env` (optional, gitignored, see `devenv/.env.example`) adds Okta settings to the api and web containers.

### API (`cd api`)

```bash
npm install && cp .env.example .env
npm run dev                    # nodemon: lb-tsc + restart, inspector on :9202
npm run build                  # lb-tsc -> dist/
npm test                       # clean + build + lb-mocha dist/__tests__ + lint
npx lb-mocha --allow-console-logs dist/__tests__/acceptance/graphql.acceptance.js   # one file, after build
npm run lint / npm run lint:fix
npm run migrate [-- --rebuild] # run from dist/, build first
npm run seed                   # run from dist/, build first
```

npm scripts load `api/.env` with `node --env-file-if-exists=.env` (there is no dotenv package). Tests use the juggler memory connector, so they need no Postgres.

### Client (`cd client`)

```bash
npm run dev       # Vite on :5173
npm run check     # svelte-check
npm run build     # -> dist/
npm run preview   # :4173
```

## API architecture

**Boot.** `src/application.ts` composes `DataSourceMixin(BootMixin(ServiceMixin(RepositoryMixin(RestApplication))))`. The GraphQL server is configured (`asMiddlewareOnly`, `graphQLPath: '/graphql'`) before its binding is resolved, then mounted as Express middleware. A small middleware defaults `req.body` to `{}` on `/graphql`, because body-parser 2 leaves it undefined on GET and Apollo then fails. Resolvers are discovered from `graphql-resolvers/` with extension `.js`, so they load from `dist/`. `src/index.ts` `main()` runs `migrateDataSources()` and `seedDatabase()` on every start unless `AUTO_MIGRATE=false`.

**Dependency pinning.** The LoopBack 2026-10 release (core 8, rest 16, boot 9) still declares `peerDependencies` on core ^7 / rest ^15 / boot ^8. `package.json` `overrides` force a single copy of `@loopback/core`, `@loopback/rest`, `@loopback/boot` and `graphql`. After upgrades, run `npm ls @loopback/core @loopback/context graphql` and make sure nothing is duplicated. Import every GraphQL decorator (including `Ctx`) from `@loopback/graphql`, never from `type-graphql`, so there is one type-graphql instance.

**One class is both the DB model and the GraphQL type.** `graphql-types/<entity>/<entity>-type.ts` stacks LoopBack decorators (`@model`, `@property`, `@belongsTo`, `@hasMany`) with GraphQL decorators (`@objectType`, `@field`). `<entity>-input.ts` holds the `@inputType`. Foreign keys are camelCase properties mapped to snake_case columns: `@belongsTo(() => Room, {keyFrom: 'roomId'}, {name: 'room_id'})`, and `hasMany` uses the column name as `keyTo` (`keyTo: 'room_id'`). Each FK is also declared in the model's `settings.foreignKeys`.

**Relations resolve through repository `include`, not field resolvers.** A nested GraphQL selection returns data only as deep as the repository method's `include`/`scope` chain. Missing levels come back as `null` without an error. Example: `EventRepository.getOne` nests location → rooms → talks → topics → childrens/parents. Relation names in `include` must match the names registered with `registerInclusionResolver` (`talks`, not `talk`).

**Repositories** extend `DefaultCrudRepository`. They are bound as singletons in the `repositories` namespace, injected by name (`@repository('TalkRepository')`), and re-exported from `repositories/index.ts`.

**Schema migration.** `datasources/mixins/dataSource.mixin.ts` overrides `migrateDataSources`. It calls `autoupdate` per model in `PUBLIC_MODELS` order, which must respect FK dependencies. `--rebuild` first runs `DROP TABLE ... CASCADE` in reverse order (Postgres only).

**Seeding.** `seed-data/*.ts` holds fixed sample rows with stable ids (persons get generated uuids). `services/seed-service.ts` inserts into a table only when it is empty. `src/seed.ts` exports `seedDatabase(app)` and is also the `npm run seed` entry point.

**Adding an entity** touches: type + input classes, a repository exported from `repositories/index.ts`, a resolver, an entry in `PUBLIC_MODELS` in dependency order, and optionally seed data plus a `SeedService` method and a call in `seed.ts`.

**Auth.** Queries are public. Every mutation calls `await requireUser(context)` (`src/auth/require-user.ts`). It needs `Authorization: Bearer <access token>` and verifies it with `@okta/jwt-verifier` against `OKTA_ISSUER` / `OKTA_AUDIENCE` (default `api://default`). Without `OKTA_ISSUER` all mutations fail with `UNAUTHENTICATED`. `AUTH_DISABLED=true` skips the check for local development.

**Style.** ESLint `@loopback/eslint-config` (eslint 8). Prettier: single quotes, no bracket spacing, width 80, trailing commas, `arrowParens: avoid`. `npm run lint:fix` formats everything.

## Client architecture

- `src/routes.js` maps paths to pages for a small history router (`src/lib/router.svelte.js`). Pages live under `src/pages/<area>/`, and each area keeps its query strings in `data.js`. Unknown paths fall back to `index.html` in nginx and Vite.
- `src/lib/graphql.js` posts queries with `fetch` and adds `Authorization: Bearer <access_token>` only when the user is logged in (`src/lib/auth.svelte.js`).
- **Config** (`src/lib/config.js`): `window.APP_CONFIG` from `/config.js` wins, then `import.meta.env.SVELTE_APP_*` (Vite `envPrefix: 'SVELTE_APP_'`, `client/.env`), then defaults. In Docker, `docker/40-app-config.sh` writes `/config.js` from `SVELTE_APP_BE_URL`, `SVELTE_APP_ISSUER`, `SVELTE_APP_CLIENT_ID` and `SVELTE_APP_REDIRECT_OKTA_URL` at container start, so one image serves every environment. If issuer or client id is empty, the Login button is hidden and the app runs in guest mode.

## CI

`.github/workflows/{api,client}_workflow.yml` run on pushes and PRs that touch their folder. The API job runs `npm test` (includes lint). The client job runs `npm run check` and `npm run build`. On pushes to `master` they then build and push `mnikolic/pac_mnikolic_{api,web}:latest` (secrets `DOCKER_USERNAME`, `DOCKER_PASSWORD`).

## Infrastructure

- Terraform providers target an explicit kube context (`var.kube_context`, default `minikube`). `install.sh` / `install.bat` refuse to run unless that context exists, and they ask before applying. Never run them, or `terraform apply`, against another context.
- Postgres is a plain Deployment + PVC + Service (`backend-postgres`), not a Bitnami chart. Backend env comes from ConfigMap `backend-config` and Secret `backend-postgres-access`. Frontend env comes from ConfigMap `frontend-config`.
- Datadog is off by default (`enable_datadog`). Keys go in a gitignored `secrets.auto.tfvars` or in `TF_VAR_*` variables, never in `pac_context.auto.tfvars`.
