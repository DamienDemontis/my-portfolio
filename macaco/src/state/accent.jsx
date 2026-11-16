// Couleur d'accent courante, posee par les pages projet.
import React from "react";
const AccentContext = React.createContext({
  accent: null,
  setAccent: () => {}
});
const useAccent = () => React.useContext(AccentContext);
function AccentProvider({
  children: e
}) {
  const [i, a] = React.useState(null);
  return <AccentContext.Provider value={{
    accent: i,
    setAccent: a
  }}>{e}</AccentContext.Provider>;
}
export { AccentProvider, useAccent };
