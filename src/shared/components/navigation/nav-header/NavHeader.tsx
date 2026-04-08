import type { FunctionComponent } from "react";
import { useState, useEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useMediaQuery } from "./useMediaQuery";
import type { Props } from "./types";
import "../nav-header.css";

// Track if this is the initial page load (not a navigation)
// This persists across component remounts via sessionStorage
const getIsInitialLoad = (): boolean => {
  if (typeof window === "undefined") return true;
  const key = "__nav_initial_load__";
  const wasInitialLoad = !sessionStorage.getItem(key);
  if (wasInitialLoad) {
    sessionStorage.setItem(key, "true");
  }
  return wasInitialLoad;
};

const NavHeader: FunctionComponent<Props> = props => {
  // useMediaQuery returns false initially (matches SSR)
  // useEffect updates it on client after hydration
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Track visibility state
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialLoad] = useState(getIsInitialLoad);

  useEffect(() => {
    // Check if the persisted parent element (from Header.astro) is already visible
    // The div with transition:persist="nav-header" is the parent container
    const checkPersisted = () => {
      // Find the persisted element (it has data-astro-transition-scope or similar)
      // Or find by checking if any parent has opacity > 0
      const wrapper = document.querySelector(
        ".nav-header-wrapper"
      ) as HTMLElement | null;

      if (wrapper) {
        // Check if parent persisted element exists and is visible
        let current: HTMLElement | null = wrapper.parentElement;
        while (current) {
          const opacity = parseFloat(window.getComputedStyle(current).opacity);
          // If we find a parent with opacity > 0, it's likely persisted
          if (opacity > 0 && current !== document.body) {
            return true;
          }
          current = current.parentElement;
        }
      }
      return false;
    };

    // Initial check
    const wasPersisted = checkPersisted();

    if (wasPersisted) {
      // Element is persisted from previous page, show immediately
      setIsVisible(true);
    } else {
      // Initial load: fade in
      if (isInitialLoad) {
        // Small delay for smooth fade in after hydration
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        // Page navigation but not persisted (shouldn't happen, but handle it)
        setIsVisible(true);
      }
    }

    // Listen for page transitions
    // On page transition, persisted element maintains visibility
    const handlePageLoad = () => {
      setIsVisible(true);
    };

    document.addEventListener("astro:page-load", handlePageLoad);
    document.addEventListener("astro:after-swap", handlePageLoad);

    return () => {
      document.removeEventListener("astro:page-load", handlePageLoad);
      document.removeEventListener("astro:after-swap", handlePageLoad);
    };
  }, [isInitialLoad]);

  return (
    <div
      className="nav-header-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transition:
          isInitialLoad && isVisible
            ? "opacity 0.4s ease-out 0.1s"
            : "opacity 0s",
      }}
    >
      {isMobile ? <MobileNav {...props} /> : <DesktopNav {...props} />}
    </div>
  );
};

export default NavHeader;
