resource "kubernetes_namespace" "keycloak" {
  metadata {
    name = "keycloak"
  }
}

resource "random_password" "keycloak-postgres-password" {
  length = 16
  special = false
}

resource "random_password" "keycloak-user-password" {
  length = 16
  special = false
}

resource "kubernetes_secret" "keycloak-postgres-access" {
  metadata {
    name = "keycloak-postgres-access"
    namespace = kubernetes_namespace.keycloak.metadata[0].name
  }

  data = {
    username = "keycloak"
    password = random_password.keycloak-postgres-password.result
  }
}

resource "kubernetes_secret" "keycloak-access" {
  metadata {
    name = "keycloak-access"
    namespace = kubernetes_namespace.keycloak.metadata[0].name
  }

  data = {
    "password" = random_password.keycloak-user-password.result
  }
}

resource "helm_release" "keycloak-postgres" {
  name = "keycloak-postgres"
  namespace = kubernetes_namespace.keycloak.metadata[0].name
  chart = "postgresql"
  repository = local.helm_repository_bitnami

  values = [
    file("helm_config/keycloak-postgres.yaml")
  ]

  set {
    name = "global.postgresql.postgresqlPassword"
    value = random_password.keycloak-postgres-password.result
  }
}

resource "helm_release" "keycloak" {

  depends_on = [
    helm_release.keycloak-postgres
  ]

  name = "keycloak"
  namespace = kubernetes_namespace.keycloak.metadata[0].name
  chart = "keycloak"
  version = "8.3.0"
  repository = local.helm_repository_codecentric

  values = [
    file("helm_config/keycloak.yaml")
  ]
}
