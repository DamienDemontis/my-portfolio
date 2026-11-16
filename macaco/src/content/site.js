// Identite du studio et liens sociaux.
import { STUDIO_NAME } from "../lib/shared.js";
const SOCIAL_LINKS = [{
  key: "linkedin",
  label: "Linkedin",
  href: "https://www.linkedin.com/company/28663057"
}, {
  key: "instagram",
  label: "Instagram",
  href: "https://www.instagram.com/studiomacaco_ch/"
}, {
  key: "youtube",
  label: "Youtube",
  href: "https://www.youtube.com/@studio_macaco"
}];
const SITE = {
  legalName: "Ludens Sagl",
  name: STUDIO_NAME,
  email: "info@studiomacaco.ch",
  telephone: "+41912614984",
  vatID: "CHE-397.368.770",
  logo: "/general/macaco-logo-complete.svg",
  foundingDate: "2022",
  areaServed: "Worldwide",
  description: {
    it: "Studio MACACO è uno studio creativo svizzero che progetta e realizza esperienze interattive per brand, istituzioni culturali e destinazioni. Uniamo direzione creativa, design, storytelling e tecnologia per trasformare identità, storie e contenuti in giochi, installazioni e mondi digitali da esplorare.",
    en: "Studio MACACO is a Swiss creative studio designing and producing interactive experiences for brands, cultural institutions and destinations. We combine creative direction, design, storytelling and technology to turn identities, stories and content into games, installations and digital worlds to explore."
  },
  address: {
    street: "Via Pestariso 5",
    postalCode: "6982",
    locality: "Agno",
    region: "Ticino",
    country: "CH"
  },
  sameAs: SOCIAL_LINKS.map(e => e.href)
};
export { SITE, SOCIAL_LINKS };
