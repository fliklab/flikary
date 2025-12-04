import type { FunctionComponent } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useMediaQuery } from "./useMediaQuery";
import type { Props } from "./types";
import "../nav-header.css";

const NavHeader: FunctionComponent<Props> = props => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile ? <MobileNav {...props} /> : <DesktopNav {...props} />;
};

export default NavHeader;
