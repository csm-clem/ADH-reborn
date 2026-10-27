# Suivi DFT

Avant chaque intervention, consulter le tableau de bord de référence : https://daily-fretboard-roadmap.quirkybison9.chatgpt.site/ (Sites, projet `appgprj_6ade3258098881919406d2d8ac6ec20b`).

Repérer les identifiants des tâches, leurs critères, leur autonomie et leurs dépendances avant de travailler. Mettre à jour les statuts et preuves dans sa source `dist/roadmap.json`, puis republier le même Site en conservant son audience. Ne pas confondre code, recette technique, déploiement et validation humaine. Un statut validé exige des preuves ; les essais sur de vrais téléphones ne sont pas remplacés par Chromium. Si le tableau n’est pas accessible, signaler cette limite et conserver un journal local des opérations déjà autorisées.

Décision de Clément du 27 octobre 2026 : la v0 est l’environnement bêta d’expérimentation, sans clients ni bêta-testeurs actuellement. Tous les parcours implémentés sont accessibles par défaut ; aucun paramètre URL de prévisualisation ne doit conditionner leur visibilité. La recette technique et pédagogique se poursuit sans masquer les contenus. UX-24 reste tranché : manche continu défilable pour 0–24, boutons optionnels, affichage 0–12 conservé.

Les développements se déploient dans le bac à sable `/DFT/lab/`, avec des essais immuables sous `/DFT/lab/builds/`. Ne pas publier en live sans instruction explicite de Clément approuvant un essai précis. Le workflow live est manuel uniquement. Garder les données, mises à jour et identités PWA du bac à sable séparées du live. Les changements non publiés vont dans `pending-changes.json` ; seul un essai promu alimente le journal live.

Chaque modification destinée à une future publication doit ajouter un identifiant inédit dans `pending-changes.json`. Ne pas ajouter une version intermédiaire au journal live. Après une promotion vérifiée, récupérer le registre live et retirer les changements déjà inclus avant de préparer le prochain candidat. Ne jamais recopier le code courant à la place de l’archive précise approuvée.

Numérotation validée le 27 octobre 2026 : releases affichées `v0.x`, essais préparatoires `v0.x.y`. Le compteur y avance à chaque essai et repart à 1 pour la prochaine release. Les identifiants techniques de builds restent immuables ; les métadonnées PWA conservent trois composantes numériques pour les mises à jour.

Les déploiements de développement se font par la branche `sandbox/dft`. Il n’est pas nécessaire de pousser vers `main` pour publier un essai ; une intégration dans la branche principale se traite séparément.
