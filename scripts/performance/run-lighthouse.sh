#!/bin/bash

# Run Lighthouse performance tests
# 여러 URL에 대해 Lighthouse 성능 테스트 실행

set -e

# 로케일 설정 (한글 처리를 위해)
export LC_ALL=C.UTF-8
export LANG=C.UTF-8

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
    
    # 파일명을 INDEX 기반으로 안전하게 생성
    FILENAME="page-$INDEX"
    
    # Chrome 경로 설정
    CHROME_PATH_FLAG=""
    if [ -n "${CHROME_PATH:-}" ]; then
        CHROME_PATH_FLAG="--chrome-path=$CHROME_PATH"
    fi
    
    lighthouse "$URL" \
        --output=json \
        --output-path="$OUTPUT_DIR/lighthouse-$FILENAME.json" \
        --chrome-flags="--no-sandbox --disable-dev-shm-usage --disable-gpu --headless --no-first-run --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding" \
        --preset=desktop \
        --quiet \
        $CHROME_PATH_FLAG
        
    echo "✅ Completed: $NAME"
    INDEX=$((INDEX + 1))
done 3<<< "$URL_ARRAY" 4<<< "$NAME_ARRAY"

echo "🏁 All Lighthouse tests completed" 