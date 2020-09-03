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
    BE_URL: "http://conference.backend/"
    CLIENT_ID: "0oaup7oeuqIcBZjyw4x6"
    ISSUER: "https://dev-269607.okta.com"
    OKTA_TESTING_DISABLEHTTPSCHECK: false,
    REDIRECT_OKTA_URL: "http://conference.frontend/"
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
