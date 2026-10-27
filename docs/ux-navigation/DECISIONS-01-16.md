# Lisibilité et navigation DFT — décisions du 27 octobre 2026

Source : pièce jointe « Texte collé.txt ». La demande de Clément valide 01 à 16, sauf 08, 12 et 13 qui doivent être expliqués avant décision. 17 à 21 restent en attente. Publication de développement dans le lab uniquement.

| Point | Mise en œuvre autorisée |
|---|---|
| 01 | Fond légèrement grisé, cartes distinctes, navigation sur sa propre surface ; quatre thèmes conservés. |
| 02 | Textes secondaires lisibles et dégradés orange/rouge et bleu assombris pour préserver leurs libellés blancs. Mesures des contrastes principaux dans chaque thème. |
| 03 | Un titre de page dominant, titres de section intermédiaires et cartes de niveau inférieur. |
| 04 | Fil d’Ariane réel et cliquable sur ordinateur ; destination parente explicite dans l’en-tête mobile. |
| 05 | Retours nommant leur destination et historique navigateur commun ; geste gauche conservé. |
| 06 | Raccourci vers la séance en cours ou la prochaine activité selon les règles existantes, sans changer les trois branches. |
| 07 | Parcours / Progrès / Succès / Réglages identiques sur mobile et ordinateur ; onglet actif signalé par forme, trait et couleur. |
| 08 | **En attente.** Voir l’explication ci-dessous. |
| 09 | Catalogue en quatre catégories : Zones / Cordes / Duos / Mélanges. Catégorie retenue au retour. Aucun parcours masqué par un drapeau de prévisualisation. |
| 10 | Mémoire de défilement et des accordéons par page ; retour et avance du navigateur. |
| 11 | Grilles de choix et réglages sur ordinateur, empilement sur mobile ; largeur de lecture bornée. |
| 12 | **En attente.** Pas de nouvel écran d’explication ni de nouvelle consigne. |
| 13 | **En attente.** Aucun déplacement de la consigne, des questions, des réponses ou du manche. |
| 14 | Progrès affiche la prochaine étape et, lorsqu’elle existe, la dernière activité réussie, avant le tableau du manche. Ce résultat ne prétend pas prouver une maîtrise durable. |
| 15 | Instrument / Jeu et son / Apparence / Sauvegardes et mises à jour / Aide ; débug toujours premier pendant la v0, informations techniques repliables. |
| 16 | États À commencer / En cours / Terminé, avec symbole et texte ; recommandation de prochaine séance séparée de l’état d’acquisition. |

## 08 — Hiérarchiser les chemins de l’accueil

Le point 06 répond à « comment reprendre sans traverser plusieurs menus ? ». Il ajoute un raccourci qui utilise la séance enregistrée ou les règles de progression actuelles. Les trois branches demeurent présentes dans le même ordre et restent comparables.

Le point 08 va plus loin : il changerait la place relative des choix. La reprise deviendrait le contenu principal ; la progression guidée un accès secondaire ; la pratique ciblée un autre accès ; les bases un encart plus discret. Il ne crée pas de parcours supplémentaire : il réorganise la porte d’entrée.

Exemple : après une séance sur E, l’utilisateur verrait d’abord « Reprendre — La note E — Retrouver les notes », puis les liens pour choisir autre chose. Aujourd’hui, le raccourci du point 06 permet déjà cette reprise, tout en conservant les trois grandes tuiles.

Intérêt : faciliter le rituel quotidien et réduire l’hésitation de celui qui veut simplement continuer. Risque : rendre les bases moins visibles au grand débutant, ou donner l’impression que la pratique ciblée est moins légitime. Cela touche au parti pris antérieur des trois branches jumbo ; ce n’est donc pas une simple retouche graphique.

Recommandation : évaluer d’abord l’accueil avec le seul raccourci 06. Si les joueurs hésitent encore, essayer une hiérarchie plus marquée, en conservant toujours un accès explicite aux bases et à la pratique ciblée. Ne pas masquer automatiquement les bases ni ajouter un questionnaire de niveau.

## 12 — Expliquer les activités avant leur lancement

Ce point vise le choix de l’activité, pas une nouvelle leçon de théorie. Un débutant ne sait pas nécessairement ce que « Nommer » ou « Retrouver » lui demande de faire.

Exemples de libellés possibles, à placer sous le nom de l’activité :

- **Découvrir** : « Touchez, écoutez, repérez. »
- **Nommer** : « Regardez le point. Choisissez son nom. »
- **Retrouver** : « Lisez la note. Touchez sa place. »

Il existe deux mises en œuvre très différentes : une courte légende directement dans le sélecteur, ou un écran d’explication à chaque lancement. La seconde ajouterait un clic et pourrait faire doublon avec la micro-leçon et les démonstrations déjà présentes.

