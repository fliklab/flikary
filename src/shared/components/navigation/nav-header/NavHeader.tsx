import type { FunctionComponent } from "react";
import { useState, useLayoutEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useMediaQuery } from "./useMediaQuery";
import type { Props } from "./types";
import "../nav-header.css";

interface NavTransition {
  wasVisible: boolean;
  targetVisible: boolean;
  shouldAnimate: boolean;
  isFirstLoad: boolean;
}

// Header.astro의 inline script에서 설정한 전역 변수 읽기
const getNavTransition = (): NavTransition => {
  if (typeof window === "undefined") {
    return { wasVisible: false, targetVisible: true, shouldAnimate: true, isFirstLoad: true };
  }
  return (window as unknown as { __navTransition?: NavTransition }).__navTransition ?? {
    wasVisible: false,
    targetVisible: true,
    shouldAnimate: true,
    isFirstLoad: true,
  };
};

const NavHeader: FunctionComponent<Props> = props => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // SSR과 일치하도록 초기값 고정 (hydration mismatch 방지)
  const [transition, setTransition] = useState<NavTransition>({
    wasVisible: false,
    targetVisible: true,
    shouldAnimate: true,
    isFirstLoad: true,
  });
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    const navTransition = getNavTransition();
    setTransition(navTransition);

    const { wasVisible, targetVisible, shouldAnimate, isFirstLoad } = navTransition;

    if (!targetVisible) {
      // 홈 페이지: 숨김
      if (wasVisible && shouldAnimate) {
        // fade-out (visible → hidden)
        setIsVisible(true);
        requestAnimationFrame(() => setIsVisible(false));
      } else {
        setIsVisible(false);
      }
    } else {
      // 일반 페이지: 표시
      if (isFirstLoad) {
        // 첫 로드: 약간의 딜레이 후 fade-in
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
      } else if (shouldAnimate) {
        // 홈에서 진입: fade-in
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
      } else {
        // 네비 있는 페이지 간 전환: 즉시 표시
        setIsVisible(true);
      }
    }
  }, []);

  const shouldFadeIn = transition.shouldAnimate || transition.isFirstLoad;

  return (
    <div
      className="nav-header-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: shouldFadeIn ? "opacity 0.4s ease-out" : "none",
      }}
    >
      {isMobile ? (
        <MobileNav {...props} isInitialLoad={transition.isFirstLoad} />
      ) : (
        <DesktopNav {...props} isInitialLoad={transition.isFirstLoad} />
      )}
    </div>
  );
};

export default NavHeader;
