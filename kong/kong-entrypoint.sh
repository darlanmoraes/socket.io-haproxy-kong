#!/usr/local/bin/dumb-init /bin/bash
set -e

# Disabling nginx daemon mode
export KONG_NGINX_DAEMON="off"
export KONG_CLUSTER_LISTEN="$(hostname -i):7946"

exec "$@"