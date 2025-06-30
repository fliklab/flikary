import { useEffect } from "react";

interface ImageLoaderProps {
  imageId: string;
  imageSrc: string;
}

export default function ImageLoader({ imageId, imageSrc }: ImageLoaderProps) {
  useEffect(() => {
    const img = document.getElementById(imageId);
    const container = img?.closest(".image-container");
    const placeholder = container?.querySelector(".gradient-placeholder");

    function hideGradient() {
      if (placeholder) {
        (placeholder as HTMLElement).style.opacity = "0";
      }
    }

    if (img) {
      if ((img as HTMLImageElement).complete) {
        hideGradient();
      } else {
        img.addEventListener("load", hideGradient);
        img.addEventListener("error", () => {
          console.error("이미지 로드 실패:", imageSrc);
        });
      }
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
