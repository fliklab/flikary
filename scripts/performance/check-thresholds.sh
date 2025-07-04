#!/bin/bash

# Check performance thresholds
# Lighthouse 결과를 기반으로 성능 임계값 위반 여부 확인

set -e

echo "🎯 Checking performance thresholds..."

DATA_DIR="${1:-.github/performance-reports/data/latest}"
SHOULD_FAIL="false"
FAILURE_REASONS=""

# 임계값 확인
if [ -f "performance-config.json" ]; then
    FAIL_PERF=$(cat performance-config.json | jq -r '.failure_conditions.performance_score_below // 0.7')
    FAIL_LCP=$(cat performance-config.json | jq -r '.failure_conditions.lcp_above_ms // 4000') 
    FAIL_CLS=$(cat performance-config.json | jq -r '.failure_conditions.cls_above // 0.25')
    FAIL_A11Y=$(cat performance-config.json | jq -r '.failure_conditions.accessibility_below // 0.8')
else
    FAIL_PERF=0.7
    FAIL_LCP=4000
    FAIL_CLS=0.25
    FAIL_A11Y=0.8
fi

echo "🎯 Failure thresholds:"
echo "  Performance < $FAIL_PERF"
echo "  LCP > ${FAIL_LCP}ms"
echo "  CLS > $FAIL_CLS"
echo "  Accessibility < $FAIL_A11Y"

# 각 파일별로 임계값 검사
for JSON_FILE in "$DATA_DIR"/lighthouse-*.json; do
    if [ -f "$JSON_FILE" ]; then
        URL=$(cat "$JSON_FILE" | jq -r '.requestedUrl')
        PERF=$(cat "$JSON_FILE" | jq -r '.categories.performance.score')
        A11Y=$(cat "$JSON_FILE" | jq -r '.categories.accessibility.score')
        LCP=$(cat "$JSON_FILE" | jq -r '.audits["largest-contentful-paint"].numericValue')
        CLS=$(cat "$JSON_FILE" | jq -r '.audits["cumulative-layout-shift"].numericValue')
        
        echo "📊 Checking: $URL"
        echo "  Performance: $PERF, A11y: $A11Y, LCP: ${LCP}ms, CLS: $CLS"
        
        # 임계값 위반 체크
        if [ $(echo "$PERF < $FAIL_PERF" | bc) -eq 1 ]; then
            SHOULD_FAIL="true"
            FAILURE_REASONS="$FAILURE_REASONS\n❌ $URL: Performance score ($PERF) below threshold ($FAIL_PERF)"
        fi
        
        if [ $(echo "$LCP > $FAIL_LCP" | bc) -eq 1 ]; then
            SHOULD_FAIL="true"
            FAILURE_REASONS="$FAILURE_REASONS\n❌ $URL: LCP (${LCP}ms) above threshold (${FAIL_LCP}ms)"
        fi
        
        if [ $(echo "$CLS > $FAIL_CLS" | bc) -eq 1 ]; then
            SHOULD_FAIL="true"
            FAILURE_REASONS="$FAILURE_REASONS\n❌ $URL: CLS ($CLS) above threshold ($FAIL_CLS)"
        fi
        
        if [ $(echo "$A11Y < $FAIL_A11Y" | bc) -eq 1 ]; then
            SHOULD_FAIL="true"
            FAILURE_REASONS="$FAILURE_REASONS\n❌ $URL: Accessibility ($A11Y) below threshold ($FAIL_A11Y)"
        fi
    fi
done

echo "should_fail=$SHOULD_FAIL" >> $GITHUB_OUTPUT
echo "failure_reasons<<EOF" >> $GITHUB_OUTPUT
echo -e "$FAILURE_REASONS" >> $GITHUB_OUTPUT
echo "EOF" >> $GITHUB_OUTPUT

if [ "$SHOULD_FAIL" = "true" ]; then
    echo "🚨 Performance thresholds violated!"
    echo -e "$FAILURE_REASONS"
else
    echo "✅ All performance thresholds passed"
fi 