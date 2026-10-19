# Daily Fretboard Trainer — Les Archives de la résonance

**Cahier des charges et direction artistique · proposition du 19 octobre 2026**  
Statut : à valider. Cette livraison contient des maquettes ; elle ne modifie ni l’application, ni les succès déjà acquis. Référence technique examinée : bêta v0.25, commit `8418499`.

## 1. Le parti pris

La collection devient une **collection d’objets sonores précieux** : premières pièces d’atelier, instruments de mesure gravés, pochettes pressées, objets de scène et atlas céleste du manche. Une identité à mi-chemin entre lutherie contemporaine, édition musicale et objet de collection.

Chaque carte doit donner envie d’être gardée, même au premier niveau. Les raretés supérieures ajoutent de la profondeur, une construction plus ambitieuse et une finition plus précieuse. Une carte facile ne sera pas une version grisée d’une belle carte difficile.

**Signature commune : une ligne de résonance.** Un tracé courbe traverse l’illustration et relie des points, des cordes, des pistes ou des constellations. Il raconte le passage de « je cherche » à « je reconnais ». Deux petites encoches dans le cadre, une microgravure DFT et une typographie constante constituent la signature de la série.

Les deux pièces jointes servent de références : richesse des dégradés, métal, surfaces stratifiées, grain, gravure, trames et lumière. Leurs consignes de génération ne deviennent pas des exigences de l’application. La référence aux cartes à collectionner inspire la matérialité et le plaisir de collectionner ; aucun cadre, symbole ou code propriétaire n’est repris.

## 2. Ce qui fait une carte unique

Une illustration se définit par quatre décisions éditoriales, prises pour ce succès précis :

1. **Un objet principal** lié à la compétence : jack pour la première réponse, constellation pour une famille, carte topographique pour une zone, sillage pour la vitesse, disque pour une phrase musicale.
2. **Une composition** : objet frontal, diagonale, éclaté, orbite, perspective, symétrie monumentale… Deux cartes voisines ne partagent pas simultanément le même objet et la même composition.
3. **Une matière** dictée par la rareté, avec un accent coloré propre à la carte.
4. **Une empreinte vraie** : positions du manche concernées ou chronologie réelle du morceau. L’art ne fabrique pas de fausses statistiques ni de fausses notes.

Un changement de teinte ou de graine aléatoire ne suffit pas à créer une nouvelle illustration. Le générateur futur pourra réutiliser des composants, mais chaque modèle aura un dessin principal et une composition choisis. Une famille déclinée par zone conserve son emblème, avec une gravure différente de sa géographie réelle.

## 3. Les cinq raretés

Je propose cinq niveaux parce qu’ils correspondent à cinq portées de preuve : premier geste, compétence locale, synthèse, défi exigeant, aboutissement. Trois niveaux écraseraient les étapes intermédiaires ; davantage diluerait les différences visuelles. Ce nombre organise la collection et ne crée pas cinq nouveaux niveaux pédagogiques.

Les mots de rareté sont conventionnels ; ils expriment la portée du défi. Ils ne prétendent pas mesurer la proportion réelle de joueurs qui le réussissent. Aucun tirage, achat de rareté, quota ou disponibilité temporaire.

| Niveau | Rareté | Promesse et attribution | Finition graphique | Marque non colorée |
|---|---|---|---|---|
| I | **Commune** | Un premier geste accompli ou une petite étape claire. Rapide à obtenir. | Papier profond, cuivre mat, impression en relief, objet dessiné avec soin. | Un losange + « Commune » |
| II | **Inhabituelle** | Une compétence locale démontrée, ou plusieurs actions complémentaires. | Aluminium brossé, émail, double gravure, objet en plusieurs plans. | Deux losanges + « Inhabituelle » |
| III | **Rare** | Une synthèse de zone, une phrase musicale identifiée, une précision confirmée. | Verre teinté, tranche dichroïque, reflets colorés localisés, motifs de précision. | Trois losanges + « Rare » |
| IV | **Épique** | Plusieurs synthèses, ou une exécution exigeante et précise. | Titane nocturne, scène lumineuse, diffraction, volume plus sculptural. | Quatre losanges + « Épique » |
| V | **Légendaire** | Un aboutissement majeur de la bêta, sans obligation de vitesse extrême. | Obsidienne, or gravé, portail sculpté, constellation, iridescence sélective. | Cinq losanges + « Légendaire » |

Le niveau ne dépend ni du nombre de clics ni de la popularité du morceau. Une carte musicale est Rare par défaut ; une série de phrases ou un défi musical exigeant peut être Épique. Une musique n’est pas légendaire parce qu’elle est célèbre.

