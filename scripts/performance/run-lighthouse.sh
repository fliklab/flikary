#!/bin/bash

# Run Lighthouse performance tests
# 여러 URL에 대해 Lighthouse 성능 테스트 실행

set -e

echo "🧪 Running performance tests..."

URLS="${1}"
NAMES="${2}"
CONFIG_NAME="${3:-quick}"
ENVIRONMENT="${4:-production}"
OUTPUT_DIR="${5:-.github/performance-reports/data/latest}"

echo "🎯 Test configuration:"
echo "  Config: $CONFIG_NAME"
echo "  Environment: $ENVIRONMENT"
echo "  URLs: $URLS"
echo "  Output directory: $OUTPUT_DIR"

# Lighthouse 테스트 실행
URL_ARRAY=$(echo "$URLS" | jq -r '.[]')
NAME_ARRAY=$(echo "$NAMES" | jq -r '.[]')

INDEX=0
while IFS= read -r URL <&3 && IFS= read -r NAME <&4; do
    echo "🔍 Testing: $NAME ($URL)"
    FILENAME=$(echo "$NAME" | sed 's/[^a-zA-Z0-9가-힣]/_/g')
    
    lighthouse "$URL" \
        --output=json \
        --output-path="$OUTPUT_DIR/lighthouse-$FILENAME-$INDEX.json" \
        --chrome-flags="--no-sandbox --disable-dev-shm-usage" \
        --preset=desktop \
        --quiet
        
    echo "✅ Completed: $NAME"
    INDEX=$((INDEX + 1))
done 3<<< "$URL_ARRAY" 4<<< "$NAME_ARRAY"

echo "🏁 All Lighthouse tests completed" 