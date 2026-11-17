# Plan 1 « Fondations » — suivi

Exécuté le 2026-11-17 sur v6-macaco (a248aae..9c582dd), en subagent-driven : 8 tâches, chacune relue (conformité + qualité), puis une relecture finale de la branche et une vague de correction. Suite : 125 tests verts, 1 sauté volontairement (coréen).

Ce document garde ce que le registre d'exécution (jetable) contenait et qui doit survivre : ce qui bloque la mise en ligne, ce qu'il faut vérifier au premier déploiement, ce qui part aux plans 2 et 3, et toutes les décisions prises en cours de route.

## Bloquants avant mise en ligne

- [LEVE, tache 6 du plan 2] la texture de Mecha_Full.glb portait le mot "MACACO" (visible sur le bras) : l'asset est supprime avec l'intro et le mecha.
- copie marketing du client encore mot pour mot (titre hero "WE GIVE SHAPE / TO INNOVATION", 6 corps rstage, ligne du loader) — retrouvable par recherche ; remplacee au plan 3.
- le loader de PageTransition porte le pictogramme fleche de MACACO (SVG inline) et sa copie "ready_for_{awesomeness}", "つくる かえる", "home {loading}" — invisible aux scans texte de T3 ; a remplacer (plan 3) ou retirer.
- les en-tetes de securite/cache du vercel.json racine (CSP, HSTS, Cache-Control assets) ne sont pas portes dans macaco/vercel.json — la CSP de v5 est taillee pour v5 (Calendly, Supabase...) ; ecrire une CSP propre a v6 (plus stricte : plus d'iubenda ni de GA) avant de basculer la racine Vercel.
- og:image/twitter:image absents (v5 a og-card.png ; apercus LinkedIn vides) ; audit manuel de public/ et de toutes les chaines en dur (loading/robot-icon.svg, home/*-icon.svg des six piliers du client, Intro.jsx:334,393,396 つなぐ/うまれる/(_GENERATING_CITY), Hud.jsx:147-182 "CLASS: CREATOR"...) ; reactiver le test coreen + test "aucun marqueur/lorem" + trancher la provenance du ko.json de v5 ; chemins d'assets sensibles a la casse (Vercel) ; ajouter le scenario "visiteur avec le SW v5" aux controles du premier deploiement.

## Contrôles au premier déploiement (non vérifiables en local)

- /fr/index.html prioritaire sur le repli SPA ; redirection has-query /?lng=fr ; /fr sans slash final -> fr/index.html ; en-tetes gz du jeu effectifs.
- la 301 /games/wii-tanks -> /games/wii-tanks/ ne doit pas boucler (trailingSlash Vercel) ; ko.json garde de l'anglais non marque (Menu, Scroll to explore, textes stage).

## À porter aux plans 2 et 3

- A porter en T6 : reutiliser le motif de formulations de recherche d'emploi du test d'identite (source unique, pas de second regex) ; si le garde CONCATENE bloque un gabarit d'URL legitime, resserrer le garde plutot que contourner le code.
- A porter au plan 3 : ajouter un test "aucun marqueur [À ÉCRIRE]/[TO WRITE]/[KO] dans les locales" quand le vrai texte arrive.
- A porter au plan 3 : accentForProgress non branche (--accent statique) ; precision carbone (tampon 250 entrees, doublons d'URL, mesurer firstPaint au load) ; defilement du mode lecture dans .scroll-root imbrique (Espace/PageDown).

## Mineurs reportés

La relecture finale les a triés : aucun ne bloque la branche. Déjà clos : T1(a) unstubGlobals, T2 file://, T2 commentaire index.html, T3 og:locale, T4 emploi dans les locales (scanne), T5 branche ?lecture=1 (couverte), T5 seuil 900 mots (tient avec le plancher 120), T5 <a href> (moot).

- Task 2: minor (deferred): hex dupliques entre tokens.css et ramp.js sans test qui les lie
- Task 2: minor (deferred): commentaire "no Hangul" repete 4 fois dans tokens.css
- Task 2: minor (deferred): commentaire index.html:39-42 obsolete (regles desormais dans tokens.css)
- Task 2: minor (deferred): famille 'Redaction 70' declaree sans variable ; le plan 3 doit l'utiliser deliberement
- Task 2: minor (deferred): tests/fonts.test.js:4 retire `file://` a la main (fragile hors Windows) -> repris en T3
- Task 3: minor (deferred): copie encore au "nous" d'un studio, variable --yellow et prefixe mc- (ne nomment pas le client) -> plans 2/3
- Task 3: minor (deferred): exports morts MaskedSvg et CaseVideoPlayerFrame ; section craft reduite a son titre
- Task 3: minor (deferred): le garde d'identite ne scanne pas public/ (svg/txt/json) ni les noms de fichiers
- Task 3: minor (deferred): existsSync insensible a la casse sous Windows/macOS ; logique IGNORES morte depuis 1289e1b
- Task 3: minor (deferred): regex du garde d'assets — ABSOLU accepte //host, rate @2x/srcset ; CONCATENE refuse tout `${x}/f.ext` (trop large) ; MASQUE ne verifie plus rien (MaskedSvg sans appelant)
- Task 3: minor (deferred): rgb(254 255 0) avec espaces non couvert
- Task 3: minor (deferred): jaune client restant hors #feff00 : .hero-side #ffeb5ab3 (index.css:619,801), config.js #ffee00, #e6a800
- Task 3: minor (deferred): hex cuivre copie en dur (DitherFill.jsx:4, RobotScene.jsx:222, Hud.jsx:140) au lieu d'OXIDATION_RAMP
- Task 3: minor (deferred): og:locale en "en/fr/ko" au lieu de ll_TT ; champs subpath/bodyText de Seo.jsx sans consommateur (T6 peut les reprendre)
- Task 3: minor (deferred): Home — readout `show_reel{time!}` orphelin ; useIsTabletDown importe depuis VideoPlayer.jsx (charge son CSS) au lieu de lib/device.js
- Task 3: minor (deferred): deux blocs .hero-front (index.css:539,547) a fusionner
- Task 4: minor (deferred): les tests de locales lisent locale.scenes[id] au lieu de passer par titleKey/bodyKey ; sceneText sans test
- Task 4: minor (deferred): "aucun import dans scenes.js" et l'interdit des formulations d'emploi dans les locales non testes (le premier est couvert implicitement par T6)
- Task 4: minor (deferred): bornes 0..1 de progress non verifiees
- Task 5: minor (deferred): lien retour en <a href> (rechargement complet) au lieu d'AppLink
- Task 5: minor (deferred): pas de test de l'independance a la langue globale (rendre lang=en quand i18n est en fr) ni de la branche ?lecture=1 de LangLayout
- Task 5: minor (deferred): seuil ">900 mots" (impose par le plan) dependant du faux texte, cassera avec le vrai texte plus court
- Task 5: minor (deferred): commentaire "// Review Focus 4" parasite ; hook insere dans une expression a virgules (style minifie)
- Task 6: minor (deferred): pas de test de l'echappement </script> du JSON-LD (prerender.mjs:89)
- Task 6: minor (deferred): SEO_LANGUAGES/SEO_DEFAULT_LANGUAGE (meta.js:387-388) dupliquent LANGUAGES/DEFAULT_LANGUAGE sans test d'egalite
- Task 6: minor (deferred): absoluteUrl (meta.js:392) duplique B (Seo.jsx:9) ; canonical calcule deux fois
- Task 6: minor (deferred): tests du prerendu dependants de l'existence de dist/ (gabarit par defaut) — passer index.html explicitement
- Task 6: minor (deferred): sameAs toujours emis ; get() leve un TypeError opaque sur cle manquante
- Task 6: minor (deferred): historique — commit intermediaire 22009a0 casse (corrige par 7d19c42)
- Task 6: minor (deferred): JSON-LD statique = Person seul, runtime = @graph (Person+WebSite+WebPage) — Person identique, formes differentes
- Task 7: minor (deferred): garde entryType === 'navigation' ecrite pour un stub qui ignore le type
- Task 8: minor (deferred): branche <Navigate> de LangLayout sans test de composant (seul resolveLanguagePath est teste)
- Task 8: minor (deferred): regle wasm retrouvee par includes('wasm') (lache) ; destinations des reecritures du jeu non verifiees ; `fixed` calcule a chaque rendu dans LangLayout

## Décisions prises pendant l'exécution

Chacune avec ce qu'elle coûte si elle est fausse. Elles amendent le plan ; le spec reste l'autorité.

- Ruling R0: travail sur place sur v6-macaco — branche dediee a ce projet, pas main ; un worktree perdrait public/case+og (28 Mo ignores) et node_modules — si faux : les commits sont deja sur la branche ou ils seraient merges.
- Ruling R1: vitest.config.js = mergeConfig(vite.config.js, { test: { globals: true, environment: 'jsdom' } }) — les tests du plan utilisent test/expect/vi sans import et du JSX — si faux : ajouter les imports.
- Ruling R2: i18n/index.js init synchrone (`initAsync: false`, i18next v24 ; ex-initImmediate) — ReadingMode et prerender lisent via getFixedT a l'import — si faux : cles brutes affichees en test.
- Ruling R3: T1 copie en.json tel quel dans fr.json et ko.json (aucun prefixe) ; T4 ecrit les corps coreens des scenes en placeholder anglais prefixe `[KO]` ; le test coreen de T4 passe en `test.skip` avec la raison "attend la provenance du ko.json de v5" — suite verte, signal visible dans chaque run — si faux : quelqu'un oublie le skip ; il apparait a chaque execution.
- Ruling R4: arrets de la rampe a i/7 (i=0..7) ; intermediaires = moyenne sRGB des voisins — si faux : simple retouche de valeurs.
- Ruling R5: T2 remplace aussi Roboto Mono par Martian Mono (--font-mono) — le spec fixe Redaction + Martian Mono — si faux : une police de plus a recharger.
- Ruling R6: Martian Mono sous-reglee latin + latin-ext ; le hangul retombe sur la pile systeme en plan 1 ; police coreenne dediee en plan 3 — si faux : rendu coreen systeme sur /ko en attendant.
- Ruling R7: nouveau module `src/lib/routing.js` exportant `resolveLanguagePath(pathname: string): string|null` (premier segment de 2 lettres non supporte -> meme chemin sous /en ; sinon null) ; LangLayout redirige avec <Navigate replace>. Le test T8 "langue inconnue" teste cette fonction (/de -> /en, /it/x -> /en/x, /games/wii-tanks/ -> null, /fr -> null). vercel.json ne porte que les 301 `?lng=` — si faux : redirection cote client au lieu de serveur pour /de.
- Ruling R8: donnees SEO pures dans `src/seo/meta.js` (pas de React/JSX), consommees par Seo.jsx et prerender.mjs ; scenes.js sans import ; prerender lit les locales via fs+JSON.parse — si faux : refacto locale.
- Ruling R9: measureTransfer().firstPaint = toutes les ressources sauf 3D (.glb .gltf .bin .hdr .ktx2) et medias (.mp3 .mp4 .webm .ogg .opus .m4a) ; full = tout — conforme au spec ("3D exclue / 3D comprise") — si faux : chiffre approximatif, documente.
- Ruling R10: le perimetre de T3 est defini par son test, pas par sa liste Files. Autorise : nettoyer en.json/fr.json/ko.json, seo/Seo.jsx, content/site.js (identite -> Damien Demontis, demontis.dev), lib/shared.js (caseList & co), pages/Home.jsx (retirer la section cases ; craft/rstage/mcf restent avec leurs marqueurs retires, le plan 3 remplace le corps), supprimer pages/DevSections.jsx, three/CaseDeviceScene.jsx, hooks/useFitHeading.js s'il n'a plus d'usage, les CSS orphelines, scripts/fetch-media.mjs + script npm + section README correspondante. CaseVideoPlayer.jsx survit, deplace en components/VideoPlayer.jsx (+ styles/video-player.css) car Home l'utilise — si faux : un fichier peut-etre inutile en plan 3.
- Ruling R11: supprimer pages/Contact.jsx, styles/contact.css et la route : le formulaire poste vers l'API du client ; les liens internes vers /contact deviennent un mailto ou disparaissent — si faux : formulaire a reconstruire avec notre propre backend.
- Ruling R12: supprimer features/measure/measure.js et l'appel trackPageView : il porte l'ID GA4 du client et dependait du consentement iubenda retire — si faux : remettre une mesure plus tard avec consentement (~1 h).
- Ruling R13: ajouter a identity.test.js un test "chaque chemin absolu d'asset reference dans src/ existe dans public/". Les references aux decors absents sont retirees (ils ne rendent rien aujourd'hui : rendu inchange) — si faux : le plan 3 redessine ces decors de toute facon.
- Ruling R14: le logo image (Nav, intro) devient un mot-symbole texte "DEMONTIS" en var(--font-display) — si faux : remplacer par un vrai logo plus tard.
- Ruling R15: Mecha_Full.glb et RobotScene restent jusqu'au plan 2 ; rien n'est mis en ligne avant la fin du plan 3 (v5 reste en ligne) — si faux : mecha visible en local seulement.
- Ruling R16: motif d'identite en `/macaco/i` (et non `/MACACO/`) — le spec vise l'identite, logos et cles compris — si faux : quelques renommages de plus.
- Ruling R17: tous les tests resolvent leurs chemins depuis le fichier de test (`fileURLToPath(new URL('..', import.meta.url))`), jamais depuis le cwd — si faux : rien.
- Ruling R18: `?lecture=1` -> LangLayout rend <ReadingMode> a la place du contenu de scroll (pas d'intro, pas de canvas, pas de dither) ; bouton de bascule dans la Nav, lien retour dans le mode lecture — si faux : emplacement du bouton a deplacer.
- Ruling R19: prerender(outDir, templatePath?) — gabarit par defaut `dist/index.html` s'il existe, sinon `index.html` source — si faux : rien.
- Ruling R20: prerender reecrit aussi dist/index.html (racine) avec le contenu `en` et hreflang x-default -> /en — si faux : la racine sans JS n'affiche que le contenu anglais.
- Ruling R21: installer la derniere 0.x de @tgwf/co2 ; API `new co2({ model: 'swd', version: 4 }).perByte(bytes, green)` a verifier dans la doc du paquet — si faux : adapter l'appel.
- Ruling R22: tests qui lisent le disque -> en-tete `// @vitest-environment node` + `fileURLToPath(new URL('..', import.meta.url))` (jsdom remplace URL et casse fileURLToPath) — si faux : tests fragiles sur CI Linux.
- Ruling R23: motif d'identite corrige en /#fef{2}00/i (+ rgb(254,255,0)) — le /#fe{2}00/i du plan matche "#fee00" et ne trouvait rien — erreur du plan, corrigee par l'implementeur.
- Ruling R24: supprimer macaco/public/case et macaco/public/og (+ leurs lignes .gitignore) — non suivis, places par le controleur dans cette session, copie integrale dans le miroir du scratchpad et sur le site en ligne ; Vite les copierait dans dist et deploierait les medias du client — si faux : les recopier depuis le miroir.
- Ruling R25: textes de remplissage des scenes = marqueur explicite ([À ÉCRIRE] fr, [TO WRITE] en, [KO] ko) + faux texte latin pour atteindre 140-160 mots ; titres = noms de scene du spec — jamais de biographie inventee, jamais la copie du client — si faux : rien n'est publie avant le plan 3, qui remplace tout.
- Ruling R26: en mode lecture, curseur natif visible (le CSS cache le curseur natif pour le curseur custom) et defilement natif (pas de scroll-root pilote ni de pont tactile) ; Nav conservee avec le lien de bascule — si faux : mode lecture inutilisable a la souris.
- Ruling R27: prerender(outDir, templatePath?) renvoie les 3 pages de langue (contrat du test) ; la page racine (contenu en + x-default) est ecrite par une fonction exportee distincte writeRootPage(outDir), appelee par l'entree CLI — R20 sans casser le test du plan — si faux : rien.
- Ruling R28: un seul motif de formulations de recherche d'emploi, extrait dans tests/helpers (importe par identity.test.js et prerender.test.js) — evite deux regex divergentes (note de la revue T3).
- Ruling R29: og:locale au format ll_TT (fr_FR, en_GB, ko_KR) — corrige le mineur T3, T6 etant la tache SEO.
- Ruling R30: titres/descriptions SEO dans les locales (cles seo.title / seo.description), lus par meta.js (pur) au runtime comme au prerendu — une seule source.
- Ruling R31: mesurer le poids avec encodedBodySize (poids reel du corps transfere, independant du cache), repli sur transferSize si encodedBodySize absent ou nul ; meme regle pour l'entree navigation — si faux : le chiffre surestime legerement (sans en-tetes HTTP).
- Ruling R32: T8 copie public/games/wii-tanks/** et public/CV_Damien_DEMONTIS_{EN,FR}.pdf dans macaco/public/ (contenu identique -> git ne stocke aucun nouveau blob) et porte dans macaco/vercel.json les 3 regles d'en-tetes, les 2 reecritures du jeu, puis un repli SPA vers /index.html ; tests d'existence + d'en-tetes — si faux : 75 Mo de doublon dans l'arbre de travail tant que l'app v5 n'est pas retiree.
- Ruling R33 (correction d'un ruling du controleur) : hote canonique = https://www.demontis.dev — l'apex repond 307 vers www (verifie), et v5 publie canonical/og:url en www. site.js, JSON-LD url, canonical, hreflang et sitemap passent en www ; les dispatchs T3/T6 donnaient l'apex : erreur du controleur — si faux : un remplacement de chaine.
- Ruling R34: macaco/public/robots.txt (Allow tout + Sitemap: https://www.demontis.dev/sitemap.xml), comme v5.
- Ruling R35: une seule vague de correction = I1, I2 (motif elargi + allowlist, buildCommand Vercel `npm test && npm run build`), I3 (sw.js kill-switch), en-tete X-Robots-Tag noindex sur /CV_*.pdf, reecritures explicites /fr /en /ko -> /{l}/index.html avant le repli SPA, + mineurs bon marche : M1 (Navigate de / garde search+hash), M2 (301 /games/wii-tanks -> /games/wii-tanks/), M3 (le build echoue si le prerendu n'a pas ecrit les pages), M4 (h1 + pied de page langues/mailto dans le noscript, h1 dans le mode lecture), M6 (coreen machine non marque dans ko.json -> marque [KO]), M7 (test : aucun lien vers CV_*.pdf dans src), M9 (src/i18n/languages.js pur, consomme par index.js, routing.js, meta.js -> supprime SEO_LANGUAGES), M11 (textes OFL de Martian Mono et Noto Sans JP), M12 (commentaires obsoletes), et tests du prerendu avec gabarit explicite. Le reste attend les plans 2/3 ou le deploiement — si faux : une vague plus large aurait coute plus cher que les taches.
- Ruling R36 (defaut du plan) : le test T8 "aucune redirection ne commence par /games" est amende pour autoriser la seule 301 /games/wii-tanks -> /games/wii-tanks/ — sans elle le jeu casse a l'URL sans slash (chemins relatifs Build/ et TemplateData/) — si faux : rien.