La vitesse reste une collection facultative. Terminer l’apprentissage doit permettre d’obtenir une carte Légendaire sans temps de réponse imposé. Les niveaux supérieurs restent réellement plus difficiles, sans transformer les premières pièces en récompenses sans intérêt.

## 4. Grammaire visuelle

### Format et hiérarchie

Les SVG de présentation utilisent un `viewBox="0 0 630 880"`, proche d’un objet imprimé. Dans l’application, la carte sera un composant HTML adaptatif : ne pas réduire une interface entière comme une image.

Ordre de lecture du recto : **illustration → titre → progression → action**. La rareté reste secondaire. Les cinq cadres gardent les mêmes zones de lecture pour que l’œil retrouve ses repères dans l’album.

| Zone | Règle |
|---|---|
| En-tête | Catégorie, mot de rareté et losanges. Pas d’XP ou de niveau joueur inventé. |
| Illustration | Environ 40 % de la hauteur ; effets contenus dans cette zone. Coche bien visible en haut à droite si acquis. |
| Titre | Deux lignes normales, trois possibles ; jamais de défilement automatique, ni réduction minuscule pour un nom long. |
| Contexte | Une ligne : zone, corde physique ou artiste ; pas de paragraphe narratif sur le recto. |
| Progression | Valeur explicite, pourcentage et barre. Exemple : « 3 / 4 activités · 75 % ». |
| Actions | « Essayer » ou « Rejouer le défi » ; « Écouter » pour les musiques écoutables ; accès « Critères » clairement distinct. |
| Date | Sur la même ligne que « Rejouer le défi ». Affichage court, détail accessible à la demande. |

Les boutons restent en pilule ; les étiquettes et cartouches de texte sont des rectangles arrondis. Les composants de bouton existants gardent leur autorité CSS. Pas de bouton sur une zone irisée ou sur du petit texte décoratif.

### Palette de collection

Couleurs d’encre stables : graphite `#26343C`, papier clair `#F8F5EE`, nuit `#101B2B`. Cuivre `#AD5835`, émail pétrole `#196E75`, cobalt `#235ED4`, corail `#CF4733`, or `#E3BC67` pour les matières et illustrations. Le texte clair utilise du blanc cassé, le texte foncé une encre dense ; les teintes métalliques ne servent pas au petit texte.

Le bleu-gris et le corail du produit restent visibles dans les contrôles. La couleur des illustrations peut s’enrichir sans repeindre toutes les actions selon la rareté.

### Matières retenues et limites

| Effet des références | Usage retenu | Limite |
|---|---|---|
| Papier / fibre / risographie | Communes, fonds gravés, pochettes rétro | Trame fine seulement sur l’art, jamais sous les critères. |
| Aluminium / guillochage | Inhabituelles, repères | Lignes vectorielles fixes ; lisibles même sans reflet. |
| Dégradés radiaux superposés | Rares et plus | Une couleur dominante et deux accents ; pas de nappes arc-en-ciel uniformes. |
| Verre stratifié | Rares, détails d’objet | Simulé par aplats translucides et contours ; pas de `backdrop-filter`. |
| Lumière de scène / faisceaux | Épiques | Formes fixes, masquées dans l’illustration. |
| Holographie / diffraction | Légendaires, détails Épiques | Localisée sur une tranche ou un objet, hors des textes. |
| Grain | Facultatif, rendu final | Préférer une trame SVG ; pas de bruit animé ni de filtre plein écran. |
| Grunge, scanlines, pixels | Une identité musicale précise si pertinente | Jamais une texture par défaut pour toute la collection. |

## 5. Les pochettes musicales : des empreintes, pas des clones

Le **music-sleeve reste le cœur de l’illustration musicale**. Les rectangles représentent de vrais événements : abscisse = départ, largeur = durée, ordonnée = hauteur MIDI. Les silences restent vides. L’accompagnement éventuel ne se confond pas avec la mélodie à reproduire.

La version source, la tonalité, le registre, le tempo et les silences proviennent de la même donnée validée que l’audio. La maquette musicale illustre la chronologie actuellement stockée pour « Seven Nation Army » ; elle ne constitue pas une nouvelle certification musicologique de cette transcription.

Chaque pochette reçoit une direction propre :

| Famille sonore | Piste artistique | Élément unique |
|---|---|---|
| Riff rock répétitif | Disque taillé, corail et cobalt, impression brute | Cellule rythmique gravée, blancs assumés entre attaques. |
| Funk / basse | Ruban souple, émail citron ou pétrole, lignes élastiques | Accents rythmiques et registre grave conservés. |
| Électronique | Prisme, grille séquencée, lumière synthétique | Longueurs de notes et répétitions structurent le motif. |
| Mélodie chantée | Ruban typographique, encre et cuivre | Contour mélodique plus aérien, sans fausse portée décorative. |
| Piano / ragtime | Papier gravé, géométrie mécanique | Articulation rythmique visible, pas de transposition graphique trompeuse. |

