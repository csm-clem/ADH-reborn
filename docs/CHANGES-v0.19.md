# v0.19 — Corrections et collection des succès

## Jeu et affichage

- Les schémas « Nouvel exercice ! » ont leur propre marge de sillet/corde à vide. La géométrie du gameplay et les autres schémas gardent leurs proportions.
- Les colonnes Corde des progrès affichent seulement les numéros. Le tableau de réponse ne révèle pas les noms par défaut ; l’indice affiche les hauteurs dans le tableau et sur le manche. Le texte utilise la première case de la zone, calculée dynamiquement.
- En découverte, un mauvais toucher laisse un point rouge jusqu’au prochain toucher. Les positions trouvées restent indiquées avec leur nom.
- En jeu, une erreur montre uniquement la position demandée en rouge, accompagnée de son nom corrigé. La position proposée n’est plus dessinée. Le délai de lecture de 500 ms et la disparition de 560 ms sont conservés. La question suivante reste disponible sans attendre, sauf la toute dernière correction avant le résultat.
- Les activités « nommer » d’une famille isolée proposent les hauteurs réellement présentes : E2/E3/E4, par exemple. Un E3 n’est pas accepté à la place d’un E2. Les mélanges continuent d’utiliser la roue des noms de notes. Les preuves et les récapitulatifs distinguent ces deux formats.
- La dernière note d’une suite est sonorisée ; le résultat et la récompense attendent 300 ms. Quitter ou mettre en pause annule le déclenchement différé ; reprendre permet de le terminer une seule fois.
- Description et illustration de la première page de configuration sont alignées à gauche sur le titre. Le message textuel « Son coupé… » est supprimé.
- Les zones de question et de réponse gardent leur disposition convenue.

## Quatre palettes coordonnées

Les couleurs du manche, du sillet, des cordes, des frettes et des réponses proviennent des variables communes. Les pastilles neutres reprennent le sillet ; aucun contour blanc ne les entoure.

| Palette | Usage |
|---|---|
| Atelier · Érable miel | Quotidien, bois chaleureux ; vert et rouge plus lumineux et saturés, sans effet fluorescent |
| Studio nuit | Pièce peu éclairée ; interface sombre et repères lumineux |
| Inclusif-contrasté | Contraste élevé, bleu/orange, texte renforcé et symboles ✓/× ; aide pour certaines difficultés de perception et d’éclairage, sans prétendre résoudre tous les troubles visuels |
| Papier | Niveaux de gris, repères sobres, symboles pour différencier les corrections |

Les Paramètres présentent chaque palette avec sa description et un aperçu de couleurs. « Selon l’appareil » suit Atelier/Studio nuit ; c’est une préférence automatique, pas une cinquième palette.

## Morceaux uniques et références plus modernes

Une attribution déterministe réserve chaque œuvre à un seul exercice « retrouver » du parcours de l’instrument/accordage et de la zone. Changer la notation ne change pas l’attribution. Les exercices « nommer » n’ont pas de suite musicale finale.

Le catalogue a été élargi à la funk, au disco et aux musiques électroniques : **Higher Ground, My Sharona, I Was Made for Lovin’ You, Superstition, Get Lucky, Blue Monday (version Orgy), Sweet Dreams**, ainsi que plusieurs riffs rock et des phrases vocales. Sur une guitare six cordes standard, les **25 activités « retrouver » disposent désormais de 25 œuvres différentes**, y compris toutes les familles isolées.

Les exercices prennent un véritable début de passage compatible ; la récompense poursuit ce passage au-delà des notes apprises. Certains passages sont des riffs situés dans le morceau : ils sont identifiés comme tels. Les sons sont synthétisés et les accompagnements sont pédagogiques, sans prétendre reproduire un enregistrement original.

Le détail des sources, des hauteurs, des passages et des simplifications rythmiques est dans [le répertoire v0.19](v0.19/repertoire.md). La reconnaissance des extraits de deux notes doit encore être vérifiée avec des musiciens ; une correspondance de hauteurs ne suffit pas à prouver qu’un extrait sera amusant à reconnaître.

Pour un autre accordage ou un instrument offrant une seule hauteur de la famille dans la zone, les positions ne sont pas inventées : une suite d’entraînement reste possible si aucun passage vérifié ne correspond réellement. Le repli n’est plus utilisé sur le parcours six cordes standard.

