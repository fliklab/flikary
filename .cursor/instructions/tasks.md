# Header 컴포넌트 Tailwind 변환 작업계획

## 📋 작업 개요
Header 컴포넌트의 현재 CSS를 Tailwind CSS로 완전히 변환하여 더 유지보수가 쉽고 일관된 스타일링 시스템을 구축합니다.

## 🎯 목표
- [ ] 21KB의 복잡한 CSS 파일을 Tailwind 유틸리티로 변환
- [ ] 다크모드 지원을 Tailwind의 `dark:` 접두사로 변환
- [ ] 반응형 디자인을 Tailwind 브레이크포인트로 변환
- [ ] CSS 변수를 Tailwind 설정으로 이관
- [ ] 코드 가독성 및 유지보수성 향상
- [ ] 재사용되는 패턴이나 색상 등은 tailwind config 등을 통해서 정리하기.

## 📁 작업 대상 파일
- `src/components/Header/index.astro` (메인 로직)
- `src/components/Header/DesktopNav.astro` (데스크톱 네비게이션)
- `src/components/Header/MobileNav.astro` (모바일 네비게이션)
- `src/components/Header/LensEffects.astro` (렌즈 효과)
- `src/components/Header/style.css` (860줄 CSS → 삭제 예정)

## 🚀 단계별 작업계획

### Phase 1: 분석 및 준비 (1일)
- [ ] **1.1 CSS 분석**
  - [ ] 현재 CSS 변수 목록 추출 (--nav-*, --lens-* 등)
  - [ ] 미디어 쿼리 분석 (640px, 768px, 1280px 브레이크포인트)
  - [ ] 애니메이션 및 트랜지션 분석
  - [ ] 다크모드 스타일 분석

- [ ] **1.2 Tailwind 설정 준비**
  - [ ] 커스텀 색상을 `tailwind.config.cjs`에 추가
  - [ ] 커스텀 스페이싱 값 정의
  - [ ] 애니메이션 키프레임 정의
  - [ ] 커스텀 그림자 값 정의

### Phase 2: DesktopNav 변환 (2일)
- [ ] **2.1 기본 레이아웃**
  - [ ] Floating nav 컨테이너 스타일링
  - [ ] Position 및 z-index 설정
  - [ ] 기본 너비/높이 설정

- [ ] **2.2 Mini/Expanded 상태**
  - [ ] mini 상태 아이콘 레이아웃
  - [ ] expanded 상태 메뉴 레이아웃
  - [ ] 상태 전환 애니메이션

- [ ] **2.3 반응형 및 다크모드**
  - [ ] 데스크톱/태블릿/모바일 브레이크포인트
  - [ ] 다크모드 색상 변환
  - [ ] 호버/포커스 상태

### Phase 3: MobileNav 변환 (1일)
- [ ] **3.1 모바일 메뉴**
  - [ ] 햄버거 버튼 스타일링
  - [ ] 오버레이 및 패널 스타일링
  - [ ] 메뉴 아이템 레이아웃

- [ ] **3.2 인터랙션**
  - [ ] 열기/닫기 애니메이션
  - [ ] 백드롭 블러 효과
  - [ ] 터치 인터랙션 최적화

### Phase 4: LensEffects 변환 (1일)
- [ ] **4.1 SVG 렌즈 효과**
  - [ ] SVG 필터 스타일링
  - [ ] 위치 및 크기 조정
  - [ ] 애니메이션 효과

- [ ] **4.2 성능 최적화**
  - [ ] will-change 속성 적용
  - [ ] GPU 가속 최적화

### Phase 5: 통합 및 최적화 (1일)
- [ ] **5.1 통합 테스트**
  - [ ] 모든 브레이크포인트에서 테스트
  - [ ] 다크모드 전환 테스트
  - [ ] 스크롤 인터랙션 테스트
  - [ ] View Transitions 호환성 테스트

- [ ] **5.2 최종 정리**
  - [ ] `style.css` 파일 삭제
  - [ ] 불필요한 import 제거
  - [ ] 코드 최적화 및 주석 정리

## 🎨 Tailwind 변환 매핑

### 색상 변환
```css
/* 기존 CSS 변수 */
--nav-bg-light: 255, 255, 255
--nav-bg-dark: 0, 24, 39
--nav-accent-light: 59, 130, 246
--nav-accent-dark: 0, 211, 252

/* Tailwind 설정 */
colors: {
  nav: {
    light: 'rgb(255, 255, 255)',
    dark: 'rgb(0, 24, 39)',
    'accent-light': 'rgb(59, 130, 246)',
    'accent-dark': 'rgb(0, 211, 252)'
  }
}
```

### 스페이싱 변환
```css
/* 기존 clamp() 함수 */
--nav-expanded-width: clamp(400px, calc(40vw + 200px), 500px)

/* Tailwind 커스텀 클래스 */
.nav-expanded { @apply w-[clamp(400px,calc(40vw+200px),500px)] }
```

### 애니메이션 변환
```css
/* 기존 keyframes */
@keyframes highlightFadeIn { ... }

/* Tailwind 설정 */
animation: {
  'highlight-fade': 'highlightFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
}
```

## 🔧 기술적 고려사항

### 성능
- [ ] 기존 860줄 CSS → Tailwind 유틸리티로 번들 크기 최적화
- [ ] 사용하지 않는 스타일 제거 (PurgeCSS)
- [ ] Critical CSS 최적화

### 호환성
- [ ] View Transitions 유지
- [ ] 기존 JavaScript 로직 호환성
- [ ] 다크모드 토글 기능 유지

### 접근성
- [ ] 키보드 네비게이션 유지
- [ ] 스크린 리더 호환성
- [ ] 색상 대비 기준 준수

## 🚨 주의사항

1. **점진적 변환**: 한 번에 모든 파일을 변경하지 말고 컴포넌트별로 순차 진행
2. **기능 테스트**: 각 단계별로 기존 기능이 정상 작동하는지 확인
3. **백업 유지**: 기존 CSS 파일을 임시로 `.bak` 확장자로 백업
4. **브랜치 전략**: `feature/header-tailwind-conversion` 브랜치에서 작업
5. **커밋 단위**: 각 컴포넌트별로 개별 커밋

## 📊 예상 결과

### Before
- CSS: 21KB (860줄)
- 복잡한 CSS 변수 시스템
- 수동 다크모드 관리

### After  
- Tailwind 유틸리티 클래스
- 일관된 디자인 시스템
- 자동 다크모드 지원
- 향상된 유지보수성

## ✅ 완료 체크리스트

### 기능 검증
- [ ] 스크롤에 따른 네비게이션 상태 변화
- [ ] 다크/라이트 모드 전환
- [ ] 반응형 레이아웃 (Desktop/Tablet/Mobile)
- [ ] 모바일 메뉴 열기/닫기
- [ ] 테마 토글 버튼 동작
- [ ] View Transitions 호환성
- [ ] 접근성 기능 유지

### 코드 품질
- [ ] 모든 하드코딩된 값 제거
- [ ] Tailwind 유틸리티로 완전 변환
- [ ] 불필요한 CSS 파일 제거
- [ ] 코드 주석 정리
- [ ] TypeScript 타입 안정성

---

**추정 작업시간**: 5-6일  
**우선순위**: High  
**담당자**: Frontend Developer  
**리뷰어**: Tech Lead 