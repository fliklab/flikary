#!/bin/bash

set -euo pipefail

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-4321}"
CONFIG_NAME="${1:-quick}"
TIMESTAMP="$(date +%Y-%m-%d_%H-%M-%S)"
OUTPUT_DIR="${2:-.local/performance/local/$TIMESTAMP}"
BASE_URL="http://$HOST:$PORT"
CHROME_PATH_DEFAULT="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

mkdir -p "$OUTPUT_DIR"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT

echo "🚀 Starting local dev server on $BASE_URL"
pnpm run dev --host "$HOST" --port "$PORT" >"$OUTPUT_DIR/dev-server.log" 2>&1 &
SERVER_PID=$!

for _ in {1..60}; do
  if curl -sf "$BASE_URL" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! curl -sf "$BASE_URL" >/dev/null 2>&1; then
  echo "❌ Dev server did not become ready. See $OUTPUT_DIR/dev-server.log"
  exit 1
fi

echo "🧪 Local dev server is ready"

URLS=$(jq -c \
  --arg config "$CONFIG_NAME" \
  --arg base "$BASE_URL" '
    . as $root
    | .testConfigs[$config] as $cfg
    | [$cfg.groups[] as $group
       | $root.pageGroups[$group].pages[]
       | ($base + .path)]
    | .[:($cfg.maxPages // length)]
  ' performance-config.json)

NAMES=$(jq -c \
  --arg config "$CONFIG_NAME" '
    . as $root
    | .testConfigs[$config] as $cfg
    | [$cfg.groups[] as $group
       | $root.pageGroups[$group].pages[]
       | .name]
    | .[:($cfg.maxPages // length)]
  ' performance-config.json)

export CHROME_PATH="${CHROME_PATH:-$CHROME_PATH_DEFAULT}"

echo "📂 Output directory: $OUTPUT_DIR"
echo "🔗 URLs: $URLS"

bash ./scripts/performance/run-lighthouse.sh \
  "$URLS" \
  "$NAMES" \
  "$CONFIG_NAME" \
  "local" \
  "$OUTPUT_DIR"

echo
echo "📊 Summary"
for json_file in "$OUTPUT_DIR"/lighthouse-*.json; do
  jq -r '
    [
      .finalUrl,
      (.categories.performance.score * 100 | round),
      .audits["largest-contentful-paint"].numericValue,
      .audits["first-contentful-paint"].numericValue,
      .audits["cumulative-layout-shift"].numericValue
    ] | @tsv
  ' "$json_file"
done

echo
echo "✅ Local performance run complete"
echo "   Results: $OUTPUT_DIR"
