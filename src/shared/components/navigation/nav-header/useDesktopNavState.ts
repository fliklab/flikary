import { useEffect, useState, useCallback } from "react";

type NavState = "expanded" | "compact";

export const useDesktopNavState = () => {
  // Always start with "expanded" to match server-side rendering
  // This prevents hydration mismatch
  const [state, setState] = useState<NavState>("expanded");

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
