# Le personnage — feuille de route

Date : 2026-11-17
Remplace la décision « silhouette stylisée, pas un portrait » du spec
(`docs/superpowers/specs/2026-11-17-portfolio-v6-design.md`).

## L'objectif

Un personnage 3D qui te ressemble le plus possible, dans ton manteau gris,
présent sur les huit scènes du site, animé, et assez léger pour le web.
Avec le maximum du travail fait par moi.

## Ce qui décide du chemin

**La ressemblance vient de la capture, pas de la génération.** Les outils
image→3D (Meshy, Tripo, Rodin, LHM) et les avatars « depuis trois selfies »
(Avaturn, MetaPerson) produisent un humain *plausible* : le visage est
approché, le corps et les vêtements sont génériques. Pour que ce soit
*toi* — tes proportions, ta posture, ta tête, ton manteau — il faut te
scanner.

**Le dither du site est un allié.** Le shader tramé qui habille déjà la
scène 3D écrase les défauts de texture et garde ce qui fait reconnaître
quelqu'un : la silhouette, les proportions, la structure du visage, la
coupe de cheveux, la coupe du manteau. Un scan imparfait passe ; un
personnage générique, même parfait, ne passe pas.

**Ta machine fait le travail.** RTX 5080 (16 Go), Ryzen 7 9800X3D, 31 Go de
RAM : je peux faire tourner en local la reconstruction photogrammétrique,
l'auto-rig et la génération d'accessoires. Ton rôle se réduit à la séance
photo et à valider la ressemblance.

## Le chemin, en un tableau

| Phase | Qui | Ton temps | Coût |
|---|---|---|---|
| 0. Trois décisions | toi | 5 min | — |
| 1. Séance de capture | toi + un ami | ~1 h 30 | 0 € |
| 2. Reconstruction 3D | moi | — | 0 € |
| 3. Squelette (rig) | moi, ou 2 min à toi sur Mixamo | 0 à 10 min | 0 € |
| 4. Poses et mouvements | moi | — | 0 € (12 € optionnels) |
| 5. Accessoires | moi | — | 0 € |
| 6. Poids web | moi | — | 0 € |
| 7. Intégration au site (= plan 2) | moi | — | 0 € |
| 8. Validation de la ressemblance | toi | 15 min par passe | — |

Coût total : **zéro**, sauf si tu choisis la cabine de scan pro (phase 0)
ou un mois de Rokoko pour un geste capturé (phase 4).

---

## Phase 0 — Trois décisions (toi, 5 min)

