# PAC Belgrade 2020 - Frontend


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