Recommandation : si ce point est validé, préférer la légende visible au moment du choix, éventuellement accompagnée d’un tout petit pictogramme fidèle au manche et à la roue. Conserver les démonstrations détaillées à la première rencontre du type d’exercice ; ne pas imposer une étape supplémentaire à chaque séance. Ce point n’est pas implémenté.

## 13 — Donner la priorité à la consigne pendant le jeu

La proposition jointe mélange trois opérations : rendre la consigne plus lisible, déplacer la consigne avant le manche, et rapprocher les questions des réponses. Elles n’ont pas les mêmes effets.

La première pourrait garder toute la géométrie actuelle, en améliorant uniquement l’ordre visuel de lecture dans le bloc existant : une consigne principale, la hauteur et la corde demandées nettement distinguées, les informations annexes plus discrètes. Ce serait la variante la plus limitée.

La deuxième changerait le trajet du regard. Sur téléphone, un bandeau avant le manche peut clarifier la tâche mais consomme de la hauteur ; il risque de réduire le manche ou l’espace des réponses. Sur ordinateur, l’emplacement doit aussi rester cohérent avec les deux colonnes existantes.

La troisième modifierait directement l’organisation questions/réponses. Clément a explicitement demandé auparavant de ne pas les rapprocher tant qu’il réfléchit au sujet : elle ne doit donc pas être mise en œuvre implicitement.

Recommandation : conserver la disposition actuelle. Si le point 13 est validé ensuite, commencer par une variante qui renforce la consigne sur place, sans déplacer les blocs, puis comparer les erreurs et le confort de lecture. Un déplacement avant le manche ou un rapprochement des réponses nécessiterait une validation distincte et une maquette sur téléphone et laptop. Aucun de ces déplacements n’est réalisé dans ce lot. Les commandes de pause, son et plein écran ne sont pas regroupées dans un nouveau menu : cela relève aussi du point 18, en attente.

## Références et suivi

Roadmap : V1-13 pour le polissage et l’accessibilité ; V1-12 pour les régressions ; V1-11 pour les entrées/sorties des chapitres ; OPS-06 pour l’essai isolé. L’API du tableau de bord reste bloquée par la politique réseau de cette session. Les preuves sont conservées localement pour une mise à jour ultérieure par l’API, sans écraser sa base persistante.

## Complément demandé — points 17 à 21, non implémentés

Le point 16 est confirmé à nouveau par Clément : son état visuel est inclus dans le lot. Les cinq propositions ci-dessous sont expliquées pour décision, sans étendre leur réalisation.

### 17 — Expliquer les boutons désactivés

Un bouton grisé signale qu’il est indisponible, mais ne dit ni pourquoi ni comment le rendre actif. Sur téléphone, une infobulle au survol n’aide pas.

Exemple adapté à la découverte : sous « J’essaie sans les noms », afficher « Encore 2 emplacements à trouver ». Le nombre est calculé à partir de l’exercice, pas fixé à six cordes : cela doit aussi fonctionner pour une basse, une guitare à huit cordes ou une famille de notes. À zéro, le bouton retrouve son état actif. Ce texte indique la condition, sans révéler où sont les réponses.

Recommandation : un motif court, visible à proximité du bouton et mis à jour lorsque c’est utile. Aucun nouveau clic, aucune nouvelle condition pédagogique, aucun compte à rebours ajouté. Le texte disparaît ou devient inutile quand le bouton est disponible.

### 18 — Clarifier les commandes de séance

Pause, son, plein écran et dièses/bémols ont des fonctions différentes malgré leurs icônes de poids comparable. Les distinguer visuellement peut aider à trouver la pause rapidement.

Une option limitée garde les commandes à leur place et donne plus de présence à Pause, avec des icônes et libellés accessibles cohérents. Une option plus compacte rangerait des commandes secondaires dans un menu « … », mais ajouterait un clic et ne gagne pas forcément de place s’il remplace un unique bouton.

Recommandation : commencer par la distinction visuelle. Garder Pause et Son directement accessibles, y compris pendant la pause. Le sélecteur ♯/♭ a été explicitement demandé à côté de Pause : ne pas le déplacer sans accord supplémentaire. Ne créer un menu que si un encombrement réel justifie ce compromis. Cela ne réintroduit pas une mention textuelle permanente « son coupé ».

### 19 — Montrer graphiquement où agir

Le point 12 explique le type d’activité au moment de le choisir. Le point 19 indique la zone à utiliser lors de la première découverte : la roue, le manche ou les commandes d’exploration.

Exemple « Nommer » : un petit schéma relie le point sur le manche à une réponse dans la roue. Exemple « Retrouver » : le nom demandé est relié au manche avec la courte consigne « Touchez sa place ». L’exemple se trouve dans l’introduction, reste accessible à nouveau depuis l’aide et ne se répète pas à chaque question.

