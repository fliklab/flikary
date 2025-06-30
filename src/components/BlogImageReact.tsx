import React, { useEffect, useState } from "react";
import blurHashData from "../data/blurhash.json";
import { blurHashToGradient } from "../utils/blurhashToGradient";

interface BlogImageReactProps {
  src: string | { src: string; [key: string]: unknown };
  alt: string;
  slug?: string;
}

export default function BlogImageReact({
  src,
  alt,
  slug,
}: BlogImageReactProps) {
  const [gradientStyle, setGradientStyle] = useState(
    "linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)"
  );
  const [imageId] = useState(`img-${Math.random().toString(36).substr(2, 9)}`);

  // src가 객체인지 문자열인지 확인하고 적절한 값 추출
  const imageSrc = typeof src === "object" ? src.src : src;

  // 디버깅용 로깅
  console.log("BlogImageReact props:", { src, alt, slug, imageSrc });

  useEffect(() => {
    if (slug && imageSrc) {
      // Astro의 /@fs/ 경로를 블로그 상대 경로로 변환
      const normalizeImagePath = (path: string): string => {
        // /@fs/absolute/path/src/content/blog/... -> blog/...
        const fsMatch = path.match(/\/@fs.*?\/src\/content\/(blog\/.+?)(\?|$)/);
        if (fsMatch) {
          return fsMatch[1];
        }

        // 일반적인 상대 경로 처리
        if (path.startsWith("./")) {
          const cleanSrc = path.replace(/^\.\//, "");
          return `blog/${slug}/${cleanSrc}`;
        }

        // 이미 blog/로 시작하는 경우
        if (path.startsWith("blog/")) {
          return path;
        }

        return path;
      };

      const imagePath = normalizeImagePath(imageSrc);

      // BlurHash 데이터에서 해당 이미지의 BlurHash 찾기
      const blurHash = (blurHashData as Record<string, string | undefined>)[
        imagePath
      ];

      if (blurHash) {
        try {
          const gradient = blurHashToGradient(blurHash);
          setGradientStyle(gradient);
        } catch (error) {
          console.error("BlurHash 디코딩 오류:", error);
        }
      }
    }
  }, [imageSrc, slug]);

  useEffect(() => {
    const img = document.getElementById(imageId);
    const container = img?.closest(".image-container");
    const placeholder = container?.querySelector(".gradient-placeholder");

    function hideGradient() {
      if (placeholder) {
        console.log("플레이스홀더 숨기기 실행");
        (placeholder as HTMLElement).style.opacity = "0";
      } else {
        console.warn("플레이스홀더를 찾을 수 없음");
      }
    }

    if (img) {
      console.log("이미지 요소 찾음:", img);
      if ((img as HTMLImageElement).complete) {
        console.log("이미지가 이미 로드됨");
        hideGradient();
      } else {
        console.log("이미지 로드 이벤트 리스너 추가");
        img.addEventListener("load", hideGradient);
        img.addEventListener("error", () => {
          console.error("이미지 로드 실패:", imageSrc);
        });
      }
    } else {
      console.warn("이미지 요소를 찾을 수 없음:", imageId);
    }

    return () => {
      if (img) {
        img.removeEventListener("load", hideGradient);
        img.removeEventListener("error", () => {});
      }
    };
  }, [imageId, imageSrc]);

  return (
    <div
      className="image-container"
      style={{ borderRadius: "32px", overflow: "hidden", position: "relative" }}
    >
      {/* 그라데이션 placeholder */}
      <div
        className="gradient-placeholder"
        style={{
          background: gradientStyle,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* 실제 이미지 */}
      <img
        id={imageId}
        src={imageSrc}
        alt={alt}
        loading="lazy"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
      />
    </div>
  );
}
