# DFT — dossier de validation des cartes de succès

**Les Archives de la résonance · 19 octobre 2026**

Il s’agit d’une proposition graphique et fonctionnelle, pas d’une nouvelle version de l’application. Les données et dates des cinq maquettes sont simulées. La bêta n’a pas été modifiée.

## Commencer la revue

1. Regarder [la planche des cinq raretés](previews/planche-cinq-raretes.png) ou [les planches PDF](previews/planches.pdf).
2. Ouvrir `index.html` dans un navigateur pour retourner les cinq cartes. Depuis le ZIP, extraire d’abord tout le dossier afin de garder les SVG à côté du HTML.
3. Lire [le cahier des charges](01-cahier-des-charges.md), puis [le catalogue des 42 modèles de succès](02-catalogue-des-succes.md).

Les boutons **Voir le verso** et **Fond de revue sombre/clair** fonctionnent dans la galerie. Les contrôles dessinés à l’intérieur des SVG sont des éléments de maquette : ils ne lancent ni exercice ni son. Aucun serveur ou bibliothèque n’est nécessaire à la conception de cette galerie ; ses images sont des fichiers locaux référencés relativement.

## Les cinq exemples SVG

| Niveau | Recto | Verso |
|---|---|---|
| Commune — La première fait le jack | [SVG](svg/01-commune.svg) | [SVG](svg/01-commune-verso.svg) |
| Inhabituelle — Réunion de famille | [SVG](svg/02-inhabituelle.svg) | [SVG](svg/02-inhabituelle-verso.svg) |
| Rare — Seven Nation Army | [SVG](svg/03-rare.svg) | [SVG](svg/03-rare-verso.svg) |
| Épique — Éclair de manche | [SVG](svg/04-epique.svg) | [SVG](svg/04-epique-verso.svg) |
| Légendaire — Le manche dans toutes ses coutures | [SVG](svg/05-legendaire.svg) | [SVG](svg/05-legendaire-verso.svg) |

Les cinq rectos pèsent environ 9,4 à 13,2 Ko chacun, non compressés. Aucun filtre SVG, image intégrée, police externe ou script dans les SVG. Le petit script de la galerie gère uniquement la revue des rectos/versos et son fond.

## Ce qui est conservé

Titre, contexte, progression et pourcentage, action Essayer/Rejouer, date sur la même ligne que Rejouer, coche visible, écoute pour la pochette musicale et critères au verso. Le music-sleeve représente la chronologie réelle actuellement stockée dans le catalogue. Le détail de sa source de données est dans le cahier des charges ; aucun nouvel audit musical n’est revendiqué.

## Points à valider

- L’identité « objets sonores gravés » et le nom de série « Archives de la résonance » — ce n’est pas un renommage de l’application.
- Les cinq finitions, en particulier l’intérêt de la Commune et la distinction Rare/Épique.
- Les noms, critères et raretés des 42 modèles ; les variantes utiles et les défis facultatifs de vitesse.
- La hiérarchie du recto, les boutons, le verso et la place donnée à la phrase musicale.

## Vérifications réalisées

Les dix SVG sont valides XML, leurs IDs sont uniques dans chaque fichier et leurs références locales résolues. Les boîtes de texte restent dans le cadre. Galerie vérifiée dans Chromium aux largeurs 320, 390, 768 et 1440 px, sans défilement horizontal ; cinq retournements aller/retour par largeur. Réduction des animations, changement de fond et retournement hors connexion après chargement vérifiés. Aucune erreur JavaScript observée.

La navigation `file://` est bloquée par la politique du navigateur de cet environnement : son ouverture directe n’a donc pas pu être testée ici. Le dossier n’utilise ni `fetch`, ni import de module, ni ressource distante. Le futur composant HTML devra encore être vérifié sur iPhone/Android et dans les quatre thèmes. Rapport technique : [verification.json](verification.json).

Les maquettes ne sont pas encore des composants accessibles de production : le cahier des charges prévoit une UI HTML avec textes adaptatifs et cibles tactiles de 44 px minimum. Les SVG servent à valider la direction artistique, pas à remplacer les formulaires par des images.
