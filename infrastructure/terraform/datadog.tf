resource "kubernetes_namespace" "datadog" {
  metadata {
    name = "datadog"
  }
}

resource "kubernetes_secret" "datadog" {
  metadata {
    name      = "datadog"
    namespace = kubernetes_namespace.datadog.metadata.0.name
  }

  data = {
    api-key = "5f81a1cd7a62fb5a3b07cd9c7b26f6d9"
    app-key = "bd12837d5d4d7a9119bcd3d1e9104cb7e88b8e44"
  }

}


resource "helm_release" "datadog" {
  chart         = "datadog"
  name          = "datadog"
  namespace     = kubernetes_namespace.datadog.id
  repository    = local.helm_repository_datadog
  recreate_pods = true

  values = [
    file("helm_config/datadog.yaml"),
  ]

  timeout = 600
  /**/
  wait    = false

  depends_on = [
    kubernetes_secret.datadog
  ]
}