Les partitions documentaires des anciens extraits restent dans les documents ; la collection ne propose de lien externe d’exemple que s’il contient une référence sonore. Toutes les phrases obtenues peuvent s’écouter directement dans l’application, hors ligne.

## Succès implémentés

### Catalogue initial

Dix succès de pratique et de collection, auxquels s’ajoutent les pochettes des phrases compatibles avec l’instrument :

| Succès | Preuve |
|---|---|
| Mes premières cordes | Les deux sens de l’accordage réussis à au moins 90 % |
| Une famille bien repérée | Famille et mélange réussis dans les deux sens |
| Mes notes naturelles | Dernier mélange naturel réussi dans les deux sens, sans indice et avec ≥10 positions échantillonnées par activité |
| Ma première carte complète | Même vérification sur le dernier mélange de la zone |
| Sans faute, sans aide | ≥20 premières réponses justes sans indice dans un exercice |
| Une suite d’un trait | Une chaîne musicale entière terminée après son dernier redémarrage |
| Plus fluide, ici | Record de moyenne battu, à précision égale ou meilleure, même exercice/profil, sans indice |
| Du regard au réflexe | ≥20 réponses, 100 %, sans indice, moyenne ≤1 s |
| Ma première pochette | Une première phrase de morceau obtenue |
| Une petite discothèque | Trois œuvres différentes collectionnées |

Les pochettes et les deux jalons de collection sont globaux ; les autres succès concernent le profil et la zone. Une transposition ou un changement de timbre n’ajoute pas une seconde pochette du même passage. Les critères décrivent des réussites ponctuelles, sans annoncer une maîtrise durable.

### Collection utilisable

- Navigation « Mes succès » / « Succès », collections **Repères / Fluidité / Musiques**.
- Pochettes distinguées par leurs initiales et une empreinte graphique du rythme/des hauteurs du passage. Cartes lisibles, vue album ou liste, filtres Tous/Obtenus/À découvrir, tri par parcours ou date. Préférences mémorisées.
- Statut textuel et symbole, critère consultable, compteurs réels, progression des activités d’accordage/famille, trois prochains objectifs.
- Écouter/Arrêter pour les phrases obtenues ; Rejouer le défi ou Essayer sans verrouiller le parcours. Une pochette obtenue avec un autre accordage reste présente et son défi réactive le profil de la preuve.
- Détails : date, instrument, zone, tentatives et synthèse des résultats, passage joué, version d’arrangement, caractère pédagogique de l’accompagnement.
- Notification groupée sur le résultat, jamais pendant une question. Aucun jingle ajouté par-dessus la récompense musicale. Sur écran court, l’annonce devient un bouton ✦ avec compteur dans l’en-tête afin de préserver les actions.
- Commandes clavier et libellés accessibles, respect de Muet et des mouvements réduits.

### Architecture et sauvegarde

`achievement-rules.js` contient le catalogue immuable et un évaluateur pur. `achievement-data.js` valide les données importées. `achievements-ui.js` présente la collection et réutilise le moteur audio existant. Aucun nouveau Singleton audio ou stockage.

Chaque obtention a un identifiant stable, une version, une portée, une date et des preuves. Une synthèse des tentatives nécessaires est conservée avec le succès : elle reste consultable même si les anciens essais dépassent la limite de l’historique. Les pochettes mémorisent le passage, la transposition et la version d’arrangement. Les doublons sont empêchés et rejetés à l’import.

Les succès font partie de la sauvegarde locale et de l’export/import existant. **Même règle v0 qu’avant : une nouvelle version repart à zéro**, mais recharger la v0.19 conserve tout. La synchronisation par compte reste réservée à la phase 8.

## Validation et suite

Les vérifications automatiques couvrent le moteur, les import/export, les roues par octave, les attributions musicales sans répétition, les interactions, les formats d’écran et le mode hors ligne. Les résultats détaillés sont dans `docs/v0.19/validation.md`.

Les étapes S1 à S6 de la roadmap Succès sont implémentées. **S7 reste une validation humaine** : faire essayer la collection à des débutants et à des joueurs attirés par la complétion, vérifier qu’ils comprennent les critères et choisissent une pratique utile. S8 (compte et synchronisation) reste prévu en phase 8. Les favoris musicaux ne font pas partie de ce premier lot.
