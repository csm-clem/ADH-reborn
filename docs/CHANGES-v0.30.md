# DFT v0.30 — Fiabilité et palette Sunrise

Livraison du 25 octobre 2026. Aucun changement au périmètre pédagogique ou commercial ; la nouvelle roadmap reste à intégrer lorsqu’elle sera fournie.

## Livraison reproductible

`release.js` est la source du numéro de version. `npm run release` synchronise `package.json`, `update.json`, le service worker et les instructions FTP ; exécute les contrôles de syntaxe et les tests ; construit le paquet ; vérifie les ressources, les imports et le précache ; produit un ZIP et une fiche SHA-256 dans `downloads/`. Une commande qui échoue interrompt la livraison.

`npm run verify:release` vérifie aussi les versions du dépôt sans les modifier. `node tools/verify-release.mjs --dist` vérifie le paquet compilé. Python 3 est nécessaire pour créer l’archive ZIP, Node 20+ pour le projet.

## Bêta et production séparées

`npm run release:production` génère une archive distincte. Le fichier `debug-mode.js`, son import, le panneau et l’action de simulation ainsi que la méthode de simulation du contrôleur sont retirés. Le module est aussi retiré du cache hors ligne. La page interne `ui-kit.html` est exclue. Les fichiers sources gardent le débug pour les tests et les versions bêta.

Le suffixe « production » décrit le paquet technique sans simulation. Il **ne signifie pas que la V1 commerciale est achevée** : parcours complet, essai, paiement et compte restent soumis à leur chantier et à la prochaine roadmap.

## Vérifications sur GitHub

Le workflow `.github/workflows/verify.yml` se déclenche au push, en pull request ou manuellement. Il construit la bêta, contrôle les parcours dans Chromium, le clavier et les palettes, la migration depuis un véritable ZIP ancien, puis le hors-ligne. Il construit ensuite la production et ouvre réellement ses réglages pour contrôler l’absence de débug. Les archives et preuves sont conservées comme artefacts du workflow.

Ces scénarios sont exécutés localement pour cette livraison. Le résultat de l’exécution hébergée sur GitHub est à consulter dans Actions ; il n’est pas déduit du seul résultat local. Aucun déploiement automatique sur o2switch n’est activé.

## Sauvegardes et restauration

Les nouveaux exports portent une enveloppe `backupFormat: {name: "DFT", version: 1}`. Les anciens exports sans enveloppe restent acceptés. Un format futur ou non reconnu est refusé avant écriture. Les progrès, profils et succès existants restent sur les mêmes clés stables.

Les tests ajoutés vérifient : restauration ancien/nouveau format, refus d’une version inconnue sans mutation des données, échec à la seconde écriture avec retour aux anciennes valeurs, conservation de l’ancienne sauvegarde pendant migration et protection d’un fichier stable corrompu. Le stockage local reste local ; ce lot n’ajoute pas de synchronisation entre appareils.

## Manche au clavier

Un seul emplacement du manche entre dans la séquence Tab. Les flèches déplacent le focus de case en case et de corde en corde ; Début/Fin vont aux extrémités de la corde. Entrée et Espace conservent la réponse existante. Les coordonnées suivent les numéros physiques et les cases de la zone. Les schémas interactifs des micro-leçons bénéficient du même contrôleur. Les contrôles de réponse alternatifs et le toucher ne changent pas.

Le point d’entrée reste unique après un nouveau rendu de question : la normalisation observe les changements de tabulation et évite les écritures inutiles. Aucun déplacement automatique vers la bonne réponse.

## Styles partagés

Les compteurs intégrés aux boutons deviennent un composant `.button-count`. Une ancienne définition d’animation tactile écrasée par une définition ultérieure est supprimée. Les anciennes couleurs de manche déjà remplacées par les tokens coordonnés sont retirées. Le nettoyage est ciblé pour conserver l’apparence hors palette Sunrise ; les feuilles historiques ne sont pas annoncées entièrement réécrites.

## Sunrise

La formule demandée est conservée avec angle par défaut 180°, début 0 %, fin 100 %. Elle est recalculée sur le bouton pour que le survol utilise effectivement les nouveaux paramètres.

| Thème | Normal : haut → bas | Survol : haut → bas |
|---|---|---|
| Jour | `#ff3839` → `#ffb230` | `#27339e` → `#51bbe8` |
| Studio Nuit | `#db485b` → `#b96928` | `#353b88` → `#367f9e` |

Le texte reste blanc avec une ombre légère. Les boutons désactivés gardent leur gris. Papier et Inclusif-contrasté gardent des actions unies, sans changement de leurs repères. Le survol est réservé aux dispositifs qui en disposent.

**Limite de contraste :** les couleurs jour demandées sont respectées exactement. Un texte blanc sur l’extrémité jaune ne garantit pas 4,5:1 ; l’ombre ne constitue pas une preuve de conformité. Le thème Inclusif-contrasté conserve son fond uni et son contraste. Cette livraison ne reprend donc pas la déclaration « zéro violation automatique » de la v0.29 pour les nouveaux dégradés.

## Recette et livrables

- 30 fichiers de tests Node passent, dont trois nouveaux scénarios de conservation des données.
- 41 vérifications des parcours : dispositions, sept activités terminées et neuf cours terminés, sans erreur JavaScript.
- Navigation réelle au clavier, maintien d’un point d’entrée après réponse et valeurs CSS jour/survol/nuit vérifiés dans Chromium.
- Production : contrôle des ressources et imports, absence du module de débug et ouverture réelle de la page des réglages.
- Hors ligne : reprise, cours et corrections contrôlés depuis le paquet compilé.
- Migration v0.28 → v0.30 : refus, nouvelle proposition au lancement suivant, acceptation et progression identique.

Captures et résultat du contrôle clavier/palette dans `docs/v0.30/`. Les essais physiques iPhone et Windows restent distincts de ces tests Chromium. Aucun transfert FTP n’a été effectué.