Ces familles ne sont pas une classification automatique rigide des genres. Une direction est attribuée morceau par morceau, à partir du passage réellement travaillé. Pas de logo d’artiste, pochette commerciale reproduite ou portrait.

À l’écoute, les événements apparaissent/s’illuminent à leur instant réel. Les notes passées restent perceptibles ; pas de curseur qui traverse toute l’interface. Le dessin reste beau à l’arrêt. Si l’extrait dépasse la place disponible, la pochette montre une fenêtre fixe annoncée (« début du riff »), sans compresser la durée à l’extrême ; le détail peut présenter la phrase entière.

La carte n’apparaît comme collectible que si un passage validé est réellement accessible pour ce profil. Les extraits en attente d’audit restent exclus. Une suite pédagogique sans morceau identifié reste une suite d’entraînement ; elle ne devient pas un disque fictif.

## 6. États et interactions

**En cours.** L’illustration est déjà colorée et attirante ; son objet a une finition plus mate. Pourcentage et fraction restent visibles. Pas de gros cadenas ni de texte « À découvrir » répété. Les exemples montrent deux cartes en cours et trois acquises ; ils ne constituent pas encore une comparaison avant/après de chacune des cinq matières.

**Acquise.** Une coche contrastée, bordée, est ajoutée au cadre. Le plein rendu de la matière apparaît. La date accompagne le bouton Rejouer. Le succès reste acquis après un échec ultérieur.

**Critères.** Un bouton retourne la carte horizontalement en 280–320 ms. Le verso présente le titre, la rareté et une liste courte de conditions avec compteurs. Le recto devient inerte ; le focus passe au verso puis revient au bouton initial. Aucun lien source ou journal détaillé encombrant. En réduction des animations : remplacement immédiat ou fondu bref.

**Essayer.** Ouvre la prochaine activité utile au critère manquant, dans le bon profil et le bon périmètre. Ni premier exercice systématique, ni changement silencieux d’instrument. Si aucun contenu compatible n’est disponible, on explique la disponibilité au lieu d’envoyer vers une activité sans rapport.

**Écouter.** Disponible pour une phrase obtenue et écoutable ; devient Arrêter pendant la lecture. Respecte le Mute et indique comment réactiver le son. Le bouton ne déclenche pas une nouvelle réussite.

**Déblocage.** En fin d’activité, après le résultat : apparition courte de la carte, sa matière se révèle une fois, texte « Nouveau succès ». Une action « Voir la carte » et une action « Continuer ». Si plusieurs succès arrivent : une annonce groupée puis les cartes dans un seul panneau, sans empiler des fenêtres obligatoires. Aucun son simultané au phrasé musical de récompense.

## 7. L’album de collection

Trois entrées conservées : **Repères, Fluidité, Musiques**. Un compteur obtenu/total disponible, les filtres Tous/En cours/Acquis, tri Parcours/Rareté/Récents et une suggestion principale « Prochain défi ».

L’album met en avant les cartes proches d’aboutir ; la vue de toutes les cartes reste accessible. Pas de notification permanente pour une carte difficile. Un filtre de profil/périmètre explicite évite de mélanger les résultats de deux accordages. Les cartes musicales obtenues restent dans la collection globale avec leur contexte d’origine.

Les défis de zone se déclinent en sélecteur I/II/III, ceux des cordes selon leur numéro physique. Ne pas afficher 72 cartes quasi identiques sans regroupement. La vue détaillée peut déployer les variantes ; une carte variante obtenue garde sa date et son identité.

La psychologie visée associe **accomplissement** (critère juste, progrès vérifiable) et **collection** (objet distinct, série cohérente). « Accomplisseur » renvoie à la progression et à la réussite ; « collectionneur » décrit ici un attrait complémentaire pour compléter et contempler une collection. Ce ne sont pas des diagnostics psychologiques.

## 8. Responsive, accessibilité et thèmes

- Album : une carte par ligne sur petit téléphone ; deux puis trois sur écrans plus larges. Largeur confortable 300–380 px. Pas de carrousel obligatoire.
- À 320 px, l’interface HTML garde une police normale de 16 px, des cibles de 44 × 44 px minimum et des titres extensibles. Les SVG fournis sont des planches visuelles ; leurs boutons dessinés ne sont pas des contrôles actifs.
- Si l’espace vertical manque, le document défile normalement. Ne pas tronquer un bouton pour prétendre tenir sur un écran.
- Les textes et actions suivent les quatre thèmes de l’application ; la matière de l’art conserve son identité. Le mode Papier traduit les matières en trames et contours. Inclusif-contrasté coupe les reflets distrayants, renforce les contours et garde coches + mots + nombres.
- Rareté identifiable sans couleur : mot et nombre de losanges. État acquis identifiable par coche et libellé accessible. Contrastes à mesurer sur le composant final : texte normal ≥ 4,5:1 ; gros texte et composants ≥ 3:1 ; viser 7:1 pour le texte en Inclusif-contrasté.
- Aucun tilt dépendant du gyroscope, effet de survol indispensable, flash ou boucle de scintillement. Navigation complète au clavier et lecteur d’écran ; le SVG décoratif est caché, son titre est porté par le HTML.

