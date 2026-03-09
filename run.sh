#!/bin/sh
set -e
# Load .env (N8N_API_URL, N8N_API_KEY) then run n8n-mcp
. ./.env 2>/dev/null || true
exec npx n8n-mcp