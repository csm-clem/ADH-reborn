# Daily Fretboard Trainer — v0.18

## Nouveau parcours par familles

Le parcours par intervalles est remplacé. Le générateur commun `CURRICULUM_RULES` produit les étapes depuis l’instrument, son accordage réel et la zone demandée.

1. Nommer puis retrouver les cordes à vide, y compris celles dont le nom est altéré.
2. Pour chaque famille : apprendre toutes ses positions isolément, dans les deux sens ; puis la mélanger aux positions déjà introduites, à nouveau dans les deux sens.
3. Les familles naturelles présentes dans l’accordage viennent d’abord, sans doublonner les cordes de même nom. Les naturelles restantes suivent, puis les familles altérées.
4. Une famille altérée présente à vide, comme F♯ sur une guitare huit cordes, est travaillée **après les naturelles**, avant les autres altérations, conformément à la réponse donnée pendant cette livraison.

En guitare six cordes standard, les familles suivent **E, A, D, G, B, F, C, F♯, C♯, G♯, D♯, A♯**. Cela produit **50 activités** : 2 pour l’accordage, puis 4 par famille. Ce nombre résulte de la méthode demandée, pas d’un quota de chapitres. Les exercices restent accessibles sans déblocage préalable.

Les activités isolées ne piochent pas dans les anciennes familles. Les mélanges conservent toutes les positions déjà introduites et garantissent au moins 20 % de questions sur la dernière famille, dans un ordre aléatoire. Les séries comptent 20 à 24 questions ; une courte chaîne finale peut les compléter sans dépasser 30 réponses dans une tentative sans erreur. Les retentatives de cette chaîne ne sont pas de nouvelles questions de statistiques.

Le générateur est testé aussi pour les zones 4–8, 7–11 et 12–16 ; leur sélection n’est pas ajoutée à l’interface dans cette livraison. Le détail des activités et les textes de micro-leçons sont dans [le parcours de référence](v0.18/PARCOURS.md).

## Micro-leçons, démonstrations et mise en page

Toutes les micro-leçons du parcours sont réécrites autour des noms, hauteurs et positions. Plus de leçons d’intervalle ni d’explication en demi-tons dans ce parcours. L’éditeur d’accordage garde ses indications techniques de transposition : il reste un outil distinct des micro-leçons.

La règle commune distingue désormais explicitement :

- **Exemple explicatif** : positions de la famille visibles, vertes et nommées ; exemple « Quelle est cette note ? » avec sa réponse explicitement indiquée.
- **Découverte interactive** : aucune bonne position révélée avant le toucher. Chaque position trouvée devient verte et nommée, puis reste visible. Le bouton « J’essaie sans les noms » s’active quand la famille entière a été explorée.
- **Question évaluée** : point neutre pour nommer, aucune case cible déjà marquée pour retrouver.

Les étiquettes partagent un calcul de taille et de placement entre le manche de jeu et les petits schémas. Les micro-leçons ont des groupes explicites — titre, visuel, explication, actions — plutôt qu’une succession d’éléments repositionnés par d’anciennes règles CSS. Sur écran paysage court, le visuel et l’explication sont côte à côte. Les actions restent regroupées sous le contenu. Une ancienne largeur minimale de boutons, source de débordements, est supprimée.

Le lien « Boutons de réponse » est remplacé par une commande stable dont le rectangle reste au même endroit à l’ouverture et à la fermeture. Seule la grille défile au-dessus de ce contrôle. La préférence reste conservée jusqu’au masquage manuel. Le retour au parcours, sur l’écran de pause, utilise le bouton secondaire partagé.

La position relative des blocs question et réponse pendant le gameplay reste conservée.

## Animations et erreurs

Les pastilles sont légèrement agrandies. Leur apparition comporte un rebond plus marqué ; leur sortie dure **560 ms**, soit 200 ms de plus, avec un grossissement plus important.

Pour une erreur, le nom attendu reste neutre et **la sortie attend 500 ms**, avant le fondu de 560 ms. La question suivante est disponible immédiatement : il ne s’agit pas d’une attente imposée au joueur. Plusieurs corrections peuvent coexister. Sur la toute dernière question, le résultat attend la fin de cette correction pour ne pas masquer son nom ; aucune réponse ne peut être comptée deux fois.

