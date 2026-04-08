import type { FunctionComponent } from "react";
import { useState, useEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useMediaQuery } from "./useMediaQuery";
import type { Props } from "./types";
import "../nav-header.css";

// 전역 플래그: 첫 로드인지 페이지 전환인지 구분
// sessionStorage는 hydration 전에 접근 가능
const getIsInitialLoad = (): boolean => {
  if (typeof window === "undefined") return true;
  const key = "__nav_initial_load__";
  return !sessionStorage.getItem(key);
};

const markAsLoaded = () => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("__nav_initial_load__", "true");
  }
};

const NavHeader: FunctionComponent<Props> = props => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 첫 로드 여부를 초기값으로 계산
  const [isInitialLoad] = useState(getIsInitialLoad);

  // 페이지 전환 시에는 즉시 visible (true), 첫 로드 시에만 fade-in (false → true)
  const [isVisible, setIsVisible] = useState(!isInitialLoad);

  useEffect(() => {
    if (isInitialLoad) {
      // 첫 로드: 약간의 딜레이 후 fade-in
      const timer = setTimeout(() => {
        setIsVisible(true);
        markAsLoaded();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  return (
    <div
      className="nav-header-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: isInitialLoad ? "opacity 0.4s ease-out 0.1s" : "none",
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
