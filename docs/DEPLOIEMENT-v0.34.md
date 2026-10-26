# Publication v0.34 — 26 octobre 2026

Application : https://media.lecompositeur.com/DFT/.

- [Déploiement réussi](https://github.com/csm-clem/ADH-reborn/actions/runs/40249590399), commit applicatif `59292a7`.
- [CI complète réussie](https://github.com/csm-clem/ADH-reborn/actions/runs/40249590406) : garde-fous, parcours courant et prévisualisation étendue, migration, hors ligne, production sans débug.
- 135 fichiers statiques transférés ; validation TLS stricte et restriction du compte à DFT conservées, API exclue, aucune suppression.
- Contrôles HTTPS réussis le `2026-10-26T00:32:32Z` : version 0.34.0, accueil, journal, styles de collection et trois textures.
- Anciennes données et clés stables conservées. Les préférences illisibles/futures sont désormais protégées contre un remplacement silencieux.

## Suivi

Le [tableau de bord](https://daily-fretboard-roadmap.quirkybison9.chatgpt.site/) est la référence, avec preuves et dépendances. Le catalogue étendu n’est pas activé par défaut : il reste accessible avec `?curriculum=full` pour recette, en attente du choix tactile UX-24 et d’une validation de ses nouveaux cours.

Le formulaire de signalement nécessite toujours son API PHP séparée. Aucun compte cPanel principal ni dossier WordPress/LMS n’a été utilisé.
