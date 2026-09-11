import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

/** Tracks whether the viewport uses the landing's mobile layout. */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return isMobile;
}
