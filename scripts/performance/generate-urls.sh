#!/bin/bash

# Generate test URLs from performance config
# performance-config.json 파일을 기반으로 테스트할 URL 목록 생성

# 더 엄격한 오류 처리
set -euo pipefail

echo "📊 Generating test URLs from performance-config.json..."
echo "🔧 Step 1: Initial setup"

# 기본 환경 정보
echo "🔧 Debug: PWD=$(pwd)"
echo "🔧 Debug: USER=$(whoami || echo 'unknown')"
echo "🔧 Debug: Script arguments: $*"
echo "🔧 Debug: GITHUB_OUTPUT=${GITHUB_OUTPUT:-'not set'}"

# 환경 체크
echo "🔧 Step 2: Environment check"
echo "🔧 Debug: bash version: ${BASH_VERSION:-'unknown'}"

# 로케일 설정
export LC_ALL=C.UTF-8
export LANG=C.UTF-8
echo "🔧 Debug: Locale set to UTF-8"

# jq 설치 및 버전 확인
echo "🔧 Step 3: Tool verification"
if ! command -v jq >/dev/null 2>&1; then
  echo "❌ jq is not installed"
  exit 1
fi

JQ_VERSION=$(jq --version 2>/dev/null || echo "unknown")
echo "🔧 Debug: jq version: $JQ_VERSION"

# 입력 파라미터 체크
echo "🔧 Step 4: Parameter validation"
if [ $# -lt 2 ]; then
  echo "❌ Usage: $0 <config_name> <environment>"
  echo "❌ Received $# arguments: $*"
  exit 1
fi

CONFIG_NAME="$1"
ENVIRONMENT="$2"

echo "🔧 Debug: CONFIG_NAME='$CONFIG_NAME'"
echo "🔧 Debug: ENVIRONMENT='$ENVIRONMENT'"

# GITHUB_OUTPUT 설정
echo "🔧 Step 5: Output file setup"
if [ -z "${GITHUB_OUTPUT:-}" ]; then
  GITHUB_OUTPUT="/dev/null"
  echo "🔧 Debug: GITHUB_OUTPUT not set, using /dev/null"
else
  echo "🔧 Debug: GITHUB_OUTPUT=$GITHUB_OUTPUT"
  # GITHUB_OUTPUT 파일이 존재하지 않으면 생성
  if [ ! -f "$GITHUB_OUTPUT" ]; then
    touch "$GITHUB_OUTPUT" || {
      echo "❌ Cannot create GITHUB_OUTPUT file: $GITHUB_OUTPUT"
      exit 1
    }
  fi
  echo "🔧 Debug: GITHUB_OUTPUT file exists: $(test -f "$GITHUB_OUTPUT" && echo "yes" || echo "no")"
  echo "🔧 Debug: GITHUB_OUTPUT is writable: $(test -w "$GITHUB_OUTPUT" && echo "yes" || echo "no")"
fi

# 기본 URL 설정
echo "🔧 Step 6: Base URL configuration"
case "$ENVIRONMENT" in
  "local")
    DEFAULT_BASE_URL="http://localhost:4321"
    ;;
  "staging")
    DEFAULT_BASE_URL="https://preview.flikary.dev"
    ;;
  *)
    DEFAULT_BASE_URL="https://flikary.dev"
    ;;
esac

echo "🔧 Debug: DEFAULT_BASE_URL='$DEFAULT_BASE_URL'"

# performance-config.json 파일 확인
echo "🔧 Step 7: Configuration file check"
if [ ! -f "performance-config.json" ]; then
  echo "⚠️ performance-config.json not found in $(pwd)"
  echo "🔧 Debug: Files in current directory:"
  ls -la || true
  
  # 기본값으로 처리
  echo "🔧 Step 8: Using default configuration"
  URLS="[\"$DEFAULT_BASE_URL/\", \"$DEFAULT_BASE_URL/resume\", \"$DEFAULT_BASE_URL/archives\"]"
  NAMES="[\"홈페이지\", \"이력서\", \"아카이브\"]"
  
  echo "🔧 Debug: Writing default URLs to GITHUB_OUTPUT..."
  {
    echo "test_urls=$URLS"
    echo "page_names=$NAMES"
  } >> "$GITHUB_OUTPUT" || {
    echo "❌ Failed to write to GITHUB_OUTPUT"
    exit 1
  }
  
  echo "✅ Default URLs generated successfully"
  exit 0
