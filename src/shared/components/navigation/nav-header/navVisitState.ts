export const isFirstVisit = (): boolean => {
  if (typeof window === "undefined") return true;
  return !(window as unknown as { __navVisited?: boolean }).__navVisited;
};

export const markVisited = () => {
  if (typeof window !== "undefined") {
    (window as unknown as { __navVisited?: boolean }).__navVisited = true;
  }
};
