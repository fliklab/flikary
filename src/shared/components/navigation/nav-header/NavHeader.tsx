import type { FunctionComponent } from "react";
import { useState, useLayoutEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useMediaQuery } from "./useMediaQuery";
import type { Props } from "./types";
import "../nav-header.css";

// 전역 플래그
const isFirstVisit = (): boolean => {
  if (typeof window === "undefined") return true;
  return !(window as unknown as { __navVisited?: boolean }).__navVisited;
};

const markVisited = () => {
  if (typeof window !== "undefined") {
    (window as unknown as { __navVisited?: boolean }).__navVisited = true;
  }
};

const NavHeader: FunctionComponent<Props> = ({ hidden = false, ...props }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // SSR 일치: 항상 false에서 시작
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useLayoutEffect(() => {
    const firstVisit = isFirstVisit();
    markVisited();

    if (hidden) {
      // 숨김 상태 (홈)
      setIsVisible(false);
      setShouldAnimate(true);
    } else if (firstVisit) {
      // 첫 방문: fade-in
      setShouldAnimate(true);
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      // 페이지 전환: 즉시 표시
      setShouldAnimate(false);
      setIsVisible(true);
    }
  }, [hidden]);

  return (
    <div
      className="nav-header-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: shouldAnimate ? "opacity 0.4s ease-out" : "none",
      }}
    >
      {isMobile ? (
        <MobileNav {...props} isInitialLoad={shouldAnimate} />
      ) : (
        <DesktopNav {...props} isInitialLoad={shouldAnimate} />
      )}
    </div>
  );
};

export default NavHeader;
