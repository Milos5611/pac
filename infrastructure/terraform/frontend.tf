resource "kubernetes_namespace_v1" "frontend" {
  metadata {
    name = "frontend"
  }
}

resource "kubernetes_config_map_v1" "frontend_config" {
  metadata {
    name      = "frontend-config"
    namespace = kubernetes_namespace_v1.frontend.metadata[0].name
  }

  data = {
    SVELTE_APP_BE_URL       = var.backend_url
    SVELTE_APP_CLIENT_ID    = var.auth0_client_id
    SVELTE_APP_ISSUER       = var.auth0_issuer
    SVELTE_APP_REDIRECT_URL = var.auth0_redirect_url
    SVELTE_APP_AUDIENCE     = var.auth0_audience
  }
}

resource "helm_release" "frontend" {
  name      = "frontend"
  namespace = kubernetes_namespace_v1.frontend.metadata[0].name
  chart     = "${path.module}/../charts/frontend"

  values = [
    file("${path.module}/helm_config/frontend.yaml"),
    yamlencode({
      image = {
        repository = var.frontend_image_repository
        tag        = var.frontend_image_tag
        pullPolicy = var.image_pull_policy
      }
      envFrom = [
        { configMapRef = { name = kubernetes_config_map_v1.frontend_config.metadata[0].name } },
      ]
      podAnnotations = {
        "checksum/config" = sha256(jsonencode(kubernetes_config_map_v1.frontend_config.data))
      }
    }),
  ]
}
