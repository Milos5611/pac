provider "kubernetes" {
  config_context = "minikube"
  config_path = "~/.kube/config"
}

provider "helm" {
  kubernetes {
    config_context = "minikube"
    config_path = "~/.kube/config"
  }
}
