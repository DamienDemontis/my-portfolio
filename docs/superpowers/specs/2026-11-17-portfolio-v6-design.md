# Portfolio v6 — conception

Date : 2026-11-17
Branche : `v6-macaco`
Base technique : reconstruction de studiomacaco.ch (commits `4dccddc`, `d1bc8ae`)

## Intention

Refaire demontis.dev en reprenant la mécanique de mise en scène de MACACO —
un scroll cinématique piloté, un personnage 3D présent en permanence — pour
raconter Damien plutôt que de lister ses compétences.

Le site doit impressionner un recruteur en 90 secondes et lui laisser le
sentiment d'avoir rencontré quelqu'un, pas lu un CV. Les angles de rareté à
servir : le combo web + Unity/WebGL, les quatre ans d'enseignement, le
bilinguisme FR/EN/KO, et la capacité à livrer du produit.

## Pourquoi maintenant

Le portfolio actuel (branche `v5`) est un système « metal » monochrome
complet — 45 composants, trois langues, un lecteur musical, des shaders.
Il est techniquement solide mais structurellement plat : une liste de
sections empilées. La base MACACO apporte ce qui lui manque, une
dramaturgie. Le but est de fusionner les deux : la matière de v5, la mise
en scène de MACACO.

## Objectifs

- Un scroll continu, une seule page, le personnage jamais hors champ.
- Huit scènes qui racontent un arc, visuel et narratif.
- Tenir les Core Web Vitals malgré la 3D.
- Trois langues, FR/EN/KO.

## Non-objectifs

- Pas de blog, pas de CMS, pas de section « articles ».
- Pas de refonte du design system v5 : on en reprend les tokens utiles,
  on ne le porte pas.
- Pas de CTA de recrutement (voir contraintes).

## Anti-objectifs

Ce qui ferait échouer le projet même s'il fonctionne techniquement :

- **Un site qui dit « je cherche un poste ».** Des collègues et la
  hiérarchie de Damien peuvent le visiter. Aucune formule du type
  « disponible à partir de », « ouvert aux opportunités », « recherche ».
  Le ton reste celui de quelqu'un qui montre son travail.
- **Un clone de MACACO avec d'autres couleurs.** La mécanique est
  reprise, l'identité doit être autre. Si un lecteur qui connaît
  studiomacaco.ch reconnaît le site, c'est raté.
- **Un portfolio qui met 8 secondes à afficher quoi que ce soit.** Le
  cinématique ne doit pas se payer sur le temps d'affichage.
- **Du texte de remplissage.** Huit scènes à 150 mots, c'est 1 200 mots
  en tout. Chaque phrase doit valoir sa place.

## Contraintes

1. **Invisibilité de la recherche d'emploi.** Contrainte de ton, non
   négociable, sur chaque mot du site.
2. **Pas d'artiste 3D ni de budget externe engagé.** La production du
   personnage doit tenir avec les outils disponibles. Seule exception
   envisagée : une cabine de scan pro, sur décision de Damien.
3. **Le contenu reste à écrire.** Damien écrit, les skills de rédaction
   interviennent en passe d'édition.
4. **La base est du code reconstruit**, pas du code écrit à la main :
   les variables locales portent encore des noms de minifieur. Toute
   modification profonde d'une scène se paie en lisibilité.

## Tranché par Damien

**Droits sur la base MACACO : acquis.** Le code et le design reconstruits
peuvent être republiés sous demontis.dev. On part de `macaco/` tel quel,
on re-skinne et on modifie sur place. Restent à retirer pour des raisons
d'identité, pas de droit : les rayures jaune/noir, Syncopate, les 25 case
studies, les logos, le favicon, le manifest et la configuration iubenda.

**Audio : la playlist actuelle de v5 est conservée.** Ce sont des
enregistrements commerciaux servis depuis le domaine ; le risque a été
posé et assumé. Mitigation retenue, et elle fait partie de la décision :
extraits de 20 à 30 secondes, lecture déclenchée explicitement par
l'utilisateur, jamais de boucle de fond, jamais d'autoplay.

**Ce qui survit de demontis.dev :**

- **Wii Tanks jouable**, servi à `/games/wii-tanks/`, atteint par un
  bouton depuis la scène 3. C'est la meilleure preuve du combo
  web + Unity/WebGL. Le long-métrage reste une page ; le jeu est une
  sortie assumée.
