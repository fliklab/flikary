#!/bin/bash

# Generate test URLs from performance config
# performance-config.json 파일을 기반으로 테스트할 URL 목록 생성

set -e

echo "📊 Generating test URLs from performance-config.json..."

# 입력 파라미터 체크
if [ $# -lt 2 ]; then
  echo "❌ Usage: $0 <config_name> <environment>"
  exit 1
fi

CONFIG_NAME="$1"
ENVIRONMENT="$2"

# GITHUB_OUTPUT이 설정되지 않은 경우 (로컬 테스트용)
if [ -z "$GITHUB_OUTPUT" ]; then
  GITHUB_OUTPUT="/dev/null"
fi

# 기본값 설정
if [ "$ENVIRONMENT" = "local" ]; then
  DEFAULT_BASE_URL="http://localhost:4321"
elif [ "$ENVIRONMENT" = "staging" ]; then
  DEFAULT_BASE_URL="https://preview.flikary.dev"
else
  DEFAULT_BASE_URL="https://flikary.dev"
fi

# performance-config.json이 없는 경우 기본값 사용
if [ ! -f "performance-config.json" ]; then
  echo "⚠️ performance-config.json not found, using defaults"
  
  # 결과 출력
  {
    echo "test_urls=[\"$DEFAULT_BASE_URL/\", \"$DEFAULT_BASE_URL/resume\", \"$DEFAULT_BASE_URL/archives\"]"
    echo "page_names=[\"홈페이지\", \"이력서\", \"아카이브\"]"
  } >> $GITHUB_OUTPUT
  exit 0
fi

# 설정 파일에서 정보 추출
if ! BASE_URL=$(jq -r ".environments.$ENVIRONMENT.baseUrl" performance-config.json 2>/dev/null); then
  echo "⚠️ Failed to get base URL from config, using default: $DEFAULT_BASE_URL"
  BASE_URL="$DEFAULT_BASE_URL"
fi

if [ "$BASE_URL" = "null" ] || [ -z "$BASE_URL" ]; then
  echo "⚠️ Base URL not found in config, using default: $DEFAULT_BASE_URL"
  BASE_URL="$DEFAULT_BASE_URL"
fi

GROUPS=$(jq -r ".testConfigs.$CONFIG_NAME.groups[]?" performance-config.json 2>/dev/null || echo "core")
MAX_PAGES=$(jq -r ".testConfigs.$CONFIG_NAME.maxPages // 5" performance-config.json)

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
  PATHS=$(jq -r ".pageGroups.$GROUP.pages[]?.path" performance-config.json 2>/dev/null || echo "/")
  PAGE_NAMES=$(jq -r ".pageGroups.$GROUP.pages[]?.name" performance-config.json 2>/dev/null || echo "홈페이지")
  
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

# 결과 출력
{
  echo "test_urls=$URLS"
  echo "page_names=$NAMES"
} >> "$GITHUB_OUTPUT" 