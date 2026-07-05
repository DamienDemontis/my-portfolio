# Catalogue de propositions — demontis.dev « le meilleur du monde »

Analyse complète : 2 audits code (UI/UX + navigation), walkthrough visuel desktop + mobile de
toutes les sections, système de navigation Foundry Console livré. Chaque proposition est
numérotée — réponds juste avec les numéros que tu veux (ex: « 1, 10, 21, 28, 49 »).

Effort : S (<1h) · M (demi-journée) · L (journée+). Impact artistique : ★ à ★★★.

## Diagnostic en une phrase
La base est forte (identité métal, shaders, navigation) mais le site est 100% grayscale sans
accent, plusieurs sections utilisent des patterns datés (% de compétences, % de langues), le
Calendly blanc casse tout, et il manque une couche « signature » (couleur, son, matière) qui
ferait passer de « très bon » à « inoubliable ».

---

## A — Direction artistique globale
1. **(M, ★★★) Couleur d'accent signature** : un seul accent « métal en fusion » (or chaud
   ~#d4a24e) utilisé avec parcimonie — droplet du rail, caret du terminal, hover states, un mot
   du hero. Un site 100% gris + UN accent = identité immédiate.
2. (S, ★★) Grain animé subtil global (la surface « vit », 2% opacité, steps(4)).
3. (M, ★★★) Cartes → « plaques usinées » : gradient directionnel brossé + edge-light 1px +
   ombre interne, partout (projets, stats, credentials). Fini les rectangles plats.
4. (M, ★★) Monogramme « DD » façon marque de forge frappée : hero (discret), footer, favicon,
   image OG. Une marque, pas juste un nom.
5. (M, ★★) Éclairage directionnel cohérent : tous les reflets/sheens orientés depuis la même
   « source de lumière » (haut-gauche) — détail que les juges Awwwards remarquent.
6. (S, ★) Vignette qui « respire » très lentement (8s).
7. (S, ★★) Mode contemplation caché (touche G) : masque tout le chrome, laisse les shaders.

## B — Hero
8. (S, ★★) Nom beaucoup plus massif sur mobile (il fait ~80px dans un viewport de 812px).
9. (S, ★★) CTA « Me contacter / CV » → vrais boutons métal magnétiques (actuellement deux
   petits liens soulignés).
10. **(M, ★★★) Titre réactif à la souris** : `angle`/`distortion` du LiquidMetal suivent le
    curseur — le métal se déforme sous ta main. Personne n'a ça.
