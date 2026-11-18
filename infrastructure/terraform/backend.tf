resource "kubernetes_namespace_v1" "backend" {
  metadata {
    name = "backend"
  }
}

resource "random_password" "backend_postgres_password" {
  length  = 16
  special = false
}

resource "kubernetes_secret_v1" "backend_postgres_access" {
  metadata {
    name      = "backend-postgres-access"
    namespace = kubernetes_namespace_v1.backend.metadata[0].name
  }

  data = {
    DB_USER     = var.database_user
    DB_PASSWORD = random_password.backend_postgres_password.result
  }
}

resource "kubernetes_persistent_volume_claim_v1" "backend_postgres" {
  metadata {
    name      = "backend-postgres-data"
    namespace = kubernetes_namespace_v1.backend.metadata[0].name
  }

  spec {
    access_modes = ["ReadWriteOnce"]

    resources {
      requests = {
        storage = var.postgres_storage_size
      }
    }
  }

  wait_until_bound = false
}

locals {
  postgres_labels = {
    "app.kubernetes.io/name"     = "postgres"
    "app.kubernetes.io/instance" = "backend-postgres"
  }
}

resource "kubernetes_deployment_v1" "backend_postgres" {
  metadata {
    name      = "backend-postgres"
    namespace = kubernetes_namespace_v1.backend.metadata[0].name
    labels    = local.postgres_labels
  }

  spec {
    replicas = 1

    # A single pod owns the ReadWriteOnce volume, so never run two at once.
    strategy {
      type = "Recreate"
    }

    selector {
      match_labels = local.postgres_labels
    }

    template {
      metadata {
        labels = local.postgres_labels
      }

      spec {
        container {
          name  = "postgres"
          image = var.postgres_image

          port {
            name           = "postgres"
            container_port = 5432
          }

          env {
            name = "POSTGRES_USER"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.backend_postgres_access.metadata[0].name
                key  = "DB_USER"
              }
            }
          }

          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.backend_postgres_access.metadata[0].name
                key  = "DB_PASSWORD"
              }
            }
          }

          env {
            name  = "POSTGRES_DB"
            value = var.database_name
          }

          # postgres:18+ keeps PGDATA in a versioned subdirectory of /var/lib/postgresql.
          volume_mount {
            name       = "data"
            mount_path = "/var/lib/postgresql"
          }

          readiness_probe {
            exec {
              command = ["sh", "-c", "pg_isready -U \"$POSTGRES_USER\" -d \"$POSTGRES_DB\""]
            }
            initial_delay_seconds = 5
            period_seconds        = 10
          }

          liveness_probe {
            exec {
              command = ["sh", "-c", "pg_isready -U \"$POSTGRES_USER\" -d \"$POSTGRES_DB\""]
            }
            initial_delay_seconds = 30
            period_seconds        = 20
          }

          resources {
            requests = {
              cpu    = "100m"
              memory = "256Mi"
            }
            limits = {
              memory = "512Mi"
            }
          }
        }

        volume {
          name = "data"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim_v1.backend_postgres.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "backend_postgres" {
  metadata {
    name      = "backend-postgres"
    namespace = kubernetes_namespace_v1.backend.metadata[0].name
    labels    = local.postgres_labels
  }

  spec {
    selector = local.postgres_labels

    port {
      name        = "postgres"
      port        = var.database_port
      target_port = "postgres"
    }
  }
}

locals {
  # The web client's origin, e.g. http://conference.frontend
  backend_cors_origins = length(var.cors_origins) > 0 ? var.cors_origins : [regex("^https?://[^/]+", var.auth0_redirect_url)]
}

resource "kubernetes_config_map_v1" "backend_config" {
  metadata {
    name      = "backend-config"
    namespace = kubernetes_namespace_v1.backend.metadata[0].name
  }

  data = {
    NODE_ENV       = "production"
    DB_HOST        = "${kubernetes_service_v1.backend_postgres.metadata[0].name}.${kubernetes_namespace_v1.backend.metadata[0].name}.svc.cluster.local"
    DB_PORT        = tostring(var.database_port)
    DB_DATABASE    = var.database_name
    AUTH0_ISSUER   = var.auth0_issuer
    AUTH0_AUDIENCE = var.auth0_audience
    CORS_ORIGINS   = join(",", local.backend_cors_origins)
    # The chart's pre-install/pre-upgrade Job migrates instead
    AUTO_MIGRATE = "false"
  }
}

resource "helm_release" "backend" {
  name      = "backend"
  namespace = kubernetes_namespace_v1.backend.metadata[0].name
  chart     = "${path.module}/../charts/backend"

  timeout = 600

  values = [
    file("${path.module}/helm_config/backend.yaml"),
    yamlencode({
      image = {
        repository = var.backend_image_repository
        tag        = var.backend_image_tag
        pullPolicy = var.image_pull_policy
      }
      envFrom = [
        { configMapRef = { name = kubernetes_config_map_v1.backend_config.metadata[0].name } },
        { secretRef = { name = kubernetes_secret_v1.backend_postgres_access.metadata[0].name } },
      ]
      # Restart the pod when the config changes.
      podAnnotations = {
        "checksum/config" = sha256(jsonencode(kubernetes_config_map_v1.backend_config.data))
      }
    }),
  ]

  depends_on = [
    kubernetes_deployment_v1.backend_postgres,
    kubernetes_service_v1.backend_postgres,
  ]
}
