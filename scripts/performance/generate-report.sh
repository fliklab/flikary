#!/bin/bash

# Generate performance report
# Lighthouse 및 Web Vitals 결과를 기반으로 상세한 성능 리포트 생성

set -e

echo "📊 Generating performance report..."

CONFIG_NAME="${1:-quick}"
ENVIRONMENT="${2:-production}"
SHOULD_FAIL="${3:-false}"
FAILURE_REASONS="${4:-}"
DATA_DIR="${5:-.github/performance-reports/data/latest}"
REPORT_DIR="${6:-.github/performance-reports/reports/latest}"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
COMMIT_HASH="${GITHUB_SHA}"
BRANCH="${GITHUB_REF_NAME}"
ACTOR="${GITHUB_ACTOR}"

mkdir -p "$REPORT_DIR"
REPORT_FILE="$REPORT_DIR/performance-report.md"

cat > "$REPORT_FILE" << EOF
# 📊 Flikary.dev Performance Report

**Generated**: $(date '+%Y-%m-%d %H:%M:%S UTC')  
**Configuration**: \`$CONFIG_NAME\`  
**Environment**: \`$ENVIRONMENT\`  
**Build**: #${GITHUB_RUN_NUMBER}  
**Commit**: [\`${COMMIT_HASH:0:7}\`](https://github.com/${GITHUB_REPOSITORY}/commit/$COMMIT_HASH)  
**Branch**: \`$BRANCH\`  
**Triggered by**: @$ACTOR

## 🎯 Executive Summary

Astro.js 기반 개인 웹사이트의 성능 분석 결과입니다.

$(if [ "$SHOULD_FAIL" = "true" ]; then
  echo "🚨 **Performance Issues Detected** - Action will fail due to threshold violations"
else
  echo "✅ **All Performance Thresholds Passed**"
fi)

EOF

# Lighthouse 결과 테이블
echo "## 🧪 Lighthouse Performance Results" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| Page | Performance | Accessibility | SEO | LCP | FCP | CLS | Status |" >> "$REPORT_FILE"
echo "|------|-------------|---------------|-----|-----|-----|-----|--------|" >> "$REPORT_FILE"

TOTAL_PERF=0
PAGE_COUNT=0

for JSON_FILE in "$DATA_DIR"/lighthouse-*.json; do
  if [ -f "$JSON_FILE" ]; then
    URL=$(cat "$JSON_FILE" | jq -r '.requestedUrl')
    PAGE_NAME=$(echo "$URL" | sed 's|.*/||' | sed 's|^$|홈페이지|')
    PERF=$(cat "$JSON_FILE" | jq -r '.categories.performance.score * 100 | floor')
    A11Y=$(cat "$JSON_FILE" | jq -r '.categories.accessibility.score * 100 | floor')
    SEO=$(cat "$JSON_FILE" | jq -r '.categories.seo.score * 100 | floor')
    LCP=$(cat "$JSON_FILE" | jq -r '.audits["largest-contentful-paint"].numericValue | floor')
    FCP=$(cat "$JSON_FILE" | jq -r '.audits["first-contentful-paint"].numericValue | floor')
    CLS=$(cat "$JSON_FILE" | jq -r '.audits["cumulative-layout-shift"].numericValue | . * 1000 | floor / 1000')
    
    # 상태 결정
    if [ $PERF -ge 90 ]; then
      STATUS="🟢 Excellent"
    elif [ $PERF -ge 80 ]; then
      STATUS="🟡 Good"
    elif [ $PERF -ge 70 ]; then
      STATUS="🟠 Needs Work"
    else
      STATUS="🔴 Poor"
    fi
    
    echo "| [$PAGE_NAME]($URL) | $PERF | $A11Y | $SEO | ${LCP}ms | ${FCP}ms | $CLS | $STATUS |" >> "$REPORT_FILE"
    
    TOTAL_PERF=$((TOTAL_PERF + PERF))
    PAGE_COUNT=$((PAGE_COUNT + 1))
  fi
done

echo "" >> "$REPORT_FILE"

# 평균 점수
if [ $PAGE_COUNT -gt 0 ]; then
  AVG_PERF=$((TOTAL_PERF / PAGE_COUNT))
  echo "**Average Performance Score**: $AVG_PERF/100" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
fi

# Web Vitals 결과
if [ -f "$DATA_DIR/web-vitals.json" ]; then
  echo "## 🌍 Web Vitals (Real User Data)" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "| Page | Data Available | LCP (75th) | FID (75th) | CLS (75th) | Assessment |" >> "$REPORT_FILE"
  echo "|------|----------------|------------|------------|------------|------------|" >> "$REPORT_FILE"
  
  cat "$DATA_DIR/web-vitals.json" | jq -r '.[] | 
    if .hasData then
      .url as $url |
      .data.record.metrics as $metrics |
      ($metrics.largest_contentful_paint.percentiles.p75 // 0) as $lcp |
      ($metrics.first_input_delay.percentiles.p75 // 0) as $fid |
      ($metrics.cumulative_layout_shift.percentiles.p75 // 0) as $cls |
      (if ($lcp <= 2500 and $fid <= 100 and $cls <= 0.1) then "✅ Good" 
       elif ($lcp <= 4000 and $fid <= 300 and $cls <= 0.25) then "🟡 Needs Improvement"
       else "🔴 Poor" end) as $status |
      "| " + $url + " | ✅ Yes | " + ($lcp | tostring) + "ms | " + ($fid | tostring) + "ms | " + ($cls | tostring) + " | " + $status + " |"
    else
      "| " + .url + " | ❌ No | - | - | - | No real user data |"
    end' >> "$REPORT_FILE"
  
  echo "" >> "$REPORT_FILE"
fi

# 임계값 위반 사항 (있는 경우)
if [ "$SHOULD_FAIL" = "true" ]; then
  echo "## 🚨 Performance Issues" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "다음 페이지들이 성능 임계값을 위반했습니다:" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "$FAILURE_REASONS" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
fi

# 상세 분석 및 권장사항
cat >> "$REPORT_FILE" << EOF

## 📈 Detailed Analysis

### 🎯 Key Insights

- **Framework**: Astro.js 정적 사이트 생성기 사용
- **Average Performance**: $(if [ $PAGE_COUNT -gt 0 ]; then echo "$AVG_PERF/100"; else echo "N/A"; fi)
- **Test Environment**: $ENVIRONMENT
- **Pages Analyzed**: $PAGE_COUNT

### 💡 Optimization Recommendations

$(if [ $AVG_PERF -lt 80 ] 2>/dev/null; then
  echo "#### 🔴 High Priority"
  echo "- **Performance Score**: 전체적인 성능 개선 필요"
  echo "- **Bundle Optimization**: JavaScript 번들 크기 최적화"
  echo "- **Image Optimization**: 이미지 압축 및 WebP 포맷 적용"
  echo ""
fi)

#### 🟡 Medium Priority
- **Astro Islands**: 인터랙티브 컴포넌트를 Astro Islands로 최적화
- **Static Generation**: 가능한 모든 페이지를 정적 생성으로 전환
- **CSS Optimization**: 사용하지 않는 CSS 제거

#### 🟢 Low Priority
- **SEO Enhancement**: 메타데이터 및 구조화된 데이터 개선
- **Accessibility**: 접근성 점수 95+ 목표
- **PWA Features**: 서비스 워커 및 오프라인 기능 추가

## 🔧 Technical Details

### Astro Configuration
- **Framework**: Astro.js
- **Build Command**: \`npm run build\`
- **Preview Command**: \`npm run preview\`
- **Source Directory**: \`src/\`
- **Output Directory**: \`dist/\`

### Test Configuration
- **Configuration**: $CONFIG_NAME
- **Environment**: $ENVIRONMENT
- **Lighthouse Version**: $(lighthouse --version 2>/dev/null || echo "latest")
- **Chrome Flags**: --no-sandbox --disable-dev-shm-usage
- **Preset**: Desktop

### Commit Information
- **Commit Hash**: \`$COMMIT_HASH\`
- **Branch**: \`$BRANCH\`
- **Author**: @$ACTOR
- **Timestamp**: $(date)

### Performance Thresholds
$(if [ -f "performance-config.json" ]; then
  cat performance-config.json | jq -r '.failure_conditions | 
    "- **Performance Score**: Must be ≥ " + (.performance_score_below | tostring),
    "- **LCP**: Must be ≤ " + (.lcp_above_ms | tostring) + "ms",
    "- **CLS**: Must be ≤ " + (.cls_above | tostring),
    "- **Accessibility**: Must be ≥ " + (.accessibility_below | tostring)'
else
  echo "- **Performance Score**: Must be ≥ 0.7"
  echo "- **LCP**: Must be ≤ 4000ms"
  echo "- **CLS**: Must be ≤ 0.25"
  echo "- **Accessibility**: Must be ≥ 0.8"
fi)

## 📊 Historical Context

이 리포트는 flikary.dev의 지속적인 성능 모니터링의 일부입니다:

- **Daily Monitoring**: main 브랜치 커밋시 자동 실행
- **Fallback Schedule**: 24시간 내 실행이 없으면 오전 4시 자동 실행
- **Failure Conditions**: 성능 임계값 위반시 GitHub Action 실패

## 🔗 Quick Links

- 🌐 [flikary.dev](https://flikary.dev)
- 🔍 [Preview Environment](https://preview.flikary.dev)
- 📊 [GitHub Repository](https://github.com/${GITHUB_REPOSITORY})
- 🔧 [Performance Config](https://github.com/${GITHUB_REPOSITORY}/blob/main/performance-config.json)

---

**🤖 Automated Performance Report** | Generated by Performance CI | flikary.dev
EOF

echo "✅ Performance report generated: $REPORT_FILE" 