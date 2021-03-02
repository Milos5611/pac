# PAC Belgrade 2020 - Infrastructure


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
    minikube addons enable metrics-server
    ```

* In order to access the services that will run in Minikube properly, you will need to update your `/etc/hosts` file to include the following:

  | Address        |  Host                 |
  | -------------- | --------------------- |
  | minikube_ip    |  conference.frontend  |
  | minikube_ip    |  conference.backend   |

  Note: Minikube ip can be found by running `minikube ip`.