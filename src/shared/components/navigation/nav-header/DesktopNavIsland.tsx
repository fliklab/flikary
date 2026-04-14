import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import DesktopNav from "./DesktopNav";
import { isFirstVisit, markVisited } from "./navVisitState";
import type { Props } from "./types";
import "../nav-header.css";

const DesktopNavIsland: FunctionComponent<Props> = props => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const firstVisit = isFirstVisit();
    markVisited();
    setIsInitialLoad(firstVisit);
  }, []);

  return (
    <div className="nav-header-wrapper">
      <DesktopNav {...props} isInitialLoad={isInitialLoad} />
    </div>
  );
};

export default DesktopNavIsland;
