# Guide portable de collaboration IA — DFT

Ce guide s’applique à ChatGPT/Codex, Claude et aux autres assistants. Les règles communes sont dans AGENTS.md ; l’état daté et les éléments non transférés sont dans PROJECT_STATE.md.

Attention : les commandes du protocole optimisé et la nouvelle CI décrites ci-dessous sont préparées localement mais pas encore synchronisées sur cette branche documentaire. Vérifier package.json et les fichiers présents avant usage. Pour les validations, utiliser les scripts existants tant que ce lot logiciel n’a pas été transféré.

# Travailler efficacement avec une IA sur DFT

Protocole adopté le 4 novembre 2026. Il organise le travail sans prétendre modifier le quota l’outil utilisé ni garantir un pourcentage d’économie.

## Le prochain message utile

Pour une modification :

> Chantier : [HUD / manche / musique / Arcade / réglages]. Objectif : […]. Attendu : […]. Formats prioritaires : […]. Développe et vérifie localement, sans publier. Lis PROJECT_STATE.md et le passage de relais. Fais un compte rendu court.

Pour une revue visuelle :

> Sur cette planche, voici tous mes retours : […]. Conserve […]. Critères de validation : […]. Une seule correction groupée, puis je valide.

Pour une publication :

> Publie le lot validé dans un nouvel essai. Donne-moi le SHA et le lien Actions, puis rends-moi la main sans surveiller en continu.

Pour la vérification finale :

> Vérifie une fois la publication [lien/identifiant]. Confirme l’essai seulement si le déploiement et le contrôle HTTPS sont réussis. Si échec, diagnostique le job concerné.

Pour attendre jusqu’à la fin, le demander explicitement. Cette demande prend le pas sur le mode économique par défaut.

## Organisation des conversations

Une conversation par chantier cohérent, pas une par bouton. Nouvelle conversation lorsque le sujet change réellement ou après la clôture d’un lot. Avant de changer : `npm run work -- handoff --summary "ce qui est fait et vérifié" --next "ce qui reste" --scope hud`. Le fichier court `work/task-state.json` ne contient ni secrets ni progression utilisateur. Il est local et ignoré par Git : lors d’un changement d’environnement, copier son résumé dans le nouveau message ou conserver les décisions publiques dans PROJECT_STATE.md ; ne pas supposer que work/ persiste sur une autre machine.

`PROJECT_STATE.md` contient le dernier état confirmé et les points d’entrée ; il est daté, pas connecté au serveur. Le mettre à jour après une publication vérifiée, sans effacer le suivi historique privé. La roadmap reste la source détaillée ; lire seulement la tâche pertinente.

## Vérifications proportionnées

`npm run work -- plan --scope hud` explique les commandes ; `check` les exécute et garde leurs journaux. Profils : copy (texte sans changement de commande), ui, hud, neck, arcade, music, transition, data, workflow, candidate. Plusieurs périmètres impliquent plusieurs profils ; une modification inconnue ou transversale exige une recette plus large. Le profil copy n’est pas adapté aux libellés utilisés comme commandes dans les tests navigateur.

Les tests navigateur supposent `npm start`. Une preuve réussie ne peut être réutilisée que pendant 24 heures, pour les mêmes fichiers, le même environnement, le même profil et les mêmes commandes. Toute modification d’un fichier source invalide l’empreinte, y compris les tests et workflows. Les journaux et fichiers générés dans work/dist/downloads sont exclus. Une preuve échouée, ancienne, future ou calculée pendant que les sources changent n’est jamais réutilisée. `--force` permet une nouvelle exécution. Les preuves locales ne désactivent aucun contrôle de publication.

## Une validation CI, puis publication du même commit

Le workflow Vérification DFT réalise les tests source, visuels et parcours/production. Sur un push sandbox/dft, il appelle ensuite le workflow réutilisable de publication. La publication relit les preuves GitHub des trois jobs pour le SHA exact, le dépôt attendu, la branche sandbox et le fichier de workflow attendu. Elle ne rejoue pas les tests déjà réussis. L’intégrité du paquet, du lab construit et les contrôles HTTPS restent obligatoires.

Une relance manuelle de sandbox-dft peut réessayer le transfert seulement si ces preuves existent pour le même SHA ; une source modifiée ou un test échoué exige une nouvelle validation. Les transferts restent sérialisés. Ne pas annuler un workflow qui transfère : la vérification ne s’annule plus automatiquement lorsqu’un autre push arrive. Regrouper les modifications et publier un seul candidat par lot validé.

Statut ponctuel : lire une fois le run et ses jobs avec le connecteur ou GitHub CLI, puis donner le résultat. `npm run work -- status --snapshot work/run.json` résume une réponse normalisée contenant l’état du run et ses jobs. Un simple succès des tests devient « validated », pas « publié ». La preuve de l’étape HTTPS est nécessaire pour « published-https-verified ». Aucune boucle de surveillance n’est lancée.

## Retouches visuelles autonomes

Ouvrir la galerie (`npm start`, puis /component-gallery.html), sélectionner Transition. Régler l’entrée, le temps central, la sortie, le début/durée du fondu et les zooms ; utiliser le curseur temporel et le mouvement réduit. « Exporter les réglages » produit un JSON sélectionnable à copier dans un seul retour, avec ce qui plaît et ce qui doit rester. Ces réglages sont une proposition en mémoire, sans modification automatique des transitions du jeu ni de la progression.

Pour le HUD/résultat, comparer ensemble les états et formats disponibles. Les nouvelles références visuelles se génèrent explicitement après examen ; ne pas les régénérer pour cacher un défaut.

## Modèle, raisonnement et agents

L’utilisateur choisit le modèle et le niveau de raisonnement dans les options disponibles de l’assistant IA. Le dépôt ne peut pas changer ces réglages ni lire le compteur. Choisir un réglage courant pour texte/style localisé/composant existant ; approfondir pour géométrie, gestes concurrents, migrations, architecture ou blocage réel. Pas de plusieurs agents par défaut. l’assistant IA doit signaler une complexité qui justifie un changement, sans transformer chaque petite correction en étude d’architecture.

## Transport Git

`npm run work -- git-check` contrôle si le dossier est un vrai checkout Git, sans lire de credential ni tester silencieusement l’authentification. Le dossier actuel est une extraction : aucun accès Git authentifié n’a pu être créé à partir du connecteur. Quand une connexion Git autorisée est disponible, utiliser un checkout puis un push normal pour les lots et PNG. Ne pas tenter d’extraire le token du connecteur. Le repli est le connecteur, avec réutilisation des SHA de blobs identiques. Cette limite reste explicite ; pas de promesse de transport Git déjà opérationnel.

## Mesure simple

Après une tâche représentative :

`npm run work -- usage --task "correction HUD" --model "réglage choisi" --turns 3 --publications 1 --usage "variation affichée par l’interface"`

Le journal local work/usage.jsonl est déclaratif, sans accès au compte l’outil utilisé. Comparer pendant une à deux semaines les tâches, allers-retours et publications. Ne pas confondre temps d’attente et consommation facturée ; aucune estimation automatique de crédits n’est inventée.

## Compte rendu attendu de l’assistant IA

Changements ; vérifications et limites ; état exact (local, validation en cours ou publication confirmée) ; une prochaine action utile. Donner un passage de relais lorsqu’un autre chantier mérite une nouvelle conversation. Ne pas recopier tous les logs ni refaire toute l’histoire.
