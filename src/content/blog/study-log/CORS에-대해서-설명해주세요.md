---
author: Flik
pubDatetime: 2025-03-26T15:27:03.000+09:00
modDatetime: 2025-03-26T15:27:03.000+09:00
title: CORS에 대해서 설명해주세요
slug: cross-origin-resource-sharing
featured: false
draft: true
tags:
  - 기술면접
description: CORS에 대한 기술면접 질문
---

# 답변

```

CORS는 Cross Origin Resource Sharing의 약자입니다.
교차출처의 리소스를 안전하게 요청하는 방식입니다.

기본적으로 브라우저는 보안상, 다른 출처의 리소스 요청을 제한합니다.
브라우저는 cross-origin 요청 시 특별한 헤더를 포함하여 보내면, 서버에서  Access-Control-Allow-Origin 헤더로 응답하게 됩니다.

이를 위해 실제 요청 전에 OPTIONS 메소드로 서버에서 교차출처 요청을 허용하는지 파악하게 되는데 이것을 preflight 요청이라고 합니다.

```

# AI 피드백

```
답변에 대한 피드백입니다:

1. 기본 개념이 불완전합니다.
   - CORS는 "Cross-Origin Resource Sharing"의 약자입니다
   - 웹 브라우저에서 다른 출처(Origin)의 리소스를 안전하게 요청할 수 있도록 하는 메커니즘입니다

2. 주요 개념을 정확히 이해해야 합니다:

   Origin(출처)의 구성 요소:
   - Protocol(http, https)
   - Host(domain)
   - Port number

   Same-Origin Policy:
   - 기본적으로 브라우저는 다른 출처의 리소스 요청을 제한
   - 보안을 위한 중요한 정책

3. CORS 동작 방식:
   - 브라우저는 cross-origin 요청 시 특별한 헤더를 포함
   - 서버는 Access-Control-Allow-Origin 등의 헤더로 응답
   - 브라우저는 서버의 응답 헤더를 확인하여 요청 허용 여부 결정

4. 추가로 알면 좋은 내용:
   - Preflight Request: OPTIONS 메서드로 실제 요청 전 서버 허용 여부 확인
   - Simple Request: 특정 조건을 만족하는 경우 Preflight 없이 직접 요청
   - Credentials: 쿠키나 인증 정보를 포함한 요청 처리
   - 실제 보안은 서버 측에서 이루어져야 함

5. 해결 방법:
   - 서버 측: 적절한 CORS 헤더 설정
   - 프록시 서버 사용
   - 환경에 따라 webpack dev server 설정


```
