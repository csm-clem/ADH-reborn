# v0.35.1 — UX-24 : manche continu défilable

Décision de Clément : conserver une seule ligne de manche, défilable pour les activités 0–24, avec boutons de réponse en option. Le comportement 0–12 est conservé.

## Implémentation

- Géométrie en pixels pour le manche de gameplay 0–24 : chaque case mesure au moins 44 pixels de large. Toutes les cordes restent visibles. Le manche défile dans son bloc et ne fait pas déborder la page.
- Défilement tactile natif et glisser à la souris. Un glissement ne soumet jamais une note ; une réponse tactile n’est reconnue qu’au relâchement sans glissement. Le comportement immédiat existant sur 0–12 reste intact.
- Barre de défilement native et fondu au bord droit tant que la fin n’est pas atteinte. Aucun changement d’orientation forcé.
- Déplacement conservé entre questions « Trouvez » : pas de cadrage automatique sur la bonne réponse. Pour « Quelle est cette note ? », seul le repère demandé est amené à l’écran lorsqu’il le faut.
- Boutons optionnels, jamais ouverts automatiquement ; leur choix reste ouvert jusqu’à fermeture manuelle. Grille adaptée à 25 cases.
- Les schémas non interactifs et les proportions des autres activités ne changent pas.

## Recette

[Test géométrique](../tests/scroll-neck.test.mjs), [recette navigateur](../tools/qa/scroll-neck.py), [résultats et captures](v0.35/verification.json).

Chromium avec vraies entrées tactiles : 320×568, 390×844, 844×390 et 1440×900. Pan tactile, glisser souris, absence de réponse lors du déplacement, réponse directe sur le manche, boutons persistants et retour au manche, huit cordes présentes, absence de débordement horizontal de page et contrôle 0–12.

Les captures ont été relues : en paysage, manche et réponses sont en colonnes ; en portrait ils sont superposés. Cette recette technique ne remplace pas les essais iOS/Android sur appareils physiques.

## Disponibilité

Les activités étendues restent dans la prévisualisation `?curriculum=full` tant que la recette complète de leurs cours n’est pas achevée. UX-24 peut être clos après les contrôles ; V1-06 à V1-09 ne sont pas déclarés automatiquement validés par cette seule décision d’interface.

La révision 0.35.1 corrige aussi l’alignement de l’accès aux boutons dans les mélanges à plusieurs cordes. Une réponse via cette grille a été vérifiée dans la recette navigateur.
