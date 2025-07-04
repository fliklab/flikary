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
  } >> "$GITHUB_OUTPUT"
  
  echo "✅ Default URLs generated successfully"
  exit 0
fi

# 설정 파일에서 base URL 추출
BASE_URL=$(jq -r ".environments.$ENVIRONMENT.baseUrl" performance-config.json 2>/dev/null || echo "$DEFAULT_BASE_URL")
if [ "$BASE_URL" = "null" ] || [ -z "$BASE_URL" ]; then
  BASE_URL="$DEFAULT_BASE_URL"
fi

echo "🌐 Base URL: $BASE_URL"

# 설정에 따라 URL 목록 생성
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
    URLS='["'$BASE_URL'/", "'$BASE_URL'/resume", "'$BASE_URL'/archives"]'
    NAMES='["홈페이지", "이력서", "아카이브"]'
    ;;
esac

echo "🎯 Generated URLs: $URLS"
echo "📝 Generated Names: $NAMES"

# 결과 출력
{
  echo "test_urls=$URLS"
  echo "page_names=$NAMES"
} >> "$GITHUB_OUTPUT"

echo "✅ URL generation completed successfully" 