# PAC Belgrade 2019 - Infrastructure

![Logo](../client/public/images/prodyna_logo.png)

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

- Kubernetes
- Minikube
- Okta
- Datadog

## Running on Minikube
* First, configure your Minikube with some resources (before starting minikube) and necessary addons:

    ```
    minikube config set cpus 4
    minikube config set memory 8192
    minikube config set disk-size 100g
  
    minikube start
  
    minikube addons enable ingress
    minikube addons enable dashboard
    minikube addons enable freshpod
    minikube addons enable metrics-server
    ```

* In order to access the services that will run in Minikube properly, you will need to update your /etc/hosts file to include the following:

  | Address        |  Host                 |
  | -------------- | --------------------- |
  | minikube_ip    |  conference.frontend  |
  | minikube_ip    |  conference.backend   |

  Note: Minikube ip can be found by running `minikube ip`.


* Run `eval $(minikube docker-env)` in order to connect minikube with a local docker.


* Run `./build-docker-images.sh` from root and wait that API and Web app are dockerized.


* Go into `terraform` folder and run `./install`. This will run terraform and install all the components to Minikube.


* Front end of the application can be accessed at http://conference.frontend


* Backend end of the application can be accessed at http://conference.backend


* Datadog monitoring of the application can be accessed at https://app.datadoghq.eu