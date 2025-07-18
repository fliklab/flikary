---
author: Flik
pubDatetime: 2025-06-10T01:27:56.000+09:00
modDatetime: 2025-06-10T01:27:56.000+09:00
title: 매끄럽게 움직이는 노브 애니메이션 만들기
slug: smooth-knob-animation
featured: true
draft: false
tags:
  - React
  - 성능 최적화
  - 애니메이션
  - 인터랙션
description: React에서 버벅이지 않는 매끄러운 애니메이션을 구현하기 위한 성능 최적화 방법을 알아봅니다. 실제 노브(Knob) 컴포넌트 개발 사례를 통해 React의 렌더링 최적화와 애니메이션 구현 방법을 설명합니다.
---

```
[웹 신디사이저](https://simple-web-synthesizer.vercel.app)를 만들면서 기록한 글입니다.
```

## 발단은 노브 컴포넌트 개발

최근 개인적인 토이 프로젝트로 사용자가 드래그로 값을 조절할 수 있는 노브(Knob) 컴포넌트를 만들었다.
(노브(Knob)는 오디오 믹서나 볼륨 조절기에서 보던 그런 원형 다이얼을 의미한다.)

구현하고자 하는 목표는 이렇다.

```
노브를 드래그하면, 노브가 회전한다.
노브가 회전한 각도만큼 그 value가 변한다.
노브가 회전할 수 있는 각도는 최대값과 최소값을 가지며 최대값과 최소값이 이 각도에 각각 맵핑된다.
```

처음에는 간단히 구현하려고 했다.
마우스 움직임을 감지해서 각도를 계산하고, 그 값을 state에 저장해서 화면에 반영했다.

하지만 실제로 구현하다보니 매끄러운 동작이 되지 않았고,
고민 끝에 이런 구현 방식에 문제가 있었다는 것을 알 수 있었다.

## Smooth or Not

나는 스무스(smooth)라는 표현을 자주 사용한다. 움직임이 매끄러운 것을 이야기할 때 주로 쓰는 표현이다.
대부분의 상황에서 스무스하게 움직이는 것이 더 좋게 보인다.
스무스라는 단어을 글로 써보니 사실 좀 어색하다. 그래도 평소에 자주 쓰는 표현을 그대로 사용해 보았다.

## 문제 상황: 매끄럽지 않은 애니메이션

첫 번째 구현에서는 노브가 엄청 버벅거렸다
React 컴포넌트가 매 프레임마다 리렌더링되기 때문이었다.

```tsx
// ❌ 문제가 있는 초기 구현
const KnobComponent = () => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    // 매 마우스 움직임마다 상태 업데이트
    const newRotation = calculateAngle(e.clientX, e.clientY);
    setRotation(newRotation); // 리렌더링 발생!
  };

  return (
    <div
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: "none", // 부드러운 전환 없음
      }}
      onMouseDown={() => setIsDragging(true)}
    >
      {/* 노브 내용 */}
    </div>
  );
};
```

**문제**

- 노브를 드래그하는동안 매 프레임마다 React 리렌더링 발생
- 각 리렌더링마다 Virtual DOM 비교 과정 실행
- 결과적으로 애니메이션이 끊어지고 CPU 사용량 급증

## 리렌더하지 말고 노브를 움직이는 것

### 리렌더가 꼭 필요한 동작일까?

우리가 리액트를 사용하면서 당연하게 여기는 룰은 상태가 바뀌면 컴포넌트를 리렌더링 하는것이다.

그리고 보통 상태를 바꿈으로서 화면상에 변화를 일으킨다.

이 문제를 해결하기 위해 내가 세운 목표는 컴포넌트를 "리렌더하지 말고 노브를 움직이는 것"이다.

그래서 그냥 DOM이나 CSS를 직접 조작하는 방식으로 변경했다.

노브를 움직일때 발생하는 핸들러에 다음과같이 css transform값을 바로 변경하도록 했다.

```typescript
elementRef.current.style.transform = `rotate(${newAngle}deg)`;
```

## 텍스트의 변화도 스무스해야 한다.

이렇게 하자 노브의 움직임이 굉장히 스무스해졌는데 한가지 문제가 있었다.

노브와 함께 표시되는 Value값이 움직이지 않는 것이었다.

