import { useEffect } from "react";

interface ImageLoaderProps {
  imageId: string;
  imageSrc: string;
}

export default function ImageLoader({ imageId, imageSrc }: ImageLoaderProps) {
  useEffect(() => {
    const img = document.getElementById(imageId);
    const container = img?.closest(".lqip-container"); // 클래스명 변경
    const placeholder = container?.querySelector(".lqip-placeholder"); // 클래스명 변경

    function hideLQIP() {
      if (placeholder) {
        (placeholder as HTMLElement).style.opacity = "0";
      }
      // 이미지에 로드 완료 표시 추가 (CSS 선택자용)
      if (img) {
        img.setAttribute("data-loaded", "true");
      }
    }

    function showLQIP() {
      if (placeholder) {
        (placeholder as HTMLElement).style.opacity = "1";
      }
      if (img) {
        img.removeAttribute("data-loaded");
      }
    }

    if (img) {
      // 이미지가 이미 로드된 경우
      if (
        (img as HTMLImageElement).complete &&
        (img as HTMLImageElement).naturalHeight !== 0
      ) {
        hideLQIP();
      } else {
        // 로딩 시작 시 LQIP 표시
        showLQIP();

        // 로드 성공 시 LQIP 숨기기
        img.addEventListener("load", hideLQIP);

        // 로드 실패 시 에러 로그 (LQIP는 계속 표시)
        img.addEventListener("error", () => {
          console.error("이미지 로드 실패:", imageSrc);
          // LQIP는 숨기지 않고 유지
        });
      }
    }

    // 클린업
    return () => {
      if (img) {
        img.removeEventListener("load", hideLQIP);
        img.removeEventListener("error", () => {});
      }
    };
  }, [imageId, imageSrc]);

  // 이 컴포넌트는 렌더링하지 않음 (로직만 수행)
  return null;
}
