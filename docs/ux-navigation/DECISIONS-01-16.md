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
