terraform {
  required_providers {
    helm = {
      source = "hashicorp/helm"
      version = "~> 1.3.2"
    }
    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "~> 1.13.3"
    }
    random = {
      source = "hashicorp/random"
    }
    datadog = {
      source  = "datadog/datadog"
      version = "~> 2.16.0"
    }
  }
  required_version = ">= 0.13"
}