- **Les deux CV PDF** : les URL continuent de répondre, mais elles
  sortent du sitemap et aucun lien du site n'y mène. Un CV téléchargeable
  est en soi un signal de recherche d'emploi, ce que la contrainte 1
  interdit.
- **Abandonnés** : la section photographie (elle ne rentre dans aucune
  scène sans casser l'arc) et le compteur de poissons Supabase (une
  dépendance externe et une clé d'API pour un gadget, sur une page au
  budget de performance serré).

**Pas de date de livraison.** v5 reste en ligne jusqu'au bout, on bascule
une seule fois, quand les huit scènes tiennent. Donc : pas de jalon
intermédiaire à défendre, et aucune raison de bâcler une scène pour
tenir un planning.

## Approches considérées

Trois structures ont été mises sur la table avant d'écrire ce document.

### A — Hub éditorial (écartée)

Hero court, puis un vrai site de contenu : notes techniques, études de
cas longues, flux RSS, 20+ URL. Le plus fort en référencement et pour
les angles DevRel/Solutions Engineer.

Écartée : ~15 000 mots à écrire, et le 3D n'y sert plus que de vignette
d'accueil. Le rapport effort/effet est mauvais pour quelqu'un dont la
force visible est la mise en œuvre technique.

### B — Hybride à deux vitesses (écartée)

Home cinématique dont chaque scène ouvre une page indexable et riche en
texte. Compromis entre spectacle et référencement.

Écartée par Damien. Elle aurait comblé le manque de contenu écrit repéré
comme un frein sur les postes DevRel, mais elle double la surface à
construire et à maintenir, et dilue l'effet du scroll continu.

### C — Long-métrage (retenue)

Une seule page, un seul scroll, zéro compromis sur la mise en scène. Le
personnage traverse les huit scènes sans jamais quitter l'écran.

Retenue parce que c'est exactement ce que la base MACACO sait déjà
faire : le travail de reconstruction a livré un moteur de scroll piloté,
des scènes 3D, un système de transition. Construire B ou A reviendrait à
en démonter une partie.

**Ce que ce choix coûte, et qui est accepté :** une seule URL à
référencer, et le manque de contenu écrit reste entier. Deux
compensations sont intégrées au plan — un `<noscript>` rédigé comme un
vrai document, et un mode lecture (voir SEO et Idées retenues).

## Le personnage

**Décision (révisée le 2026-11-17 par Damien) : un portrait ressemblant,
le plus fidèle possible, dans son vrai manteau gris.** Elle remplace la
silhouette stylisée encapuchonnée retenue d'abord.

La ressemblance vient de la capture, pas de la génération : les outils
image→3D et les avatars « depuis trois selfies » produisent un humain
plausible, pas Damien. Le personnage est donc **scanné** (photogrammétrie,
maison ou en cabine), puis nettoyé, rigué et posé. Le dither du site garde
ce qui fait reconnaître quelqu'un — silhouette, proportions, structure du
visage, coupe du manteau — et efface les défauts de texture.

Le chemin complet, phase par phase, avec ce que fait Damien et ce que fait
le constructeur : `docs/superpowers/notes/2026-11-17-personnage-feuille-de-route.md`.

Contraintes qui en découlent :

- Rien sous licence de recherche ou non commerciale dans ce qui est
  publié : ni GVHMR ni le corps SMPL-X pour les mouvements.
- Squelette humanoïde de type Mixamo, pour que poses et animations
  restent interchangeables.
- Accessoires par scène (casque, écharpe…) attachés au squelette ; la
  génération 3D par IA est réservée aux objets.

Le personnage change de pose et d'accessoires à chaque scène — c'est lui
qui porte la continuité. Les poses s'appuient sur des photos et des clips
de la gestuelle de Damien ; leur réglage fin est laissé au constructeur.

## Les huit scènes

L'arc visuel va du chrome au végétal : le métal s'oxyde à mesure qu'on
descend. L'arc narratif va de ce que Damien fait à ce qu'il transmet.

