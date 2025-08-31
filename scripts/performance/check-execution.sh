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

# 스케줄 실행인 경우 - 30일 이내 커밋 확인
if [ "$GITHUB_EVENT_NAME" = "schedule" ]; then
  echo "📅 Scheduled execution - checking recent commits"
  
  # 30일 전 날짜 계산
  SINCE_DATE=$(date -u -d '30 days ago' '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null || date -u -v-30d '+%Y-%m-%dT%H:%M:%SZ')
  
  echo "🔧 Debug: Checking commits since: $SINCE_DATE"
  
  # 최근 30일 내 커밋 확인
  API_URL="$GITHUB_API_URL/repos/$GITHUB_REPOSITORY/commits?sha=main&since=$SINCE_DATE&per_page=1"
  
  echo "🔧 Debug: API URL: $API_URL"
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
  
  # 커밋이 있는지 확인
  if ! COMMIT_COUNT=$(echo "$API_RESPONSE" | jq '. | length' 2>&1); then
    echo "⚠️ Failed to parse API response: $COMMIT_COUNT"
    echo "should_run=true" >> "$GITHUB_OUTPUT"
    echo "🚀 JSON parsing failed - defaulting to run test"
    exit 0
  fi
  
  echo "🔧 Debug: Commits in last 30 days: $COMMIT_COUNT"
  
  if [ "$COMMIT_COUNT" -eq 0 ]; then
    echo "should_run=false" >> "$GITHUB_OUTPUT"
    echo "⏭️ No commits in the last 30 days - skipping performance test"
    exit 0
  else
    # 30일 이내 커밋이 있으면, 이번 달에 이미 실행했는지 확인
    echo "📊 Found $COMMIT_COUNT commits in last 30 days - checking if already ran this month"
    
    # 이번 달 1일 0시 계산
    MONTH_START=$(date -u '+%Y-%m-01T00:00:00Z')
    API_URL="$GITHUB_API_URL/repos/$GITHUB_REPOSITORY/actions/workflows/performance.yml/runs?per_page=10"
    
    if ! API_RESPONSE=$(curl -s \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      "$API_URL" 2>&1); then
      echo "⚠️ Failed to check workflow runs"
      echo "should_run=true" >> "$GITHUB_OUTPUT"
      echo "🚀 Proceeding with test due to API error"
      exit 0
    fi
    
    # 이번 달에 성공한 실행이 있는지 확인
    if ! MONTHLY_RUNS=$(echo "$API_RESPONSE" | jq -r --arg since "$MONTH_START" \
      '[.workflow_runs[] | select(.created_at >= $since and .conclusion == "success" and .event == "schedule")] | length' 2>&1); then
      echo "⚠️ Failed to parse workflow runs"
      echo "should_run=true" >> "$GITHUB_OUTPUT"
      echo "🚀 Proceeding with test due to parsing error"
      exit 0
    fi
    
    if [ "$MONTHLY_RUNS" -gt 0 ]; then
      echo "should_run=false" >> "$GITHUB_OUTPUT"
      echo "⏭️ Performance test already ran this month ($MONTHLY_RUNS scheduled runs)"
      exit 0
    else
      echo "should_run=true" >> "$GITHUB_OUTPUT"
      echo "🚀 Running monthly performance test (commits found, no test this month yet)"
      exit 0
    fi
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