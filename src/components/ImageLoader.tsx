import { useEffect, useState } from "react";

interface ImageLoaderProps {
  imageId: string;
  imageSrc: string;
}

type LoadingState = "loading" | "loaded" | "error";

export default function ImageLoader({ imageId, imageSrc }: ImageLoaderProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  useEffect(() => {
    const img = document.getElementById(imageId);
    const container = img?.closest(".lqip-container");
    const placeholder = container?.querySelector(".lqip-placeholder");

    function handleImageLoaded() {
      if (placeholder && img) {
        // 1. 먼저 이미지를 보이게 하고
        (img as HTMLElement).style.opacity = "1";
        (img as HTMLElement).setAttribute("data-loaded", "true");

        // 2. 잠시 후 플레이스홀더를 페이드 아웃
        setTimeout(() => {
          (placeholder as HTMLElement).style.opacity = "0";
        }, 150); // 약간의 오버랩으로 자연스러운 전환

        setLoadingState("loaded");
      }
    }

    function handleImageError() {
      console.error("이미지 로드 실패:", imageSrc);
      setLoadingState("error");
      // 에러 시에는 플레이스홀더를 유지
    }

    function resetImageState() {
      if (placeholder && img) {
        (placeholder as HTMLElement).style.opacity = "1";
        (img as HTMLElement).style.opacity = "0";
        (img as HTMLElement).removeAttribute("data-loaded");
        setLoadingState("loading");
      }
    }

    if (img) {
      // 이미지가 이미 로드된 경우
      if (
        (img as HTMLImageElement).complete &&
        (img as HTMLImageElement).naturalHeight !== 0
      ) {
        handleImageLoaded();
      } else {
        // 로딩 시작 시 초기 상태 설정
        resetImageState();

        // 이벤트 리스너 등록
        img.addEventListener("load", handleImageLoaded);
        img.addEventListener("error", handleImageError);
      }

      // 클린업 함수
      return () => {
        img.removeEventListener("load", handleImageLoaded);
        img.removeEventListener("error", handleImageError);
      };
    }
  }, [imageId, imageSrc]);

  // 로딩 상태에 따른 추가 클래스 적용 (선택사항)
  useEffect(() => {
    const container = document
      .getElementById(imageId)
      ?.closest(".lqip-container");
    if (container) {
      container.setAttribute("data-loading-state", loadingState);
    }
  }, [loadingState, imageId]);

  return null;
}