fi

echo "🔧 Debug: performance-config.json found"
FILE_SIZE=$(wc -c < performance-config.json 2>/dev/null || echo "unknown")
echo "🔧 Debug: File size: $FILE_SIZE bytes"

# JSON 유효성 검사
echo "🔧 Step 8: JSON validation"
if ! jq empty performance-config.json 2>/dev/null; then
  echo "❌ performance-config.json has invalid JSON syntax"
  exit 1
fi

echo "🔧 Debug: JSON syntax is valid"

# base URL 추출
echo "🔧 Step 9: Base URL extraction"
BASE_URL=""
if BASE_URL=$(jq -r ".environments.$ENVIRONMENT.baseUrl" performance-config.json 2>/dev/null); then
  echo "🔧 Debug: jq extraction successful: '$BASE_URL'"
else
  echo "⚠️ Failed to extract base URL with jq, using default"
  BASE_URL="$DEFAULT_BASE_URL"
fi

if [ "$BASE_URL" = "null" ] || [ -z "$BASE_URL" ]; then
  echo "⚠️ Base URL is null or empty, using default: $DEFAULT_BASE_URL"
  BASE_URL="$DEFAULT_BASE_URL"
fi

echo "🌐 Base URL: $BASE_URL"

# URL 목록 생성
echo "🔧 Step 10: URL generation for config '$CONFIG_NAME'"

case "$CONFIG_NAME" in
  "quick")
    URLS="[\"$BASE_URL/\", \"$BASE_URL/resume\", \"$BASE_URL/blog\", \"$BASE_URL/blog/blog-with-ai-insights\", \"$BASE_URL/archives\"]"
    NAMES="[\"홈페이지\", \"이력서\", \"블로그\", \"AI가 글 써주는 시대를 마주하는 블로거 이야기\", \"아카이브\"]"
    ;;
  "comprehensive")
    URLS="[\"$BASE_URL/\", \"$BASE_URL/resume\", \"$BASE_URL/blog\", \"$BASE_URL/archives\", \"$BASE_URL/blog/blog-with-ai-insights\"]"
    NAMES="[\"홈페이지\", \"이력서\", \"블로그\", \"아카이브\", \"AI가 글 써주는 시대를 마주하는 블로거 이야기\"]"
    ;;
  "blog_focus")
    URLS="[\"$BASE_URL/blog\", \"$BASE_URL/blog/blog-with-ai-insights\"]"
    NAMES="[\"블로그\", \"AI가 글 써주는 시대를 마주하는 블로거 이야기\"]"
    ;;
  *)
    echo "⚠️ Unknown config '$CONFIG_NAME', using default"
    URLS="[\"$BASE_URL/\", \"$BASE_URL/resume\", \"$BASE_URL/archives\"]"
    NAMES="[\"홈페이지\", \"이력서\", \"아카이브\"]"
    ;;
esac

echo "🎯 Generated URLs: $URLS"
echo "📝 Generated Names: $NAMES"

# 결과 출력
echo "🔧 Step 11: Writing results to output"
echo "🔧 Debug: GITHUB_OUTPUT path: '$GITHUB_OUTPUT'"

if ! {
  echo "test_urls=$URLS"
  echo "page_names=$NAMES"
} >> "$GITHUB_OUTPUT"; then
  echo "❌ Failed to write to GITHUB_OUTPUT"
  exit 1
fi

echo "🔧 Debug: Successfully wrote to GITHUB_OUTPUT"
echo "✅ URL generation completed successfully" 