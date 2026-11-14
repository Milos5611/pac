#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

KUBE_CONTEXT="${TF_VAR_kube_context:-minikube}"
KUBE_CONFIG_PATH="${TF_VAR_kube_config_path:-$HOME/.kube/config}"
AUTO_APPROVE=false
[[ "${1:-}" == "--yes" ]] && AUTO_APPROVE=true

if ! kubectl --kubeconfig "$KUBE_CONFIG_PATH" config get-contexts "$KUBE_CONTEXT" >/dev/null 2>&1; then
  echo "Error: kube context '$KUBE_CONTEXT' not found in $KUBE_CONFIG_PATH." >&2
  echo "Start Minikube first ('minikube start') or set TF_VAR_kube_context." >&2
  exit 1
fi

echo "Target kube context: $KUBE_CONTEXT ($KUBE_CONFIG_PATH)"

TF_TARGET_VARS=(-var "kube_context=$KUBE_CONTEXT" -var "kube_config_path=$KUBE_CONFIG_PATH")

terraform init
terraform validate
terraform plan -out planfile "${TF_TARGET_VARS[@]}"

if [[ "$AUTO_APPROVE" != true ]]; then
  read -r -p "Apply this plan to context '$KUBE_CONTEXT'? [y/N] " answer
  if [[ ! "$answer" =~ ^[Yy]$ ]]; then
    rm -f planfile
    echo "Aborted."
    exit 1
  fi
fi

terraform apply planfile
rm -f planfile