사실 이 값도 변해야 하는게 맞지만 이 값을 위해서 상태를 업데이트 하면 노브가 다시 스무스하지 않게 된다.

그래서 처음에는 이렇게 구현했다.

- 0.1초에 한번씩 상태를 업데이트한다.

```typescript
// handleMouseMove의 내부

// 1. 즉시 시각적 업데이트 (60fps)
elementRef.current.style.transform = `rotate(${newAngle}deg)`;

// 2. 상태 업데이트는 제한적으로 (10fps)
const now = Date.now();
if (now - lastUpdateTime.current > 100) {
  setValue(newValue);
  lastUpdateTime.current = now;
}
```

(참고: 이때 `lastUpdateTime`은 `useRef()`로 선언한 값인데 useRef는 리렌더를 시키지 않으면서 값을 업데이트 할 수 있는 방법으로 자주 사용된다.)

이렇게 하자 일단 괜찮게 작동하는 듯 했다.

그런데 1/10에 한번씩 바뀌는 Value값이 생각보다 버벅거리는 것처럼 느껴진다는걸 깨달았다.
단순히 텍스트값이 바뀌는 것이지만... 이 변화도 더 스무스하게 업데이트시키기 위해서 결국 DOM을 직접 조작한다.

## 해결방법 1: DOM 직접 조작 + 상태 분리

```tsx
// ✅ 개선된 노브 구현
const SmoothKnobComponent = () => {
  const [value, setValue] = useState(50); // 실제 값 (가끔 업데이트)
  const elementRef = useRef<HTMLDivElement>(null);
  const lastUpdateTime = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!elementRef.current) return;

    const newAngle = calculateAngle(e.clientX, e.clientY);
    const newValue = angleToValue(newAngle);

    // 1. 즉시 시각적 업데이트 (60fps)
    elementRef.current.style.transform = `rotate(${newAngle}deg)`;
    elementRef.current.

    // 2. 상태 업데이트는 제한적으로 (10fps)
    const now = Date.now();
    if (now - lastUpdateTime.current > 100) {
      setValue(newValue);
      lastUpdateTime.current = now;
    }
  }, []);

  return (
    <div
      ref={elementRef}
      className="knob-container"
      style={{
        transform: `rotate(${valueToAngle(value)}deg)`, // 초기값 설정
      }}
    >
      <div className="knob-indicator" />
      <div className="value-display">{value}</div>
    </div>
  );
};
```

[GIF 이미지: 부드러운 노브 애니메이션 - 끊김 없는 매끄러운 회전]

**개선 효과:**

- 시각적 회전: 60fps로 부드러운 애니메이션
- React 리렌더링: 10fps로 제한 (성능 향상)
- 사용자 경험: 즉각적인 반응 + 정확한 값 표시

## 해결방법 2: CSS Transition 활용

단순한 상태 전환의 경우, CSS의 transition 기능을 활용하면 더 간단하다.

```tsx
// ✅ CSS transition을 활용한 토글 애니메이션
const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <div
      className={`toggle-switch ${isOn ? "on" : "off"}`}
      onClick={() => setIsOn(!isOn)}
    >
      <div className="toggle-handle" />
    </div>
  );
};
```

```css
/* CSS로 애니메이션 처리 */
.toggle-switch {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-switch.on {
  background-color: #10b981;
}

.toggle-switch.on .toggle-handle {
  transform: translateX(24px);
}

.toggle-handle {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
}
```

[GIF 이미지: 부드러운 토글 스위치 애니메이션]

## 해결방법 3: requestAnimationFrame 활용

더 복잡한 애니메이션의 경우 `requestAnimationFrame`을 사용한다.

requestAnimationFrame을 통해 등록된 콜백은 브라우저의 다음 리페인트 시점에 실행되며, 메인 스레드가 block 되더라도 일관된 프레임 레이트를 유지할 수 있습니다. 이는 setTimeout이나 setInterval과 달리 브라우저의 렌더링 파이프라인과 동기화되어 더 부드러운 애니메이션을 구현할 수 있게 해줍니다.

