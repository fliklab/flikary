import { useEffect } from "react";

interface ImageLoaderProps {
  imageId: string;
  imageSrc: string;
}

export default function ImageLoader({ imageId, imageSrc }: ImageLoaderProps) {
  useEffect(() => {
    const img = document.getElementById(imageId) as HTMLImageElement;
    const container = img?.closest(".blog-image-wrapper") as HTMLElement;
    const placeholder = container?.querySelector(
      ".gradient-placeholder"
    ) as HTMLElement;

    if (!img || !container || !placeholder) {
      console.warn("[ImageLoader] Elements not found:", {
        img: !!img,
        container: !!container,
        placeholder: !!placeholder,
      });
      return;
    }

    function hideGradient() {
      console.log("[ImageLoader] Hiding gradient for:", imageSrc);
      if (placeholder) {
        placeholder.style.opacity = "0";
      }
    }

    // 이미지가 이미 로드되었는지 확인
    if (img.complete && img.naturalHeight !== 0) {
      console.log("[ImageLoader] Image already loaded:", imageSrc);
      hideGradient();
    } else {
      console.log("[ImageLoader] Waiting for image load:", imageSrc);

      const handleLoad = () => {
        console.log("[ImageLoader] Image loaded:", imageSrc);
        hideGradient();
      };

      const handleError = () => {
        console.error("[ImageLoader] Image load failed:", imageSrc);
        // 에러 시에도 placeholder를 숨김
        hideGradient();
      };

      img.addEventListener("load", handleLoad);
      img.addEventListener("error", handleError);

      return () => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleError);
      };
    }

    return () => {
      if (img) {
        img.removeEventListener("load", hideGradient);
        img.removeEventListener("error", () => {});
      }
    };
  }, [imageId, imageSrc]);

  // 이 컴포넌트는 렌더링하지 않음 (로직만 수행)
  return null;
}
