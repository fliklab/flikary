---
author: Sat Naing
pubDatetime: 2023-12-07T08:47:16+09:00
modDatetime: 2023-12-07T08:47:27+09:00
title: 예제와 함께 React Native Reanimated v3 기본 개념 파악하기(처음 사용하기 위한 가이드)
slug: reanimated-basic-example
featured: true
draft: false
tags:
  - react native
  - reanimated
description:
  React Native Reanimated의 기본 개념과 예제를 소개합니다. React Native Reanimated를 처음 사용하는 사람들을 위한 가이드입니다. React Reanimated는 React Native에서 고성능 애니메이션과 인터랙션을 구현하기 위한 라이브러리입니다. React Native Reanimated를 비롯하여 애니매이션 구현을 다루는 자료가 풍부하지 않기에 이 가이드를 작성하였습니다.  
---

참고: 이 글은 [React Native Reanimated v3](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/ 'React Native Reanimated v3')을 기반으로 작성되었으나 v2에서도 호환됩니다.

## React Native Reanimated란 무엇인가?

**React Native Reanimated**는 React Native에서 고성능 애니메이션과 인터랙션을 구현하기 위한 라이브러리입니다. React Native에 Animated 라이브러리가 있지만 **Reanimated**는 JavaScript 스레드 대신 UI 스레드에서 애니메이션을 실행하기 때문에 성능상으로 유리합니다.
이 때문에 Reanimated로 구현한 애니매이션은 Animated로 구현한 애니매이션보다 더 부드럽고 일관된 애니메이션 경험을 제공합니다.

이러한 장점 때문에 RN에서 사용할 수 있는 애니매이션 라이브러리 중 가장 성능이 좋은것으로 알려져 있습니다. 다만 RN에서의 애니매이션 구현을 다루는 가이드 자료가 풍부하게 나와있지 않기에 제대로 학습하고 활용하는데까지는 많은 경험을 필요로 합니다.
게다가 **Reanimated**가 Animated와 비슷하게 생겼지만 약간 다른 문법을 사용하기 때문에 처음 접하는 사람들은 헷갈리기가 쉽습니다. 그래서 이 가이드를 작성하게 되었습니다. 이 가이드는 React Native Reanimated 라이브러리에 대한 소개로 시작하여 주요 개념과 이해를 돕기 위한 예제 코드로 구성됩니다. 가이드가 완벽하지 않을 수 있지만 점차 개선해 볼 생각입니다. 도움이 되길 바랍니다.

## 핵심 원리

### 선언적(Declarative) 애니메이션

Reanimated는 선언적 접근 방식을 사용하여 애니메이션을 정의합니다. 이는 애니메이션의 최종 상태를 선언하고, 라이브러리가 그 상태에 도달하는 방법을 결정하게 합니다. 애니메이션의 각 단계를 명시적으로 정의하지 않아도 되므로, 애니메이션을 더 쉽게 구현할 수 있습니다.

### UI 스레드에서의 실행