1. **Scan maison ou cabine pro ?**
   - *Maison* (recommandé pour commencer) : gratuit, un ami et ton
     téléphone suffisent. Risque : un léger mouvement pendant la prise
     floute le résultat — on refait une prise, c'est tout.
   - *Cabine pro* : des dizaines d'appareils déclenchent en même temps,
     donc zéro flou de mouvement — c'est la meilleure fidélité qui existe.
     Prix sur devis ([tOOiin](https://www.aniwaa.com/fr/produit/scanners-3d/tooiin-generator),
     [Artec Shapify](https://artec3d.com/fr/shapifybooth)). Si un
     prestataire près de chez toi en a une, tout ce qui suit reste
     identique : je reprends à partir de son fichier.
2. **Un compte Adobe pour Mixamo ?** Gratuit. C'est l'auto-rigger humanoïde
   de référence, et le format de squelette que les outils d'animation
   savent cibler. Sans compte, je rigge tout en local avec un modèle
   open source (Puppeteer, licence Apache-2.0), avec un peu plus de
   risque sur la qualité.
3. **Ton accord pour que j'installe Blender et un environnement
   Python + CUDA** sur ta machine. C'est ce qui me permet de faire les
   phases 2 à 6 sans toi.

## Phase 1 — La séance de capture (toi + un ami, ~1 h 30)

### Préparation

- **Tenue** : *ton vrai manteau gris* — c'est lui qu'on verra sur le
  site. Le pantalon et les chaussures que tu veux voir. Évite le noir uni
  très sombre et les matières brillantes : la photogrammétrie a besoin de
  texture visible. Cheveux comme d'habitude.
- **Lunettes** : si tu en portes tout le temps, garde-les pour la séance
  de référence (1C) mais retire-les pour le scan (reflets) — je les
  remodéliserai comme un accessoire.
- **Lumière** : diffuse et uniforme. Dehors par temps couvert, ou une
  pièce bien éclairée sans soleil direct ni ombre dure.
- **Fond et sol** : simples, mats, sans miroir ni vitre.

### 1A — Le scan du corps (le plus important)

- **Pose** : A-pose. Bras écartés à 30–45° du corps, paumes vers les
  cuisses, doigts légèrement écartés, pieds à largeur d'épaules. Regard
  fixé sur un point, bouche fermée, respiration douce. *Ne bouge pas.*
- **Ton ami tourne autour de toi** avec l'appareil photo du téléphone, en
  mode photo (pas vidéo), sans zoom :
  - cercle 1 à hauteur des genoux ;
  - cercle 2 à hauteur de la poitrine ;
  - cercle 3 bras tendus au-dessus de ta tête, l'objectif incliné vers toi ;
  - une photo tous les 10 à 15 degrés, soit 25 à 35 par cercle, chaque
    photo nette et chevauchant la précédente aux deux tiers.
- **Durée cible** : moins de 3 minutes par prise, sinon les bras
  retombent. **Fais deux prises complètes** ; je garderai la meilleure.
- **Bonus** : une troisième passe avec l'app gratuite
  [RealityScan](https://3dprinting.com/scanners/3d-scanning-with-your-phone/)
  ou [KIRI Engine](https://apps.apple.com/app/id1577127142), qui affichent
  en réalité augmentée les zones encore non couvertes. Utile pour vérifier
  qu'il ne manque rien.

### 1B — Le visage (~40 photos)

Assis, expression neutre, même lumière. Ton ami photographie ta tête de
plus près, en trois arcs d'une oreille à l'autre : sous le menton, à
hauteur des yeux, au-dessus du front. Très net. C'est ce qui me permettra
de raffiner le visage si celui du scan est mou.

### 1C — Les références (~10 photos)

Debout, naturel : face, trois-quarts, profil, dos. Plus une photo de
chaque geste de la liste 1D. Elles me servent à régler les poses et à
juger la ressemblance.

### 1D — Les gestes (optionnel, 8 clips de 3 à 5 s)

Téléphone **fixe** (trépied ou posé), corps entier dans le cadre, même
manteau. Un clip par scène du site :

| Scène | Le geste à filmer |
|---|---|
| 1. Ouverture | de dos, immobile, puis tu tournes la tête vers la caméra |
| 2. Le métier | debout face à un écran imaginaire, une main qui fait défiler |
| 3. Ce que je construis | tes mains qui tournent et assemblent un objet invisible |
| 4. La musique | tu poses un casque sur tes oreilles, puis tu hoches la tête en rythme |
| 5. La Corée | mains dans les poches, tête levée vers la neige qui tombe |
| 6. Le vivant | tu t'accroupis et poses la main au sol |
| 7. La transmission | geste d'explication, main ouverte vers quelqu'un de plus petit |
| 8. Sortie | tu te retournes et t'éloignes en marchant |

Même si on ne capture pas le mouvement (phase 4), ces clips me donnent
*ta* gestuelle comme référence pour poser le personnage.

## Phase 2 — Reconstruction 3D (moi)

1. Je reconstruis le maillage texturé à partir de tes photos, en local :
   RealityScan desktop (gratuit, le meilleur résultat ; il faudra que tu
   l'installes et t'y connectes une fois) ou COLMAP + OpenMVS (open source,
   100 % automatique de mon côté).
2. Nettoyage scripté dans Blender : suppression du sol et des parasites,
   bouchage des trous, alignement et mise à l'échelle réelle.
3. Retopologie et réduction du maillage, puis cuisson de la texture sur le
   nouveau maillage.
4. Si le visage du scan est mou : je reprojette tes photos 1B sur la tête.
5. **Livrable** : un modèle statique propre de toi en A-pose. Je te
   l'envoie en rendu tournant à côté de tes photos de référence.

## Phase 3 — Le squelette (moi, ou 2 minutes à toi)

- **Avec Mixamo** (recommandé) : tu te connectes sur mixamo.com, tu
  déposes le fichier que je t'ai préparé, tu places 5 repères (poignets,
  coudes, genoux, entrejambe), tu télécharges. Je prends la suite.
- **Sans Mixamo** : je rigge en local avec
  [Puppeteer](https://github.com/Seed3D/Puppeteer) (Apache-2.0) ou
  [UniRig](https://github.com/VAST-AI-Research/UniRig).
- Dans les deux cas, je vérifie la déformation sur une série de poses
  test (rendus automatiques), en surveillant le manteau aux hanches et aux
  genoux.

## Phase 4 — Poses et mouvements (moi)

Les scènes sont surtout des **poses vivantes**, pas des chorégraphies.
Trois sources, dans l'ordre :

1. **Poses que je règle par script**, d'après tes photos et clips de 1C/1D.
2. **Bibliothèque Mixamo** pour les mouvements génériques (respiration,
   marche de la sortie, hochement de tête). Libre d'usage dans tes projets.
3. **Une animation procédurale** côté site : respiration, regard qui suit
   le curseur — c'est déjà une idée retenue dans le spec.
4. *Optionnel* : un geste signature capturé depuis ton clip (le casque de
   la scène 4) avec [Rokoko Vision](https://www.rokoko.com/products/vision)
   — 30 s gratuites par mois, un mois payant à 12 € sinon. Conditions
   commerciales à confirmer avant usage.

**Écarté pour ce qui sera publié** : la capture de mouvement open source
par [GVHMR](https://github.com/zju3dv/GVHMR/blob/main/LICENSE) et le corps
SMPL-X — licences éducatives, de recherche ou non lucratives, et sous-licence
commerciale exigée pour SMPL-X. Un portfolio qui sert ta carrière est une
zone grise ; je ne la fais pas porter au site. Je peux m'en servir
seulement en interne, comme référence de pose.

## Phase 5 — Accessoires (moi)

Casque audio (scène 4), écharpe ou bonnet (scène 5), éventuellement tes
lunettes. Les objets, c'est là que la génération 3D excelle : je les génère
en local sur ta carte graphique (modèles open source image→3D) ou je les
prends dans des bibliothèques CC0, puis je les attache aux os du squelette.

## Phase 6 — Poids web (moi)

Pipeline automatique : réduction du maillage, compression meshopt,
textures WebP ou KTX2, et un test qui échoue si le poids dépasse le
budget.

**Budget à revoir** : le spec visait 1,5 Mo pour tout le personnage. Avec
un vrai scan texturé, je propose **3 Mo** — textures 1024 px, que le
dither rend largement suffisantes. Chargé après l'affichage du titre, il
ne touche pas au LCP.

## Phase 7 — Intégration au site (moi, = plan 2)

Le canvas persistant derrière les sections, une pose par scène, les
transitions entre poses, le matériau tramé (déjà dans la base), le regard
qui suit le curseur, et les paliers mobile. J'écris le plan 2 dès que le
modèle riggé existe — il dépend de sa forme et de son poids réels.

## Phase 8 — Validation de la ressemblance (toi, 15 min par passe)

À chaque étape clé (scan nettoyé, personnage riggé, personnage tramé dans
le site), je te montre un rendu tournant à côté de tes photos de
référence. Tu juges, je corrige. **Tu es le seul juge de la ressemblance.**

---

## Qui fait quoi

**Toi** : trois décisions, une séance photo d'environ 1 h 30 avec un ami,
deux minutes sur Mixamo si tu choisis cette voie, et une validation à
chaque étape.

**Moi** : tout le reste — reconstruction, nettoyage, retopologie,
texture, rig ou préparation du rig, poses, accessoires, optimisation,
intégration, et les tests qui gardent le poids et la qualité sous
contrôle.

## Risques et parades

| Risque | Parade |
|---|---|
| Tu bouges pendant le scan : résultat flou | deux prises ; prises courtes ; en dernier recours, cabine pro |
| Manteau trop sombre ou trop uni : trous dans le scan | lumière diffuse, deux prises ; je reconstruis les zones manquantes |
| Visage mou dans le scan | reprojection de tes photos de visage (1B) |
| Le manteau se déforme mal en mouvement | poses sobres ; os supplémentaires ou physique légère sur les pans du manteau |
| Outils de recherche incompatibles avec la RTX 50 | Mixamo et RealityScan ne dépendent pas de ta carte graphique |
| Licences | rien sous licence de recherche dans ce qui est publié |
| Poids trop lourd | budget testé automatiquement, textures et maillage réduits |

## Ce que j'écarte, et pourquoi

- **Générer tout le corps par IA** (Meshy, Tripo, Rodin,
  [LHM](https://github.com/aigc3d/LHM),
  [FRESA](https://github.com/rongakowang/FRESA)) : un humain plausible,
  pas toi. Utile pour les accessoires, pas pour toi.
- **Les avatars « depuis trois selfies »**
  ([Avaturn](https://www.producthunt.com/products/avaturn-real-3d-avatars-from-photo?launch=avaturn),
  [MetaPerson](https://avatarsdk.com/)) : rapides et déjà riggés, mais
  corps et vêtements génériques. C'est mon **plan de secours** si le scan
  échoue deux fois.
- **MetaHuman** : rien trouvé de fiable sur son usage sur le web hors
  Unreal ; je ne bâtis pas dessus.
- **Les splats gaussiens animés** : la meilleure ressemblance en recherche,
  mais le rendu animé dans un navigateur n'est pas mûr.

## Sources

- Reconstruction et rig : [UniRig](https://github.com/VAST-AI-Research/UniRig),
  [Puppeteer](https://github.com/Seed3D/Puppeteer),
  [LHM](https://github.com/aigc3d/LHM), [FRESA](https://github.com/rongakowang/FRESA)
- Capture de mouvement : [Chamiseul_RGBMocap](https://github.com/mayalhc/Chamiseul_RGBMocap),
  [licence GVHMR](https://github.com/zju3dv/GVHMR/blob/main/LICENSE),
  [Rokoko Vision](https://www.rokoko.com/products/vision)
- Mixamo en 2026 : [guide Cinevva](https://app.cinevva.com/guides/free-character-animations-rigging),
  [FAQ Adobe](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)
- Scan au téléphone : [3dprinting.com](https://3dprinting.com/scanners/3d-scanning-with-your-phone/),
  [KIRI Engine](https://apps.apple.com/app/id1577127142)
