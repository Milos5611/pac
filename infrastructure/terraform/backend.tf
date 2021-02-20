resource "kubernetes_namespace" "backend" {
  metadata {
    name = "backend"
  }
}

resource "random_password" "backend-postgres-password" {
  length = 16
  special = false
}

resource "kubernetes_secret" "backend-postgres-access" {
  metadata {
    name = "backend-postgres-access"
    namespace = kubernetes_namespace.backend.metadata[0].name
  }

  data = {
    DB_USER = var.database_user
    DB_PASSWORD = random_password.backend-postgres-password.result
  }
}

resource "helm_release" "backend-postgres" {
  name = "backend-postgres-postgresql-0"
  namespace = kubernetes_namespace.backend.metadata[0].name
  chart = "postgresql"
  repository = local.helm_repository_bitnami

  values = [
    file("helm_config/backend-postgres.yaml")
  ]

  set {
    name = "global.postgresql.postgresqlPassword"
    value = random_password.backend-postgres-password.result
  }
}

resource "kubernetes_config_map" "backend-config" {
  metadata {
    name = "backend-config"
    namespace = kubernetes_namespace.backend.metadata[0].name
  }

  data = {
    DB_DRIVER = var.database_driver
    DB_HOST = helm_release.backend-postgres.metadata[0].name
    DB_NAME = var.database_name
    DB_PORT = var.database_port
    DB_USER = var.database_user
    DB_PASSWORD = random_password.backend-postgres-password.result
    DB_DATABASE = var.database_db,
    CLIENT_ID = var.okta_client_id
  }
}

resource "helm_release" "backend" {
  name = "backend"
  namespace = kubernetes_namespace.backend.metadata[0].name
  chart = "../charts/backend"

  depends_on = [
    helm_release.backend-postgres,
    kubernetes_config_map.backend-config,
    kubernetes_secret.backend-postgres-access
  ]

  values = [
    file("helm_config/backend.yaml")
  ]
}
