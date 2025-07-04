#!/bin/bash

# Generate test URLs from performance config
# performance-config.json 파일을 기반으로 테스트할 URL 목록 생성

set -e

echo "📊 Generating test URLs from performance-config.json..."
echo "🔧 Debug: PWD=$(pwd)"
echo "🔧 Debug: USER=$(whoami)"
echo "🔧 Debug: Script arguments: $*"
echo "🔧 Debug: GITHUB_OUTPUT=$GITHUB_OUTPUT"

# 환경 체크
echo "🔧 Debug: Checking environment..."
echo "🔧 Debug: bash version: $BASH_VERSION"

# jq 설치 확인
if ! command -v jq >/dev/null 2>&1; then
  echo "❌ jq is not installed"
  exit 1
fi

echo "🔧 Debug: jq version: $(jq --version)"

# 입력 파라미터 체크
if [ $# -lt 2 ]; then
  echo "❌ Usage: $0 <config_name> <environment>"
  echo "❌ Received $# arguments: $*"
  exit 1
fi

CONFIG_NAME="$1"
ENVIRONMENT="$2"

echo "🔧 Debug: CONFIG_NAME='$CONFIG_NAME'"
echo "🔧 Debug: ENVIRONMENT='$ENVIRONMENT'"

# GITHUB_OUTPUT이 설정되지 않은 경우 (로컬 테스트용)
if [ -z "$GITHUB_OUTPUT" ]; then
  GITHUB_OUTPUT="/dev/null"
  echo "🔧 Debug: GITHUB_OUTPUT not set, using /dev/null"
else
  echo "🔧 Debug: GITHUB_OUTPUT file exists: $(test -f "$GITHUB_OUTPUT" && echo "yes" || echo "no")"
  echo "🔧 Debug: GITHUB_OUTPUT is writable: $(test -w "$GITHUB_OUTPUT" && echo "yes" || echo "no")"
fi

# 기본값 설정
if [ "$ENVIRONMENT" = "local" ]; then
  DEFAULT_BASE_URL="http://localhost:4321"
elif [ "$ENVIRONMENT" = "staging" ]; then
  DEFAULT_BASE_URL="https://preview.flikary.dev"
else
  DEFAULT_BASE_URL="https://flikary.dev"
fi

echo "🔧 Debug: DEFAULT_BASE_URL='$DEFAULT_BASE_URL'"

# performance-config.json 파일 확인
echo "🔧 Debug: Checking performance-config.json..."
if [ ! -f "performance-config.json" ]; then
  echo "⚠️ performance-config.json not found in $(pwd)"
  echo "🔧 Debug: Files in current directory:"
  ls -la
  
  # 결과 출력
  echo "🔧 Debug: Writing default URLs to GITHUB_OUTPUT..."
  {
    echo "test_urls=[\"$DEFAULT_BASE_URL/\", \"$DEFAULT_BASE_URL/resume\", \"$DEFAULT_BASE_URL/archives\"]"
    echo "page_names=[\"홈페이지\", \"이력서\", \"아카이브\"]"
  } >> "$GITHUB_OUTPUT"
  
  echo "✅ Default URLs generated successfully"
  exit 0
fi

echo "🔧 Debug: performance-config.json found"
echo "🔧 Debug: File size: $(wc -c < performance-config.json) bytes"
echo "🔧 Debug: File permissions: $(ls -l performance-config.json)"

# jq로 파일 유효성 검사
echo "🔧 Debug: Validating JSON syntax..."
if ! jq empty performance-config.json 2>/dev/null; then
  echo "❌ performance-config.json has invalid JSON syntax"
  exit 1
fi

echo "🔧 Debug: JSON syntax is valid"

# 설정 파일에서 base URL 추출
echo "🔧 Debug: Extracting base URL for environment '$ENVIRONMENT'..."
if ! BASE_URL=$(jq -r ".environments.$ENVIRONMENT.baseUrl" performance-config.json 2>/dev/null); then
  echo "⚠️ Failed to extract base URL with jq, using default"
  BASE_URL="$DEFAULT_BASE_URL"
else
  echo "🔧 Debug: jq extraction successful: '$BASE_URL'"
fi

if [ "$BASE_URL" = "null" ] || [ -z "$BASE_URL" ]; then
  echo "⚠️ Base URL is null or empty, using default: $DEFAULT_BASE_URL"
  BASE_URL="$DEFAULT_BASE_URL"
fi

echo "🌐 Base URL: $BASE_URL"

# 설정에 따라 URL 목록 생성
echo "🔧 Debug: Generating URLs for config '$CONFIG_NAME'..."

case "$CONFIG_NAME" in
  "quick")
    # 빠른 테스트: core와 blog에서 몇 개씩
    URLS='["'$BASE_URL'/", "'$BASE_URL'/resume", "'$BASE_URL'/blog", "'$BASE_URL'/blog/blog-with-ai-insights", "'$BASE_URL'/archives"]'
    NAMES='["홈페이지", "이력서", "블로그", "AI가 글 써주는 시대를 마주하는 블로거 이야기", "아카이브"]'
    ;;
  "comprehensive")
    # 종합 테스트: 모든 주요 페이지
    URLS='["'$BASE_URL'/", "'$BASE_URL'/resume", "'$BASE_URL'/blog", "'$BASE_URL'/archives", "'$BASE_URL'/blog/blog-with-ai-insights"]'
    NAMES='["홈페이지", "이력서", "블로그", "아카이브", "AI가 글 써주는 시대를 마주하는 블로거 이야기"]'
    ;;
  "blog_focus")
    # 블로그 중심 테스트
    URLS='["'$BASE_URL'/blog", "'$BASE_URL'/blog/blog-with-ai-insights"]'
    NAMES='["블로그", "AI가 글 써주는 시대를 마주하는 블로거 이야기"]'
    ;;
  *)
    # 기본값
    echo "⚠️ Unknown config '$CONFIG_NAME', using default"
    URLS='["'$BASE_URL'/", "'$BASE_URL'/resume", "'$BASE_URL'/archives"]'
    NAMES='["홈페이지", "이력서", "아카이브"]'
    ;;
esac

echo "🎯 Generated URLs: $URLS"
echo "📝 Generated Names: $NAMES"

# 결과 출력
echo "🔧 Debug: Writing results to GITHUB_OUTPUT..."
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