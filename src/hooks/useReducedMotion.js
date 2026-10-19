// reads prefers-reduced-motion and updates on change
import { useEffect, useState } from "react";

export function useReducerdMotion() {
  const [reduced, setReduced] = useState(
    () => Window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    // window.matchMedia() checks whether a browser media query matches.
    // prefers-reduced-motion: reduce asks whether the visitor prefers reduced motion.
    //.matches returns true if that preference is enabled.
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced
}
