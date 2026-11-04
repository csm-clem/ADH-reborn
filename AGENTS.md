# Accès et autorisations — DFT

Autorisations de Clément, précisées le 4 novembre 2026. Elles décrivent le travail autorisé ; elles ne créent pas de connexion technique et ne remplacent pas les permissions de l’environnement.

## Périmètre autorisé

- Dépôt applicatif : https://github.com/csm-clem/ADH-reborn ; développement sur `sandbox/dft`.
- Lire les sources, l’historique, les différences, les workflows et leurs journaux utiles au chantier.
- Modifier les fichiers du projet, corriger les bugs, refactoriser, créer les tests et la documentation ; exécuter les vérifications et prévisualisations locales nécessaires. Préserver les changements préexistants.
- Préparer le lot et les commits locaux sans nouvelle confirmation pour ces opérations courantes.
- Lire le suivi privé https://github.com/csm-clem/dft-roadmap et y ajouter les décisions, états et preuves liés au travail demandé, en conservant l’historique. Ne pas recopier son contenu privé dans le dépôt public.
- Par défaut : développement et vérifications locales. Un envoi de sources sur une branche de travail se fait lorsqu’il est demandé ; un push sur `sandbox/dft` se fait lors d’une demande de publication, car il déclenche la chaîne lab.
- Une demande de publication autorise l’envoi du lot validé, le lancement de sa CI et son déploiement dans le lab. Utiliser le suivi ponctuel décrit ci-dessous, sauf demande explicite d’attendre la fin.
- Un statut ou une revue ne constitue pas une demande de publication. Ne pas intégrer dans `main` ou promouvoir en live sans instruction explicite ; la promotion live doit porter sur un essai précis approuvé.

## Préparation d’un nouvelle session

1. Vérifier que l’environnement contient bien le projet, puis lire `PROJECT_STATE.md`. Les noms exacts sont `AGENTS.md` et `PROJECT_STATE.md` (pas `project_state.md`).
2. Vérifier les outils et accès déjà disponibles avant de demander quoi que ce soit : dépôt applicatif, suivi privé si pertinent, lecture des Actions ; écriture GitHub seulement si la tâche la nécessite.
3. Réutiliser les connexions autorisées présentes. Ce fichier n’accorde ni accès au dépôt privé, ni authentification Git, ni permissions système. Une connexion accessible dans un ancien chat n’est pas une preuve d’accès dans le nouveau.
4. Si un accès nécessaire manque, le nommer précisément et poursuivre les parties indépendantes. Ne pas demander de mots de passe ou tokens dans le chat ou les fichiers ; utiliser l’interface de connexion/permissions prévue.
5. Vérifier les modifications locales et la branche distante avant tout envoi. Un chemin d’un ancien environnement peut ne plus exister ; ne pas remplacer le projet courant par une ancienne copie.
6. Les tests de remise à zéro/import utilisent des fixtures isolées ; ne pas effacer la progression réelle pour réaliser une recette.

Les instructions courantes de Clément priment sur ces règles de dépôt. Les protections et permissions techniques de la plateforme continuent de s’appliquer.

# Suivi DFT

Avant chaque intervention, consulter le suivi privé GitHub : https://github.com/csm-clem/dft-roadmap/issues . Les 47 issues sont la source de vérité depuis le 28 octobre 2026. L'identifiant de tâche reste dans le titre ; `issue-map.json` du dépôt privé fait la correspondance. Lire la tâche, ses critères et ses commentaires, puis ajouter les preuves et décisions datées sans effacer les précédentes. Les labels `phase:*` et `statut:*` organisent le suivi ; les tâches terminées sont fermées. Le code, les tests, le déploiement et la validation humaine restent distincts. Ne pas marquer une tâche V1 entière terminée pour un correctif partiel. V1-11, V1-12 et V1-13 correspondent aux issues #11, #12 et #13 ; OPS-06 à #47.

L'ancien Site https://daily-fretboard-roadmap.quirkybison9.chatgpt.site/ reste une archive privée ; ne plus y écrire ni demander une recopie manuelle. Le dépôt GitHub privé conserve l'export intégral de la version Sites 15, les sources, décisions et preuves originales. Ne jamais copier ce contenu privé dans le dépôt public de l'application. Si GitHub est indisponible, conserver un journal local explicite et signaler la limite, sans prétendre à une écriture distante.

Décision de Clément du 27 octobre 2026 : la v0 est l’environnement bêta d’expérimentation, sans clients ni bêta-testeurs actuellement. Tous les parcours implémentés sont accessibles par défaut ; aucun paramètre URL de prévisualisation ne doit conditionner leur visibilité. La recette technique et pédagogique se poursuit sans masquer les contenus. UX-24 reste tranché : manche continu défilable pour 0–24, boutons optionnels, affichage 0–12 conservé.

