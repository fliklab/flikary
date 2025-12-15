import type { FunctionComponent } from "react";
import { useState, useLayoutEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useMediaQuery } from "./useMediaQuery";
import type { Props } from "./types";
import "../nav-header.css";

// 전역 플래그를 window 객체에 저장
const checkIsInitialLoad = (): boolean => {
  if (typeof window === "undefined") return true;
  return !(window as unknown as { __navLoaded?: boolean }).__navLoaded;
};

const markAsLoaded = () => {
  if (typeof window !== "undefined") {
    (window as unknown as { __navLoaded?: boolean }).__navLoaded = true;
  }
};

const NavHeader: FunctionComponent<Props> = props => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 첫 로드 여부와 가시성 상태
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // useLayoutEffect: DOM 페인트 전에 실행되어 깜빡임 방지
  useLayoutEffect(() => {
    const isFirst = checkIsInitialLoad();
    setIsInitialLoad(isFirst);

    if (isFirst) {
      // 첫 로드: 짧은 딜레이 후 fade-in
      const timer = setTimeout(() => {
        setIsVisible(true);
        markAsLoaded();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // 페이지 전환: 즉시 표시 (DOM 페인트 전에 설정)
      setIsVisible(true);
    }
  }, []);

  return (
    <div
      className="nav-header-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: isInitialLoad && isVisible ? "opacity 0.4s ease-out" : "none",
      }}
    >
      {isMobile ? (
        <MobileNav {...props} isInitialLoad={isInitialLoad} />
      ) : (
        <DesktopNav {...props} isInitialLoad={isInitialLoad} />
      )}
    </div>
  );
};

export default NavHeader;
