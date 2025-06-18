import { useEffect } from "react";

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
  // Google Analytics 이벤트 트래킹 함수
  const sendGAEvent = (eventName: string, category: string, label: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, {
        event_category: category,
        event_label: label,
      });
      console.log("GA Event sent:", { eventName, category, label });
    } else {
      console.warn("Google Analytics not loaded");
    }
  };

  useEffect(() => {
    const trackingElements = document.querySelectorAll("[data-tracking-name]");

    const handleClick = (e: Event) => {
      const element = e.currentTarget as HTMLElement;
      const eventName = element.dataset.trackingName;
      const category = element.dataset.trackingCategory;
      const label = element.dataset.trackingLabel;

      if (eventName && category && label) {
        sendGAEvent(eventName, category, label);
      }
    };

    trackingElements.forEach(element => {
      element.addEventListener("click", handleClick);
    });

    return () => {
      trackingElements.forEach(element => {
        element.removeEventListener("click", handleClick);
      });
    };
  }, []);

  return (
    <div className="mx-auto my-8">
      <div className="flex items-center rounded-full border border-gray-200 bg-gray-100 px-8 py-3 transition-all duration-300 hover:border-gray-300 hover:shadow-md sm:py-4 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-gray-600">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 font-medium text-gray-700 no-underline dark:text-gray-200"
          data-tracking-name="resume_chatbot_click"
          data-tracking-category="engagement"
          data-tracking-label="이력서 AI 챗봇 클릭"
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