| # | Scène | Le personnage | Matière | À écrire |
|---|---|---|---|---|
| 1 | Ouverture | de dos, lumière froide | chrome pur | nom, une ligne |
| 2 | Le métier | face à un mur de données | chrome, premières piqûres | PandaLab, HealthTech, ISO 27001/HDS, 23 900 utilisateurs |
| 3 | Ce que je construis | manipule des objets flottants | acier brossé | JobNeko, Leon'Art, Wii Tanks, WebGL — avec le bouton vers le jeu jouable |
| 4 | La musique | casque audio | néon chaud sur métal | ce que la musique lui fait ; visualizer branché sur la lecture réelle, déclenchée au clic |
| 5 | La Corée | parka, neige | néon froid, patine | un an à Keimyung, ce qui en reste |
| 6 | Le vivant | racines perçant le sol | cuivre oxydé, verdigris | collapsologie, éco-conception |
| 7 | La transmission | face à des silhouettes plus petites | lumière, métal apaisé | quatre ans, 200+ étudiants |
| 8 | Sortie | s'éloigne | retour au noir | contact, sans appel à candidature |

La scène 6 est l'aboutissement de l'arc visuel : c'est là que le chrome
du début a fini de rouiller. La direction artistique raconte la section
au lieu de l'illustrer.

La scène 7 porte l'angle le plus rare pour les postes visés — quatre ans
d'enseignement, 200+ étudiants. Elle mérite le même soin que la 3.

## Direction artistique

### Couleur

**Le métal qui s'oxyde.** Une seule rampe, parcourue de haut en bas :

```
chrome      #D6D9DC  ->  acier     #8A8F98
cuivre      #B87333  ->  rouille   #8C3A1E
verdigris   #2F6E63  ->  mousse    #3A4A3C
fond        #0A0B0C         os (texte)  #E6E1D8
```

Pas d'accent unique posé sur tout le site : la couleur d'accent *est* la
position dans le scroll. Le système d'accent par page déjà présent dans
la base (`state/accent.jsx`) sert exactement à ça.

### Typographie

Le v5 tourne sur Inter + Bebas Neue + Metal Mania. Les trois sont très
vues, et Metal Mania date. Proposition :

- **Display : Redaction.** Serif dessinée pour un projet sur
  l'incarcération, publiée en six degrés de dégradation (Redaction 10 à
  100). Utiliser un degré différent selon la scène, de net à rongé,
  renforce l'arc d'oxydation. Gratuite.
- **Corps et interface : Martian Mono.** Grotesque monospace, large,
  technique sans être sci-fi.
- **Coréen : Noto Sans KR**, déjà chargé par la base.

Alternative si Redaction s'avère illisible en petit : Cinzel en display,
plus gravé que gothique.

### Éléments 2D et 3D

Repris de la base : le dither WebGL, les bandes de danger (à retravailler,
trop MACACO), le curseur personnalisé, le voile de transition.

À produire : les racines de la scène 6, le visualizer audio de la scène 4
(le `ParticleVisualizer` de v5 est récupérable), les silhouettes de la
scène 7.

À supprimer : les rayures jaune/noir, la typo Syncopate, tout ce qui
identifie MACACO.

## Référencement

Une seule page, donc une seule cible : la requête « Damien Demontis » et
les combinaisons rares (lead dev + HealthTech, web + Unity/WebGL,
développeur bilingue FR/KO).

- **Le `<noscript>` est rédigé comme un vrai document**, pas comme un
  repli. C'est la version indexable du site. La base MACACO fait déjà
  exactement ça et le mécanisme est en place.
- Prérendu du HTML au build. Le script d'origine
  (`scripts/generate-seo.mjs`) n'était pas dans le bundle : à réécrire.
- JSON-LD `Person` : `knowsAbout`, `alumniOf`, `worksFor`, `sameAs`.
  Rien qui signale une recherche de poste.
- `hreflang` FR/EN/KO, trois URL de langue.

## Performance

Le point dur : un site 3D cinématique qui passe les Core Web Vitals.

- **Le LCP doit être le titre, pas le canvas.** Le 3D se charge après.
- GLB du personnage sous 3 Mo (révisé : un vrai scan texturé, textures
  1024 px que le dither rend suffisantes), compression meshopt ou Draco.
- Les paliers responsive de la base (`lib/device.js`) sont déjà là :
  mobile, tablette, desktop, avec densité de pixels plafonnée.
- `prefers-reduced-motion` respecté sur toutes les scènes.
- Budget : moins de 1 Mo au premier affichage, 3D exclue.

## Idées retenues

**Le compteur carbone du site, affiché dans la scène 6.** Le poids réel
de la page et son équivalent gCO2, mesurés et montrés. L'optimisation
devient une preuve au lieu d'un argument. C'est la seule idée qui serve
à la fois le propos écologique, la crédibilité technique et le
référencement.

