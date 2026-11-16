// Identite du site et liens sociaux.
const SOCIAL_LINKS = [{
  key: "github",
  label: "GitHub",
  href: "https://github.com/damiendemontis"
}, {
  key: "linkedin",
  label: "LinkedIn",
  href: "https://www.linkedin.com/in/damien-demontis/"
}];
const SITE = {
  name: "Damien Demontis",
  url: "https://demontis.dev",
  email: "damien.demontis@epitech.eu",
  sameAs: SOCIAL_LINKS.map(e => e.href)
};
export { SITE, SOCIAL_LINKS };
