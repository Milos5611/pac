resource "kubernetes_namespace" "frontend" {
  metadata {
    name = "frontend"
  }
}

resource "kubernetes_config_map" "frontend-config" {
  metadata {
    name = "frontend-config"
    namespace = kubernetes_namespace.frontend.metadata[0].name
  }

  data = {
    SVELTE_APP_BE_URL: var.backend_url
    SVELTE_APP_CLIENT_ID: var.okta_client_id
    SVELTE_APP_ISSUER: var.okta_issuer
    SVELTE_APP_OKTA_TESTING_DISABLEHTTPSCHECK: var.okta_http_check
    SVELTE_APP_REDIRECT_OKTA_URL: var.okta_redirect_url
  }
}


resource "helm_release" "frontend" {
  name = "frontend"
  namespace = kubernetes_namespace.frontend.metadata[0].name
  chart = "../charts/frontend"

  depends_on = [
    helm_release.frontend,
    kubernetes_config_map.frontend-config
  ]

  values = [
    file("helm_config/frontend.yaml")
  ]
}
