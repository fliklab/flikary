#!/bin/bash

# Performance workflow execution check script
# GitHub Actions에서 성능 테스트 실행 여부를 결정

set -e

echo "🔍 Checking execution conditions..."

# 환경 변수 확인
EVENT_NAME="${GITHUB_EVENT_NAME}"
FORCE_RUN="${INPUT_FORCE_RUN:-false}"
GITHUB_TOKEN="${GITHUB_TOKEN}"
API_URL="${GITHUB_API_URL}"
REPOSITORY="${GITHUB_REPOSITORY}"

# 수동 실행이거나 강제 실행인 경우
if [ "$EVENT_NAME" = "workflow_dispatch" ] || [ "$FORCE_RUN" = "true" ]; then
    echo "should_run=true" >> $GITHUB_OUTPUT
    echo "✅ Manual execution or force run"
    exit 0
fi

# 스케줄 실행인 경우 - 24시간 내 실행 이력 확인
if [ "$EVENT_NAME" = "schedule" ]; then
    echo "📅 Scheduled execution - checking recent workflow runs"
    
    # 최근 24시간 내 성공한 workflow run 확인
    RECENT_RUNS=$(curl -s \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "$API_URL/repos/$REPOSITORY/actions/workflows/performance.yml/runs?per_page=10" \
        | jq -r --arg since "$(date -u -d '24 hours ago' '+%Y-%m-%dT%H:%M:%SZ')" \
        '[.workflow_runs[] | select(.created_at > $since and .conclusion == "success")] | length')
    
    if [ "$RECENT_RUNS" -gt 0 ]; then
        echo "should_run=false" >> $GITHUB_OUTPUT
        echo "⏭️ Performance test already ran in the last 24 hours ($RECENT_RUNS successful runs)"
        exit 0
    else
        echo "should_run=true" >> $GITHUB_OUTPUT
        echo "🚀 No successful runs in 24 hours - executing fallback test"
        exit 0
    fi
fi

# Push 이벤트인 경우 - 성능에 영향을 주는 파일 변경 확인
echo "📝 Checking changed files for performance impact..."
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD)
echo "📝 Changed files:"
echo "$CHANGED_FILES"

echo "should_run=true" >> $GITHUB_OUTPUT
echo "🚀 Performance-impacting files detected" 