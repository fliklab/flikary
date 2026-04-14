import type { FunctionComponent } from "react";
import { useState, useEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
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

const NavHeader: FunctionComponent<Props> = props => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const firstVisit = isFirstVisit();
    markVisited();
    setIsFirstLoad(firstVisit);
  }, []);

  return (
    <div className="nav-header-wrapper">
      <DesktopNav {...props} isInitialLoad={isFirstLoad} />
      <MobileNav {...props} isInitialLoad={isFirstLoad} />
    </div>
  );
};

export default NavHeader;
