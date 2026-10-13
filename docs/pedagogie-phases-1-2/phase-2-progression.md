# Phase 2 — Reconstruction proposée pour validation

État : conception terminée, aucune modification du parcours dans l’application. Le découpage de 24 micro-leçons est une hypothèse à éprouver, non une bibliothèque finale figée.

## ADH-04 — Huit étapes, 24 micro-leçons

Le parcours de référence utilise une guitare 6 cordes standard E2 A2 D3 G3 B3 E4, cordes numérotées 6 à 1 du grave vers l’aigu. Les hauteurs indiquées sont les hauteurs sonores réelles, sans lecture de partition. La préférence d’instrument de l’utilisateur n’est pas modifiée.

| Étape | Micro-leçons | Vérification principale |
| --- | --- | --- |
| 1. Se repérer | ML01 diagramme ; ML02 noms français/internationaux ; ML03 départs à vide | Coordonnée comprise ; conversion facultative ; premiers repères de Mi/La guidés |
| 2. Mi | ML04 E/F/G grave ; ML05 transfert à Mi aigu ; ML06 phrase E–F–G–F–E | Trois ancrages sur chacun des Mi ; même nom ≠ même hauteur ; première application |
| 3. La | ML07 A/B/C ; ML08 sélection entre Mi et La ; ML09 ligne E–A–B–A | Choix d’une occurrence conforme à la consigne, dans les deux sens |
| 4. Ré et Sol | ML10 D/E/F ; ML11 G/A/B ; ML12 octaves E2/E3 et A2/A3 | Deux nouvelles cordes, puis deux relations d’octave concrètes |
| 5. Si et relations | ML13 B/C/D ; ML14 unisson B3 ; ML15 recherche entre cordes | Les 18 positions naturelles ; nom, hauteur et emplacement distingués |
| 6. Altérations | ML16 dièses ; ML17 bémols ; ML18 enharmonie | Les 12 positions restantes, par déduction puis rappel ; graphie séparée de hauteur |
| 7. Applications | ML19 suite nommée ; ML20 référence sonore ; ML21 fondamentale | Notes utilisées dans une tâche, sans partition ni accord obligatoire |
| 8. Consolidation | ML22 rappel sans aide ; ML23 phrase nouvelle ; ML24 bilan différé | Couverture des 30 positions dans les deux sens, rétention et transfert séparés |

Les titres ne désignent pas des séries uniformes de vingt questions. Une micro-leçon enseigne une idée ; ses exercices peuvent revenir sans recopier son texte. Les tailles de lots et la planification automatique relèvent des phases 3 et 4.

### Décisions qui évitent les sauts de difficulté

- Mi aigu suit très tôt Mi grave. La similitude est enseignée au lieu de refaire les mêmes introductions en fin de parcours.
- Les 18 positions naturelles servent d’ancrages. Les 12 positions altérées sont visibles comme emplacements non encore nommés, puis enseignées à l’étape 6.
- « Première recherche » signifie d’abord une position sur une corde donnée, puis une occurrence admissible parmi des cordes déjà connues. Aucune recherche de toutes les occurrences n’est obligatoire.
- Le début montre Mi puis La avant de présenter le panorama des cordes à vide. Voir les six départs ne signifie pas les avoir tous appris ; leur entraînement se répartit ensuite entre les étapes.
- La traduction Do–C est proposée mais n’est pas un prérequis bloquant. Son test cache la traduction.
- ML16 est un concept et plusieurs petits groupes d’entraînement, pas douze nouvelles positions demandées immédiatement. Commencer par F♯, ensuite varier les ancrages et les cordes ; retirer les aides seulement après réussite.
- ML17 utilise d’abord les **sept positions** dont la note naturelle supérieure est déjà dans la zone : Mi grave case 2, Mi aigu case 2, La case 1, Ré case 1, Sol cases 1 et 3, Si case 2. Les cinq altérations de case 4 sont reliées à leur graphie bémol dans ML18 ; on ne demande pas de chercher une note en case 5.
- Les applications de ML06 et ML09 emploient uniquement des notes connues. Une pulsation simple ou un tempo libre suffit ; ni nouveau doigté rigide, ni accord, ni lecture rythmique n’est imposé.
- Sans guitare, la version écran de l’application musicale permet de continuer. Les tâches physiques restent à faire ultérieurement.
- La phrase de bilan ML23 n’est pas la phrase d’entraînement ML19. Son modèle apparaît après la première tentative ; ses notes et son rythme auront déjà été rencontrés séparément.

### Exemples musicaux retenus