**Le mode lecture.** Un bouton qui aplatit le site en un document texte
lisible. Accessibilité, et surtout : c'est la réponse au manque de
contenu écrit qu'impose le format long-métrage. Le texte existe déjà
pour le `<noscript>`, le mode lecture ne fait que le rendre visible.

**La scène 5 en coréen.** La typo et la langue basculent sur cette scène
seulement, quelle que soit la langue choisie. La locale KO existe déjà
en v5. Preuve vivante plutôt qu'affirmation.

**Le personnage suit le curseur.** Orientation de la tête ou du buste.
Peu coûteux, rend la présence beaucoup plus forte.

## Idées écartées

- Easter egg Konami : le v5 a déjà une palette de commandes, redondant.
- Terminal interactif : vu partout sur les portfolios de développeurs.
- Galerie photo : présente en v5, mais elle casse l'arc narratif.

## Décisions de construction

Tranchées après relecture. Ce sont mes choix, pas ceux de Damien — à
corriger s'ils ne vont pas.

**Architecture du scroll : un canvas persistant derrière des sections DOM
épinglées**, et non l'extension de la timeline du hero à tout le site.

Le hero de la base remappe la position de scroll sur une timeline en
millisecondes (`config.scrollMs`) qui pilote des plans de caméra. Étendre
ce moteur aux huit scènes voudrait dire opérer précisément le code que la
contrainte 4 signale : les constantes de timing de l'intro sont encore
minifiées et leur rôle n'est pas déductible du bundle. Un canvas
persistant garde le texte en flux natif — et le mode lecture,
l'accessibilité et `prefers-reduced-motion` deviennent presque gratuits.
Conséquence à assumer : le « moteur de scroll piloté » de la base sert
moins qu'espéré, on en reprend surtout l'aspect.

**Budget du personnage : 3 Mo pour le système entier** (révisé depuis
1,5 Mo avec le passage au scan), pas par scène. Un seul maillage riggé,
des accessoires interchangeables montés sur le même squelette (casque,
écharpe, lunettes). Les silhouettes de la scène 7 sont le même maillage,
décimé, sans texture ni accessoire.

**Mobile : parité narrative, qualité dégradée.** Les huit scènes, moins
d'effets, densité de pixels plafonnée, personnage figé sous un seuil de
performance. Le mode lecture est le plancher, pas une expérience
distincte.

**Scène 5 : typographie et titres en coréen, corps dans la langue
active.** Un recruteur francophone ou anglophone comprend la scène ; le
coréen reste visible comme preuve. Les attributs `lang` suivent, dans le
`<noscript>` comme dans le mode lecture.

**Compteur carbone : deux nombres, pas un.** Le premier affichage (3D
exclue) et l'expérience complète (3D comprise). Un compteur qui cacherait
la partie lourde serait exactement le greenwashing que la scène critique.
Le contraste entre les deux chiffres *est* le propos.

**150 mots par scène est un budget ferme**, pas une estimation : la
typographie display et la durée des scènes se calent dessus.

**Redirections** des URL `?lng=fr` / `?lng=ko` indexées vers la nouvelle
structure `/fr` `/en` `/ko`.

**Outillage du personnage : gratuit.** Photogrammétrie (RealityScan
desktop ou COLMAP + OpenMVS), Blender scripté, rig Mixamo (ou Puppeteer en
local), poses scriptées, accessoires générés en local. Remplace l'abonnement
Meshy envisagé d'abord. Dépenses optionnelles : cabine de scan pro, un mois
de Rokoko Vision pour un geste capturé.

**Langue source : le français d'abord.** Tu écris en français, je produis
l'anglais. Pour le coréen, dis-moi d'où vient le `ko.json` de v5 : s'il a
été écrit ou relu par un humain, il sert de base ; s'il sort d'une
machine, on ne le prend pas comme référence — ton niveau A2 ne te permet
pas de valider le résultat, et une scène entière repose dessus.

## Ce qui est laissé au constructeur

- Les poses exactes du personnage scène par scène.
- Le détail des transitions entre scènes.
- Le choix entre meshopt et Draco.
- L'implémentation du visualizer audio (reprise ou réécriture du
  `ParticleVisualizer` de v5).
- La mécanique du mode lecture.

## Outils de rédaction

`coreyhaines31/marketingskills` (~50k étoiles, MIT) en passe d'édition,
skill `copywriting` seule : `npx skills add
coreyhaines31/marketingskills --skill copywriting`. Calibrée pour du SaaS
B2B — utile pour resserrer, inutile pour trouver quoi dire. La matière
vient de Damien.
