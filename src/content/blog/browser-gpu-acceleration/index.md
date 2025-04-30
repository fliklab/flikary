---
author: Flik
pubDatetime: 2025-04-30T15:00:53.000+09:00
modDatetime: 2025-04-30T15:00:53.000+09:00
title: 브라우저의 GPU 가속 이해하기
slug: browser-gpu-acceleration
featured: true
draft: false
tags:
  - 웹 성능
  - 브라우저
  - GPU 가속
  - CSS 최적화
description: 브라우저가 GPU 가속을 사용하는 상황과 CSS 속성들을 알아보고, 웹 성능 최적화에 활용하는 방법을 정리합니다.
---

## 인트로: 브라우저가 왜 GPU를 사용할까?

오늘날의 웹은 이미지, 애니메이션, 동영상, 인터랙션으로 가득 차 있다  
이런 리치 콘텐츠를 렌더링하는 데 **모든 계산을 CPU에만 맡기면 성능 병목**이 생길 수 있다.

그래서 브라우저는 일부 그래픽 처리를 **GPU(그래픽카드)** 로 넘겨 **하드웨어 가속**을 사용한다.  
하지만 모든 상황에서 GPU가 작동하지는 않는다.

GPU가 쓰이는 것 상황이 언제이며, 어떤 영향이 있는지 좀 더 자세히 알고 싶어서, 이 글을 쓰면서 정리해본다.

---

## 브라우저 렌더링 파이프라인

```
HTML → DOM Tree → CSSOM Tree → Render Tree → Layout → Paint → Composite
```

위 순서는 브라우저가 콘텐츠를 렌더링하는 대략적인 파이프라인이다.

하드웨어(GPU) 가속은 주로 마지막에 있는 Composite 단계에서 일어난다.

### 레이어(Layer) 분리

GPU가 화면을 그릴 때는 **레이어(Layer)** 를 조합하여 그리게 된다. 레이어는 포토샵에서 있는 레이어와 마찬가지로 GPU에서 여러 이미지를 겹쳐서 처리하는 방식이다. GPU는 여러 레이어를 병렬적으로 처리하고, 필요할 때만 다시 그리거나 조합할 수 있다.

브라우저가 모든 요소를 하나의 레이어로만 처리한다면, 아주 작은 변경에도 전체 페이지를 다시 렌더링해야 하지만 레이어를 적절히 분리하면 변경이 일어난 부분만 다시 그리면 되기 때문에 성능 향상에 도움이 된다.

그래서 GPU 가속을 활용할 가능성이 있는 부분은 보통 새로운 레이어로 분리하여 처리하게 된다.

### 개발자 도구에서 레이어 확인하기

참고: 크롬 개발자 도구에서 실제 레이어가 나뉘진 방식을 시각적으로 확인할 수 있다.(개발자 도구 우측 상단 점 3개 → "More tools" → "Layers" 를 선택)

![크롬 개발자 도구에서 레이어 확인하기](./layers-tab-chrome.jpg)

---

## GPU 가속이 발생하는 상황

브라우저가 GPU 가속을 사용하는 상황은 크게 다음과 같다.

1. 특정 CSS 속성 사용 (transform, opacity, will-change 등)
2. 비디오 재생 및 캔버스 요소 처리
3. WebGL 및 3D 그래픽 렌더링
4. CSS 애니메이션 및 트랜지션
5. 복잡한 레이어 합성(Compositing) 작업

각 상황에 대해 자세히 살펴보겠습니다.

## 1. 특정 CSS 속성 사용

GPU 가속을 유도하거나 자동으로 발생시키는 CSS 속성이 있다.<br/>
GPU는 `transform`, `opacity` 같은 픽셀 조작을 빠르게 처리하기 위해 별도 레이어로 분리하여 렌더링하고, 필요한 레이어에 대해서 GPU가속을 하게 된다.
이 속성들은 주로 레이아웃, 페인트 단계를 건너뛰고 합성 단계만 수정한다는 특징이 있다.

또한 `position: fixed`, `sticky`와 같은 속성이 적용된 요소나, 복잡한 스크롤 영역의 콘텐츠는 브라우저가 독립적으로 합성할 필요가 있다고 판단할 경우 GPU 레이어로 분리되기도 한다.

### 대표적인 속성들

- `transform`: 회전, 크기 조절, 이동 등의 변형  
   예) `transform: translateX(100px);`
- `opacity`: 투명도 조절  
   예) `opacity: 0.5;`
- `filter`, `backdrop-filter`: 블러, 그레이스케일 등 시각 효과 . 일부 브라우저에서 GPU 처리 여부에 차이가 있음.
  예) `filter: blur(5px);`
