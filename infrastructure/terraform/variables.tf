variable "kube_context" {
  type        = string
  default     = "minikube"
  description = "kubeconfig context to deploy into. Defaults to the local Minikube cluster."
}

variable "kube_config_path" {
  type        = string
  default     = "~/.kube/config"
  description = "Path to the kubeconfig file that contains kube_context."
}

variable "backend_image_repository" {
  type        = string
  default     = "mnikolic/pac_mnikolic_api"
  description = "Container image repository for the API."
}

variable "backend_image_tag" {
  type        = string
  default     = "latest"
  description = "Container image tag for the API."
}

variable "frontend_image_repository" {
  type        = string
  default     = "mnikolic/pac_mnikolic_web"
  description = "Container image repository for the web client."
}

variable "frontend_image_tag" {
  type        = string
  default     = "latest"
  description = "Container image tag for the web client."
}

variable "image_pull_policy" {
  type        = string
  default     = "Always"
  description = "imagePullPolicy for the API and web client. Use \"Never\" for images loaded into Minikube locally."

  validation {
    condition     = contains(["Always", "IfNotPresent", "Never"], var.image_pull_policy)
    error_message = "image_pull_policy must be Always, IfNotPresent or Never."
  }
}

variable "database_user" {
  type        = string
  default     = "postgres"
  description = "Postgres user."
}

variable "database_port" {
  type        = number
  default     = 5432
  description = "Postgres port."
}

variable "database_name" {
  type        = string
  default     = "conference_db"
  description = "Postgres database used by the API."
}

variable "postgres_image" {
  type        = string
  default     = "postgres:18-alpine"
  description = "Postgres container image."
}

variable "postgres_storage_size" {
  type        = string
  default     = "1Gi"
  description = "Size of the Postgres persistent volume claim."
}

variable "auth0_issuer" {
  type        = string
  description = "Auth0 issuer URL with trailing slash, e.g. https://<tenant>.us.auth0.com/. Used by the web client for login and by the API to verify access tokens."
}

variable "auth0_audience" {
  type        = string
  default     = "api://default"
  description = "Auth0 API identifier (audience): requested by the web client at login and checked by the API in access tokens."
}

variable "auth0_client_id" {
  type        = string
  description = "Client ID of the Auth0 single-page application used by the web client."
}

variable "auth0_redirect_url" {
  type        = string
  description = "Where Auth0 redirects after sign-in and sign-out."
}

variable "backend_url" {
  type        = string
  description = "GraphQL endpoint the web client calls from the browser."
}

variable "enable_datadog" {
  type        = bool
  default     = false
  description = "Install the Datadog agent. Requires datadog_api_key and datadog_app_key."
}

variable "datadog_chart_version" {
  type        = string
  default     = "3.270.1"
  description = "Version of the datadog/datadog Helm chart."
}

variable "datadog_api_key" {
  type        = string
  default     = ""
  sensitive   = true
  description = "Datadog API key. Set via TF_VAR_datadog_api_key or secrets.auto.tfvars. Never commit it."
}

variable "datadog_app_key" {
  type        = string
  default     = ""
  sensitive   = true
  description = "Datadog application key. Set via TF_VAR_datadog_app_key or secrets.auto.tfvars. Never commit it."
}
