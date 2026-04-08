import { useEffect, useState } from "react";

type NavState = "expanded" | "compact";

export const useDesktopNavState = () => {
  const [state, setState] = useState<NavState>("expanded");

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY;
      setState(prev => {
        if (y > 140 && prev !== "compact") return "compact";
        if (y <= 80 && prev !== "expanded") return "expanded";
        return prev;
      });
    };

    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return state;
};
