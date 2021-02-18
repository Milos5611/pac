# PAC Belgrade 2019 - Frontend

![Logo](public/images/prodyna_logo.png)

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

- Svelte
- Svelma
- Svelte OIDC
- Rollup
- Svelte Router

## Installation

Install dependencies via

```
npm install
```

## Environment tasks

| Environment   |      Command             | Description                                      |
| ------------- | :----------------------: | ------------------------------------------------ |
| Local         |  **npm run dev**         | Run local Svelte with hot reloading enabled.     |
| Local Prod    |  **npm run start**       | Run local Svelte with production build.          |
| Prod build    |  **npm run build**       | Run production build.                            |

Build will create new directory name `build` and all files will be there

## Other tasks

| Task          |          Command          | Description                                      |
| ------------- | :-----------------------: | ------------------------------------------------ |
| Docker build  |  **npm run docker:build** | Run production build and create docker container |
| Docker run    |  **npm run docker:run**   | Run already created docker container             |

## Environment variable

All env variable are executed during build time and can be find in
**_rollup.config.js_** file.

| Variable                             | Description                  |
| ------------------------------------ | :--------------------------- |
| SVELTE_APP_BE_URL                    | Endpoint to Node server      |
| SVELTE_APP_ISSUER                    | OIDC Issuer                  |
| SVELTE_APP_CLIENT_ID                 | OIDC App ID                  |
| SVELTE_APP_REDIRECT_OKTA_URL         | Redirect route after login   |

### Repository structure

```
/
|
├─ client/
|  |
|  |─ config/        # Buld configuration / GraphQL / storage
|  |
│  ├─ public/        # All static related files
|  |    ├─ fonts/    # Project fonts
|  |    ├─ icons/    # Project icons
|  |    ├─ images/   # Project images
|  |
|  |─ src/
|  |    ├─ components/   # Damb for widgets
│  │    ├─ pages/        # Complex components with many sub-components
│  │    ├─ main.js       # Application start
│  │    ├─ App.svelte    # Svelte App
│  │    ├─ routes        # Application Routes
|  |
├─ Dockerfile        # Container definition
├─ .gitignore        # List of files and folders not tracked by Git
├─ package.json      # Project manifest
├─ package-lock.json # Project manifest with locked version
└─ README.md         # This file
```