Les développements se déploient dans le bac à sable `/DFT/lab/`, avec des essais immuables sous `/DFT/lab/builds/`. Ne pas publier en live sans instruction explicite de Clément approuvant un essai précis. Le workflow live est manuel uniquement. Garder les données, mises à jour et identités PWA du bac à sable séparées du live. Les changements non publiés vont dans `pending-changes.json` ; seul un essai promu alimente le journal live.

Chaque modification destinée à une future publication doit ajouter un identifiant inédit dans `pending-changes.json`. Ne pas ajouter une version intermédiaire au journal live. Après une promotion vérifiée, récupérer le registre live et retirer les changements déjà inclus avant de préparer le prochain candidat. Ne jamais recopier le code courant à la place de l’archive précise approuvée.

Numérotation validée le 27 octobre 2026 : releases affichées `v0.x`, essais préparatoires `v0.x.y`. Le compteur y avance à chaque essai et repart à 1 pour la prochaine release. Les identifiants techniques de builds restent immuables ; les métadonnées PWA conservent trois composantes numériques pour les mises à jour.

Les déploiements de développement se font par la branche `sandbox/dft`. Il n’est pas nécessaire de pousser vers `main` pour publier un essai ; une intégration dans la branche principale se traite séparément.

# Protocole économe validé le 4 novembre 2026

- Lire `PROJECT_STATE.md`, puis la tâche pertinente ; éviter de relire toute l’histoire de la roadmap.
- Une conversation par chantier cohérent. Préserver un passage de relais court dans `work/task-state.json` en fin de lot ; ne pas y inclure de secrets ou de données de progression.
- Par défaut, une demande de modification signifie développement et vérifications locales ciblées. Séparer la revue visuelle puis la publication ; ne pas publier un essai pour chaque micro-retouche.
- Choisir `npm run work -- plan --scope …`. Ne répéter les vérifications réussies que si des fichiers pertinents, l’environnement ou les hypothèses ont changé. Les preuves locales ne remplacent jamais les contrôles CI avant publication.
- Pour une animation, fournir des réglages interactifs et un export à copier plutôt que multiplier les petites retouches conversationnelles. Regrouper les retours par écran et format.
- Pour les publications futures : lancer la chaîne, donner le SHA et le lien du workflow, indiquer clairement « en attente », puis rendre la main sans suivi minute par minute. Cette préférence est autorisée par Clément dans la conversation du 4 novembre 2026. Suivre jusqu’au contrôle HTTPS seulement si Clément demande explicitement d’attendre la fin. Ne jamais annoncer une livraison sur le seul lancement.
- Lors d’une demande de statut, effectuer une lecture ponctuelle et résumer ; pas de boucle de polling. Une erreur appelle d’abord le diagnostic ciblé du job concerné, pas une relance de toute la recette sans cause identifiée.
- Préférer un push Git normal pour les lots et binaires si un transport authentifié est disponible. Vérifier avec `npm run work -- git-check` ; ne jamais extraire les identifiants d’un connecteur, lancer une authentification interactive ou afficher un token. À défaut, le connecteur reste utilisable sans renvoyer les blobs identiques.
- Utiliser le niveau de raisonnement proportionné à la difficulté ; ne pas déléguer à plusieurs agents par défaut. Le modèle, le quota et le plan sont des choix de l’utilisateur dans l’assistant IA, pas des réglages que le dépôt peut modifier.
- Compte rendu final court : changements, vérifications, état de publication, prochaine action utile. Signaler au besoin qu’un nouveau chantier mérite une nouvelle conversation, avec un passage de relais prêt à copier.

# Portabilité entre assistants

Ces règles sont communes à ChatGPT, Codex, Claude et aux autres assistants utilisés pour DFT. Certains outils ne lisent pas automatiquement AGENTS.md : demander sa lecture dans le premier message. CLAUDE.md est uniquement un point d’entrée, sans copie des règles.

Vérifier la présence des scripts avant d’utiliser les commandes du protocole optimisé. Sur la branche documentaire, les outils `npm run work`, la nouvelle chaîne CI et la planche réglable restent un lot local non synchronisé. À défaut, utiliser les scripts réellement présents dans package.json et signaler la limite ; ne pas recréer ou prétendre retrouver un travail local absent.

Les fichiers versionnés transportent les règles et l’état daté, pas les authentifications, les fichiers ignorés par Git, ni le contexte privé d’une conversation. Les préférences propres à l’outil (modèle, raisonnement, quota) restent à configurer dans son interface.
