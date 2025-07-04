#!/usr/bin/env bash

# Generate test URLs from performance config
# performance-config.json 파일을 기반으로 테스트할 URL 목록 생성

# 더 엄격한 오류 처리 - Ubuntu에서 더 호환성 있게
set -e

echo "📊 Generating test URLs from performance-config.json..."

# 즉시 기본 정보 출력 (문제 발생 지점 파악용)
echo "🔧 Step 1: Script started successfully"
echo "🔧 Debug: Arguments count: $#"
echo "🔧 Debug: All arguments: $*"

# Bash 버전 체크 (일부 Ubuntu에서 문제가 될 수 있음)
if [ -n "${BASH_VERSION:-}" ]; then
  echo "🔧 Debug: bash version: $BASH_VERSION"
else
  echo "🔧 Debug: Not running in bash, shell: ${0##*/}"
fi

echo "🔧 Step 2: Environment check passed"

# 로케일 설정 (가능한 경우에만)
export LC_ALL=C.UTF-8 2>/dev/null || export LC_ALL=C 2>/dev/null || true
export LANG=C.UTF-8 2>/dev/null || export LANG=C 2>/dev/null || true
echo "🔧 Debug: Locale configured"

echo "🔧 Step 3: Tool verification"
# jq 설치 및 버전 확인
if ! command -v jq >/dev/null 2>&1; then
  echo "❌ jq is not installed"
  exit 1
fi

JQ_VERSION=$(jq --version 2>/dev/null || echo "unknown")
echo "🔧 Debug: jq version: $JQ_VERSION"

echo "🔧 Step 4: Parameter validation"
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

echo "🔧 Step 5: Output setup"
# GITHUB_OUTPUT 설정
if [ -z "${GITHUB_OUTPUT:-}" ]; then
  GITHUB_OUTPUT="/dev/null"
  echo "🔧 Debug: GITHUB_OUTPUT not set, using /dev/null"
else
  echo "🔧 Debug: GITHUB_OUTPUT=$GITHUB_OUTPUT"
  # GITHUB_OUTPUT 파일이 존재하지 않으면 생성
  if [ ! -f "$GITHUB_OUTPUT" ]; then
    if ! touch "$GITHUB_OUTPUT" 2>/dev/null; then
      echo "❌ Cannot create GITHUB_OUTPUT file: $GITHUB_OUTPUT"
      exit 1
    fi
  fi
  echo "🔧 Debug: GITHUB_OUTPUT file ready"
fi

echo "🔧 Step 6: Base URL configuration"
# 기본 URL 설정
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

echo "🔧 Step 7: Configuration file check"
# performance-config.json 파일 확인
if [ ! -f "performance-config.json" ]; then
  echo "⚠️ performance-config.json not found in $(pwd)"
  
  # 기본값으로 처리
  echo "🔧 Step 8: Using default configuration"
  URLS="[\"$DEFAULT_BASE_URL/\", \"$DEFAULT_BASE_URL/resume\", \"$DEFAULT_BASE_URL/archives\"]"
  NAMES="[\"홈페이지\", \"이력서\", \"아카이브\"]"
  
  echo "🔧 Debug: Writing default URLs to output..."
  if ! {
    echo "test_urls=$URLS"
    echo "page_names=$NAMES"
  } >> "$GITHUB_OUTPUT" 2>/dev/null; then
    echo "❌ Failed to write to GITHUB_OUTPUT"
    exit 1
  fi
  
  echo "✅ Default URLs generated successfully"
  exit 0
fi

echo "🔧 Debug: performance-config.json found"

echo "🔧 Step 8: JSON validation"
# JSON 유효성 검사 (더 안전하게)
if ! jq empty performance-config.json >/dev/null 2>&1; then
  echo "❌ performance-config.json has invalid JSON syntax"
  exit 1
fi

echo "🔧 Debug: JSON syntax is valid"

echo "🔧 Step 9: Base URL extraction"
# base URL 추출 (더 안전한 방식)
BASE_URL="$DEFAULT_BASE_URL"
if EXTRACTED_URL=$(jq -r ".environments.$ENVIRONMENT.baseUrl" performance-config.json 2>/dev/null); then
  if [ "$EXTRACTED_URL" != "null" ] && [ -n "$EXTRACTED_URL" ]; then
    BASE_URL="$EXTRACTED_URL"
    echo "🔧 Debug: Using extracted base URL: '$BASE_URL'"
  else
    echo "🔧 Debug: Using default base URL: '$BASE_URL'"
  fi
else
  echo "🔧 Debug: jq extraction failed, using default: '$BASE_URL'"
fi

echo "🌐 Base URL: $BASE_URL"

echo "🔧 Step 10: URL generation"
# URL 목록 생성
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

echo "🔧 Step 11: Writing results"
# 결과 출력
echo "🔧 Debug: Writing to output file..."

if ! {
  echo "test_urls=$URLS"
  echo "page_names=$NAMES"
} >> "$GITHUB_OUTPUT" 2>/dev/null; then
  echo "❌ Failed to write to GITHUB_OUTPUT"
  exit 1
fi

echo "🔧 Debug: Successfully wrote to output"
echo "✅ URL generation completed successfully" 