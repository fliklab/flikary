---
layout: ../../shared/layouts/FaqLayout.astro
title: "FAQ"
jsonld:
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity":
      [
        {
          "@type": "Question",
          "name": "어떤 개발 경력을 가지고 있나요?",
          "acceptedAnswer":
            {
              "@type": "Answer",
              "text": "5년간 스타트업에서 프론트엔드 전반을 담당하며 앱 6개 이상을 런칭한 경험이 있습니다.",
            },
        },
        {
          "@type": "Question",
          "name": "주로 사용하는 기술 스택은 무엇인가요?",
          "acceptedAnswer":
            {
              "@type": "Answer",
              "text": "React, React Native, Next.js, TypeScript 중심의 크로스 플랫폼 개발을 해왔습니다.",
            },
        },
        {
          "@type": "Question",
          "name": "웹과 앱 중 어디에 강한가요?",
          "acceptedAnswer":
            {
              "@type": "Answer",
              "text": "웹과 앱 모두 경험이 풍부하며, 모노레포 구조로 iOS/Android/웹을 동시에 관리한 경험이 있습니다.",
            },
        },
        {
          "@type": "Question",
          "name": "성능 최적화 경험이 있나요?",
          "acceptedAnswer":
            {
              "@type": "Answer",
              "text": "Next.js의 SSR, 이미지 Lazy Loading, 번들 최적화 등으로 TBT를 64% 이상 개선했습니다.",
            },
        },
        {
          "@type": "Question",
          "name": "인상적인 문제 해결 사례가 있나요?",
          "acceptedAnswer":
            {
              "@type": "Answer",
              "text": "방송 캡처로 상품 등록하는 기능을 제안·개발해 MAU 51%, 판매 374% 증가를 이끌었습니다.",
            },
        },
      ],
  }
---

<div class="search-box-container">
  <div class="search-box">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <a 
      href="https://assistant.flikary.dev/chat" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="search-link"
      onclick="gtag('event', 'chatbot_click', {'event_category': 'engagement', 'event_label': 'AI 챗봇 클릭'});"
    >
      저에 대해 더 궁금한 점이 있으신가요? 여기를 클릭하여 AI 챗봇에게 물어보세요!
    </a>
  </div>
  <p class="search-description">이력서에 없는 내용도 답변해 드립니다.</p>
</div>

<style>
  .search-box-container {
    margin: 2rem 0;
  }
  .search-box {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background-color: #f8fafc;
    transition: all 0.3s ease;
  }
  .search-box:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }
  .search-box svg {
    margin-right: 0.75rem;
    color: #64748b;
  }
  .search-link {
    color: #334155;
    text-decoration: none;
    font-weight: 500;
    flex: 1;
  }
  .search-description {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #64748b;
    text-align: center;
  }
  @media (prefers-color-scheme: dark) {
    .search-box {
      background-color: #1e293b;
      border-color: #334155;
    }
    .search-link {
      color: #e2e8f0;
    }
    .search-box:hover {
      border-color: #475569;
    }
  }
</style>

### 👨‍💻 기본 정보

**1. 어떤 개발 경력을 가지고 있나요?**
5년간 스타트업에서 프론트엔드 전반을 담당하며 앱 6개 이상을 런칭한 경험이 있습니다.

**2. 주로 사용하는 기술 스택은 무엇인가요?**
React, React Native, Next.js, TypeScript 중심의 크로스 플랫폼 개발을 해왔습니다.

**3. 웹과 앱 중 어디에 강한가요?**
웹과 앱 모두 경험이 풍부하며, 모노레포 구조로 iOS/Android/웹을 동시에 관리한 경험이 있습니다.

**4. 어떤 프로젝트에 기여했나요?**
라이브 커머스 '와이스', 패션 커머스 '볼라', 백오피스, 랜딩페이지 등 다양한 프론트엔드 영역에 참여했습니다.

### 🚀 기술 역량

**5. 성능 최적화 경험이 있나요?**
Next.js의 SSR, 이미지 Lazy Loading, 번들 최적화 등으로 TBT를 64% 이상 개선했습니다.

**6. SEO 최적화도 해봤나요?**
블로그 프로젝트에서 SEO를 최적화하여 검색 상위노출, 월 8천 뷰 달성한 경험이 있습니다.

**7. 실시간 서비스 개발 경험이 있나요?**
WebSocket 기반 경매 및 채팅 시스템, 라이브 스트리밍 기능을 개발했습니다.

**8. 애니메이션 구현 경험이 있나요?**
RN Reanimated와 Gesture Handler를 활용한 인터랙션, PIP 영상 전환, 시각효과 등을 직접 개발했습니다.

**9. 자동화 및 CI/CD 경험이 있나요?**
GitHub Actions, shell script, Fastlane 등을 이용해 코드푸시 및 배포 자동화를 구현했습니다.

**10. 접근성(A11y) 고려도 했나요?**
웹 접근성을 고려한 aria, alt, 시맨틱 태그를 직접 적용하고 Lighthouse로 개선 작업을 했습니다.

### 🧠 문제 해결력 & 창의성

**11. 인상적인 문제 해결 사례가 있나요?**
방송 캡처로 상품 등록하는 기능을 제안·개발해 MAU 51%, 판매 374% 증가를 이끌었습니다.

**12. 사이드 프로젝트를 해본 적 있나요?**
SEO 최적화 블로그, 이미지→PDF 변환기, 단축주소 생성기 등 다양한 실험적 사이드 프로젝트를 수행했습니다.

**13. 오픈소스 기여 경험이 있나요?**
VS Code 확장 프로그램 YOCO를 팀과 함께 개발하여 마켓플레이스 트렌딩에 등재되었습니다.

**14. 기술적인 집요함이 있나요?**
SEO 실험을 위해 구글 문서를 정독하며 수십 번 실험하고, 메타데이터 검증 툴도 직접 개발했습니다.

**15. 사용성 개선에 기여한 사례가 있나요?**
버튼 연타로 중복 요청되는 문제에 throttle과 멱등키를 적용해 UX를 개선했습니다.

### 👥 협업과 커뮤니케이션

**16. 협업 스타일은 어떤가요?**
각 직군 간 언어 차이를 이해하고, 비즈니스 목표에 맞게 조율·설득하는 데 능숙합니다.

**17. 디자이너와 협업 경험도 있나요?**
디자인 패턴을 분석해 재사용 가능한 컴포넌트와 디자인 시스템을 코드화한 경험이 있습니다.

**18. 문서화도 잘하나요?**
사내 위키 문서의 60% 이상을 집필하며 팀의 온보딩과 협업에 기여했습니다.

### 📚 학습 및 성장

**19. 개발자로서의 시작은 어떻게 되었나요?**
도서관 사회복무 중 업무 자동화 도구를 만들면서 프로그래밍에 빠졌고, 이후 독학과 실무로 빠르게 성장했습니다.

**20. 교육과 전공은 어떤가요?**
중앙대 전자전기공학과와 디지털이미징공학 복수전공, CS 과목도 50학점 이상 이수했습니다.
