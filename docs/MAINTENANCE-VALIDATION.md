# Contrôles de maintenance et de livraison

Ce lot complète les protections v0.30/v0.31. Il ne change aucun exercice, prix, durée d’essai, donnée de progression, interface ou déploiement.

## Contrôles disponibles

- `npm run check` découvre les fichiers `.js`, `.mjs` et `.cjs` du projet, des services, des outils et des tests, puis les fait analyser par Node sans les exécuter. Un nouveau module n’a plus besoin d’être ajouté à une longue commande. Les archives, documents historiques, fichiers générés et dépendances dans `docs/`, `downloads/`, `dist/`, `work/`, `node_modules/` et `.git/` sont exclus de cette découverte.
- `npm test` conserve les tests existants et ajoute des paquets temporaires volontairement incomplets pour vérifier que les garde-fous échouent réellement.
- `npm run verify:release` vérifie les versions et ressources de la source sans modifier les fichiers.
- `node tools/verify-release.mjs --dist` vérifie les fichiers réellement préparés dans `dist/`, y compris leur syntaxe après transformation.
- `node tools/verify-release.mjs --dist --production` refuse aussi les pages internes, le module de débug et les traces de simulation visées par le contrat de livraison.

La vérification suit les références littérales des modules (`from`, imports directs et `import('…')`), les feuilles CSS et leurs `url()`/imports, les ressources HTML et les icônes/démarrage du manifeste PWA. Les ressources statiques nécessaires doivent exister dans le paquet et dans le précache. Les requêtes dynamiques d’API, les liens vers les cours et les manifestes de mise à jour conservent leur fonctionnement réseau existant.

Les fragments, paramètres d’URL et chemins encodés sont résolus avant comparaison. Les ressources de précache répétées, distantes ou sortant du paquet sont refusées. Les deux entrées historiques `./` et `./index.html` restent possibles. Une URL `data:` intégrée à une feuille CSS ne demande pas de fichier supplémentaire.

Il s’agit d’une analyse adaptée aux formes de références utilisées dans cette application, pas d’un parseur JavaScript/HTML/CSS complet ni d’un audit de sécurité. Un chargement calculé à l’exécution, une ressource dessinée dans une chaîne de caractères ou un comportement matériel demande toujours une recette navigateur appropriée.

## GitHub Actions

Un premier job exécute les contrôles de syntaxe, les tests Node et la vérification des ressources avant d’installer les outils navigateur. Le job bêta/production conserve ensuite ses essais Chromium existants. Une nouvelle vérification annule une vérification devenue obsolète sur la même branche ou pull request. Le workflow FTPS est séparé et n’est pas modifié par ce lot.

## Alignement sur la roadmap générale

La référence produit est `docs/ROADMAP-GENERALE.md` (V1/V2/V3), qui remplace l’ordre des huit anciennes phases. La V1 doit couvrir le parcours complet annoncé et intégrer l’accès commercial ; ce lot ne la réduit pas à un pilote Mi/La. Les contrôles présents répondent à ses étapes « Finaliser le jeu » et « Recetter et livrer la V1.0 » ainsi qu’à la conservation des données déjà livrée.

Les choix d’identité, fournisseur de paiement, prix, déclenchement d’essai et droits hors ligne restent des décisions commerciales. La dernière roadmap fournie par Clément confirme un essai de sept jours ; elle remplace l’hypothèse marketing antérieure de quatorze jours. Ce lot n’implémente pas encore cet essai.

Le suivi consolidé se trouve dans le [Kanban privé DFT](https://daily-fretboard-roadmap.quirkybison9.chatgpt.site). Une carte n’est validée que sur preuve de son livrable ; une branche testée ou un paquet produit ne vaut pas déploiement du produit.

## Vérification avant une prochaine publication

```sh
npm run check
npm test
npm run verify:release
npm run release
npm run release:production
```

Les commandes de release reconstruisent les archives locales comme auparavant. Elles ne transfèrent rien sur o2switch. Un paquet dit « production » décrit l’absence des outils internes et ne signifie pas que le parcours complet et le paiement de la V1 sont terminés.
