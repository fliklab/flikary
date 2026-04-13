import type { FunctionComponent } from "react";
import { useState, useEffect } from "react";
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

// 현재 페이지의 hidden 상태 읽기
const getHiddenState = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!(window as unknown as { __navHidden?: boolean }).__navHidden;
};

const NavHeader: FunctionComponent<Props> = props => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const initialHidden = !!props.hidden;

  // SSR에서 바로 표시할 수 있어야 idle hydration으로 내려도 헤더가 숨지 않는다.
  const [isVisible, setIsVisible] = useState(!initialHidden);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // 초기 마운트 시 visibility 설정
  useEffect(() => {
    const firstVisit = isFirstVisit();
    markVisited();
    setIsFirstLoad(firstVisit);

    const hidden = getHiddenState();

    if (hidden) {
      // 숨김 상태 (홈)
      setIsVisible(false);
      setShouldAnimate(true);
    } else {
      // 초기 SSR과 페이지 전환 모두 즉시 표시
      setShouldAnimate(false);
      setIsVisible(true);
    }
  }, []);

  // 페이지 전환 시 visibility 변경 감지
  useEffect(() => {
    const handleVisibilityChange = (e: CustomEvent<{ hidden: boolean }>) => {
      const hidden = e.detail.hidden;
      const wasVisible = isVisible;

      if (hidden && wasVisible) {
        // visible → hidden: fade-out
        setShouldAnimate(true);
        setIsVisible(false);
      } else if (!hidden && !wasVisible) {
        // hidden → visible: fade-in
        setShouldAnimate(true);
        setTimeout(() => setIsVisible(true), 50);
      }
      // visible → visible: 유지 (아무것도 안 함)
    };

    document.addEventListener(
      'nav:visibility-change',
      handleVisibilityChange as EventListener
    );

    return () => {
      document.removeEventListener(
        'nav:visibility-change',
        handleVisibilityChange as EventListener
      );
    };
  }, [isVisible]);

  return (
    <div
      className="nav-header-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: shouldAnimate ? "opacity 0.4s ease-out" : "none",
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
