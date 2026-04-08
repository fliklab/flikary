import type { FunctionComponent } from "react";
import { useState, useLayoutEffect, useEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useMediaQuery } from "./useMediaQuery";
import type { Props } from "./types";
import "../nav-header.css";

// 전역 플래그를 window 객체에 저장
const getNavLoadedFlag = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!(window as unknown as { __navLoaded?: boolean }).__navLoaded;
};

const setNavLoadedFlag = () => {
  if (typeof window !== "undefined") {
    (window as unknown as { __navLoaded?: boolean }).__navLoaded = true;
  }
};

const NavHeader: FunctionComponent<Props> = props => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 플래그 즉시 체크하고 설정 (mount 시점에)
  const [wasAlreadyLoaded] = useState(() => {
    const loaded = getNavLoadedFlag();
    setNavLoadedFlag(); // 즉시 플래그 설정
    return loaded;
  });

  // 페이지 전환이면 즉시 visible, 첫 로드면 false에서 시작
  const [isVisible, setIsVisible] = useState(wasAlreadyLoaded);

  // 첫 로드일 때만 fade-in 효과
  useLayoutEffect(() => {
    if (!wasAlreadyLoaded) {
      // 첫 로드: 약간의 딜레이 후 fade-in
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [wasAlreadyLoaded]);

  // fallback: 혹시 위에서 실행 안 됐을 경우
  useEffect(() => {
    if (!isVisible) {
      setIsVisible(true);
    }
  }, [isVisible]);

  return (
    <div
      className="nav-header-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: !wasAlreadyLoaded && isVisible ? "opacity 0.4s ease-out" : "none",
      }}
    >
      {isMobile ? (
        <MobileNav {...props} isInitialLoad={!wasAlreadyLoaded} />
      ) : (
        <DesktopNav {...props} isInitialLoad={!wasAlreadyLoaded} />
      )}
    </div>
  );
};

export default NavHeader;
