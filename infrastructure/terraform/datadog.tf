resource "kubernetes_namespace_v1" "datadog" {
  count = var.enable_datadog ? 1 : 0

  metadata {
    name = "datadog"
  }
}

resource "kubernetes_secret_v1" "datadog" {
  count = var.enable_datadog ? 1 : 0

  metadata {
    name      = "datadog"
    namespace = kubernetes_namespace_v1.datadog[0].metadata[0].name
  }

  # Key names expected by the chart's apiKeyExistingSecret / appKeyExistingSecret.
  data = {
    api-key = var.datadog_api_key
    app-key = var.datadog_app_key
  }

  lifecycle {
    precondition {
      condition     = var.datadog_api_key != "" && var.datadog_app_key != ""
      error_message = "enable_datadog is true but datadog_api_key or datadog_app_key is empty. Set them in secrets.auto.tfvars or via TF_VAR_datadog_api_key / TF_VAR_datadog_app_key."
    }
  }
}

resource "helm_release" "datadog" {
  count = var.enable_datadog ? 1 : 0

  name       = "datadog"
  namespace  = kubernetes_namespace_v1.datadog[0].metadata[0].name
  repository = local.helm_repository_datadog
  chart      = "datadog"
  version    = var.datadog_chart_version
  timeout    = 1200

  values = [
    file("${path.module}/helm_config/datadog.yaml"),
  ]

  depends_on = [
    kubernetes_secret_v1.datadog,
  ]
}
