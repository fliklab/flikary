---
layout: ../layouts/ResumeLayout.astro
email: jsh852@gmail.com
region: 서울시 마포구
github: fliklab
website: https://flikary.dev
nickname: Flik
title: Resume
subtitle: "프론트엔드 개발자"
summary: 소규모 스타트업에서 서비스의 런칭과 성장을 함께하며 팀의 비즈니스 목표를 달성한 경험이 있습니다. 뭐든지 만들어 보고 실험하면서 더 나은 것을 만들어내는 과정에서 기쁨을 느낍니다.
skills:
  - tag:
      - React Native
      - React.js
      - Next.js
      - Typescript
      - Javascript
education:
  - degree: 학사
    school: 중앙대학교
    location: 서울캠퍼스
    startDate: 2011.03
    endDate: 2020.02
    major: 전자전기공학/디지털이미징공학(복수전공)
    description: 자료구조, 데이터베이스, 그래픽스, 컴퓨터비전 등 컴퓨터공학 전공과목 이수 (총 145학점 중 50학점)
works:
  - company: (주)볼라
    position: 프론트엔드 개발자
    location: 서울
    startDate: 2020.03
    endDate: 2025.02
    duration: 5년
    techStack:
      [
        React Native,
        Next.js,
        TypeScript,
        MobX,
        WebSocket,
        Tanstack Query,
        GitHub,
      ]
    description: |
      React Native 기반의 라이브 커머스 플랫폼인 와이스(WYYYES)와 라이브 패션 플랫폼 볼라(서비스 종료) 등 앱 6개를 출시하였습니다. 앱 서비스를 비롯하여 랜딩페이지, 백오피스 개발 등 팀의 프론트엔드 개발 전반을 담당하였습니다. 팀 초기 멤버로 비즈니스 목표를 함께 달성해 왔습니다.
    projects:
      - name: 와이스(WYYYES)
        period: 2021.11 ~ 2025.02
        tag:
          - C2C
          - 라이브 커머스
          - 실시간 컬렉터블 경매
        description:
          - "React Native 및 라이브 스트리밍 기반의 수집품 경매 앱"
          - Yarn Workspaces를 활용한 모노레포 구조 구현으로 iOS/Android/웹을 동시에 개발할 수 있는 환경 구축
          - 아마존 IVS 기반의 라이브 스트리밍 및 수신 플레이어를 활용한 실시간 영상 송수신 구현
          - Websocket 기반의 실시간 채팅 및 경매 시스템 개발.
          - 소셜 로그인 (구글, 카카오, 네이버) 기능 개발
          - 결제 시스템 (인앱 결제, 외부 PG 연동) 개발
          - Firebase Messaging을 활용한 푸쉬 알림 구현
          - 딥링크 처리 및 다이나믹 링크 구현하여 소셜 공유 기능과 연동
          - Storybook을 활용한 컴포넌트 시각적 테스트
          - react-native-reanimated를 활용한 애니메이션 및 트랜지션 효과 최적화
          - 다양한 조건에서 재사용 가능한 커스텀 폼 요소 및 입력 컴포넌트 제작 및 활용
          - 다양한 전략의 웹 성능 최적화 및 SEO
          - Next.js의 SSR/SSG 활용, 이미지, 폰트 등 정적 리소스 캐싱 최적화 등

        website: https://wyyyes.com

      - name: 볼라(Volla)
        period: 2020.03 ~ 2021.10
        tag:
          - B2C
          - 라이브 커머스
          - 여성 패션
        description:
          - "React Native 및 라이브 스트리밍 기반의 여성 패션 플랫폼 앱 (현재 서비스 종료)"
          - 라이브 스트리밍, 실시간 채팅, 피드, 배송 등 기능을 포함한 모바일 앱 클라이언트 개발.
          - React.js 기반의 셀러 전용 어드민 페이지 개발

  - company: (주)더시퀀스
    position: Technical Director
    startDate: 2018.02
    endDate: 2020.02
    duration: 2년
    techStack: [OpenFrameworks(C#), Processing(Java), Three.js, Unity, Arduino]
    description: |
      그래픽 프로그래밍(processing, three.js, OpenFrameworks), 게임 프로그래밍(Unity), 피지컬컴퓨팅(Arduino) 등을 활용한 인터랙티브 미디어아트의 기술적 구현 및 현장 설치에 대한 부분을 총괄하였습니다.
projects:
  - name: YOCO(You Only Copy Once)
    teamComposition: 3인 팀 프로젝트
    period: 2024
    techStack: [TypeScript, VSCode Extension, Open Source]
    description:
      - 코드 복사시 파일 이름을 함께 복사할수 있도록 해주는 VS Code Extension이자 오픈소스 프로젝트입니다.
      - 메인 기능 개발을 담당하였고 배포 CI/CD 및 테스트코드 개발에도 참여.
      - Microsoft Marketplace의 Featured Section에 등재.
    additionalLinks:
      - text: Marketplace
        url: https://marketplace.visualstudio.com/items?itemName=yoco.YOCO
      - text: Github
        url: https://github.com/YOCOING/YOCO
  - name: 테크버킷 블로그
    teamComposition: 개인 프로젝트
    period: 2023
    techStack: [Next.js, TypeScript, SEO]
    description:
      - SEO를 통한 검색 엔진 상위 노출에 대한 호기심에서 시작된 기술 블로그 사이트.
      - Next.js 기반 전반적인 제작 및 배포, SEO 등의 실험을 목표로 개설 후 지속적으로 운영중.
      - 다수 페이지 상위 노출 및 월 조회수 8K 달성 (구글 검색엔진 기준)
    team: 개인
    additionalLinks:
      - text: WebSite
        url: https://techbukket.com
      - text: 발표자료
        url: http://z.ifmage.xyz/83vi
awards:
  - title: 항해플러스 최우수 수료생
    organization: "주최: 팀스파르타"
    date: 2024.08
    description: |
      경력자 대상의 역량 강화 프로그램인 항해플러스 프론트엔드 코스 1기에 참여하여 최우수 수료생 1인으로 선정되었습니다.
  - title: 오픈소스컨트리뷰톤 최우수상(정보통신산업진흥원장상)
    organization: "주최: 과학기술정보통신부ᐧ정보통신산업진흥원"
    date: 2019.12
    link: http://z.ifmage.xyz/YWxF
    description: |
      2019년 오픈소스컨트리뷰톤에서, 팀 YORK에 멘티로 참여하여 최우수상을 수상했습니다. KERAS 튜토리얼 문서의 번역을 담당하였습니다.
---

안녕하세요. 프론트엔드 개발자 정성훈(Flik)입니다.👋

스타트업 (주)볼라의 초기 멤버로 서비스의 런칭과 성장을 함께 하며 팀의 비즈니스 목표를 달성한 경험이 있습니다.<br/>
뭐든지 만들어 보고 실험하면서 더 나은 것을 만들어내는 과정에서 기쁨을 느낍니다.

#### **Strong Points**

- **React.js와 React Native**를 활용하여 웹과 모바일을 아우르는 크로스플랫폼 개발 경험을 가지고 있습니다.
- GitHub Actions, Fastlane, 셸 스크립트 등을 활용한 **CI/CD** 및 개발 효율성을 높이기 위한 자동화 경험이 있습니다.
- Next.js 기반 SSR, SSG, 메타 태그 최적화, 성능 최적화 등의 성능 최적화와 **SEO를 통해 검색엔진 상위 노출을 달성한 경험**이 있습니다.
- Reanimated를 활용하여 RN에 최적화된 애니메이션 개발 경험이 있으며, 애니메이션과 인터랙션 설계에 대한 높은 이해도를 가지고 있습니다.
- 스타트업 초기 멤버로 앱을 런칭하고 성장시키면서 팀의 비즈니스 목표를 이해하고 제품에 반영하는 능력을 키워왔습니다.
