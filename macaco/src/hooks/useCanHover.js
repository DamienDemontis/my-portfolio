import React from "react";
import { canHover, HOVER_QUERY } from "../app-core.jsx";
function useCanHover() {
  const [n, o] = React.useState(canHover);
  return React.useEffect(() => {
    const e = window.matchMedia(HOVER_QUERY),
      t = () => o(e.matches);
    return t(), e.addEventListener("change", t), () => e.removeEventListener("change", t);
  }, []), n;
}
export { useCanHover };
