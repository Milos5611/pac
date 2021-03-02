# PAC Belgrade 2020 - Backend


## Points of Contact

| Role            | Name          | Email                                                                | Teams          |
| --------------- | ------------- | -------------------------------------------------------------------- | -------------- |
| _Product Owner_ | Darko Krizic  | [darko.krizic@prodyna.com](mailto:darko.krizic@prodyna.com)          | @Darko Krizic  |
| _Maintainer_    | Milos Nikolic | [milos.nikolic@prodyna.com](mailto:milos.nikolic@prodyna.com)        | @Milos Nikolic |

## Stack

- Typescript
- NodeJS
- Loopback 4
- GraphQL
- Postgres
- Docker

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

All env variable are executed during run time and can be find in
**_.env_** file od **_dotenv_** folder.

| Variable                             | Description                  |
| ------------------------------------ | :--------------------------- |
| DB_HOST                              | Postgres Host                |
| DB_PORT                              | Postgres Port                |
| DB_USER                              | Postgres User                |
| DB_PASSWORD                          | Postgres Password            |
| DB_DATABASE                          | Postgres DB name             |

### Repository structure

```
/
|
├─ api/
|  |
|  |─ src/
|  |    ├─ datasrource/         # Database configuration
│  │    ├─ graphql-resolvers/   # Graphql Resolvers 
│  │    ├─ graphql-types/       # Graphql Types
│  │    ├─ helpers/             # Helpers method for migration and seed database
│  │    ├─ repositories/        # Methods to execute operation on database
│  │    ├─ seed-data/           # Data to seed database
│  │    ├─ services/            # Internal services
|  |
├─ Dockerfile        # Container definition
├─ .gitignore        # List of files and folders not tracked by Git
├─ package.json      # Project manifest
├─ package-lock.json # Project manifest with locked version
└─ README.md         # This file
```
