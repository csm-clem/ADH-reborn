# Référence de cohérence de DFT

## Composants réellement utilisés

- `ui-actions.js` : bouton accessible, dispatch des commandes, raccourcis, focus et distinction clavier/pointeur.
- `ui-icons.js` : jeu d’icônes unique de l’application et de la galerie.
- `game-hud.js` : même structure pour Arcade et Parcours. Les adapters fournissent les noms d’actions, les informations et les commandes pertinentes. Une action absente retire son bouton. `status`, `extra` et `timer` permettent les extensions propres au mode.
- `result-frame.js` : anatomie commune des résultats (en-tête, résumé, actions/récompenses, détail). Les calculs, sauvegardes, succès, partage, musiques et révisions restent dans leur contrôleur. Les motions existantes sont conservées.
- `launch-transition.js` : une seule chronologie et une seule fonction de rendu. La palette est fournie par les tokens Arcade/Parcours.
- `neck-view.js` : rendu du manche partagé, également utilisé par la galerie.

Les libellés et les noms d’action du bouton sont échappés ; les slots HTML sont réservés au markup produit par le code de l’application. Ne pas y injecter de texte externe sans échappement.

## Rythme et cascade

`tokens.css` définit l’échelle `--space-1` à `--space-6`, la taille tactile et les couleurs des thèmes. Les rôles `--control-gap`, `--action-gap`, `--field-action-gap`, `--section-gap`, `--panel-padding`, `--game-gap` et `--result-gap` donnent un sens à ces distances. Le contexte paysage compact peut changer certains rôles sans réécrire les pages.

Les boutons sont peints uniquement par `components.css`. La structure commune du HUD est dans `hud-layout.css`, importée après les anciennes feuilles de pages : leur cascade ne peut plus rétablir un ancien HUD. Sur petit écran, le titre prend une ligne distincte et toutes les commandes restent disponibles, avec des cibles de 44 px. Le manche de nommage et la roue adaptent leur place disponible sans réduire la taille des boutons de réponse.

Pour une nouvelle page : réutiliser le composant, ajouter une option explicite si le besoin est partagé, puis employer un rôle d’espacement existant. Éviter les copies et les sélecteurs propres à un mode pour modifier l’apparence d’un bouton.

## Contrats de comportement

- Pause : horloge active figée, son arrêté selon les règles du mode, reprise sans remettre le temps à zéro.
- Son : même état `aria-pressed`, même icône et même libellé dans les HUD ; état conservé après rendu et focus rendu au bouton.
- Relance : nouvelle séance de l’activité courante, sans suppression des résultats durables ; indisponible pendant la pause ou une introduction.
- Échap : pause/reprise même si la transition a retiré le précédent élément focalisé ; ignoré pendant l’édition d’un champ ou l’ouverture d’un dialogue.
- Tab : focus contenu dans les commandes visibles pendant la pause, sans traverser les pages inertes de la transition.
- Plein écran : libellé, icône et état synchronisés pour les deux modes.
- Résultats : statistiques dans le flux, sans mutation du score ni nouvelle célébration à leur ouverture.
- Réduction des mouvements : résultats finaux directement lisibles ; fondus de transition sans déplacement spatial.

## Galerie interne

Lancer `npm start`, puis ouvrir `/component-gallery.html` sur le serveur de développement (port 4173). `/ui-kit.html` redirige vers cette référence. La galerie emploie les vrais composants et les vrais rendus des contrôleurs, avec des fixtures en mémoire. Elle ne lit ni ne modifie la progression de l’utilisateur et n’enregistre pas les préférences choisies.

Sélecteurs : composant, mode, quatre thèmes, état et largeur. États proposés : normal, record, pause, son coupé, titre long, absence de données. La pause et le son sont interactifs sur le HUD ; les boutons natifs permettent d’examiner survol, focus et désactivation. L’iframe possède son propre viewport pour rendre les règles responsive réelles. Les trois fichiers de galerie et l’ancienne entrée ui-kit sont exclus du paquet de production et de son cache.

## Vérifications et références

- `npm test` : contrats unitaires, règles de styles et calculs.
- `python3 tools/qa/game-controls.py` : commandes sur les deux vrais modes (Échap, horloge, son, focus, relance).
- `npm run qa:ui` : 32 captures comparées, HUD/résultats dans les deux modes, actions et manche, clair/sombre et formats portrait/paysage/bureau ; dimensions tactiles, débordements, focus clavier et isolation du stockage.
- Les autres états/thèmes sont accessibles dans la galerie pour la revue humaine.
- `npm run qa:ui:update` : génération explicite des références candidates. Ne pas lancer cette commande pour faire disparaître un échec sans examiner les images.

Références : `tests/visual/ui-consistency/`. Captures courantes et rapport : `work/ui-consistency/`. La comparaison tolère les petites variations de rendu (écart de canal >45 sur moins de 2,5 % des pixels). Un test injecte une régression visuelle pour vérifier que le comparateur la détecte. Les premières références sont générées techniquement ; leur examen humain reste distinct d’une approbation du design.

Les deux workflows GitHub exécutent les comparaisons et les contrats de commandes, avec Pillow épinglé. Leurs artefacts conservent les captures courantes. Une différence volontaire doit être revue puis accompagnée de nouvelles références dans le même changement.
