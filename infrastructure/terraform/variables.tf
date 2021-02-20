variable "okta_client_id" {
  type = string
  description = "ClientID for OKTA application to fetch user identity"
}

variable "database_user" {
  type = string
  description = "Postgres SQL user"
}

variable "database_port" {
  type = string
  description = "Running port for Postgres SQL"
}

variable "database_name" {
  type = string
  description = "Postgres SQL database name"
}

variable "database_driver" {
  type = string
  description = "Postgres SQL driver"
}

variable "database_db" {
  type = string
  description = "Postgres SQL database"
}

variable "okta_issuer" {
  type = string
  description = "OKTA issuer link"
}
variable "okta_redirect_url" {
  type = string
  description = "Where OKTA should return after succesfully sign in user"
}
variable "okta_http_check" {
  type = bool
  description = "Weather OKTA should check for http or not"
}
variable "backend_url" {
  type = string
  description = "Url where the BE app will be seating"
}

variable "datadog_api_key" {
  type = string
  description = "Datadog API key"
}

variable "datadog_app_key" {
  type = string
  description = "Datadog APP key"
}
