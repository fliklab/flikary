---
author: Flik
pubDatetime: 2025-03-08T07:02:00Z
title: "AI를 활용하여 2024년의 내 코드 돌아보기"
slug: retro-codes-2024-with-ai
featured: true
draft: false
tags:
  - AI
  - 회고
  - Diary
description: 2024년에 작성한 코드를 주제별로 되돌아보고, 그 과정에서 AI를 어떻게 활용했는지를 이야기합니다.
---

## 서론

이번에 개발블로그 모임 <오늘은써야지>에 참여하면서 2024년에 작성한 코드를 돌아보는 시간을 가지게 되었다. 이 글에서는 내가 작성한 코드를 주제별로 되돌아보고, 그 과정에서 AI를 어떻게 활용했는지를 이야기하고자 한다.

## <1> 2024년 얼마나 코딩했을까?

코드를 되돌아보기에 앞서, 1년간 코드를 얼마나 어떻게 작성했는지 한번 대략적으로 확인해보고 싶었다.

2024년 동안의 월별 커밋 수와 변경된 라인 수를 분석하여, 어떤 시점에 많은 작업이 이루어졌는지를 한 눈에 알 수 있었다.
(회사에서 주로 작업한 레포의 main 브랜치 기준)

![](@assets/images//retro-codes-2024-with-ai/2025-03-09-18-22-22.png)

12월에는 일을 안한 것 처럼 보이지만, 변명을 하자면 12월에는 장기적으로 진행된 PR이 있어 main에 머지가 안되고 있어서 집계가 되지 않았던 것이다. 6-7월은 반대로 장기적으로 진행하던 PR이 머지되면서 코드 수정이 많이 집계되었던 것 같다.

#### AI에게 부탁하기: 년간 커밋 수

일단 위의 그래프를 그릴 수 있었던 방법부터 이야기해보려고 한다. 사실 위에 보여드린 그래프를 만드는데에는 cursor와 gpt의 도움을 많이 받았다.

git 명령어를 활용하면 뭔가 방법이 있을 것 같은데, git 명령어에 능숙한 편은 아니라서 cursor에게 한번 냅다 요청해 보았다.

```
프롬프트: 2024년에 발생한 전체 커밋 개수, Flik이 작성한 커밋 개수를 찾아줘
```

커서가 예상대로 git 명령어를 사용하는 쪽으로 생각을 전개했고, 생각보다 쉽게 한 해동안 작성한 커밋 수를 얻을 수 있었다.

![](@assets/images/retro-codes-2024-with-ai/2025-03-09-18-23-00.png)

![](@assets/images/retro-codes-2024-with-ai/2025-03-09-18-23-17.png)

#### 더 나아가기: 년간 커밋 수와 라인 수

앞서 확인한 연간 전체 커밋 수를 보니 좀더 자세히 알고 싶은 마음이 생겼다. 커밋 수가 곧 코드의 양을 대변하는건 아니기 때문이다. 커밋이 적어도 라인 수가 많을 수도 있으니까.

그래서 이어서 월별 커밋 수, 월별 수정한 line 수를 확인하기를 요청했고, 몇번의 시도 끝에 결과를 얻을 수 있었다.

```
프롬프트: 2024년 1~12월까지 각 월마다 발생한 총 커밋수, Flik이 작성한 커밋 수를 각각 체크해줘. (main 브랜치 기준)
```

```
프롬프트: 각 커밋별로 line을 반영해서 2024년에 월별로 Flik이 작성한 커밋 수, line수 통계를 볼 수 있게 스크립트를 작성해줘.
```

![](@assets/images/retro-codes-2024-with-ai/2025-03-09-18-23-28.png)

```bash
## 레포에서 발생한 모든 커밋
total_all=$(git log --since="2024-01-01" --until="2024-12-31" --oneline | wc -l | xargs)

## 내가 작성한 커밋만 추리기
flik_1_all=$(git log --since="2024-01-01" --until="2024-12-31" --author="Flik1 <xxxxx@gmail.com>" --oneline | wc -l | xargs)
flik_2_all=$(git log --since="2024-01-01" --until="2024-12-31" --author="Flik2 <xxxxx@users.noreply.github.com>" --oneline | wc -l | xargs)
flik_total_all=$((flik_1_all + flik_2_all))

## 1년간 작성한 커밋 수와 전체 커밋 대비 비율 확인
percentage_all=$(echo "scale=1; $flik_total_all * 100 / $total_all" | bc); echo "연간 총계 | $total_all | $flik_total_all | ${percentage_all}%"
```

#### 월별로 작성했던 커밋량을 확인할 수 있는 스크립트

```bash
## 월별로 작성한 커밋 수 확인
echo "월 | 전체 커밋 수 | Flik 커밋 수 | 비율" && echo "--- | --- | --- | ---" && for month in {01..12}

do total=$(git log --since="2024-$month-01" --until="2024-$month-31" --oneline | wc -l | xargs)

flik_1=$(git log --since="2024-$month-01" --until="2024-$month-31" --author="Flik1 <xxxxx@gmail.com>" --oneline | wc -l | xargs)

flik_2=$(git log --since="2024-$month-01" --until="2024-$month-31" --author="Flik2 <xxxxx@users.noreply.github.com>" --oneline | wc -l | xargs)

flik_total=$((flik_1 + flik_2))

percentage=0

if [ $total -ne 0 ]
then percentage=$(echo "scale=1; $flik_total * 100 / $total" | bc)
fi

echo "$month월 | $total | $flik_total | ${percentage}%"
done
```

## <3> 어느 코드를 되돌아볼까?

한 해동안 작성한 코드를 모두 다 하나하나 읽어보는 것은 불가능하다고 본다.

기억에 의존하여 중요한 코드를 직접 되돌아볼 수도 있지만, 좀더 효과적으로 코드를 되돌아볼 수 있는 방법이 없을까 고민하다가 이번에도 GPT와 Cursor를 활용하게 되었다.

```
프롬프트: 내가 작년에 작성한 코드를 되돌아보려고 한다.
되돌아볼 수 있는 유형을 추려서, 그 유형에 해당되는 코드를 선정하려고 한다.(ex. 반복적으로 쓰이는 부분을 합치기, 하나의 함수나 컴포넌트를 여러개로 나누기, 불필요한 iteration을 줄이기 ...)
예시로 제시한 유형 외에도 생각해볼 수 있는 주제들을 30개 이상 제안해줘.
대부분의 코드는 React, React Native로 작성된 점을 참고.
```

이렇게 물어본 결과, 생각보다 괜찮은 주제를 많이 찾을 수 있었다. 전부 다 다루기에는 너무 방대했기 때문에 관심 있어 보이는 주제들을 좀 더 추리는 작업을 했었다.

- **반복되는 로직을 커스텀 훅(Custom Hook)으로 분리하기**
- **하나의 함수나 컴포넌트를 여러 개로 나누어 SRP(Single Responsibility Principle) 적용하기**
- **관련된 상태와 로직을 하나의 Context로 묶기**
- **불필요한 state 업데이트 방지하기 (ex. `useState`를 `useRef`로 변경)**
- **불필요한 re-render 방지를 위해 `memo` 또는 `useMemo` 사용하기**
- **컴포넌트에서 useEffect를 최소화하고, `useLayoutEffect`를 적절히 활용하기**
- **불필요한 API 호출 줄이기 (useEffect 내부에서 의존성 최적화)**
- **불필요한 데이터 매핑(`map`, `filter`, `reduce` 등) 줄이기**
- **Form 입력 검증 로직을 개선하고, `react-hook-form` 등 사용 고려하기**
- …

---

## <3> 진짜로 코드 되돌아보기

이제는 본격적으로 코드를 돌아보기 위해서 cursor에게 각 주제별로 해당되는 케이스를 찾아달라고 요청해 보았다.

처음에는 그냥 한번에 글감을 찾아달라고 요청했는데, 좀 아쉬움이 많았다.

```
프롬프트: 코드 개선을 주제로 하는 글의 글감이 될 만한 코드를 찾아줘.
```

그래서 아래처럼 특정 관점으로 제한해서 코드를 검토해달라고 할 때 좀 더 괜찮은 대답을 얻을 수 있었다.

코드 탐색의 기준을 매번 개별적으로 제시하면 번거롭기는 했지만, 그렇게 하는 게 좀 더 좋은 대답을 얻을 수 있었다.

```
프롬프트: 작년에 Flik이 작성한 코드 중에서, "**반복되는 로직을 커스텀 훅(Custom Hook)으로 분리하기**"의 관점에서 되돌아보고 개선해볼 수 있는 코드를 제안해줘.
```

아래처럼 구체적인 코드를 언급하면서 개선점을 제시하는 답변을 받을 수가 있었다.

![](@assets/images/retro-codes-2024-with-ai/2025-03-09-18-23-50.png)

제안된 내용들은 간단한 개선들이 많았다. 내가 작성한 코드에 뻔한 문제가 있다는 사실에 부끄러웠지만 앞으로 작성할 때에 의식적으로 신경을 더 쓰게 될 것 같아서 유익했다.

이 글에선 구체적인 개선 내용을 다 다루지는 않으려고 한다.

### (1) **불필요한 useEffect 줄이기**

아래 작성된 hook에서는 비슷한 작업(라이브 퇴장)을 수행하는 세 개의 별도 useEffect가 있다. 이로 인해 코드 중복이 발생하고, 관련 로직이 분산되어 있어 이해하기 어렵다.

```tsx
const useAutoLeave = () => {
  // 차단된 경우 자동 퇴장
  useEffect(() => {
    if (isBlocked) {
      exit();
      showToast("입장할 수 없습니다");
    }
  }, [isBlocked, exit, showToast]);

  // 자신의 세션에 잘못 입장한 경우 자동 퇴장
  useEffect(() => {
    if (isOwnSession) {
      exit();
      showOptions();
    }
  }, [isOwnSession, exit, showOptions]);

  // 이미 종료된 세션일 경우 자동 퇴장
  useEffect(() => {
    if (isEnded) {
      exit();
      showToast("종료된 세션입니다");
    }
  }, [isEnded, exit, showToast]);
};
```

```tsx
const useAutoLeave = () => {
  useEffect(() => {
    // 차단된 경우 자동 퇴장
    if (isBlocked) {
      exit();
      showToast("입장할 수 없습니다");
      return;
    }

    // 자신의 세션에 잘못 입장한 경우 자동 퇴장
    if (isOwnSession) {
      exit();
      showOptions();
      return;
    }

    // 이미 종료된 세션일 경우 자동 퇴장
    if (isEnded) {
      exit();
      showToast("종료된 세션입니다");
    }
  }, [isBlocked, isOwnSession, isEnded, exit, showToast, showOptions]);
};
```

#### (2) **불필요한 데이터 매핑(`map`, `filter`, `reduce` 등) 줄이기**

아래 코드는 여러 상품의 가격의 총합을 보여주기 위한 코드인데, map과 reduce가 연달아 사용하고 있다. 그런데 사실은 한 번의 reduce를 사용하여 작성할 수 있는 코드였다.

또 컴포넌트 내에서 인라인으로 map, reduce를 사용하면서 컴포넌트가 렌더링될 때마다 동일한 계산을 반복하면서 비효율적으로 동작하게 되는데, 이런 부분은 useMemo로 감싸면서 최적화할 수 있었다.

```tsx
// 기존 코드
const Total: React.FC = ({...})=>{
	(...)
	return (
		<Text
		  style={fonts.Text16BoldWhiteRight}
		  allowFontScaling={false}
		>
		  {totalPrice?.toLocaleString() ??
		    items
		      .map(item =>
		        typeof item.price === 'number' ? item.price : 0,
		      )
		      .reduce((prev, next) => prev + next, 0)
		      .toLocaleString()}
		  원
		</Text>
	)
}
```

```tsx
// 개선된 코드

// 가격 합계 미리 계산
const calculatedTotalPrice = useMemo(() => {
  if (totalPrice !== undefined) return totalPrice;

  return items.reduce(
    (total, item) => total + (typeof item.price === 'number' ? item.price : 0),
    0
  );
}, [items, totalPrice]);

return (
  // 생략...
  <Text
    style={fonts.Text16BoldWhiteRight}
    allowFontScaling={false}
  >
    {calculatedTotalPrice.toLocaleString()}원
  </Text>

// 생략...

```

### AI는 만능일까?

사실 이 글에서 다룬 AI의 대답이 한번에 술술 나왔던 것은 아니다. 첫 질문에는 높은 확률로 엉뚱한 대답을 했고, 질문의 범위를 제한하거나 구체적인 요구를 하면서 점점 내가 원하는 답변을 주도록 유도했다. 그래서 주제별로 해당되는 코드를 찾아달라고 하는 게 낫겠다고 생각이 되었다.

이렇게 AI에게 어떤 방식으로 질문을 바꾸어서 던질지에 대한 결정은 AI가 아닌 인간의 결정을 따른다. 그러니까 아직까지 AI가 만능은 아니라는 것이다.

같은 GPT도 어떻게 사용하는지에 따라 활용도가 다른데, 잘 활용하는 능력이나 아직 미지의 영역에 가까운 것 같다.

그래서 별거 아닐 수도 있지만 이번 글을 읽는 사람에게도 어떤 인사이트가 되길 바라며 활용하는 과정을 다루어 보았다.

## 마무리

사실 이번 작업에서 cursor가 레포지토리 전체를 100% 다 확인하지는 못하는 것 같았다. 연간 작성한 코드를 리뷰하기에는 너무 방대하기 때문에 그러지 않았을 것이다.

하나의 Feature 개발 혹은 특정 폴더나 특정 기능을 제한하는 식으로 범위를 좁혀서 리뷰를 요청한다면 좀 더 효과적으로 리뷰를 할 수 있겠다는 생각이 든다.

AI를 활용한 코드 리뷰는 솔직히 엄청 효과적이진 않았다. 그래도 이전에는 AI를 활용해서 코드 리뷰를 하려는 시도 자체를 적극적으로 하지 못했는데 앞으로 종종 시도는 해보면 좋겠다고 생각하며 글을 마친다.