Chaque cercle grandit autour de son propre centre. Le nom de note est animé séparément en opacité : sa largeur ne déplace plus l’origine du zoom. Les styles d’animation sont conservés lors du rendu différentiel pour éviter leur redémarrage. Le réglage de réduction des mouvements reste respecté. Le ripple demeure supprimé.

## Dièses ou bémols

Une préférence **Notes altérées : Dièses / Bémols** est disponible dans les Paramètres. Une commande ♯ / ♭ est ajoutée à côté de Pause pendant les exercices. Le choix est conservé et s’applique aux roues, consignes, étiquettes, statistiques et affichages d’accordage.

Changer F♯ en G♭ change seulement le nom affiché : la hauteur MIDI, la réponse attendue, la file des questions et le chronométrage en cours ne sont pas réinitialisés. La notation CDE / Do–Ré–Mi reste une préférence indépendante.

## Chaîne musicale et récompense automatique

Une erreur dans la suite remet la chaîne à son début, sans jouer de son d’erreur. Après une nouvelle chaîne entièrement correcte, **la dernière bonne note déclenche automatiquement la phrase accompagnée**, sur la fiche de résultat. L’élève peut arrêter ou relancer l’écoute ; Muet reste respecté.

La sélection active ne retient que les extraits pour lesquels une phrase complète est vérifiée : Ah ! vous dirai-je, maman, Kuckuck, le Chœur des fiançailles, The Entertainer, Over the Rainbow, Star Trek et Frère Jacques. Les anciens appels Maria, Dents de la mer, My Bonnie et Saints, trop courts ou arrangés sans phrase complète vérifiée, ne sont plus sélectionnés pour cette récompense. Une configuration sans extrait compatible conserve une suite d’entraînement annoncée comme telle, sans prétendre rejouer un morceau original.

L’écoute peut dépasser les seules notes que l’élève a dû toucher. Elle est transposée pour le contexte et peut changer de registre ; l’accompagnement est une harmonisation pédagogique, pas l’enregistrement ni l’orchestration d’origine. Une phrase complète n’est pas nécessairement le morceau entier. Voir [les sources et étendues musicales](RECOMPENSES-MUSICALES.md).

La tentative conserve la réussite de chaîne et l’identifiant musical pour préparer la future collection. **La page Succès et les obtentions persistantes ne sont pas encore implémentées** : la demande portait ici sur leur roadmap.

## Succès : proposition et roadmap

Le [document de conception des succès](ROADMAP-SUCCES.md) traite le catalogue, les preuves, le moteur déterministe, la persistance, les pochettes musicales, la page de collection, les notifications, la validation avec les joueurs et la synchronisation de phase 8. Une [maquette d’album](v0.18/collection-succes.svg) illustre le principe.

Le collectionneur veut réunir un ensemble et voir ce qui lui manque ; l’accomplisseur veut constater un défi réussi et sa progression. L’album proposé sert les deux, sans enfermer une personne dans un profil. Les critères sont visibles ; aucune rareté artificielle ou récompense aléatoire n’est nécessaire. Les références et les choix retenus à partir du texte joint sont expliqués dans le document.

## Validation

- 86 tests automatisés et contrôle syntaxique.
- Parcours standard complet de 50 activités, avec résultats et sauvegardes.
- Onboarding : six instruments, huit formats, accordages et préférences.
- Manche et boutons accessibles : six instruments, cinq formats, aigu en haut.
- 20 compositions de micro-leçons : actions visibles et touchables.
- Stabilité du SVG, commande de boutons immobile, correction lisible et changement dièses/bémols sur cinq formats.
- Erreur musicale qui remet à zéro, récompense accompagnée déclenchée automatiquement, arrêt et preuve enregistrée.
- Contexte audio unique, restauration d’une sauvegarde entre instruments, cache et démarrage hors connexion depuis un sous-dossier FTP.

Les essais dans Chromium ne remplacent pas le retour tactile sur les téléphones réels, l’écoute de leurs haut-parleurs ou les tests avec des personnes ayant des besoins visuels particuliers.

## Installer

Décompresser [le ZIP v0.18](../downloads/daily-fretboard-trainer-v0.18.zip), puis déposer **son contenu** dans `adh-pwa/v0.18/`. Ouvrir ensuite `https://media.lecompositeur.com/adh-pwa/v0.18/`. Le serveur o2switch n’est pas modifié automatiquement. Comme convenu en v0, la progression des versions précédentes est retirée ; l’instrument et les préférences sont conservés.
