# 네비게이션 디자인 컨셉 가이드 (Phase 8.3)

## 1. 컨셉 재정의
- **키워드**: Soft Minimal, Glass Capsule, Fluid Morphing, Calm Gradient.
- **배경**: 전체 페이지는 기존 파스텔 그라데이션을 유지하고, 네비게이션 계층은 `rgba(255,255,255,0.85)` 이상의 투명도를 가진 화이트 캡슐로 구성한다. 모든 캡슐에는 `backdrop-filter: blur(20px)`와 미세한 내부 섀도(`inset 0 1px 0 rgba(255,255,255,0.6)`)를 적용해 레이어감을 만든다.
- **타이포 톤**: 제목은 손글씨 감성을 살린 나눔바른펜, 본문과 보조 UI는 Inter로 대비를 준다.
- **아이콘 스타일**: 라인 두께 1.5px, 라운드 캡, hover 시 채도가 올라가는 미세한 그라데이션 stroke.

## 2. 폰트 시스템
```css
@font-face {
  font-family: 'NanumBarunPen';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/NanumBarunpen.woff') format('woff');
  font-weight: normal;
  font-display: swap;
}
```

```css
.inter-default {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}
```
- **Heading**: `NanumBarunPen`, letter-spacing -0.02em, line-height 1.2.
- **Body/UI**: `Inter`, letter-spacing -0.01em, line-height 1.45.
- **토큰**: `--font-display: 'NanumBarunPen', cursive;`, `--font-sans: 'Inter', system-ui;`.

