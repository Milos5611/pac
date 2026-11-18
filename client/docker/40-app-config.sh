#!/bin/sh
set -eu

target=/usr/share/nginx/html/config.js

json_escape() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

{
  echo "window.APP_CONFIG = {"
  for key in SVELTE_APP_BE_URL SVELTE_APP_ISSUER SVELTE_APP_CLIENT_ID SVELTE_APP_REDIRECT_URL SVELTE_APP_AUDIENCE; do
    eval "value=\${$key:-}"
    printf '  "%s": "%s",\n' "$key" "$(json_escape "$value")"
  done
  echo "};"
} > "$target"

echo "40-app-config.sh: wrote $target"
