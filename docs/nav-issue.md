# Navigation Issue 회고 리포트

## 개요

페이지 전환 시 헤더 네비게이션이 깜빡이는 문제를 해결하는 과정에서 여러 시행착오를 겪었다. 이 문서는 문제의 원인 분석, 잘못된 해결 시도들, 그리고 최종 해결책을 정리한 회고 리포트이다.

---

## 1. 문제 현상

- 페이지 전환 시 헤더 네비게이션이 한 번 깜빡임
- 홈 ↔ 블로그 전환 시 네비게이션 상태가 제대로 유지되지 않음
- 태그 클릭 시에도 깜빡임 발생

---

## 2. 원인 분석

### 2.1 핵심 문제: React State가 persist되지 않음

`Header.astro`에서 `transition:persist="nav-header"`를 사용하고 있지만, 이것은 **DOM 요소만 유지**한다. **React 컴포넌트의 state는 유지되지 않는다.**

```astro
<!-- Header.astro -->
<div transition:persist="nav-header" transition:animate="none">
  <NavHeader client:load activeNav={activeNav} />
</div>
```

### 2.2 깜빡임 발생 과정

**NavHeader.tsx:**
```tsx
const [isVisible, setIsVisible] = useState(false);  // 페이지 전환마다 false로 리셋
```

페이지 전환 시:
1. DOM은 persist되지만 React가 re-hydrate됨
2. `isVisible = false` → `opacity: 0` 적용
3. useEffect 실행 후 `setIsVisible(true)` → `opacity: 1`
4. **이 0→1 전환이 깜빡임으로 보임**

**DesktopNav.tsx:**
```tsx
const [hasMounted, setHasMounted] = useState(false);  // 매번 리셋

<motion.div
  initial="hidden"   // ← 항상 hidden에서 시작
  animate="visible"
>
```

### 2.3 추가 원인: 태그 필터의 data-astro-reload

`TagFilter.tsx`에 `data-astro-reload` 속성이 있어 View Transitions를 우회하고 전체 페이지 리로드를 강제했다.

```tsx
// 문제의 코드
<a href={`/tags/${tag.slug}/`} data-astro-reload>
```

---

## 3. 잘못된 해결 시도들

### 3.1 시도 1: sessionStorage 기반 첫 로드 감지

```tsx
const getIsInitialLoad = (): boolean => {
  if (typeof window === "undefined") return true;
  const key = "__nav_initial_load__";
  return !sessionStorage.getItem(key);
};

const [isInitialLoad] = useState(getIsInitialLoad);
const [isVisible, setIsVisible] = useState(!isInitialLoad);
```

**문제점:**
- SSR에서 `window`가 undefined → `isInitialLoad = true`
- 클라이언트에서 sessionStorage에 값이 있으면 → `isInitialLoad = false`
- **Hydration mismatch 발생!**

### 3.2 시도 2: useState 초기화 함수에서 플래그 설정

```tsx
const [wasAlreadyLoaded] = useState(() => {
  const loaded = getNavLoadedFlag();
  setNavLoadedFlag(); // 즉시 플래그 설정
  return loaded;
});

const [isVisible, setIsVisible] = useState(wasAlreadyLoaded);
```

**문제점:**
- SSR: `wasAlreadyLoaded = false` (window가 undefined)
- Client: `wasAlreadyLoaded = true` (플래그가 설정되어 있음)
- 여전히 **Hydration mismatch**

### 3.3 시도 3: useLayoutEffect로 변경

```tsx
const [isVisible, setIsVisible] = useState(false);

useLayoutEffect(() => {
  const wasAlreadyLoaded = getNavLoadedFlag();
  if (wasAlreadyLoaded) {
    setIsVisible(true);  // DOM 페인트 전에 설정
  }
}, []);
```

**문제점:**
- SSR 초기값 `false` → 클라이언트에서 `true`로 변경
- useLayoutEffect가 DOM 페인트 전에 실행되지만, React의 첫 렌더링은 이미 `opacity: 0`
- **짧은 순간 깜빡임 여전히 발생**

### 3.4 시도 4: hidden prop 전달

```astro
<!-- Header.astro -->
<NavHeader client:load activeNav={activeNav} hidden={hidden} />
```

```tsx
// NavHeader.tsx
const NavHeader = ({ hidden = false, ...props }) => {
  // hidden에 따라 visibility 결정
};
```

**문제점:**
- `transition:persist`가 있는 요소는 새 페이지에서 **교체되지 않고 유지**됨
- 새 페이지의 `hidden` prop이 전달되지 않음
- 홈(`hidden=true`)에서 블로그(`hidden=false`)로 이동해도 여전히 `hidden=true` 상태 유지

---

## 4. 최종 해결책

### 4.1 핵심 아이디어

1. **inline script로 페이지별 상태를 전역 변수에 저장** (React hydration 전에 실행)
2. **커스텀 이벤트로 페이지 전환 시 visibility 변경 전파**
3. **React에서 이벤트를 구독하여 opacity 변경**

