// import { useEffect } from "react";

// gtag 전역 타입 선언
declare global {
  interface Window {
    gtag: (
      command: "event",
      action: string,
      params: {
        event_category: string;
        event_label: string;
        [key: string]: string | number | boolean | null;
      }
    ) => void;
  }
}

interface ChatbotButtonProps {
  url: string;
  label?: string;
  description?: string;
}

const ChatbotButton = ({
  url,
  label = "저에게 궁금한 점이 있으신가요? 여기를 클릭하여 AI 챗봇에게 물어보세요!",
  description = "이력서에 없는 내용도 답변해 드립니다.",
}: ChatbotButtonProps) => {
  const sendGAEvent = (
    eventName: string,
    parameters?: {
      [key: string]: string | number | boolean | null;
    }
  ) => {
    // const googleAnalyticsId = import.meta.env
    //   .PUBLIC_GOOGLE_ANALYTICS_ID as string;
    //@ts-expect-error dataLayer is not typed
    if (typeof window !== "undefined" && window.dataLayer) {
      //@ts-expect-error dataLayer is not typed
      window.dataLayer.push({
        event: eventName,
        link_text: label,
        ...parameters,
      });
      console.log("GA4 Event sent:", eventName, parameters);
    } else {
      console.warn("Google Analytics not loaded");
    }
  };

  // 챗봇 링크 클릭 핸들러
  const handleChatbotClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // GA4 권장 이벤트: 'click' 이벤트 사용
    sendGAEvent("click", {
      link_text: label,
      link_url: url,
      link_domain: new URL(url).hostname,
      outbound: "true", // 외부 링크임을 표시
      // GA4 커스텀 파라미터
      component: "chatbot_button",
      page_location: window.location.href,
    });

    // 또는 커스텀 이벤트 사용
    sendGAEvent("click_chatbot_interaction", {
      action: "click",
      category: "engagement",
      label: "이력서 AI 챗봇",
      value: "1",
    });
  };

  return (
    <div className="mx-auto my-8">
      <div className="flex items-center rounded-full border border-gray-200 bg-gray-100 px-8 py-3 transition-all duration-300 hover:border-gray-300 hover:shadow-md sm:py-4 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-gray-600">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 font-medium text-gray-700 no-underline dark:text-gray-200"
          onClick={handleChatbotClick} // 직접 핸들러 연결
        >
          🔍 {label}
        </a>
      </div>
      {description && (
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};

export default ChatbotButton;
