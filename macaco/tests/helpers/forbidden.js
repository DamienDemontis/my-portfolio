// Formules de recherche d'emploi interdites partout (sources et pages generees).
// Source unique : tous les tests qui verifient cette contrainte importent ce motif.
// `freelance` n'est volontairement PAS interdit.
const MOTIFS = [
  /disponible/,
  /ouvert aux opportunit/,
  /recherche un poste/,
  /available for/,
  /open to work/,
  /\bhiring\b/,
  /\bseeking\b/,
  /opportunit/,
  /looking for/,
  /next (?:role|challenge|step|position)/,
  /nouveaux? d[ée]fis?/,
  /[àa] l['’]écoute/,
  /\brecherche\b/,
  /\bcherche\b/,
  /open to/,
  /\bavailable\b/,
  /구직|이직|채용|취업/,
]
export const EMPLOI = new RegExp(MOTIFS.map(m => m.source).join('|'), 'i')

// Phrases exactes tolerees (faux positifs du contenu actuel). Vide : aucun attendu.
export const EMPLOI_AUTORISE = []

export const contientEmploi = texte => {
  let t = texte
  for (const phrase of EMPLOI_AUTORISE) t = t.split(phrase).join('')
  return EMPLOI.test(t)
}
