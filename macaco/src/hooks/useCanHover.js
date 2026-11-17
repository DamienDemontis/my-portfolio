import { canHover, HOVER_QUERY } from "../lib/device.js";
import React from "react";
function useCanHover() {
  const [n, o] = React.useState(canHover);
  return React.useEffect(() => {
    const e = window.matchMedia(HOVER_QUERY),
      t = () => o(e.matches);
    return t(), e.addEventListener("change", t), () => e.removeEventListener("change", t);
  }, []), n;
}
export { useCanHover };
