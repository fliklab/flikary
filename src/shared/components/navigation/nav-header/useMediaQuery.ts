import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  // Always start with false to match server-side rendering
  // useEffect runs only on client, so initial render matches SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);
    // Set initial value immediately
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [query]);

  return matches;
};
