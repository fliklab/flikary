#!/bin/bash

# Determine test configuration script
# GitHub Actions 실행 방식에 따라 테스트 구성을 결정

set -e

echo "🎯 Determining test configuration..."

# 필수 환경 변수 체크
if [ -z "$GITHUB_EVENT_NAME" ]; then
  echo "❌ GITHUB_EVENT_NAME is not set"
  exit 1
fi

# 기본값 설정
INPUT_TEST_CONFIG="${INPUT_TEST_CONFIG:-}"
INPUT_ENVIRONMENT="${INPUT_ENVIRONMENT:-}"

if [ "$GITHUB_EVENT_NAME" = "workflow_dispatch" ]; then
  if [ -z "$INPUT_TEST_CONFIG" ] || [ -z "$INPUT_ENVIRONMENT" ]; then
    echo "❌ Test configuration or environment not provided for manual execution"
    exit 1
  fi
  CONFIG_NAME="$INPUT_TEST_CONFIG"
  ENVIRONMENT="$INPUT_ENVIRONMENT"
elif [ "$GITHUB_EVENT_NAME" = "schedule" ]; then
  CONFIG_NAME="comprehensive"  # 스케줄 실행시 종합 테스트
  ENVIRONMENT="production"
else
  CONFIG_NAME="quick"          # 일반 push시 빠른 테스트
  ENVIRONMENT="production"
fi

# 결과 출력
{
  echo "config_name=$CONFIG_NAME"
  echo "environment=$ENVIRONMENT"
} >> $GITHUB_OUTPUT

echo "📊 Configuration: $CONFIG_NAME"
echo "🌐 Environment: $ENVIRONMENT" 