| Usage | Noms | Emplacements | Limite pédagogique |
| --- | --- | --- | --- |
| Premier motif | E–F–G–F–E | Mi grave 0–1–3–1–0, ou même trajet sur Mi aigu | Une corde à la fois ; pas de saut imposé entre grave et aigu |
| Ligne de basses | E–A–B–A | Mi grave 0 ; La 0–2–0 | Ordre des notes avant régularité du tempo |
| Phrase avec altération | E–F♯–G–F♯–E | Mi grave 0–2–3–2–0 | Emplacements déjà appris ; correction après essai |
| Fondamentales | E de Em ; A de Am ; B de Bm ; C de C | Mi grave 0 ; La 0, 2, 3 | Jouer la fondamentale seulement suffit ; connaître l’accord n’est pas requis |

Ces exemples sont originaux et génériques. Aucun enregistrement, morceau protégé ou support externe n’est repris. La production des médias du pilote n’est pas commencée.

## ADH-05 — Correspondance de toutes les anciennes fiches

L’inventaire porte sur les identifiants **qualifiés par instrument** : 35 sur guitare6 et 41 sur guitare7. Le même `s0-first` n’a pas le même départ sur les deux instruments.

La correspondance complète se trouve dans `correspondance-76-fiches.csv`. Chaque fiche possède une décision, une destination, les compétences futures visées, le sort de l’exercice, le sort de son texte et les consignes à déplacer. Aucune ancienne fiche n’est abandonnée sans destination explicite.

| Contenu ancien | Décision | Réemploi |
| --- | --- | --- |
| Notes, accordages, hauteurs, calcul des cases | Conserver | Source musicale vérifiée, sans la réécrire manuellement dans le moteur |
| Fiches `first`, `grow`, `four`, `whole` | Fusionner | Ancrages naturels, concepts utiles et étape d’altérations ; retirer les introductions sans apport |
| Exercice `find` | Conserver et avancer dans le parcours | Nom → position dès les premiers ancrages, avec retrait progressif du guidage |
| Présentation de fiche `mix` | Remplacer | Rappel cumulatif par groupe de positions/compétences, pas fusion des scores |
| Générateur des questions `mix` | Conserver et adapter | Alternance des deux sens ; données et résultats séparés |
| Toucher le manche, glisser, ouvrir les boutons | Déplacer vers l’aide d’interface | Consigne au premier usage, puis rappel contextuel ; ne plus en faire le contenu conceptuel de la leçon |
| Badges et historique de tentatives | Conserver comme historique | Aucune preuve instrumentale ou consolidation autonome déduite automatiquement |

La catégorie est attribuée au contenu : une fiche fusionnée peut contenir un exercice conservé et une consigne déplacée. Cette granularité évite de jeter un outil utile parce que son texte est répétitif.

### Cas 7 cordes

Le parcours de référence 6 cordes correspond aux six cordes communes de BEADGBE **par hauteur de départ et numéro physique**, et non par indice de tableau. Exemple : l’ancien `guitar7/s1-first` correspond au Mi grave, soit `guitar6/s0-first`.

Les cinq anciennes fiches du Si grave ont une destination de conception `EXT7`. Les six fiches mixtes qui incluent cette corde sont marquées comme rappel cumulatif à adapter, avec une référence `EXT7`. Cette réserve est une décision de reclassement, pas l’implémentation de l’extension de la phase 6 ni une promesse de transfert validé. Le futur diagnostic reconnaîtra les acquis communs tout en vérifiant leur usage sur une vue à sept cordes.

Aucune préférence n’est écrasée, aucune donnée n’est migrée et le parcours 7 cordes actuel reste inchangé. Les accordages personnalisés et les basses restent hors de cette reconstruction de référence ; leurs données existantes ne sont pas modifiées.

## Couverture des positions

La guitare 6 cordes offre **30 positions**, dont **18 naturelles et 12 altérées**, dans la zone 0–4. Les douze classes de hauteur sont présentes ; le nombre de positions ne se confond donc pas avec le nombre de noms différents.

`couverture-30-positions.csv` donne pour chacune : corde, case, nom, hauteur réelle, première découverte, leçon d’ancrage et vérifications dans les deux sens. Les positions à vide sont vues en découverte guidée ML03, puis réellement travaillées avec leur groupe d’ancrage. Les mêmes positions sont revérifiées en ML22 et ML24 ; un examen réparti sur plusieurs séances doit achever sa couverture avant toute validation globale.

| Corde | Cases 0, 1, 2, 3, 4 | Ancrages naturels | Positions altérées |
| --- | --- | --- | --- |
| 6, Mi grave | E2, F2, F♯2, G2, G♯2 | ML04 : 0, 1, 3 | ML16/18 : 2, 4 |
| 5, La | A2, A♯2, B2, C3, C♯3 | ML07 : 0, 2, 3 | ML16/18 : 1, 4 |
| 4, Ré | D3, D♯3, E3, F3, F♯3 | ML10 : 0, 2, 3 | ML16/18 : 1, 4 |
| 3, Sol | G3, G♯3, A3, A♯3, B3 | ML11 : 0, 2, 4 | ML16/18 : 1, 3 |
| 2, Si | B3, C4, C♯4, D4, D♯4 | ML13 : 0, 1, 3 | ML16/18 : 2, 4 |
| 1, Mi aigu | E4, F4, F♯4, G4, G♯4 | ML05 : 0, 1, 3 | ML16/18 : 2, 4 |

