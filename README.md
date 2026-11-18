# PAC Belgrade 2020 - Conference Application POC

![Logo](client/public/images/prodyna_logo.png)

![client](https://github.com/Milos5611/pac/workflows/client/badge.svg)
![api](https://github.com/Milos5611/pac/workflows/api/badge.svg)
![FOSSA](https://app.fossa.com/api/projects/git%2Bgithub.com%2FMilos5611%2Fpac-backend.svg?type=shield)

## Product Vision

The Conferencing App is a fictive but easy to understand business application. The customers organises events and wants
to get rid of printed paper and digitise the business. The intention is to have a central place where all details about
events, talks, persons a.s.o. are stored. The system must support multiple frontends (e.g. Web or Mobile phone). The
system must be scalable because while the events take place the load gets very high. So the architecture must compensate
for that. Additionally monitoring must ensure that bottlenecks can be detected early to prevent low performance.

## Points of Contact

| Role            | Name          | Email                                                                | Teams          |
| --------------- | ------------- | -------------------------------------------------------------------- | -------------- |
| _Product Owner_ | Darko Krizic  | [darko.krizic@prodyna.com](mailto:darko.krizic@prodyna.com)          | @Darko Krizic  |
| _Maintainer_    | Milos Nikolic | [milos.nikolic@prodyna.com](mailto:milos.nikolic@prodyna.com)        | @Milos Nikolic |

## Stack

- [TypeScript](https://typescriptlang.org) and [Node.js](https://nodejs.org/) 22, 24 or 26 (Docker and CI use 26)
- [LoopBack 4](https://loopback.io/) with [GraphQL](https://graphql.org/) (type-graphql, Apollo Server)
- [PostgreSQL](https://www.postgresql.org/) 18
- [Svelte 5](https://svelte.dev/) and [Vite](https://vite.dev/)
- [Auth0](https://auth0.com/) (OpenID Connect) for login
- [Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/), [Minikube](https://minikube.sigs.k8s.io/docs/), [Helm](https://helm.sh/), [Terraform](https://www.terraform.io/)
- [Datadog](https://www.datadoghq.com/) (optional)

npm is the only package manager. Each part (`api/`, `client/`) has its own `package.json` and `package-lock.json`.

## Quick start (Docker)

Requires Docker with Compose v2.24 or newer. From the repository root:

```bash
docker compose up --build
```

| Service  | URL                             |
| -------- | ------------------------------- |
| Web app  | http://localhost:8080           |
| GraphQL  | http://localhost:3000/graphql (open it in a browser for the Apollo Sandbox) |
| Postgres | `localhost:5432`, user/password/db `postgres` |

On start the API creates the schema and fills empty tables with sample data. Stop with `Ctrl+C` or
`docker compose down`. Add `-v` to also delete the database volume.

Login and GraphQL mutations need OIDC settings: copy `devenv/.env.example` to `devenv/.env` and adjust it. Without
it, the app runs in guest mode (read-only).

## Local development (hot reload)

Run Postgres in Docker and the API and web app on the host (Node 22.12+):

```bash
docker compose up -d postgres

cd api
cp .env.example .env      # once
npm install
npm run dev               # http://localhost:3000/graphql, restarts on change

cd ../client
npm install
npm run dev               # http://localhost:5173
```

### Database tasks (in `api/`)

```bash
npm run build                    # migrate and seed run from dist/
npm run migrate                  # create or alter tables
npm run migrate -- --rebuild     # drop all tables, then create them again
npm run seed                     # insert sample data into empty tables
```

With the Docker stack, run them inside the container instead, for example
`docker compose exec api node dist/migrate --rebuild`.

### Login (Auth0)

Login uses the Auth0 tenant `dev-a6i1rkcd4ax8jbrq.us.auth0.com` (issuer `https://dev-a6i1rkcd4ax8jbrq.us.auth0.com/`,
SPA client id `MSppXA9ofiby9G6xq0DTiMLzJhYGRSHw`, API audience `https://pac-api`). The Auth0 application must list the URL you use (`http://localhost:5173`,
`http://localhost:8080`, `http://conference.frontend/`) under Allowed Callback URLs, Allowed Logout URLs and Allowed Web
Origins. In the Auth0 API (**Applications → APIs → PAC API**), authorize the PAC application for user access on the
**Application Access** tab and turn on **Allow Offline Access**; in the application settings, turn on **Refresh Token
Rotation**. The web client keeps sessions alive with rotating refresh tokens. Login needs a secure origin (https or
`localhost`); on plain http such as `http://conference.frontend/` the Login button is hidden. Queries never need a
login. For local testing of mutations without a login, set `AUTH_DISABLED=true` in `api/.env`.

## Running in local Minikube

See [infrastructure/README.md](./infrastructure/README.md). In short: start Minikube with the ingress addon, add
`conference.frontend` and `conference.backend` to `/etc/hosts`, then run `./install.sh` in `infrastructure/terraform`.
The script refuses to run unless the `minikube` kubectl context exists, so it never deploys to another cluster.

* Front end: http://conference.frontend
* Back end: http://conference.backend/graphql
* Datadog (optional): https://app.datadoghq.eu

```
/
├─ .github/          # GitHub Actions: test, lint and publish Docker images
├─ api/              # Backend (LoopBack 4 + GraphQL)
├─ client/           # Frontend (Svelte 5 + Vite)
├─ devenv/           # Optional env overrides for docker compose
├─ infrastructure/   # Terraform + Helm charts for Minikube
└─ docker-compose.yml
```

## Services

* [Web Application](client/README.md)
* [LoopBack Node API](./api/README.md)
* [Infrastructure](./infrastructure/README.md)