- `will-change`: 해당 요소가 앞으로 변할 것임을 브라우저에게 알려줌.  
   예) `will-change: transform;`

그 외에도 `position: fixed/sticky`, `overflow`와 함께 사용되는 스크롤 요소, `perspective`, `animation`, `box-shadow`, `text-shadow` 등의 CSS 속성들이 GPU 가속을 유발할 수 있다. 자세한 내용은 [CSS Triggers](https://csstriggers.com/)에서 확인 가능하다.

### `will-change`와 애니매이션 최적화

`will-change`를 사용하면, 애니매이션이 발생하기 전에 gpu layer를 생성하도록 할 수 있다.
애니매이션이 곧 발생할 것이니 준비하라는 뜻이다.

```css
.element {
  will-change: transform, opacity;
}
```

위와같이 transform과 opacity에서 변화가 일어날 가능성이 있다는 사실을 미리 알린다.

`will-change`를 사용하지 않으면, 변화가 감지된 후에야 GPU 레이어를 생성 시도하기 때문에 최초 프레임에서 끊기는 현상이 있을 수도 있다.

다만, 너무 많이 쓰면 메모리 누수로 인해 **GPU 메모리 과부하** 의 원인이 될 수 있어서 꼭 필요한 상황에만 쓰는게 좋다.

### GPU 가속이 되지 않는 속성들

이 속성들은 애니메이션을 적용해도 **GPU가 아닌 CPU에서 처리**되며, 브라우저는 **layout → paint → composite**의 전 과정을 반복하게 된다.

| 속성                                        | 설명                                  |
| ------------------------------------------- | ------------------------------------- |
| `top`, `left`, `right`, `bottom`            | 위치 이동을 위해 **layout 계산 필요** |
| `width`, `height`                           | 크기 변화 **reflow 발생**             |
| `margin`, `padding`                         | 주변 여백 변경 **layout 재계산**      |
| `background-color`, `color`, `border-color` | 색상 변화 **paint 단계 필요**         |
| `border`, `box-sizing`                      | 테두리 변화 **layout & paint** 영향   |
| `font-size`, `line-height`                  | 텍스트 레이아웃 변화 **layout** 영향  |

### (주의) 브라우저 호환성

- `will-change`: IE와 Edge 18 이하 미지원
- `backdrop-filter`: Firefox에서 기본 비활성화
- `transform-style: preserve-3d`: 일부 모바일 브라우저에서 부분 지원

자세한 호환성 정보는 [Can I Use](https://caniuse.com)에서 확인.

---

## 2. 비디오(<video>) 및 캔버스(<canvas>)

`<video>` 태그로 재생되는 비디오는 대부분 GPU 디코딩을 사용한다.

`<canvas>`의 경우 WebGL을 사용하는 `<canvas>`는 GPU 가속이 기본으로 활성화되고, WebGL이 사용되지 않는 일반 `<canvas>`는 성능, 해상도, 변경 빈도 등에 따라 자동 GPU 승격 여부가 판단된다.

## 3. WebGL 및 3D 그래픽 렌더링

WebGL은 브라우저에서 OpenGL ES 기반의 3D 그래픽을 처리할 수 있게 해주는 API이다. GPU가 정점 셰이더/프래그먼트 셰이더 등을 통해 직접 연산한다.

예) Three.js, Babylon.js, PlayCanvas 같은 3D 라이브러리 기반 앱

### WebGL 코드 예시

```javascript
// WebGL 컨텍스트 생성
const canvas = document.createElement("canvas");
const gl = canvas.getContext("webgl");

// GPU 가속을 활용한 3D 렌더링 예시
if (gl) {
  // 버텍스 셰이더와 프래그먼트 셰이더 컴파일
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  // 셰이더 프로그램 생성 및 GPU에 전달
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // GPU 메모리에 버퍼 생성
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // GPU에서 실행될 셰이더 프로그램 활성화
  gl.useProgram(program);
}
```

위 코드에서 `canvas.getContext('webgl')`는 WebGL 컨텍스트를 생성하는 부분이다.
(실제로 GPU 가속을 활용하기 위해서는 브라우저, 그래픽 카드, 드라이버가 모두 WebGL을 지원해야 한다.)

WebGL을 통한 GPU 병렬 처리는 다음과 같은 과정으로 이루어진다.

1. GPU 메모리에 셰이더 프로그램을 로드
2. 버텍스 데이터를 GPU 버퍼에 저장
3. GPU에서 직접 셰이더 프로그램을 실행하여 렌더링

예시 코드를 보면 이러한 과정이 잘 드러난다. 먼저 WebGL 컨텍스트를 생성하고, 버텍스와 프래그먼트 셰이더를 컴파일한 후, 셰이더 프로그램을 생성하여 GPU에 전달한다. 그리고 GPU 메모리에 버퍼를 생성하고 셰이더 프로그램을 활성화하는 과정을 거친다.

이런 방식으로 CPU 대신 GPU의 병렬 처리 능력을 활용하면 복잡한 그래픽 작업을 훨씬 효율적으로 처리할 수 있다.

> 💡 참고: WebGL이 지원되지 않는 환경을 대비해 `getContext('webgl')`이 실패하면 `getContext('2d')`로 폴백하는 방어 코드를 작성하는 것이 좋다.

### **WebGPU (차세대 GPU API)**

- WebGL의 후속 기술로, 더 낮은 수준의 GPU 제어가 가능하다.
- 더 효율적인 GPU 자원 활용과 현대적인 그래픽 기능을 제공한다.
- 아직은 실험적 기능이지만, 차세대 웹 그래픽의 표준이 될 것으로 기대됨.

---

## GPU 가속의 오해와 주의점

`translateZ(0)`을 사용하면 요소가 GPU 레이어로 분리될 가능성이 높아진다. 이 덕분에 `transform`, `opacity` 기반의 애니메이션이 더 부드럽게 작동하게 된다. 그래서 초기에 성능 최적화 목적이나 그래픽 깨짐 방지를 위해 많이 사용하게 된다.

비슷하게 `will-change`도 브라우저에 해당 속성이 곧 변경될 것이라는 힌트를 주어, 미리 최적화 준비를 하게 만든다. 둘 다 GPU 가속을 유도하는 데 효과적이지만, 실제로 GPU 레이어로 분리되는지는 브라우저가 내부적으로 판단하기 때문에 **무조건 적용된다고 보장할 수는 없다**.

또한 너무 많은 요소에 `translateZ(0)`이나 `will-change`를 남용하면 GPU 메모리를 불필요하게 소비하게 되고, 성능이 저하될 수도 있다. 따라서 실제로 애니메이션이 발생하는 **핵심 요소에만 제한적으로 적용하는 것이 좋다**.

---

## DevTools로 GPU 가속 확인하는 방법

### 1. **Chrome → Rendering → Layer Borders 표시**

- GPU 레이어는 네온 그린 테두리로 표시된다. Chrome DevTools의 Rendering 탭에서 이 기능을 활성화하면 GPU 가속 레이어를 시각적으로 확인할 수 있다.

### 2. **about:gpu**

- 브라우저 주소창에 `about:gpu`를 입력하면, 현재 브라우저에서 GPU 가속이 활성화되어 있는지 확인할 수 있다. 실행하면 브라우저의 GPU 가속 상태와 하드웨어 정보가 상세히 나타난다.

### 3. **Performance 패널**

- **Performance 패널**에서 프레임 타임을 분석하고 Composite 단계를 확인할 수 있으며, FPS 측정을 통해 애니메이션 성능 문제를 파악하는 데 도움을 준다.

### 4. **기타 도구**

- 성능 모니터(Performance Monitor)와 Task Manager(Shift+Esc)를 사용하여 GPU 메모리 사용량을 실시간으로 모니터링하고, 불필요한 레이어를 확인하며 애니메이션 최적화 상태를 점검할 수 있다.
- 맥에서 Task Manager 방법은 상단 매뉴에서 '창 > 작업관리자(Task Manager)' 선택

---

## 마무리

GPU 가속을 고려하지 않고 개발해도 대부분의 경우 큰 문제가 발생하지 않아서 깊이 있게 알아보지 않았다. 그러나 이번 기회를 통해 브라우저가 자동으로 처리하는 데에도 한계가 있다는 점을 자세히 알 수 있었다. 특히, `translateZ(0)`와 `will-change` 속성이 GPU 가속을 유도하지만, 반드시 보장하지 않는다는 점도 처음 알게 되었다. GPU 가속의 원리를 이해하고, 각 속성들이 어떤 구조와 상황에서 GPU가 개입되는지 알고 개발을 할 때 좀더 고수준의 최적화를 할 수 있을 것으로 기대가 된다.

---

## 참고 문서

- [Chrome의 가속 렌더링 - web.dev](https://web.dev/articles/speed-layers?hl=ko)
- [GPU Accelerated Compositing in Chrome - The Chromium Projects](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/)
- [하드웨어 가속에 대한 이해와 적용 (D2)](https://d2.naver.com/helloworld/2061385)
- [LIFE OF A PIXEL(영상)](https://www.youtube.com/watch?v=K2QHdgAKP-s)
