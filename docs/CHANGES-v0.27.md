# Daily Fretboard Trainer v0.27 — jeu et collection plus lisibles

## Jeu et manche

- Les marges au-dessus et au-dessous des cordes sont réduites. Le manche exploite la hauteur disponible ; les marges des schémas pédagogiques restent indépendantes. La numérotation conserve son espace lisible.
- Les questions de **nom** présentent systématiquement les sept notes naturelles. Dès qu'une activité comprend des altérations, la seconde roue propose les cinq altérations : aucune réponse n'est déduite uniquement des réponses présentes dans la série.
- Les exercices de **hauteur** gardent leur roue E2/E3/E4, conformément à la consigne antérieure sur les familles isolées. Leur question s'intitule désormais « Quelle est cette hauteur ? », également dans l'explication. Cette exception reste à confirmer avec Clément : une question a été posée pendant le travail.
- Le survol et l'appui dans la roue ont un fond neutre. Les couleurs d'évaluation restent réservées aux réponses.
- Les numéros décoratifs des trois branches sont retirés.

### Pourquoi la roue et le manche avaient changé

Comparaison réelle de l'historique :

| Version / commit | Constat |
|---|---|
| v0.23 — `9109330` | `wheel()` comportait **déjà** deux règles : MIDI exact pour les familles et les cordes à vide, sept noms naturels pour les questions de nom. La roue limitée aux hauteurs n'a donc pas été introduite en v0.24/v0.25. |
| v0.24 — `8a301d4` | Ajout des zones variables, d'une corde continue de 0 à 12 et des boutons adaptés lorsque treize cibles seraient trop petites. Ajout d'un demi-espacement de corde aux bords du manche de jeu : cela contribuait aux marges excessives. |
| v0.25 — `8418499` | Conservation de la règle de roue et des adaptations tactiles. Pas de justification historique pour attribuer la restriction des réponses à l'accessibilité en paysage. |

La correction conserve la corde continue, les cases visibles et l'alternative tactile en portrait. Elle ne revient pas aux anciennes limitations à une seule zone. Les noms et les hauteurs restent deux tâches différentes, explicitement nommées.

## Timbres

- **Acoustique** : le bruit de corde pincée est mélangé à un corps harmonique stable, plus riche en fondamentale et moins chargé en médiums nasillards.
- **Saturée** : deux étages de saturation, filtrage d'entrée et de baffle, traitement à fréquence double avant réduction pour limiter les artefacts numériques. Cela reste une synthèse Web Audio, pas une capture d'ampli réel.
- Les deux timbres passent par la calibration de puissance audible existante ; les notes peuvent toujours se chevaucher. Les préférences et commandes audio sont conservées.

## Collection

- Onglet **Tout**, en plus de Repères / Fluidité / Musiques ; c'est le choix initial des nouveaux joueurs. Les anciens filtres de catégorie restent respectés.
- Une seule présentation en cartes. L'ancienne alternative « Liste » n'avait pas de fonction pédagogique distincte et compliquait la géométrie des pochettes. L'album reste la collection de cartes, avec progression, critères et commandes réelles.
- Les cartes non acquises sont désaturées. Le bouton **Essayer** reste dans la couleur du thème, sans filtre appliqué à ses parents.
- Les dates, numéros stables, critères, actions, reflets et mouvements des cartes restent fonctionnels.

## Mes progrès

- La poignée de défilement a la largeur `largeur de la piste × largeur visible / largeur totale du tableau`. Elle se recalcule au montage et au redimensionnement, conserve le clavier et suit les gestes de défilement.
- Quatre états : À découvrir `·`, À revoir `!`, Travaillée `✓`, **Parfait `✓✓`**.
- Travaillée : plus de 85 % de premières réponses correctes à cet emplacement.
- Parfait : 100 %, **avec au moins trois réponses pour nommer et trois pour retrouver**. Cela évite d'attribuer ce niveau après une seule bonne réponse. Il s'agit d'un indicateur de résultats, pas d'une garantie de mémorisation définitive.
- Les cellules ont des fonds complets, avec des couleurs adaptées aux quatre thèmes. Pourcentage et symbole permettent une lecture en noir et blanc. Les statistiques cumulées continuent de fonctionner après réduction du journal détaillé.

## Musiques : changements et limite restante

