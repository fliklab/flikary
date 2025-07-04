#!/bin/bash

# Generate test URLs from performance config
# performance-config.json 파일을 기반으로 테스트할 URL 목록 생성

set -e

echo "📊 Generating test URLs from performance-config.json..."

CONFIG_NAME="${1:-quick}"
ENVIRONMENT="${2:-production}"

# performance-config.json이 없는 경우 기본값
if [ ! -f "performance-config.json" ]; then
    echo "⚠️ performance-config.json not found, using defaults"
    if [ "$ENVIRONMENT" = "local" ]; then
        BASE_URL="http://localhost:4321"
    elif [ "$ENVIRONMENT" = "staging" ]; then
        BASE_URL="https://preview.flikary.dev"
    else
        BASE_URL="https://flikary.dev"
    fi
    
    echo "test_urls=[\"$BASE_URL/\", \"$BASE_URL/resume\", \"$BASE_URL/archives\"]" >> $GITHUB_OUTPUT
    echo "page_names=[\"홈페이지\", \"이력서\", \"아카이브\"]" >> $GITHUB_OUTPUT
    exit 0
fi

# 설정 파일에서 정보 추출
BASE_URL=$(cat performance-config.json | jq -r ".environments.$ENVIRONMENT.baseUrl")
GROUPS=$(cat performance-config.json | jq -r ".testConfigs.$CONFIG_NAME.groups[]?" || echo "core")
MAX_PAGES=$(cat performance-config.json | jq -r ".testConfigs.$CONFIG_NAME.maxPages // 5")

echo "🌐 Base URL: $BASE_URL"
echo "📦 Groups: $GROUPS"
echo "📊 Max pages: $MAX_PAGES"

# URL과 페이지 이름 배열 생성
URLS="["
NAMES="["
COUNT=0

for GROUP in $GROUPS; do
    echo "📋 Processing group: $GROUP"
    
    # 그룹의 페이지들 처리
    PATHS=$(cat performance-config.json | jq -r ".pageGroups.$GROUP.pages[]?.path" 2>/dev/null)
    PAGE_NAMES=$(cat performance-config.json | jq -r ".pageGroups.$GROUP.pages[]?.name" 2>/dev/null)
    
    while IFS= read -r PATH <&3 && IFS= read -r NAME <&4; do
        if [ -n "$PATH" ] && [ "$PATH" != "null" ] && [ "$COUNT" -lt "$MAX_PAGES" ]; then
            if [ "$COUNT" -gt 0 ]; then
                URLS="$URLS,"
                NAMES="$NAMES,"
            fi
            
            FULL_URL="$BASE_URL$PATH"
            URLS="$URLS\"$FULL_URL\""
            NAMES="$NAMES\"$NAME\""
            
            COUNT=$((COUNT + 1))
            echo "  ✅ Added: $NAME → $FULL_URL"
        fi
    done 3<<< "$PATHS" 4<<< "$PAGE_NAMES"
done

URLS="$URLS]"
NAMES="$NAMES]"

echo "🎯 Final URLs: $URLS"
echo "📝 Final Names: $NAMES"

echo "test_urls=$URLS" >> $GITHUB_OUTPUT
echo "page_names=$NAMES" >> $GITHUB_OUTPUT 