11. (S, ★) Sous-titre en effet Decrypted au chargement (composant déjà présent).
12. (M, ★★) Orbes métal flottants en parallaxe profondeur derrière le titre
    (MetalFloatingOrb existe déjà et n'est utilisé nulle part).
13. (S, ★) Heure locale + lieu en mono dans un coin : « NANCY, FR — 14:32 » (vivant, humain).

## C — Chargement
14. **(S, ★★) Loader 1×/session + skippable** (clic/touche/scroll passe). Actuellement 2,2s
    forcées à CHAQUE visite — le plus gros point de friction du site.
15. (M, ★★) Loader narratif : l'orbe se « forge » — COULÉE → TREMPE → POLISSAGE au lieu d'un %.

## D — À propos
16. (M, ★★★) Portrait en gravure métal : ta photo en halftone/dither monochrome, révélée en
    couleur au hover — même langage que la section Photo. Il n'y a AUCUNE photo de toi.
17. (S, ★) Compteurs stats animés (CountUp au scroll) sur les plaques 3+/20+/15+/100+.
18. (M, ★★) Mini-timeline géographique FR → 🇰🇷 KR → FR gravée.
19. (L, ★) Lanyard : remplacer par webm alpha (−3 Mo de three.js) ou le supprimer.

## E — Expérience
20. (M, ★★) Hiérarchie inversée : intitulé du poste en GROS, décor git-log en secondaire —
    aujourd'hui le concept avale le contenu.
21. **(S, critique) Retirer `feat: join your company?`** — signal de recherche d'emploi
    visible par ton employeur (contrainte que tu m'as donnée).
22. (M, ★★) Hover sur un commit → plaque détail (réalisations, stack) en side-panel.
23. (S, ★) Logos entreprises : quasi invisibles (noir sur noir) → plaques révélées au hover.

## F — Compétences
24. (M, ★★) Tuer les pourcentages (auto-évaluation datée) → trois tiers : « FORGÉ DANS /
    TRAVAILLE AVEC / EXPLORE ».
25. (L, ★★★) Constellation interactive : graph de nœuds draggable reliant les technos
    (React—Next—TS...), rendu métal. Section signature possible.
26. (M, ★★) Chips avec remplissage liquid metal au hover.
27. (L, ★★) Alternative : « l'établi » — outils accrochés au mur d'un atelier, skeuomorphisme
    artistique assumé.

## G — Projets
28. **(S, ★★★) Screenshots grayscale → couleur au hover** (le langage existe déjà en Photo).
    Le meilleur ratio effort/effet artistique du catalogue.
29. (L, ★★★) Études de cas : modal/page par projet featured (problème → solution → stack →
    résultat, screenshots) — ce que les recruteurs veulent vraiment.
30. (S, ★) Tilt 3D subtil au hover (TiltedCard déjà dans le repo).
31. (M, ★) Filtres par techno (les tags deviennent cliquables).
32. (M, ★★) Wii Tanks jouable en mini-iframe directement dans la carte (« essaie-moi »).
33. (S, ★★) Numérotation géante gravée (01, 02…) en watermark sur chaque carte.

## H — Formation / Certifs / Langues (consolidation)
34. (M, ★★) Fusionner en UNE section « Parcours » (3 volets) → profondeur 10 → 8 sections,
    moins de scroll, sections faibles regroupées.
35. (M, ★★★) Langues : tuer « French 100% » (cliché connu) → mots gravés en liquid metal
    (« Bonjour / Hello / Ciao / 안녕하세요 »), hover = niveau + anecdote.
36. (M, ★★) Certifications en médailles frappées (badges métal circulaires), pas en cartes.

## I — Centres d'intérêt
37. (M, ★★★) Musique : preview audio 30s au clic + le ParticleVisualizer (déjà dans le repo)
    réagit au son. Grosse expérience sensorielle à faible coût.
38. (S, ★★) YouTube : façades custom (thumbnail grayscale + bouton play métal), l'iframe ne
    charge qu'au clic — supprime le rouge/blanc YouTube qui casse le thème.
39. (S, ★) Carousel albums : défilement auto lent + drag.

## J — Photographie
40. (M, ★★) Bouton « plein écran » : le dôme prend tout le viewport, chrome masqué.
41. (M, ★★) Overlay lieu/date au hover (« Séoul — oct. 2023 ») — transforme la galerie en
    carnet de voyage.
42. (M, ★) Mobile : bande de film scrollable au lieu du dôme 3D (perf).

## K — Contact
43. **(S, ★★) Calendly thémé sombre** (params URL background/text/primary) ou bouton popup —
    le bloc blanc est la pire casse du thème de tout le site.
44. (M, ★★) Formulaire : focus glow, validation inline, envoi → shimmer de succès.
45. (S, ★★) Email en très gros type liquid metal, clic = copie.
46. (S, ★) Microcopy « réponse sous 24h ».

## L — Navigation (raffinements de l'existant)
47. (M, ★★) Rail : miniatures des plaques Atlas au hover des crans.
48. (S, ★★) Vrai code Konami au clavier → tout le métal passe or 10s.
49. **(L, ★★★) Design sonore** : clics métalliques, whoosh au fast-travel, drone ambiant très
    bas, toggle mute visible. QUASI PERSONNE n'a un bon audio design — c'est LE différenciateur
    « meilleur du monde ».
50. (M, ★★) Curseur contextuel : loupe sur les photos, play sur vidéos, « DRAG » sur carousels.

## M — Motion
51. (S, ★) Tokens de motion unifiés (3 springs nommés au lieu de 4+ configs ad hoc).
52. (M, ★★) Parallaxe multi-couches par section (titre/contenu/fond à vitesses différentes).
53. (M, ★★) Titres de section : reveal « coulée » — le métal coule dans les lettres au scroll.
54. (M, ★) Switch de langue avec View Transitions API (crossfade doux au lieu du swap sec).

## N — Performance (perçue)
55. (L, ★) Lanyard → webm alpha : −3 Mo (le plus gros gain du site).
56. (M, ★) AVIF + srcset sur toutes les images.
57. (S, ★) Fonts self-hosted + `font-display: swap` (supprime le flash de police).
58. (S, ★) Dôme photo : moins de segments sur mobile.

## O — Accessibilité
59. (S) Contrastes : `--metal-text-muted` #525252 → #8a8a8a (échec WCAG actuel).
60. (S) Hiérarchie headings propre + skip-link réel.

## P — Méta / présence
61. (M, ★★) Image OG générée par locale : ton nom en liquid metal statique — le lien que tu
    partages devient une œuvre.
62. (S, ★) hreflang EN/FR/KO + sitemap.
63. (M, ★★) Page 404 artistique : un shard perdu qui flotte, « cd /home » pour rentrer.

## Q — Signature « meilleur du monde »
64. (L, ★★★) **Le Lab** : section cachée (`cd lab` dans la console) avec tes expériences
    WebGL/shaders/jeux — le terrain de jeu qui prouve l'artiste derrière l'ingénieur.
65. (M, ★) Carte de visite générée : bouton → PDF « plaque métal » avec tes infos.
66. (M, ★★) Thème alternatif caché (cuivre/or) débloqué quand le rail est 100% exploré —
    récompense de l'explorateur.

---

## Si je devais choisir pour toi (top 10)
21 (critique) → 1 → 28 → 43 → 10 → 49 → 16 → 35 → 14 → 64