| Morceau | Modification |
|---|---|
| Seven Nation Army | Deux mesures du riff, sans les deux pauses ajoutées dans l'ancienne lecture. Les attaques sont désormais à 0, 1,5, 2, 2,5, 3, 4 et 6 temps ; deux derniers sons de deux temps. Passage de la transcription de basse Bonedo, distinct de la variante détaillée de guitare avec glissés. |
| Around the World | Quatre mesures du couplet : appuis en La, Do et Mi, puis descente finale. L'ancienne courte descente répétée ne représentait pas cette phrase. Le comptage publié permet de conserver les deux doubles croches de fin de mesures. |
| Over the Rainbow | Tempo doublé : 78 → **156 BPM**, sans transposition des notes. |
| The Christmas Song | Retiré des nouvelles attributions. Remplacé dans le catalogue par **Cantaloupe Island**, de Herbie Hancock : jazz funk, nouvelle pochette illustrée et numéro **M027**, attribué à une activité compatible. Sur guitare 6 standard, il apparaît dans le mélange des G♯. Les anciennes cartes de Noël acquises conservent leur identité, date et lecture. |
| Immigrant Song | **Pas de nouvelle version vocale livrée.** L'ancienne ligne de basse n'est plus attribuée à de nouveaux défis ni présentée comme une voix. Le passage est en révision. Les succès historiques restent conservés ; leur lecture est désactivée tant que la nouvelle phrase n'est pas validée. |

Les préécoutes d'exercice et les récompenses utilisent la même chronologie de notes, durées et silences. L'écoute revient toujours à la hauteur de la source. Les tests établissent cette cohérence interne, pas une identité acoustique avec les disques.

### Sources consultées le 19 octobre 2026

- [Seven Nation Army — atelier, partition et audio Bonedo](https://www.bonedo.de/artikel/die-besten-bass-riffs-in-noten-und-tabs-the-white-stripes-seven-nation-army/) ; comparaison avec la [variante détaillée de Lee Jones](https://www.chords-and-tabs.net/song/name/white-stripes-seven-nation-army-20). Les deux transcriptions ne doivent pas être fusionnées.
- [Around the World — tablature avec comptage rythmique explicite](https://www.guitartabs.cc/tabs/d/daft_punk/around_the_world_btab.html), [atelier avec audio Bonedo](https://www.bonedo.de/artikel/play-alike-daft-punk/) et [analyse de la construction du groove, Attack Magazine](https://www.attackmagazine.com/technique/passing-notes/daft-punk-basslines-the-ultimate-guide/). La lecture suit le comptage de la tablature ; elle ne reproduit pas les glissés, le filtre du synthé ou le microtiming du disque.
- [Cantaloupe Island — source LilyPond, thème à 116 BPM](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Cantaloupe%20Island%20-%20Ly%20Core%20-%20Fm.ly). Levée et première phrase ; les deux premières notes sont séparées, la liaison finale est conservée. La synthèse utilise une voix seule.
- [Immigrant Song — édition vocale Alfred/Musicnotes](https://www.musicnotes.com/sheetmusic/led-zeppelin/immigrant-song/MN0047711), [analyse collaborative Hooktheory](https://www.hooktheory.com/theorytab/view/led-zeppelin/immigrant-song). Ces pages ne donnent pas, dans les données exploitables ici, une transcription complète et corroborée du cri vocal. Le téléchargement direct des PDF externes est refusé par le réseau de cet environnement. Il faut une partition vocale exploitable ou un relevé validé pour terminer ce point ; je n'ai pas déduit des notes et durées à partir de simples descriptions.

## Livraison et données

La v0.27 conserve les clés de sauvegarde stables et les anciennes preuves. Aucune réinitialisation des testeurs. Le ZIP prêt à déposer par FTP contient l'application et ses ressources ; le serveur o2switch n'a pas été modifié par cette intervention.

## Vérifications effectuées

- `npm run check` : syntaxe des modules validée.
- `npm test` : **27 fichiers de tests passent**, dont huit nouvelles régressions ciblées sur les roues, la géométrie, les statistiques durables, la conservation des cartes, la chronologie musicale et les timbres.
- Collection : quatre thèmes × cinq formats, critères au verso, boutons, lecture/arrêt, animations musicales, inclinaison souris et glissement tactile ; aucune erreur JavaScript.
- Jeu : guitare 6, guitare 8 et basse 4 sur téléphone portrait, téléphone paysage et PC. Sept/douze réponses selon la tâche ; marge haute inférieure à 35 px, basse inférieure à 50 px, numérotation comprise. La prochaine réponse est acceptée pendant que la correction précédente s'anime.
- Progrès : quatre thèmes × deux formats, pourcentages et symboles, fonds des cellules, largeur de poignée contrôlée contre les dimensions réelles, accès à la dernière case.
- Archive FTP : 131 fichiers, lancement à une URL imbriquée, ressources et 46 illustrations disponibles hors ligne après rechargement.
- Captures et rapports JSON dans [v0.27](v0.27/). Les écoutes sur du matériel réel, notamment Windows/iPhone, restent à reproduire par les testeurs ; une calibration numérique ne suffit pas à certifier le rendu de leurs haut-parleurs.
