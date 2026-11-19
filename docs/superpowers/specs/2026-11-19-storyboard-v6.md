# Portfolio v6 — storyboard

Décidé avec Damien le 2026-11-19 : on garde toute la mécanique de MACACO (intro cinématique, HUD, scène tramée, rideau du pied de page), son personnage remplace le robot, et on ajoute les sections du plan de base. Sa consigne : « faut que ce soit artistique, pense aux plans cinématiques, aux modèles 3D que tu peux aller chercher… pousser le côté plan vraiment travaillé, divers, original ».

Ce document remplace la décision « canvas persistant » du spec (`2026-11-17-portfolio-v6-design.md`, « Architecture du scroll ») : chaque section est une scène épinglée avec son propre canvas et sa propre timeline de plans, comme la scène des expertises de MACACO.

## Grammaire commune

- **Un geste signature par section**, jamais deux fois le même : contre-plongée en grue, orbite à 360°, dolly zoom, mise au point qui bascule, plan zénithal, travelling latéral, caméra qui traverse un objet.
- **Le rythme des coupes** : une section ne commence jamais avec la focale, la hauteur ou le mouvement sur lesquels finit la précédente (large ↔ macro, fixe ↔ mobile, haut ↔ bas).
- **Focales variées**, de l'équivalent 18 mm (déformant, dramatique) au 135 mm (compression, gros plan), avec le champ de vision three.js calé en conséquence.
- **Alternance de rendu**, comme MACACO : PBR irisé → aplat → tramé → net → néon → tramé → organique → tramé → aplat.
- **Couleur** : chaque section prend sa teinte dans la rampe d'oxydation (chrome → acier → cuivre → rouille → vert-de-gris → mousse).
- **Le personnage joue** : une animation propre à chaque section (marche, écoute, enseigne, touche une fleur), écrite comme les quatre clips de l'intro.
- **Accessibilité et poids** : `prefers-reduced-motion` donne un plan fixe par section ; chaque scène charge ses modèles à l'approche (une hauteur d'écran avant), au plus 1,5 Mo par section après compression ; le texte reste en DOM, lisible et indexé.

## Les sections

| # | Section | Décor | Rendu | Geste signature |
|---|---|---|---|---|
| 1 | Ouverture | ville de l'intro | PBR irisé | contre-plongée en grue à l'atterrissage |
| 2 | Maxime | – | aplat cuivre, titre glitch | (existant) |
| 3 | Expertises | plateau noir | tramé | une focale par expertise |
| 4 | Projets | salle de projection | net, lumière du projecteur | travelling le long du faisceau |
| 5 | Musique | salle d'écoute néon | néon chaud, bloom | orbite à 360° |
| 6 | Corée | ruelle de Daegu, nuit, neige | tramé froid + néons | grue descendante depuis les fils électriques |
| 7 | Le vivant | ruine qui reverdit | organique, profondeur de champ | bascule de mise au point |
| 8 | Transmission | classe fantôme | tramé, craie | contrechamp par-dessus l'épaule |
| 9 | Sortie | grande porte de fer | aplat | la porte se referme sur le rideau |

### 1. Ouverture (existante, à reprendre)
Tout l'enchaînement de MACACO reste : gros plan de profil, réveil sous le HUD, lévitation irisée, plongées par-dessus l'épaule, chute et réception dans la ville.
- **À corriger** : après la réception, la caméra visait le robot accroupi et coupe la tête. Remplacer par une **contre-plongée en grue** : départ au ras des bottes, montée jusqu'au visage pendant que les lumières de la ville s'allument derrière lui ; le titre arrive à la fin du mouvement.
- Le HUD affiche ses « diagnostics » (stack, langues), les mots verticaux passent en coréen (contenu-v6).

### 3. Expertises (scène tramée existante)
Six plans, un par expertise, chacun avec une focale et une hauteur différentes ; les étiquettes de MACACO restent.
- **E-santé** : très gros plan sur l'œil, 135 mm ; une ligne d'électrocardiogramme traverse l'image en balayage tramé.
- **Interfaces** : macro sur la main, 35 mm ; des panneaux d'interface translucides flottent autour des doigts.
- **Tests** : plan zénithal, 24 mm ; une grille de coches vertes clignote au sol autour de lui.
- **Produits IA** : profil en silhouette, 50 mm ; un champ de particules en réseau autour de la tête, mise au point qui passe des particules au visage.
- **3D et jeux** : contre-plongée débullée, 18 mm ; son double en fil de fer décalé à côté de lui (le modèle et son rendu).
- **Transmission** : recul large ; ses copies tramées se multiplient derrière lui.

### 4. Projets : la salle de projection
Décor : salle noire, **projecteur 8 mm** (`filmstrip_projector_8mm`) au premier plan, faisceau volumétrique (cône additif, poussière en particules), un écran où passent les projets (vidéos ou captures). Il regarde l'écran, éclairé par l'image.
- **Macro** sur la bobine qui tourne, mise au point qui glisse vers la poussière du faisceau.
- **Par-dessus son épaule** vers l'écran, sa silhouette découpée par la lumière.
- **Signature : travelling latéral le long du faisceau**. Chaque palier de scroll passe au projet suivant avec une brûlure de pellicule.
- **Contrechamp** depuis l'écran : son visage éclairé par les couleurs du projet.