## 9. Architecture à prévoir après validation

| Couche | Responsabilité |
|---|---|
| `achievement-definitions` | ID stable, titre, critère versionné, rareté, catégorie, périmètre, éligibilité. |
| Évaluateur pur | Calcule les critères depuis les preuves durables ; aucun accès DOM/audio. |
| Registre artistique | `artId`, composition, matière, accent, empreinte réelle ; versionné indépendamment. |
| Composant carte unique | Recto/verso, progression, actions, date, accès clavier. |
| Composants communs | Boutons, badge rareté, coche, barre, music-sleeve. |
| Service collection existant | Persistance, migration, émission idempotente d’un déblocage. |

Il ne faut pas créer une nouvelle instance globale mutable par carte. Réutiliser les services partagés déjà présents et un registre immuable de règles. Une règle de rendu commune s’applique à toutes les pages ; l’illustration est une variation de données et d’art, pas une copie du module de carte.

Clé de succès : `definitionId + ruleVersion + profileKey + scopeId` ; pour une musique, identité du morceau et version du passage, avec contexte d’obtention conservé. Le changement de notation C/Do ou ♯/♭ ne crée pas un doublon. Les parcours guidés réutilisent les mêmes preuves que la pratique ciblée.

Les dix définitions actuelles et les cartes `music-*` conservent leurs IDs lors d’un renommage ou d’un habillage. Les anciennes dates restent ; une exigence plus forte crée une nouvelle règle, sans retirer un ancien succès. Les compteurs durables remplacent le recalcul depuis le seul journal limité à 250 tentatives. Le Mode Débug produit des cartes simulées identifiées, jamais des preuves persistantes.

### Budget technique proposé

SVG d’illustration cible ≤ 18 Ko non compressés, maximum 25 Ko à justifier pour une Légendaire ; le texte/UI restent en HTML. `defs` à IDs préfixés ; motifs réutilisables ; aucune image ou police réseau. Une seule petite texture facultative, aucun flou plein cadre. Les exemples livrés utilisent des motifs vectoriels sans filtres.

Album immobile au repos. Révélation 450–700 ms une fois ; survol éventuel 180 ms sur les seuls appareils à pointeur précis. Animations de `transform`/`opacity`, arrêt hors écran et à l’onglet caché. Les nombreux événements du music-sleeve ne s’animent que pendant l’écoute. Chargement différé des illustrations hors écran, pas de promotion permanente de chaque carte en calque GPU.

Objectif à mesurer sur un Android modeste et Safari iPhone : pas de saccade lors du défilement d’un album de 30 cartes, aucune tâche longue imputable à une animation de décoration. Ce sont des critères futurs, pas des performances déjà démontrées par ces maquettes.

## 10. Livrables et critères de validation

Ce dossier fournit un catalogue de **42 modèles de succès**, cinq rectos SVG, cinq versos SVG et une galerie locale avec retournement. Chaque exemple correspond à un modèle du catalogue ; progression et dates sont des simulations annoncées.

| Exemple | Niveau | Intention graphique |
|---|---|---|
| La première fait le jack | Commune | Un jack sculpté en cuivre et un câble qui dessine la résonance. |
| Réunion de famille | Inhabituelle | Des orbites gravées et des positions réunies par un noyau d’émail. |
| Seven Nation Army | Rare | Un disque dichroïque, un ruban et le vrai piano-roll du catalogue actuel. |
| Éclair de manche | Épique | Un trait lumineux tendu entre des structures de titane, une scène de vitesse. |
| Le manche dans toutes ses coutures | Légendaire | Un atlas du manche encadré d’un portail doré et d’orbites célestes. |

À valider avant toute production en masse : identité commune, différence réelle des cinq matières, lisibilité à 320 px, attrait des cartes faciles, identité des pochettes, noms/critères du catalogue, place des contrôles et fidélité des données dessinées. Après accord : intégrer le composant unique, migrer les preuves, produire les autres illustrations par lots et tester les quatre thèmes sur appareils.

**Hors de cette étape :** modifier la bêta, générer toute la collection, créer des modes Arcade/Explorer/harmoniques ou inventer des récompenses payantes.
