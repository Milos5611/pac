# PAC Belgrade 2019 - Conference Application POC

![Logo](client/public/images/prodyna_logo.png)

![client](https://github.com/Milos5611/pac/workflows/client/badge.svg)
![api](https://github.com/Milos5611/pac/workflows/api/badge.svg)
![FOSSA Status(https://app.fossa.com/api/projects/git%2Bgithub.com%2FMilos5611%2Fpac-backend.svg?type=shield)]

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

- [Typescript](https://typescriptlang.org)
- [NodeJS](https://nodejs.org/)
- [Loopback4](https://loopback.io/)
- [GraphQL](https://graphql.org/)
- [Postgres](https://www.postgresql.org/)
- [Svelte](https://svelte.dev/)
- [Svelma](https://c0bra.github.io/svelma/)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)
- [Terraform](https://www.terraform.io/)
- [Minikube](https://minikube.sigs.k8s.io/docs/)
- [Okta](https://www.okta.com/)
- [Datadog](https://www.datadoghq.com/)
- [Helm](https://helm.sh/)

# Running project in local Minikube

* Go to [client folder](./client) and run `npm install` in order to install all frontend dependency.


* Go to [api folder](./api) and run `npm install` in order to install all backend dependency.


* Follow the steps [described here](./infrastructure/README.md) in order to prepare minikube and hosts.


* Run `eval $(minikube docker-env)` in order to connect minikube with a local docker.


* Run `./build-docker-images.sh` from root and wait that API and Web app are dockerized.


* Go into `terraform` folder and run `./install`. This will run terraform and install all the components to Minikube.


* Front end of the application can be accessed at http://conference.frontend


* Backend end of the application can be accessed at http://conference.backend


* Datadog monitoring of the application can be accessed at https://app.datadoghq.eu

# Local Development Only

For local development, a docker-compose file is provided to spin up both the API, DB and UI inside of containers, with
their filesystems volume-bound to the local repos. Changes to the repos should be automatically detected, and the
containers updated within a few seconds.

I use workspaces in order to leverage one config for eslint/prettier. The downside here is you need to be careful to
use "Open Workspace" to load this file instead of opening the pac/ folder itself.

## Setup

Prior to starting the containers, you'll need to create the environmental configs for both containers. The configs are
stored in `/devenv`. Examples are provided. Copy the example files, removing the `.example` from the name (
ie: `.env.example` -> `.env`). After creating the env files, populate them with the needed values.

## Starting

Please note the below mentioned commands need to run from the project root in order to start dev env using docker. 
A similar thing can be achieved going to every service and run `npm run dev`.

Once the environmental configs are setup, you can bring up the environment by running

`docker-compose up`

You can stop the containers by using `Ctrl+C` on the terminal, or using

`docker-compose down`

## Reset Database

It sometimes helps to completely reset your database. Also when doing the setup, the very first time, schema needs to be
created.  
In such cases run:
`docker-compose run api npm run migrate -- --rebuild`

## Migrate Database

When database schema changes, or new data migrations are created, you can migrate your existing database by running:
`docker-compose run api npm run migrate`

## Seeding Test Data

Seed test data with:
`docker-compose run api npm run seed`

```
/
|
├─ .github/                     # Github Actions to build and check the project
├─ api/                         # Backend application
├─ client/                      # Frontend application
├─ dotenv/                      # Environment variables
├─ infrastructure/              # Infrastructuree of the application
|
├─ docker-compose.yaml          # Config to run app in local docker container
├─ build-docler-images.sh       # Build Api and Web docker images from the root folder
├─ .gitignore                   # List of files and folders not tracked by Git
└─ README.md                    # This file
```

## Services

* [Web Application](client/README.md)
* [Loopback Node Api](./api/README.md)
* [Infrastracture](./infrastructure/README.md)
* Local Postgres Database