### 4.2 구현

**Header.astro:**
```astro
<header class="site-header">
  <div
    id="nav-header-container"
    transition:persist="nav-header"
    transition:animate="none"
  >
    <NavHeader client:load activeNav={activeNav} />
  </div>
</header>

{/* 현재 페이지의 hidden 상태를 전역에 저장 */}
<script is:inline define:vars={{ hidden }}>
  window.__navHidden = hidden;
</script>

{/* 페이지 전환 후 hidden 상태 동기화 */}
<script>
  function syncNavVisibility() {
    const event = new CustomEvent('nav:visibility-change', {
      detail: { hidden: window.__navHidden }
    });
    document.dispatchEvent(event);
  }

  document.addEventListener('astro:page-load', syncNavVisibility);
</script>
```

**NavHeader.tsx:**
```tsx
const NavHeader: FunctionComponent<Props> = props => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  // 초기 마운트 시 visibility 설정
  useLayoutEffect(() => {
    const firstVisit = isFirstVisit();
    markVisited();

    const hidden = getHiddenState();  // window.__navHidden 읽기

    if (hidden) {
      setIsVisible(false);
    } else if (firstVisit) {
      setShouldAnimate(true);
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setShouldAnimate(false);
      setIsVisible(true);
    }
  }, []);

  // 페이지 전환 시 visibility 변경 감지
  useEffect(() => {
    const handleVisibilityChange = (e: CustomEvent<{ hidden: boolean }>) => {
      const hidden = e.detail.hidden;
      const wasVisible = isVisible;

      if (hidden && wasVisible) {
        // visible → hidden: fade-out
        setShouldAnimate(true);
        setIsVisible(false);
      } else if (!hidden && !wasVisible) {
        // hidden → visible: fade-in
        setShouldAnimate(true);
        setTimeout(() => setIsVisible(true), 50);
      }
      // visible → visible: 유지
    };

    document.addEventListener('nav:visibility-change', handleVisibilityChange);
    return () => document.removeEventListener('nav:visibility-change', handleVisibilityChange);
  }, [isVisible]);

  return (
    <div
      className="nav-header-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: shouldAnimate ? "opacity 0.4s ease-out" : "none",
      }}
    >
      {/* ... */}
    </div>
  );
};
```

### 4.3 홈 페이지에 Header 추가

```astro
<!-- src/pages/index.astro -->
<Layout>
  <Header hidden />  <!-- 숨김 상태로 추가 -->
  <main id="main-content">
    <!-- ... -->
  </main>
</Layout>
```

### 4.4 태그 필터 수정

```tsx
// TagFilter.tsx - data-astro-reload 제거
<a
  href={`/tags/${tag.slug}/`}
  className={`tag-filter-btn ${activeTag === tag.slug ? "active" : ""}`}
>
  #{tag.name}
</a>
```

---

## 5. 동작 방식 요약

| 시나리오 | 동작 |
|---------|------|
| 첫 방문 (어떤 페이지든) | fade-in 애니메이션 |
| 홈 → 블로그 | `nav:visibility-change` 이벤트로 fade-in |
| 블로그 → 홈 | `nav:visibility-change` 이벤트로 fade-out |
| 블로그 ↔ 다른 페이지 | 깜빡임 없이 즉시 유지 |

---

## 6. 교훈

1. **`transition:persist`는 DOM만 유지한다** - React state, props는 re-hydration 시 초기화됨
2. **SSR과 클라이언트의 초기값은 일치해야 한다** - Hydration mismatch 방지
3. **persist된 컴포넌트에 prop 전달은 무의미하다** - 새 페이지의 값이 적용되지 않음
4. **inline script는 React보다 먼저 실행된다** - 전역 상태 설정에 활용 가능
5. **커스텀 이벤트로 Astro ↔ React 통신이 가능하다** - 페이지 전환 시 상태 동기화

---

## 7. 추가 수정사항

### toggle-theme.js 중복 리스너 문제

**문제:**
```js
// onclick은 addEventListener와 무관하므로 항상 true
if (themeBtn && !themeBtn.onclick) {
  themeBtn.addEventListener("click", handleThemeToggle);
}
```

**해결:**
```js
if (themeBtn && !themeBtn.hasAttribute("data-theme-initialized")) {
  themeBtn.setAttribute("data-theme-initialized", "true");
  themeBtn.addEventListener("click", handleThemeToggle);
}
```

---

## 8. 관련 파일

- `src/shared/components/layout/Header.astro`
- `src/shared/components/navigation/nav-header/NavHeader.tsx`
- `src/shared/components/navigation/nav-header/DesktopNav.tsx`
- `src/shared/components/navigation/nav-header/MobileNav.tsx`
- `src/shared/components/article-card/TagFilter.tsx`
- `src/pages/index.astro`
- `public/toggle-theme.js`
