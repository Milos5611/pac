resource "kubernetes_namespace" "datadog" {
  metadata {
    name = "datadog"
  }
}

resource "kubernetes_secret" "datadog" {
  metadata {
    name = "datadog"
    namespace = kubernetes_namespace.datadog.metadata.0.name
  }

  data = {
    api-key = var.datadog_api_key
    app-key = var.datadog_app_key
  }

}

resource "helm_release" "datadog" {
  chart = "datadog"
  name = "datadog"
  namespace = kubernetes_namespace.datadog.id
  repository = local.helm_repository_datadog
  recreate_pods = true

  values = [
    file("helm_config/datadog.yaml"),
  ]

  timeout = 1200

  depends_on = [
    kubernetes_secret.datadog
  ]
}