애니메이션 계산이 JavaScript 스레드가 아닌 UI 스레드에서 직접 이루어져 애플리케이션의 성능에 영향을 덜 미칩니다.
JavaScript 스레드와 UI 스레드에 대한 내용은 React Native의 핵심 원리에 해당하므로 자세한 내용은 [RN 문서(Threading Model)](https://reactnative.dev/architecture/threading-model 'Threading Model')를 참고하길 바랍니다.

### 주요 용어 및 개념

**SharedValue**: 애니메이션 상태를 저장하는 데 사용되는 변수입니다. SharedValue의 변화는 애니메이션을 트리거할 수 있습니다. `useSharedValue()` 함수를 사용하여 정의합니다.

**AnimatedStyle**: 스타일 속성을 애니메이션화하기 위해 사용됩니다. 이는 컴포넌트에 적용되어 시각적 변화를 만듭니다. `useAnimatedStyle()` 함수를 사용하여 정의합니다.

**[Worklet](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary/#worklet 'Worklet')**: JavaScript 코드를 UI 스레드에서 실행할 수 있게 해주는 함수입니다. Reanimated에서 애니메이션 로직은 대부분 worklet 내에서 실행됩니다.

## 코드와 함께 알아보기

### 1. 첫 번쩨 예제

첫번째 예제를 보면서 좀더 알아보겠습니다. 버튼을 누르면 오른쪽으로 100만큼 이동하는 박스를 구현하는 방법을 보겠습니다.

- 이 예시에서 `offset`은 SharedValue로, 움직이는 박스의 x좌표를 저장합니다.
- `useAnimatedStyle`은 `offset`의 변화를 감지하고, `offset`의 값에 따라 `transform` 스타일 속성을 업데이트합니다.
- `withSpring`은 애니메이션을 트리거하는 함수로, `offset`의 값을 0에서 100으로 스무스하게 변화시킵니다.
- Animated Component에서만 애니매이션을 적용할 수 있습니다. reanimated에서 import한 `Animated.View`, `Animated.Text`, `Animated.ScollView` 등을 사용해야 합니다.

```javascript
import { View, Button } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'

const ExampleComponent = () => {
  const offset = useSharedValue(0) // 초기값이 0인 SharedValue를 생성합니다.

  // 움직이는 박스의 스타일을 정의합니다.
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    }
  })

  return (
    <View>
      <Animated.View style={animatedStyles} />
      <Button
        title="Move"
        onPress={
          // 버튼을 누를 때 offset의 값이 100으로 변하게 합니다.
          () => (offset.value = withSpring(100))
        }
      />
    </View>
  )
}
```

이 예시를 조금 더 자세히 짚어 보겠습니다.

`useSharedValue`는 애니메이션 상태를 저장하는 데 사용되는 변수를 정의합니다.

```
const offset = useSharedValue(0);
```

`useAnimatedStyle`은 애니메이션 스타일을 정의하기 위해 사용되는 React Hook입니다.
useSharedValue로 생성한 변수의 변화를 감지하고, 그에 따라 스타일을 업데이트합니다.
`offset.value`로 사용해야 한다는 점을 주의하세요. (React의 Ref를 사용하는 것과 비슷합니다.)

```javascript
const animatedStyles = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: offset.value }],
  }
})
```

여기서는 transform 스타일 속성을 사용하여 움직이는 박스의 x좌표를 업데이트하고 있지만 다른 스타일 속성도 사용할 수 있습니다.
예를 들면 `opacity`를 사용하여 페이드 인/아웃 애니메이션을 구현할 수 있습니다.

```javascript
const animatedStyles = useAnimatedStyle(() => {
  return {
    opacity: offset.value, // 페이드 인아웃 애니메이션
  }
})
```

`withSpring`은 애니메이션을 트리거하기 위해 사용되는 함수입니다.

```javascript
;() => (offset.value = withSpring(100))
```

혼동하기 쉬운 것은 `withSpring(100)`를 단지 실행하는것이 아니라 이 값을 `offset.value`에 할당한다는 것입니다.

이 밖에도 `withTiming`, `withDecay`, `withRepeat` 등 다양한 애니메이션을 트리거하는 함수가 있습니다.
이들은 값이 변하는 방식에 차이가 조금씩 있는데 이들 차이에 대해서는 다른 예시와 함께 또 알아보겠습니다.

---

### 2. Entering/Exiting 애니매이션 예제

**Entering, Exiting 애니매이션**은 컴포넌트가 화면에 추가되거나 제거될 때 애니매이션을 트리거 하는 애니매이션입니다. 정학히는 Layout Animation의 일종입니다.
예를 들어 화면에 등장하면서 페이드 인 애니매이션을 구현하고, 화면에서 사라지면서 페이드 아웃 애니매이션을 구현할 수 있습니다.

먼저, `useAnimatedStyle`를 사용하여 페이드 인/아웃 애니매이션을 구현하는 예시를 보겠습니다.
아래 예시에서는 useEffect를 사용하여 컴포넌트가 화면에 등장할 때 페이드 인 애니매이션을 트리거합니다.

```javascript
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

const FadeComponent = () => {
  const opacity = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  return <Animated.View style={[styles.box, animatedStyles]} />
}

useEffect(() => {
  // 화면이 로드될 때 페이드 인 애니매이션을 트리거합니다.
  opacity.value = withTiming(1, { duration: 1000 })
  return () => {
    // 화면에서 사라질 때 페이드 아웃 애니매이션
    opacity.value = withTiming(0, { duration: 1000 })
  }
}, [])
```

Entering과 Exiting을 사용하여 구현하면 아래처럼 훨씬 간단한 것을 볼 수 있습니다.

```javascript
import { FadeIn, FadeOut } from 'react-native-reanimated'

function App() {
  return <Animated.View style={styles.box} entering={FadeIn} exiting={FadeOut} />
}
```

Entering, Exiting으로 정의된 애니매이션은 코드상으로 간단할 뿐만 아니라 UI 스레드에서 실행되기 때문에(Layout Animation 방식) 성능상으로도 더 좋습니다.

이번 예제에서는 `FadeIn`, `FadeOut` 을 사용했지만 Fade, Bounce, Flip, Slide, Zoom 등의 자주 사용되는 애니매이션 효과는 Reanimated에 기본으로 제공합니다.
[Entering/Exiting animations](https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/ 'Entering/Exiting animations')에서 제공하는 기본 애니매이션을 확인할 수 있습니다.

더 나아가서 Keyframe을 활용하여 Entering/Exiting 애니매이션을 직접 정의하거나, Layout Transiton을 활용하여 더 복잡한 상황에서의 Layout Animation을 구현할 도 있는데 이 부분은 [Layout Animation](https://docs.swmansion.com/react-native-reanimated/docs/category/layout-animations 'Layout Animations')에서 더 확인해 보시길 바라며 넘어가 보겠습니다.

---

### 3. 드래그 앤 드롭 애니매이션

이번에는 `PanGestureHandler`를 함께 사용하여 드래그 앤 드롭에 따라 움직이는 박스를 구현하는 예시를 보겠습니다.

```javascript
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'

const DragComponent = () => {
  const offsetX = useSharedValue(0)
  const offsetY = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
    }
  })

  return (
    <PanGestureHandler onGestureEvent={gestureEvent}>
      <Animated.View style={[styles.box, animatedStyles]} />
    </PanGestureHandler>
  )
}
```

---

### 4. 무한 반복 애니매이션

`withRepeat` 함수를 사용하여 애니매이션을 무한 반복할 수 있습니다. 이것을 활용해서 진동 및 반복 애니메이션을 구현할 수 있는데, 예를 들면 계속 회전하는 로딩 스피너를 구현할 수 있습니다.

```javascript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSpring,
} from 'react-native-reanimated'

const LoadingSpinner = () => {
  const rotation = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    }
  })

  useEffect(() => {
    rotation.value = withRepeat(withSpring(360), -1)
  }, [])

  return <Animated.View style={[styles.box, animatedStyles]} />
}
```

---

### 5. 애니메이션과 상태 관리

아래 예시는 상태에 따라서 애니매이션을 트리거하는 예시입니다.
Redux로 관리되는 `appState.isVisible`의 값에 따라 true이면 페이드 인 애니매이션을 트리거하고, false이면 페이드 아웃 애니매이션을 트리거합니다.

```javascript
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useSelector } from 'react-redux'

const StateManagedComponent = () => {
  const opacity = useSharedValue(0)
  const appState = useSelector((state) => state.appState)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: appState.isVisible ? withTiming(1) : withTiming(0),
    }
  })

  return <Animated.View style={[styles.box, animatedStyles]} />
}
```

---

### 6. 스크롤 애니매이션

이번에는 스크롤을 함에 따라 변하는 애니매이션을 구현해보겠습니다. 스크롤 이벤트를 감지하고 해당 위치에 따라 애니메이션 상태(예: 위치, 투명도)를 업데이트하는 애니매이션을 구현할 수 있습니다.

- SharedValue 사용: 스크롤 위치를 저장하고 추적하기 위해 Reanimated의 SharedValue를 사용합니다.
- `useAnimatedScrollHandler`: 스크롤 이벤트를 처리하기 위해 Reanimated의 `useAnimatedScrollHandler`를 사용합니다.
- `useAnimatedStyle`: 스크롤 위치에 따라 스타일을 동적으로 업데이트하기 위해 `useAnimatedStyle`을 사용합니다.

```javascript
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from 'react-native-reanimated'

const ScrollExample = () => {
  const sharedValue = useSharedValue(0)

  // 스크롤 이벤트에 따라 sharedValue 값을 업데이트하는 Handler.
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      sharedValue.value = event.contentOffset.y
    },
  })

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const headerHeight = 200 - sharedValue.value // 기본 높이에서 스크롤 양만큼 빼기
    return {
      height: headerHeight > 100 ? headerHeight : 100, // 최소 높이 설정
    }
  })

  return (
    <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
      <Animated.View style={[styles.header, animatedHeaderStyle]} />
      {/* 컨텐츠 */}
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: 'blue',
    // 초기 높이 설정
    height: 200,
  },
})
```

`useSharedValue`로 변하는 값을 정의하고 `useAnimatedStyle`을 사용하여 애니매이션 스타일을 정의하는 점은 기존 예시와 동일합니다.
기존 예시와 다른점은 애니매이션을 트리거하는 것이 스크롤 이벤트라는 점입니다. 스크롤 이벤트의 onScroll에 `useAnimatedScrollHandler()`로 정의한 `scrollHandler`를 넣어줍니다.

`useAnimatedScrollHandler`는 스크롤 이벤트를 감지하고 `sharedValue` 값을 업데이트합니다.
`useAnimatedStyle`로 정의된 `animatedHeaderStyle`은 `sharedValue` 값이 변함에 따라 헤더의 높이를 동적으로 변경합니다.
이렇게 하면 스크롤에 따라 헤더의 크기가 자연스럽게 조절됩니다.

---

### 7. 애니매이션이 끝날 때 콜백 실행하기

애니매이션이 끝날때 특정 콜백을 실행하는 경우가 종종 있습니다. 예를 들어 애니매이션이 끝날 때 상태를 업데이트하고 싶은 경우에 사용할 수 있습니다.
이런 경우에 `RunOnJS`를 사용하면 JavaScript 함수를 UI 스레드에서 실행하도록 할 수 있습니다. React의 상태 관리를 위해 종종 사용됩니다.

다음 예시는 화면에서 컴포넌트가 사라지고나면 isVisible을 false로 업데이트합니다.

```javascript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'

const FadeComponent = () => {
  const opacity = useSharedValue(0)
  const isVisible = useSharedValue(true)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  useEffect(() => {
    if (!isVisible.value) {
      // 애니매이션이 끝나면 isVisible을 false로 업데이트합니다.
      runOnJS(setIsVisible)(false)
    }
  }, [isVisible])

  return <Animated.View style={[styles.box, animatedStyles]} />
}
```

`RunOnJS`가 사용되는 방식에 유의하시기 바랍니다. 첫번째 괄호안에 함수가 들어가고 그 다음 괄호에 함수의 인자가 들어가는 고차함수 형태로 사용됩니다.

```javascript
runOnJS(setIsVisible)(false)
```

---

### 더 알아볼만한 것들

- `withDelay`: 애니매이션을 지연시킵니다.
- `withSequence`: 애니메이션을 순차적으로 실행합니다.
- `withTimingTransition`: 애니메이션을 트리거합니다.
- `cancelAnimation`: 애니메이션을 취소합니다.
- `measure`: 컴포넌트의 크기를 측정합니다.

더 많은 자료는 Software Mansion의 [공식 문서](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/ 'Software Mansion, React Native Reanimated') 를 참고하세요.
