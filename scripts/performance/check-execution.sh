#!/bin/bash

# Performance workflow execution check script
# GitHub Actions에서 성능 테스트 실행 여부를 결정

set -e

echo "🔍 Checking execution conditions..."

# 필수 도구 확인
echo "🔧 Debug: Checking required tools..."
for tool in curl jq; do
  if ! command -v $tool >/dev/null 2>&1; then
    echo "❌ $tool is not installed"
    exit 1
  fi
  echo "🔧 Debug: $tool is available"
done

# GITHUB_OUTPUT이 설정되지 않은 경우 (로컬 테스트용)
if [ -z "$GITHUB_OUTPUT" ]; then
  GITHUB_OUTPUT="/dev/null"
  echo "🔧 Debug: GITHUB_OUTPUT not set, using /dev/null"
else
  echo "🔧 Debug: GITHUB_OUTPUT=$GITHUB_OUTPUT"
fi

# 필수 환경 변수 체크
echo "🔧 Debug: Checking environment variables..."
REQUIRED_VARS="GITHUB_EVENT_NAME GITHUB_TOKEN GITHUB_API_URL GITHUB_REPOSITORY"

for var in $REQUIRED_VARS; do
  if [ -z "${!var}" ]; then
    echo "❌ $var is not set"
    exit 1
  fi
  echo "🔧 Debug: $var is set"
done

# 기본값 설정
FORCE_RUN="${INPUT_FORCE_RUN:-false}"
echo "🔧 Debug: FORCE_RUN=$FORCE_RUN"
echo "🔧 Debug: GITHUB_EVENT_NAME=$GITHUB_EVENT_NAME"

# 수동 실행이거나 강제 실행인 경우
if [ "$GITHUB_EVENT_NAME" = "workflow_dispatch" ] || [ "$FORCE_RUN" = "true" ]; then
  echo "should_run=true" >> "$GITHUB_OUTPUT"
  echo "✅ Manual execution or force run"
  exit 0
fi

# 스케줄 실행인 경우 - 24시간 내 실행 이력 확인
if [ "$GITHUB_EVENT_NAME" = "schedule" ]; then
  echo "📅 Scheduled execution - checking recent workflow runs"
  
  # API 요청 준비
  API_URL="$GITHUB_API_URL/repos/$GITHUB_REPOSITORY/actions/workflows/performance.yml/runs?per_page=10"
  SINCE_DATE=$(date -u -d '24 hours ago' '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null || date -u -v-24H '+%Y-%m-%dT%H:%M:%SZ')
  
  echo "🔧 Debug: API URL: $API_URL"
  echo "🔧 Debug: Since date: $SINCE_DATE"
  
  # 최근 24시간 내 성공한 workflow run 확인
  echo "🔧 Debug: Making API request..."
  if ! API_RESPONSE=$(curl -s \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "$API_URL" 2>&1); then
    echo "⚠️ Failed to make API request: $API_RESPONSE"
    echo "should_run=true" >> "$GITHUB_OUTPUT"
    echo "🚀 API request failed - defaulting to run test"
    exit 0
  fi
  
  echo "🔧 Debug: API response received"
  
  if ! RECENT_RUNS=$(echo "$API_RESPONSE" | jq -r --arg since "$SINCE_DATE" \
    '[.workflow_runs[] | select(.created_at > $since and .conclusion == "success")] | length' 2>&1); then
    echo "⚠️ Failed to parse API response: $RECENT_RUNS"
    echo "should_run=true" >> "$GITHUB_OUTPUT"
    echo "🚀 JSON parsing failed - defaulting to run test"
    exit 0
  fi
  
  echo "🔧 Debug: Recent successful runs: $RECENT_RUNS"
  
  if [ "$RECENT_RUNS" -gt 0 ]; then
    echo "should_run=false" >> "$GITHUB_OUTPUT"
    echo "⏭️ Performance test already ran in the last 24 hours ($RECENT_RUNS successful runs)"
    exit 0
  else
    echo "should_run=true" >> "$GITHUB_OUTPUT"
    echo "🚀 No successful runs in 24 hours - executing fallback test"
    exit 0
  fi
fi

# Push 이벤트인 경우 - 성능에 영향을 주는 파일 변경 확인
echo "📝 Checking changed files for performance impact..."
if ! CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>&1); then
  echo "⚠️ Failed to get changed files: $CHANGED_FILES"
  echo "⚠️ Defaulting to run test"
  echo "should_run=true" >> "$GITHUB_OUTPUT"
  exit 0
fi

echo "📝 Changed files:"
echo "$CHANGED_FILES"

echo "should_run=true" >> "$GITHUB_OUTPUT"
echo "🚀 Performance-impacting files detected" 