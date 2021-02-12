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
    SVELTE_APP_BE_URL: "http://conference.backend/graphql"
    SVELTE_APP_CLIENT_ID: "0oaup7oeuqIcBZjyw4x6"
    SVELTE_APP_ISSUER: "https://dev-269607.okta.com"
    SVELTE_APP_OKTA_TESTING_DISABLEHTTPSCHECK: false,
    SVELTE_APP_REDIRECT_OKTA_URL: "http://conference.frontend/"
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