## 3. 공통 시각 규칙
- **Glass Surface**: `--surface-glass: rgba(255,255,255,0.86); --surface-blur: 20px;`.
- **윤곽선**: `border: 1px solid rgba(255,255,255,0.55)` + `box-shadow: 0 12px 30px rgba(15,32,52,0.12)`.
- **그라데이션 포스터**: Hero 내부 이미지 프레임은 `linear-gradient(135deg,#c6f0ff,#ffd4eb)`.
- **아이콘 페이드**: opacity 1 → 0 (120ms) → morph → 1 (180ms) 순으로 easing `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Radix Theme 연계**: `Theme` 컴포넌트의 `accentColor="iris"`을 기본으로 하고, `radius="full"` 옵션으로 캡슐 톤을 유지한다. 커스텀 surface/blur 변수는 `ThemePanel`에서 재사용 가능하도록 `mauve` 계열 토큰에 매핑한다.

## 4. 데스크톱 네비게이션 상태 설계

| 상태 | 트리거 | 레이아웃/스타일 | 모션 |
| --- | --- | --- | --- |
| **Expanded Capsule** | 최초 로딩, 최상단 스크롤 | 폭 720~840px, 내부 패딩 24px, 텍스트+아이콘 전체 표시, 가운데 로고 | 스폰지처럼 살짝 팽창하는 scale 0.96→1 (180ms) |
| **Icon Compact** | 스크롤 다운 감지 (30px 이상) | 높이 44~48px, 텍스트 숨기고 아이콘만 표시, 브랜드 영역 접기 | width/padding 줄이며 아이콘 scale 0.9→1 (200ms) |
| **Hidden Bar** | Compact 상태에서 추가 스크롤 다운 (150px 누적) | 위치 `translateY(-120%)` | opacity 1→0 + translateY(-24px) (160ms) |
| **Peek Reveal (Half)** | Hidden 상태에서 스크롤 업 방향 전환 | 헤더가 -40% 지점에 걸쳐 반쪽만 노출, 클릭 시 전체 등장 | translateY(-120%)→(-40%) (150ms), opacity 0.8 고정 |
| **Return Compact** | Peek 상태에서 클릭 or 추가 스크롤 업 | Icon Compact 레이아웃 재노출 | translateY(-40%)→0 (160ms) |
| **Re-Expand** | 최상단 근처(20px 이하)로 스크롤 업 | Expanded 스타일 복원 | 아이콘/텍스트 페이드 in, width/height easing 260ms |

- **아이콘 페이드 규칙**: Expanded→Compact 전환 시 텍스트 opacity 1→0 후 width 축소, 그 뒤 아이콘 opacity 0→1로 순차 전환. `transition-delay`를 80ms 줘서 모핑 완료 후 나타나게 한다.
- **Morph 구현 팁**: 동일한 DOM을 유지하고 `clip-path: inset(0 round 32px)`와 `border-radius` 값을 동시에 보간하면 자연스럽게 보인다.

## 5. 모바일 네비게이션 시나리오
1. **Floating Hamburger**: 오른쪽 상단, 지름 56px 라운드 버튼. `background: rgba(255,255,255,0.88)` + blur 20px.
2. **Scroll Down**: 20px 이상 감지 시 버튼이 `translateY(-120%)` 되며 opacity 0으로. ease-out 180ms.
3. **Scroll Up**: 버튼이 다시 `translateY(0)` + opacity 1 (220ms).
4. **Morph Open**: 버튼 탭 시 원형이 220ms 동안 가로 240px, 세로 320px의 세로형 rounded rectangle로 확장. clip-path와 border-radius(999px→32px) 보간.
5. **Menu Stack**: 내부에 세로 메뉴 4~5개, 하단에 검색/테마 토글 아이콘 배치. 메뉴 항목은 Inter SemiBold, 20px/28px.
6. **Close Interaction**: 상단 우측 X를 탭하면 역순 애니메이션 + blur fade-out.

## 6. 필요한 컴포넌트 구조
- `NavSurface`: Radix `Theme` + `Box`를 래핑하여 Glass 배경, 그림자, radius 토큰을 관리하는 프리젠테이션 컴포넌트. `asChild`로 내부 NavigationMenu를 감싼다.
- `NavContentDesktop`: `NavigationMenu.Root/List/Item/Link`를 사용해 Expanded/Condensed 상태별 레이아웃을 구성한다. 상태는 Radix `data-state` 속성을 활용해 스타일을 바인딩한다.
- `NavContentMobile`: `Dialog.Root`(또는 `Sheet` 패턴)과 `Dialog.Trigger/Content/Close`를 사용해 햄버거 ↔ drawer 인터랙션을 구성한다.
- `NavStateController`: 스크롤 방향, 위치, Viewport 폭 감지 → 상태 머신(`expanded | condensed | hidden`)을 결정. 상태 변경은 Radix `Presence`와 연계하여 애니메이션을 분리한다.
- `IconCluster`: 검색, 다크모드, 깃허브 등 묶음. Radix `Tooltip`과 `HoverCard`를 활용해 접근성/포커스 로직을 통합한다.
- `HamburgerMorphButton`: `Primitive.button` 기반으로 원형 ↔ rounded rectangle 모핑, SVG line 애니메이션 포함.
- `NavDrawerStack`: `Flex`, `Separator` 등을 활용해 모바일 메뉴 항목 리스트와 하단 액션(검색, 밝기) 배치.
- `BackdropLayer`: 공통 blur/opacity token을 공유하여 다른 글래스 UI에도 재사용. `Portal`을 통해 문서 루트에 마운트하여 z-index 충돌 방지.

## 7. 애니메이션 & 인터랙션 스펙
- **Duration**: 160–260ms, 모핑 구간은 220ms 고정.
- **Easing**: `cubic-bezier(0.65, 0, 0.35, 1)`(빠르게 축소 후 부드럽게 정지), 페이드에는 `ease-out`.
- **Stagger**: 아이콘 → 텍스트 → 액션 순으로 40ms 간격.
- **Accessibility**: `prefers-reduced-motion` 시 translate/scale 제거, opacity만 120ms 적용.

## 8. 구현 참고
- **스크롤 감지**: `IntersectionObserver`로 Hero 영역을 sentinel로 삼아 Expanded 복원, `useScrollDirection` 훅으로 Condensed/Hidden 상태 토글.
- **상태 동기화**: 상태 머신 결과를 Radix `NavigationMenu.Root`의 `data-state` 속성에 주입하고, Radix Theme의 CSS 변수(`--colors-panel`, `--space-3`)와 연결하여 스타일을 일관되게 관리한다.
- **투명도 & 블러 토큰**: Radix Theme의 `globalCss` 혹은 Style Registry에 `nav-glass` mixin을 정의해 `backdrop-filter`와 opacity를 재사용한다. Tailwind 유틸리티 대신 Radix Theme utility class(`className={glass({ variant: state })}`)를 사용하는 방향을 유지한다.
- **폰트 로딩**: `@font-face`는 `src/shared/styles/fonts.css`로 분리하고, `font-display: swap`으로 CLS 방지.

## 9. 코드 및 로직 분리 전략
- **상태 로직 모듈화**
  - `useNavScrollState` 훅: 스크롤 위치, 방향, 마지막 인터랙션 타임스탬프를 감지해 `expanded | condensed | hidden`을 반환.
  - `useViewportCategory` 훅: 브레이크포인트(`md`, `lg`)와 `prefers-reduced-motion`을 동기화하여 레이아웃 로직이 프레젠테이션과 분리되도록 한다.
  - 위 훅들은 `src/shared/utils/navigation/`에 저장해 다른 페이지에서도 재사용한다.

- **상태 머신 정의**
  - `navigationMachine.ts`: XState 또는 경량 상태 머신으로 스크롤 이벤트, 포커스, 마우스 진입을 이벤트로 받아 상태 전이를 정의.
  - UI 컴포넌트는 머신에서 나온 `context`(opacity, scale, translateY)를 Radix `data-state` 속성과 `@radix-ui/react-presence`의 `present` prop에 바인딩해 스타일을 분리한다.

- **프레젠테이션 vs 로직**
  - `NavShell.astro`: 데이터를 속성으로 받은 뒤 `NavSurface`, `NavContentDesktop`, `NavContentMobile`을 조립한다.
  - 로직은 `controller.ts`에서 상태 계산 후 `NavShell`에 전달한다. Radix 컴포넌트는 가능한 한 `asChild` 패턴을 써서 DOM을 최소화한다.

- **애니메이션 재사용**
  - `motionTokens.ts`: duration, delay, easing 상수를 export 하여 Radix `Presence` transition과 Web Animations API 모두에서 공유.
  - `useMorphTimeline` 훅: Web Animations API 혹은 `framer-motion`에 의존하지 않는 경량 타임라인을 제공, 데스크톱/모바일 모핑에 재사용.

- **아이콘 및 액션 그룹**
  - `IconCluster`는 children render prop을 사용해 필요한 아이콘만 주입하도록 설계. 페이드/스케일 애니메이션은 cluster 내부에서 처리하여 호출자는 상태만 넘긴다.
  - `ActionButton` 컴포넌트는 공통 focus-ring, aria-label, tooltip 처리를 담당해 접근성 로직 중복을 없앤다. Radix `Tooltip.Provider`로 포커스/마우스 상태를 관리한다.

- **테마/토큰 구성**
  - `tokens/navigation.ts`에 surface, shadow, spacing, radius 값을 정의하고 Radix Theme `createTheme` API로 주입한다.
  - 모든 컴포넌트는 색상 상수를 직접 쓰지 않고 tokens를 import 하여 수정 시 중앙집중적으로 관리.

- **테스트 전략**
  - 상태 머신 단위 테스트: 스크롤 이벤트 시퀀스에 따른 상태 전이 검증.
  - 훅 테스트: `useNavScrollState`가 Debounce와 `requestAnimationFrame`을 활용하여 성능을 유지하는지 확인.
  - 시각 스냅샷: Storybook에서 Expanded/Condensed/Hidden, Mobile Drawer Open 상태를 캡처해 리그레션 방지. Radix `TestingLibrary` helper를 사용해 접근성 트리를 검증한다.

## 10. Radix UI 적용 사양
- **데스크톱**
  - `NavigationMenu.Root`: 상태 머신에서 내려준 `data-nav-state`를 전달해 Expanded/Condensed/Hiding 상태를 제어.
  - `NavigationMenu.List`: Glass Capsule 형태를 유지하기 위해 `NavSurface`가 wrapping, 내부 spacing은 Radix `Flex`로 조절.
  - `NavigationMenu.Item` + `NavigationMenu.Link`: hover/focus 처리 및 `aria-current` 표시를 자동화.
  - `NavigationMenu.Indicator`를 활용해 현재 페이지를 capsule 하단에 작은 dot로 표시.

- **모바일**
  - `Dialog.Root`: 햄버거와 Drawer를 제어. `Dialog.Content`는 rounded rectangle, `Dialog.Overlay`는 blur/opacity 토큰을 공유.
  - `Dialog.Close`: X 버튼을 `asChild`로 래핑하여 커스텀 아이콘에 접근성 props 자동 주입.
  - `Presence`: 스크롤 방향에 따라 햄버거 버튼이 mount/unmount 될 때 모션을 제어.

- **공통**
  - `Slot`: NavSurface 내부에서 아이콘 버튼 커스터마이징 시 사용.
  - `Theme`: 페이지 루트에 배치해 폰트/색상 토큰을 전달, 네비게이션은 `Theme` 범위 내에서만 커스텀 변수를 override.
  - `Separator`, `ScrollArea`: Drawer 내부 카테고리 구분 및 태그 필터를 위한 재사용 가능한 구조.

Radix UI 기반으로 구조를 잡음으로써 Tailwind 유틸리티 사용을 최소화하고, 상태/테마/동작 로직을 프리미티브 수준에서 일관되게 재사용할 수 있다.

이 문서는 `.cursor/instructions/tasks.md`의 **8.3 네비게이션 디자인 리프레시**를 위한 컨셉/컴포넌트 정의 기준선으로 사용한다.

