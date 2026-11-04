# DFT — point d’entrée court

Lire ce fichier et `AGENTS.md` au début d’un chantier ; ouvrir ensuite uniquement les documents utiles au périmètre.

- Source : https://github.com/csm-clem/ADH-reborn ; branche de développement `sandbox/dft`.
- Dernier essai confirmé : **v0.40.8**, `b000049-7e018e6c474d`, commit `7e018e6c474d6dcf36589b4eba6de54aa7f86ab1`.
- Essai : https://media.lecompositeur.com/DFT/lab/builds/b000049-7e018e6c474d/
- Galerie : même URL suivie de `component-gallery.html`.
- Live confirmé : v0.39 ; promotion uniquement sur approbation d’un essai précis.
- Ce point d’état date du 4 novembre 2026. Vérifier la branche distante avant toute publication ; ce fichier ne constitue pas une preuve de l’état distant courant.
- Travail local après cet essai : optimisation du protocole de travail, outils de vérification ciblée et publication après validation unique. Aucun nouvel essai publié pour ce lot.

## Accès et reprise dans un nouveau chat

- Autorisations détaillées : section initiale d’`AGENTS.md`. Lecture, modifications et tests locaux autorisés ; publication lab sur demande ; live seulement pour un essai précisément approuvé.
- Suivi détaillé privé : https://github.com/csm-clem/dft-roadmap/issues ; livraison/protocole OPS-06 : #47, Arcade V2-04 : #39. Lire uniquement la tâche pertinente.
- Connexion à préparer dans l’interface : application GitHub autorisée sur le dépôt applicatif et, pour le suivi, sur le dépôt privé. Une écriture nécessite les droits correspondants. Aucun accès ne se transmet par le seul texte de ces fichiers.
- Environnement actuel : `/workspace/work/dft-launch`, extraction sans checkout Git authentifié. Ce chemin est indicatif et non portable ; retrouver le projet dans le nouvel environnement avant toute modification.
- Cette branche documentaire synchronise les règles et l’état portable. Elle ne contient pas encore le lot logiciel local : tools/workflow.py (`npm run work`), nouvelle chaîne CI unique, tests associés et planche réglable. Ne pas supposer leur présence dans un nouveau checkout ; leur transfert/publication doit être demandé séparément. Les commandes ci-dessous sont conditionnées à leur disponibilité dans package.json.
- Branche de portabilité : `docs/portable-ai-20261104`, basée sur la branche de développement. Pour une nouvelle session, ouvrir cette branche ou fournir ses documents explicitement tant qu’elle n’est pas intégrée. Aucun changement de main ni déploiement applicatif pour cette synchronisation.
- `work/task-state.json` contient le dernier passage de relais local ; `work/` est ignoré par Git et ne voyage pas automatiquement entre environnements. Les preuves d’exécution ne doivent pas être considérées valides sur une autre machine.
- La nouvelle chaîne CI unique est préparée et testée localement ; elle n’est pas encore activée ni éprouvée sur GitHub. Le dernier essai confirmé reste v0.40.8.

Premier message minimal, lorsque ces fichiers sont accessibles :

> DFT — chantier […]. Lis AGENTS.md et PROJECT_STATE.md. Résultat attendu : […]. Développe et vérifie localement, sans publier.

## Décisions à conserver

HUD/actions/icônes/résultats partagés ; transition unique orange Arcade/bleue Parcours ; manche réaliste et continu sur 24 cases ; progression associée au couple instrument/accordage. Ne pas recopier les composants par mode.

## Reprise efficace

- `npm run work -- state` : état court et éventuel passage de relais local.
- `npm run work -- plan --scope hud` : vérifications adaptées au périmètre.
- `npm run work -- check --scope hud` : exécution, journaux et preuve liés à l’empreinte des fichiers.
- `npm run work -- handoff --summary "…" --next "…"` : passage de relais dans `work/task-state.json`.
- Guide de collaboration : `docs/working-with-ai.md`.
- Composants et captures : `docs/ui-consistency.md`.

Le contexte privé détaillé reste dans la roadmap ; ne pas le recopier dans les sources publiques. Les métriques de crédit ne sont pas accessibles automatiquement.

## Changer d’assistant

Reconnecter GitHub et l’environnement dans le nouvel outil. Demander la lecture d’AGENTS.md et PROJECT_STATE.md ; CLAUDE.md renvoie aux mêmes règles. Ne pas transmettre de secrets dans le prompt. Les autorisations de travail sont consignées, mais les accès doivent être effectivement accordés dans l’interface du nouvel outil.