Le Si grave de la 7 cordes ajoute B1, C2, C♯2, D2, D♯2 ; ses 35 positions sont toutes identifiées dans l’inventaire ancien. Leur nouvelle production détaillée est réservée à la phase 6.

## ADH-06 — Réécriture des concepts

Les 24 propositions de textes figurent dans `contenus-24-micro-lecons.md` et dans le JSON de parcours. Elles expliquent des relations ; elles ne sont pas encore des écrans ou des activités du pilote. Leur longueur et leur découpage pourront évoluer après essais. Ce travail ne réécrit pas les 76 anciennes cartes mot pour mot et ne produit aucun média final.

### Décisions musicales à respecter

1. **Case / emplacement / corde à vide** : la case est un espace ; l’emplacement combine une corde et une case ; 0 est la convention pour la corde à vide, pas un nouvel espace fretté.
2. **Noms français/internationaux** : Do–C, Ré–D, Mi–E, Fa–F, Sol–G, La–A, Si–B. Traduction retirée pendant son test.
3. **Tons et demi-tons naturels** : E–F et B–C = un demi-ton ; les autres voisins naturels = un ton. Une case = un demi-ton sur une même corde ; deux cases = un ton.
4. **Deux cordes de Mi** : mêmes noms aux mêmes cases, mais **deux octaves**, 24 demi-tons, fréquence ×4. Ne pas présenter cette comparaison comme un unisson ou une octave simple.
5. **Octave simple** : E2 en corde 6 case 0 → E3 en corde 4 case 2 ; A2 en corde 5 case 0 → A3 en corde 3 case 2. Fréquence ×2. Ne pas généraliser leur forme à toutes les cordes : l’écart Sol–Si change la géométrie.
6. **Unisson réel dans 0–4** : B3 en corde 3 case 4 = B3 en corde 2 à vide. C’est la seule paire d’emplacements de même hauteur dans cette zone sur six cordes standard. Un timbre différent sur l’instrument ne change pas cette hauteur.
7. **Dièse et bémol** : modification de la hauteur de ±1 demi-ton, pas simple lettre suivante/précédente. Les premiers exemples ne franchissent pas les limites de la zone.
8. **Enharmonie** : dans le tempérament égal du jeu, C♯/D♭, D♯/E♭, F♯/G♭, G♯/A♭, A♯/B♭ partagent leurs hauteurs. E♯=F et B♯=C sont possibles ; ne pas écrire que E et B n’ont pas de dièse. La graphie attendue dépend du contrat de tâche.
9. **Graphie vs hauteur** : une tâche pure de position accepte les écritures enharmoniques de la hauteur demandée ; une conversion de graphie demande l’écriture précisée et peut signaler « hauteur juste, nom à revoir ». Une erreur de graphie ne devient pas une erreur physique de hauteur.
10. **Fondamentale** : note qui donne son nom à l’accord, sans exiger la maîtrise du doigté de cet accord.

### Comparaisons sonores prévues, non produites

| Relation à vérifier | Couple de référence | Ce que le support doit démontrer |
| --- | --- | --- |
| Même nom, deux octaves | E2 / E4 | Même lettre, hauteur différente, rapport ×4 |
| Octave simple | E2 / E3 | Même lettre, hauteur différente, rapport ×2 |
| Unisson | B3 Sol case 4 / B3 Si à vide | Même hauteur à deux emplacements ; le modèle synthétique peut avoir le même timbre |
| Enharmonie | F♯2 / G♭2 sur la même position | Même hauteur, deux écritures ; ne pas jouer deux hauteurs différentes |
| Voisinage | F2 / F♯2 / G2 | Deux demi-tons successifs, l’altération entre deux ancrages |

Une tâche de comparaison peut donner les noms et demander la relation ; elle ne suppose pas l’oreille absolue. Son résultat auditif reste distinct du rappel visuel. En l’absence de son, les tâches visuelles restent disponibles et cette tâche sonore est reportée explicitement.

## Critères de sortie de phase 2

24 objectifs associés à des prérequis antérieurs ; Mi aigu relié dès la deuxième étape ; deux applications avant la carte complète ; 30 positions couvertes dans les deux sens ; 76 anciennes fiches reclassées ; unissons, octaves et exemples de notes vérifiés ; textes conceptuels proposés. **Les contrôles de conception sont satisfaits. Aucun essai d’élève ou critère de produit final n’est présenté comme déjà validé.**
