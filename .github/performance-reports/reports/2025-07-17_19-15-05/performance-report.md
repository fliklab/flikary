# 📊 Flikary.dev Performance Report

**Generated**: 2025-07-17 19:18:07 UTC  
**Configuration**: `comprehensive`  
**Environment**: `production`  
**Build**: #27  
**Commit**: [`86a08da`](https://github.com/fliklab/flikary/commit/86a08da8f6161edf25e2e8db3d61dd30d0d5c089)  
**Branch**: `main`  
**Triggered by**: @fliklab

## 🎯 Executive Summary

Astro.js 기반 개인 웹사이트의 성능 분석 결과입니다.

✅ **All Performance Thresholds Passed**

## 🧪 Lighthouse Performance Results

| Page | Performance | Accessibility | SEO | LCP | FCP | CLS | Status |
|------|-------------|---------------|-----|-----|-----|-----|--------|
| [홈페이지](https://flikary.dev/) | 100 | 95 | 100 | 707ms | 358ms | 0 | 🟢 Excellent |
| [resume](https://flikary.dev/resume) | 99 | 95 | 66 | 618ms | 273ms | 0.03 | 🟢 Excellent |
| [blog](https://flikary.dev/blog) | 100 | 91 | 100 | 594ms | 247ms | 0 | 🟢 Excellent |
| [archives](https://flikary.dev/archives) | 100 | 91 | 100 | 605ms | 253ms | 0 | 🟢 Excellent |
| [blog-with-ai-insights](https://flikary.dev/blog/blog-with-ai-insights) | 92 | 91 | 100 | 731ms | 293ms | 0.17 | 🟢 Excellent |

**Average Performance Score**: 98/100


## 📈 Detailed Analysis

### 🎯 Key Insights

- **Framework**: Astro.js 정적 사이트 생성기 사용
- **Average Performance**: 98/100
- **Test Environment**: production
- **Pages Analyzed**: 5

### 💡 Optimization Recommendations



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
- **Build Command**: `pnpm run build`
- **Preview Command**: `pnpm run preview`
- **Source Directory**: `src/`
- **Output Directory**: `dist/`

### Test Configuration
- **Configuration**: comprehensive
- **Environment**: production
- **Lighthouse Version**: 12.8.0
- **Chrome Flags**: --no-sandbox --disable-dev-shm-usage
- **Preset**: Desktop

### Commit Information
- **Commit Hash**: `86a08da8f6161edf25e2e8db3d61dd30d0d5c089`
- **Branch**: `main`
- **Author**: @fliklab
- **Timestamp**: Thu Jul 17 19:18:08 UTC 2025

### Performance Thresholds
- **Performance Score**: Must be ≥ 0.7
- **LCP**: Must be ≤ 4000ms
- **CLS**: Must be ≤ 0.25
- **Accessibility**: Must be ≥ 0.8

## 📊 Historical Context

이 리포트는 flikary.dev의 지속적인 성능 모니터링의 일부입니다:

- **Daily Monitoring**: main 브랜치 커밋시 자동 실행
- **Fallback Schedule**: 24시간 내 실행이 없으면 오전 4시 자동 실행
- **Failure Conditions**: 성능 임계값 위반시 GitHub Action 실패

## 🔗 Quick Links

- 🌐 [flikary.dev](https://flikary.dev)
- 🔍 [Preview Environment](https://preview.flikary.dev)
- 📊 [GitHub Repository](https://github.com/fliklab/flikary)
- 🔧 [Performance Config](https://github.com/fliklab/flikary/blob/main/performance-config.json)

---

**🤖 Automated Performance Report** | Generated by Performance CI | flikary.dev