```tsx
// ✅ requestAnimationFrame을 활용한 부드러운 스크롤
const SmoothScrollComponent = () => {
  const [targetPosition, setTargetPosition] = useState(0);
  const currentPosition = useRef(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const animateScroll = useCallback(() => {
    const diff = targetPosition - currentPosition.current;

    if (Math.abs(diff) < 0.1) {
      currentPosition.current = targetPosition;
      return;
    }

    currentPosition.current += diff * 0.1; // 부드러운 이징

    if (elementRef.current) {
      elementRef.current.style.transform = `translateY(${currentPosition.current}px)`;
    }

    requestAnimationFrame(animateScroll);
  }, [targetPosition]);

  useEffect(() => {
    animateScroll();
  }, [targetPosition, animateScroll]);

  return (
    <div ref={elementRef} className="smooth-scroll-content">
      {/* 스크롤 내용 */}
    </div>
  );
};
```

## 최적화 핵심 원칙

### 1. 역할 분리

- **CSS**: 시각적 변화 (transform, opacity, color 등)
- **React**: 상태 관리 (최종값, 사용자가 인식하는 의미 있는 변화)
- **Transition/Animation**: 중간 과정의 부드러운 전환

### 2. 업데이트 빈도 조절

```tsx
// ✅ 스로틀링을 통한 성능 최적화
const useThrottledCallback = (callback: Function, delay: number) => {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: any[]) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    },
    [callback, delay]
  );
};

const handleMove = useThrottledCallback((e: MouseEvent) => {
  // 실제 상태 업데이트
  setValue(calculateValue(e));
}, 100); // 100ms마다만 실행
```

### 3. 메모이제이션 활용

```tsx
// ✅ 불필요한 재생성 방지
const handleInteraction = useCallback((e: MouseEvent) => {
  // DOM 직접 조작
  if (elementRef.current) {
    const newPosition = calculatePosition(e);
    elementRef.current.style.left = newPosition + "px";
  }
}, []); // 의존성 배열 최소화
```

### transition을 적용하면 도움이 될까?

CSS transition을 적용하면 노브의 움직임이 더 부드러워질 수 있다. 하지만 실시간으로 변하는 값에 transition을 적용하면 오히려 반응성이 떨어질 수 있고 결정적으로 성능적인 손실이 크다.

transition을 적용하면 transition 시간동안 추가적인 메모리를 사용하게 되는데
실시간으로 처리되는 값에서는 매 변화마다 이 transition 처리가 일어나는걸까? 의문이 생겼다. transition에 해당하는 시간이 끝나기 전에 연속적으로 새로운 변화가 계속 입력되면 이전 transition은 중단되고 새로운 transition이 시작된다. 이는 브라우저가 transition을 최적화하여 처리하기 때문에 가능한데, 이전 transition의 현재 상태를 시작점으로 하여 새로운 목표값으로 부드럽게 전환하는 방식으로 동작한다. 하지만 이런 연속적인 transition 중단과 재시작은 CPU 리소스를 더 많이 사용하게 되고, 특히 빠른 속도로 값이 변경되는 경우에는 오히려 성능 저하를 초래할 수 있다.

만약 실시간 값 변화가 중요하지 않은 인터랙션이었다면, 값이 변하는 주기를 제한하고 (throttle) 해당 시간에 맞게 transition을 적용하는 것으로 대체할 수도 었었을 것 같다.

지금처럼 실시간 반응이 중요한 컴포넌트에는 transition 대신 직접적인 DOM 조작이 더 적합하다고 생각했다.

## 마무리

리액트에서 상태는 매우 중요하기 때문에 엄격하게 관리하는 것이 중요하지만 화면에서 이루어지는 모든 인터랙션이 반드시 State의 변화를 유발할 필요는 없다.

단순히 애니매이션과 인터랙션을 위한 움직임은 **React 리렌더링은 최소화** 하는것이 유리하다.

단순히 Repint-Reflow 과정을 생략하는 것 뿐만 아니라 불필요한 React 에서의 상태 변화 자체를 생략하는것이다.

**시각적 변화와 상태 변화를 분리**하고 **DOM, CSS 직접 조작**, requestAnimationFrame 같은 방식으로 반응성 좋은 애니메이션을 만들 수 있었다.

고성능 애니매이션을 이야기 위해서 다루고 싶은 이야기가 더 많지만 이정도로 기록하고 넘어간다.
