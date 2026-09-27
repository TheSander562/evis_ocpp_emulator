#!/bin/sh
# docker-entrypoint.sh
set -e

# Substitute env vars into the template, output as config.js
sed -e "s|__VITE_API_URL__|${VITE_API_URL}|g" \
    -e "s|__VITE_WS_URL__|${VITE_WS_URL}|g" \
    /app/dist/config.template.js > /app/dist/config.js

exec "$@"
