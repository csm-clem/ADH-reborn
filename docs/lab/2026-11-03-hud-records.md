# HUD, résultats et cohérence

Implémentation locale : HUD commun configurable (retour, titre, contexte, relance immédiate, plein écran, pause, son ; altérations et temps selon le mode). La relance recommence la séance courante sans effacer les progrès. Transition unique avec zoom ease out sur les 300 ms du fondu précédent. Retrait de l’entrée Arcade redondante dans Parcours ; espacements des groupes de boutons, mini-leçons, résultats et reset.

Les statistiques Arcade quittent la grille centrée contrainte à la hauteur de l’écran lorsqu’elles sont ouvertes ; le détail prend sa place dans le flux et la carte du manche défile dans son propre cadre. Le bouton indique « Voir les stats ». L’ouverture termine proprement le compteur animé sans relancer la célébration. Éclats disposés en huit directions autour de chaque nombre, sans découpe par la carte.

Records indépendants par mode et profil instrument/accordage : bonnes réponses, nombre de bonus combo déclenchés, plus longue série. Les anciens résultats de meilleur score servent de minimum connu ; les anciennes séries non enregistrées ne peuvent pas être reconstituées. Chaque nouvelle partie enrichit ces maxima même sans record de score. Un dépassement strict déclenche le surlignage ; une égalité ne le déclenche pas. L’ancien meilleur nombre de notes consécutives reste indiqué si la partie ne l’atteint pas.

## Paliers actuels

Les quatre modes utilisent le score total, bonus compris : palier = partie entière(score / 1000). Les versions naturelles et chromatiques ont les mêmes étapes ; seules les notes admises changent. Le timer dépend du nombre de questions, pas du score : 4000 ms moins 10 ms par question résolue, minimum 500 ms. Les erreurs et expirations accélèrent aussi cette horloge.

Sur guitare 6 cordes, zones : 0/1000/2000/3000/4000 points = 2/3/4/5/6 cordes graves, cases 0–4. Chaque zone suivante occupe trois paliers : découverte seule, alternance par groupes de trois entre zones adjacentes, puis mélange cumulatif. Débuts de zones II à VI : 5000, 8000, 11000, 14000, 17000 points ; les deux phases suivantes commencent 1000 puis 2000 points plus tard. Au moins quatre questions découvrent la nouvelle zone même si un bonus saute un palier. Zones : 0–4, 4–8, 8–12, 12–16, 16–20, 20–24.

Cordes, guitare 6 cordes : une corde grave sur 0–12 au départ, puis une corde supplémentaire par 1000 points ; six cordes à 5000. À 6000 points, passage aux 24 cases. Lors d’un ajout de corde, une question sur cinq provient du périmètre nouveau. Pour N cordes : toutes les cordes à (N−1)×1000 en mode Cordes, extension 24 cases à N×1000 ; en mode Zones toutes les cordes à (N−2)×1000, zone II à (N−1)×1000 puis une nouvelle zone tous les 3000 points.

## Consolider la PWA

Conserver une source par composant (HUD, manche, transition, résultat, bouton), avec options explicites plutôt que copies par mode. Centraliser les espacements et dimensions tactiles dans les tokens. Maintenir une galerie des composants dans les deux thèmes, aux tailles mobile/portrait/paysage/bureau. Ajouter des tests de contrats partagés (labels, raccourcis, son, pause, focus, mouvements réduits) et des captures visuelles pour détecter les écarts. Séparer logique de score, persistance des records et animation de présentation.
