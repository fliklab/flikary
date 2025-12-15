import type { FunctionComponent } from "react";
import { useState, useLayoutEffect } from "react";
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

  // SSR과 일치하도록 초기값은 false로 고정 (hydration mismatch 방지)
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    const wasAlreadyLoaded = getNavLoadedFlag();
    setNavLoadedFlag(); // 플래그 즉시 설정

    if (wasAlreadyLoaded) {
      // 페이지 전환: 즉시 표시
      setIsFirstLoad(false);
      setIsVisible(true);
    } else {
      // 첫 로드: fade-in
      setIsFirstLoad(true);
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      className="nav-header-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: isFirstLoad && isVisible ? "opacity 0.4s ease-out" : "none",
      }}
    >
      {isMobile ? (
        <MobileNav {...props} isInitialLoad={isFirstLoad} />
      ) : (
        <DesktopNav {...props} isInitialLoad={isFirstLoad} />
      )}
    </div>
  );
};

export default NavHeader;