Projets : JobNeko, Leon'Art, Wii Tanks (bouton « Jouer »), la plateforme e-santé (niveau produit), la reconnaissance faciale, MSC Découverte. Un clic ouvre le projet.

### 5. Musique : la salle d'écoute
Décor : sol noir réfléchissant, **boombox** (`boombox`), néons cuivre. Il porte un **casque** (modèle procédural : arceau et coques, attaché à l'os de la tête). Le visualiseur de particules du v5, branché sur la vraie lecture, forme un anneau autour de lui. La musique ne démarre qu'au clic et le fichier ne se télécharge qu'à ce moment-là.
- **Très gros plan** sur une coque du casque, liseré néon.
- **Signature : orbite à 360°** lente autour de lui, l'anneau pulse sur les basses.
- **Dolly zoom** (effet vertigo) sur le drop.
- **Plan en contre-plongée** au travers de l'anneau de particules.

Animation : tête qui bat la mesure, épaules qui suivent.

### 6. Corée : la ruelle de Daegu
Décor : collection `hidden_alley` de Poly Haven, avec façades d'immeubles, rideaux de fer, blocs de climatisation, **poteaux électriques aux fils emmêlés** (très coréen), lampadaires, voiture bâchée et plaque d'égout. On ajoute des **enseignes au néon en hangeul** (plans émissifs : 잇다, 벼리다, une enseigne de 노래방), de la neige en particules et un sol mouillé qui reflète les néons.
- **Signature : grue descendante** depuis les fils électriques jusqu'à la rue (24 mm).
- **Travelling d'accompagnement** : il marche sous les lampadaires.
- Des **phares** balaient la ruelle et le découpent en silhouette (lumière seule, pas de voiture qui passe).
- **Gros plan** sur les flocons qui se posent sur l'épaule du manteau, bokeh des néons derrière.
- **Plan zénithal** à travers les fils.

Rendu tramé froid ; les néons gardent leur couleur et passent au-dessus de la trame grâce au bloom.

### 7. Le vivant : la ruine qui reverdit
Décor : sol de chrome qui s'oxyde en vert-de-gris (shader piloté par le scroll), **racines** (`root_cluster_01`, `pine_roots`), souche moussue (`tree_stump_01`), rochers moussus (`rock_moss_set_01`), tronc mort (`dead_tree_trunk`), **fleurs** qui percent les fissures (`flower_gazania`, `dandelion_01`).
- **Signature : bascule de mise au point**. Macro au ras d'un pissenlit, faible profondeur de champ, lui flou derrière ; la netteté passe sur lui.
- **Zénithal en accéléré** : le vert-de-gris s'étend et les racines poussent avec le scroll.
- **Travelling au ras du sol** à travers les herbes.
- Il se penche et effleure une fleur : gros plan sur la main.

Le compteur carbone (deux chiffres) est gravé sur une plaque oxydée du décor.

### 8. Transmission : la classe fantôme
Décor : **tableau noir** (`standing_chalkboard_01`), rangées de **pupitres et chaises d'école** (`SchoolDesk_01`, `SchoolChair_01`). Les élèves sont ses copies tramées en plus petit (le fantôme de MACACO), assises, qui tournent la tête vers lui.
- **Plan large** depuis le fond de la classe : dos des élèves, lui au tableau.
- **Signature : contrechamp par-dessus son épaule** vers les rangées de fantômes.
- **Gros plan** sur la craie : le texte s'écrit au tableau (C, Docker, design patterns…).
- La caméra recule et ressort par une fenêtre.

### 9. Sortie : la porte
Décor : **grande porte de fer** (`large_iron_gate`) ouverte sur une lumière blanche, brouillard au sol.
- **Steadicam** derrière lui pendant qu'il marche vers la lumière.
- **Plan fixe large** : il entre dans la lumière, la porte se referme.
- Le choc de la porte enchaîne sur le rideau du pied de page (contact).

## Modèles et licences
Toutes les sources sont CC0 (Poly Haven) : utilisables sans attribution, commitables dans le dépôt public. Chaque modèle passe par le pipeline de l'asset du personnage (texture WebP ≤ 1024 px, simplification des maillages lourds, meshopt), avec un manifeste listant la source, l'URL et la licence.

## Ordre de construction
1. **Socle** : composant de scène cinématique (épinglage, timeline de plans par progression du scroll, dolly zoom, orbite, profondeur de champ, chargement à l'approche, plan fixe sous `prefers-reduced-motion`), pipeline des décors, corrections de l'ouverture et des expertises.
2. Projets.
3. Musique.
4. Corée.
5. Le vivant.
6. Transmission et sortie.
7. Le texte (après validation de `contenu-prive/contenu-v6.md`).

Chaque section est montrée à Damien avant de passer à la suivante.
