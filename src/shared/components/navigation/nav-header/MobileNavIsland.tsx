import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import MobileNav from "./MobileNav";
import { isFirstVisit, markVisited } from "./navVisitState";
import type { Props } from "./types";
import "../nav-header.css";

const MobileNavIsland: FunctionComponent<Props> = props => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const firstVisit = isFirstVisit();
    markVisited();
    setIsInitialLoad(firstVisit);
  }, []);

  return (
    <div className="nav-header-wrapper">
      <MobileNav {...props} isInitialLoad={isInitialLoad} />
    </div>
  );
};

export default MobileNavIsland;
