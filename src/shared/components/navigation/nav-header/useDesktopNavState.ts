import { useEffect, useState, useCallback } from "react";

type NavState = "expanded" | "compact";

// Get initial state based on current scroll position (no flash)
const getInitialState = (): NavState => {
  if (typeof window === "undefined") return "expanded";
  return window.scrollY > 100 ? "compact" : "expanded";
};

export const useDesktopNavState = () => {
  const [state, setState] = useState<NavState>(getInitialState);

  const updateState = useCallback(() => {
    const y = window.scrollY;
    setState(prev => {
      if (y > 140 && prev !== "compact") return "compact";
      if (y <= 80 && prev !== "expanded") return "expanded";
      return prev;
    });
  }, []);

  useEffect(() => {
    // Initial check
    updateState();

    // Scroll listener
    window.addEventListener("scroll", updateState, { passive: true });

    // Astro View Transitions: update state after page swap
    const handlePageLoad = () => {
      // Small delay to ensure scroll position is restored
      requestAnimationFrame(updateState);
    };

    document.addEventListener("astro:page-load", handlePageLoad);
    document.addEventListener("astro:after-swap", handlePageLoad);

    return () => {
      window.removeEventListener("scroll", updateState);
      document.removeEventListener("astro:page-load", handlePageLoad);
      document.removeEventListener("astro:after-swap", handlePageLoad);
    };
  }, [updateState]);

  return state;
};
