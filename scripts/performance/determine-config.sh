#!/bin/bash

# Determine test configuration script
# GitHub Actions 실행 방식에 따라 테스트 구성을 결정

set -e

echo "🎯 Determining test configuration..."

EVENT_NAME="${GITHUB_EVENT_NAME}"
INPUT_TEST_CONFIG="${INPUT_TEST_CONFIG:-}"
INPUT_ENVIRONMENT="${INPUT_ENVIRONMENT:-}"

if [ "$EVENT_NAME" = "workflow_dispatch" ]; then
    CONFIG_NAME="$INPUT_TEST_CONFIG"
    ENVIRONMENT="$INPUT_ENVIRONMENT"
elif [ "$EVENT_NAME" = "schedule" ]; then
    CONFIG_NAME="comprehensive"  # 스케줄 실행시 종합 테스트
    ENVIRONMENT="production"
else
    CONFIG_NAME="quick"          # 일반 push시 빠른 테스트
    ENVIRONMENT="production"
fi

echo "config_name=$CONFIG_NAME" >> $GITHUB_OUTPUT
echo "environment=$ENVIRONMENT" >> $GITHUB_OUTPUT

echo "📊 Configuration: $CONFIG_NAME"
echo "🌐 Environment: $ENVIRONMENT" 