Recommandation : faire ce travail dans les introductions existantes, avec un exemple distinct des questions évaluées. Pendant une véritable question, un signal peut désigner le manche entier ou la corde demandée ; il ne doit pas montrer la case correcte. Préserver le passage fluide découverte → jeu, sans multiplier les écrans obligatoires. Ce point n’autorise pas à déplacer les blocs du jeu, sujet du point 13.

### 20 — Rendre le clavier cohérent dans toute l’application

Le manche dispose déjà de commandes clavier et les nouveaux onglets du catalogue suivent leur fonctionnement clavier habituel. Le point 20 est une recette plus large : vérifier tout le trajet avec Tab, Maj+Tab, Entrée et Échap, puis le retour du focus après une fenêtre ou un changement de page.

Exemples : après avoir fermé Pause, retrouver un contrôle utile ; en ouvrant une fenêtre, ne pas laisser le focus derrière ; dans Progrès, pouvoir atteindre une note et consulter son détail ; voir nettement la cible active dans les quatre thèmes.

Recommandation : sécuriser d’abord les comportements natifs et documenter les touches déjà fonctionnelles. Ne pas afficher des raccourcis fictifs et ne pas détourner les touches du navigateur ou celles d’un champ de texte. Ajouter d’éventuels raccourcis rapides ensuite, avec leurs tests. Ce n’est ni un nouveau mode d’exercice ni un remplacement du tactile.

### 21 — Adapter le jeu à la largeur et à la hauteur réellement disponibles

Le point 11 améliore l’usage de la largeur dans les menus et réglages sur laptop. Le point 21 concerne surtout le jeu dans les cas contraints : laptop peu haut, téléphone paysage, barres Safari visibles, agrandissement du texte ou taille de fenêtre réduite.

L’objectif est que la consigne, la réponse, la progression et les commandes essentielles restent utilisables, sans agrandir artificiellement le manche ni l’écraser pour tout faire tenir. Les commandes d’interface doivent conserver des cibles confortables, idéalement autour de 44 px. Le manche demande un compromis propre au nombre de cases et de cordes : treize cases ne peuvent pas toutes offrir 44 px de largeur sur un écran étroit.

Recommandation : revoir d’abord les marges et les informations secondaires, puis tester chaque configuration. Conserver les décisions existantes : pas de rotation automatique ; 0–12 ajusté comme aujourd’hui ; 0–24 sur une bande continue défilable, avec boutons de réponse facultatifs. Ce point ne signifie pas « imposer le paysage », « ajouter du défilement partout » ou « rapprocher questions et réponses ». Une recette sur de vrais téléphones reste nécessaire avant de le déclarer validé.

## Nouvelle décision de Clément — correctifs après v0.38.8

Cette décision remplace les mentions « en attente » ci-dessus : 12, 13, 17, 19, 20 et 21 sont autorisés. 08 et 18 sont rejetés. Les quatre filtres du catalogue (09) sont annulés : toutes les sections restent visibles ensemble. Le maintien de l’ancienne géométrie du jeu n’est plus une contrainte : la consigne précède la surface tactile pour rester lisible lorsque la main la couvre.

- 12 : consignes courtes dans le choix d’activité, sans écran de lancement ajouté.
- 13 : consigne au-dessus du manche et des réponses ; en paysage deux colonnes sous cette consigne. Corde demandée explicite. La main peut masquer la cible touchée sans cacher la question.
- 17 : condition visible et calculée pour le bouton de découverte ; motif visible pour l’écoute coupée ; retrait du bouton « Terminer la séquence », obsolète depuis la fin automatique.
- 19 : repère graphique d’action dans les introductions existantes, distinct des réponses évaluées ; aide existante toujours accessible dans Réglages.
- 20 : focus local visible, Échap pause/reprise, Mute accessible en pause, navigation par flèches dans Progrès et défilement vers la case focalisée sur le manche long ; touches réellement disponibles documentées dans Aide.
- 21 : cadrage explicite borné par la place disponible, cibles de roue conservées, pas de rotation forcée, manche 24 cases continu défilable et boutons facultatifs.
- Manche : un seul moteur de dessin `neckBase`; l’échelle du mode défilant s’applique aux traits et aux inlays comme aux coordonnées. Le cadrage est calé sur celui du manche court. Les règles CSS qui changeaient la disposition par longueur de corde sont retirées/remplacées.
- Gestes : droite = précédent, gauche = suivant déjà visité, pas exercice pédagogique suivant automatique.
- Chapitres : ＋ / ▶ / ✓ et texte. Une réussite d’activité seule ne remplace pas les critères de couverture d’un chapitre.
- Navigation : même surface active sur les deux formats ; mobile sur toute la hauteur, sans petits rectangles arrondis flottants.

Les anciennes preuves `gameplay-unchanged.json` concernent uniquement le lot précédent. Ce lot modifie volontairement la géométrie. Les nouvelles preuves se trouvent dans les artefacts `work/gameplay-ux` et `work/navigation-ux`. Les essais sur de vrais téléphones restent à faire.
