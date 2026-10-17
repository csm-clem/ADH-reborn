# Daily Fretboard Trainer — Roadmap générale V1 / V2 / V3

Décision produit du **17 octobre 2026**, à partir de la v0.19.

Cette roadmap remplace l’ordre de priorité des huit phases pédagogiques initiales. Les anciens dossiers restent des références historiques ; leurs tâches ne constituent plus des prérequis automatiques à la V1. Les décisions prises ensuite dans la conversation priment sur leurs anciennes prescriptions.

## Stratégie retenue

**V1 fonctionnelle → tests utilisateurs → ajustements V1.x → marketing et campagne publicitaire → bilan des ventes → V2 si le résultat est concluant → V3.**

Les tests techniques et la recette interne restent nécessaires avant la V1. Les tests utilisateurs structurés commencent après cette première version fonctionnelle, selon la décision du porteur du projet. On peut la distribuer d’abord à un groupe restreint : « V1 fonctionnelle » ne signifie pas déclencher immédiatement la publicité.

Aucune nouvelle fonctionnalité n’est implémentée par cette mise à jour documentaire. La version exécutable reste la v0.19.

## V1.0 — Une application simple, amusante et payable

### Promesse et couverture

« S’entraîner quelques minutes pour retrouver plus vite les notes sur tout le manche, sur son instrument et son accordage. »

**Correction de périmètre du 17 octobre : tout le parcours d’apprentissage des notes appuyées passe en V1.** La zone 0–4 reste le point de départ ; les autres zones, les cordes, les duos, les mélanges et les repères d’octaves font partie de la même V1. La couverture va jusqu’à la case 24 pour les instruments concernés, en respectant le nombre de cases réellement proposé. Les activités restent librement accessibles ; les réussites recommandent une suite mais ne verrouillent pas les exercices.

Les parcours de gammes, les arpèges avancés et les harmoniques restent en V3. La correction déplace le parcours complet des notes appuyées, sans ajouter les autres modes avancés à la V1.

### Périmètre retenu

| Élément | Travail V1 |
|---|---|
| Configuration | Stabiliser les instruments, accordages et réglages déjà disponibles. Aucun nouvel instrument à ajouter pour lancer la V1. |
| Parcours d’apprentissage complet | Accordage, familles naturelles puis altérées, familles isolées et mélanges cumulatifs ; nommer et retrouver dans des activités distinctes. Toutes les zones du manche retenues, travail par corde, duos, mélanges et octaves ; adaptation à l’instrument et à l’accordage. |
| Compréhension | Finaliser les textes, exemples et démonstrations nécessaires pour jouer sans explication extérieure. Supprimer les formulations répétitives ou ambiguës. |
| Plaisir de jeu | Stabiliser les réponses immédiates, les corrections lisibles, la difficulté, la longueur des séances et les finales musicales existantes. Le plaisir sera vérifié avec des joueurs après la V1. |
| Résultats et progrès | Garder les scores, temps moyens, records du même exercice, carte par position et révisions manuelles ciblées. Ne pas annoncer une mémorisation durable à partir d’une séance réussie. |
| Succès et personnalisation existants | Conserver et stabiliser ce qui est déjà livré, sans enrichir le catalogue ni ajouter de nouvelles mécaniques. Les succès restent secondaires par rapport au jeu. |
| PWA | Installation, première connexion puis jeu hors ligne, reprise après interruption, audio, tactile, lisibilité et commandes accessibles. |
| Progression | Conservation durable à partir de la V1, migrations testées entre mises à jour, export/import de secours. Les remises à zéro restent propres aux versions v0. |
| Accès commercial | Essai complet de sept jours, paiement et vérification des droits, activation et restauration de l’achat. |

La V1 réutilise les fonctionnalités déjà présentes. Elle exige désormais de **produire le parcours complet au-delà de 0–4**, puis de stabiliser le jeu et de terminer l’accès commercial. Les règles de génération sont réutilisées ; les contenus, la couverture et la progression de difficulté doivent être vérifiés pour chaque zone.

Le parcours inclut les zones 0–4, 4–8, 7–11 et 12–16 déjà envisagées, puis la couverture restante jusqu’à la dernière case retenue. Il comprend aussi le travail par corde sur 0–12 et 0–24, les duos de cordes voisines et les cordes mélangées. Les nombres de cordes et de duos suivent l’instrument. Ce découpage doit couvrir le manche sans lacunes ni répétitions pédagogiquement inutiles.

### Essai et paiement sans compte de jeu obligatoire

Le modèle retenu reste : **sept jours d’accès complet, puis achat pour continuer à jouer**. Après expiration, un non-acheteur voit une proposition d’achat ; payer rétablit l’accès complet. L’expiration ne supprime pas ses résultats ni sa sauvegarde. Le statut exact des clients déjà présents sur Le Compositeur reste à préciser : il n’est pas déduit automatiquement d’un autre achat.

La création d’un compte de jeu et la synchronisation des progrès restent en V2. En V1, une identité d’achat peut suffire — par exemple une adresse e-mail et un lien/code de restauration — sans espace personnel ni profil de progression en ligne.

Cela demande tout de même un petit service serveur : début et fin d’essai de référence, vérification des paiements, attribution et restauration des droits. Un simple compteur dans le navigateur ne constitue pas un mécanisme commercial fiable. Le raccordement au WordPress existant ou à un service dédié est à décider avant l’implémentation.

À définir : démarrage de l’essai, prix, achat unique ou abonnement, éventuel avantage pour les clients existants, fournisseur de paiement, comportement hors connexion après vérification des droits et règles de remboursement. Préciser aussi les mises à jour incluses dans l’achat ; ne pas promettre tacitement toutes les futures versions majeures.

### Ordre de réalisation jusqu’à la V1

1. **Figer la carte du parcours complet** : zones, étendue réelle des instruments, cordes, duos, mélanges, prérequis et critères de validation. Garder une liste fermée des écrans et corrections indispensables ; tout nouveau mode rejoint V2/V3.
2. **Produire le parcours complet** : réutiliser le moteur par familles, écrire les micro-leçons et démonstrations adaptées, préparer les exercices et applications musicales. Vérifier les hauteurs et la couverture dans les deux sens, puis la continuité de difficulté entre zones.
3. **Finaliser le jeu** : résoudre les bugs, fluidifier les séquences et vérifier que les exercices et extraits correspondent aux notes autorisées. Vérifier les droits d’utilisation des extraits retenus pour une diffusion commerciale, ou les remplacer par un répertoire autorisé.
4. **Finaliser les écrans et les textes** : configuration, parcours complet, consignes, pause, résultats, progrès, paramètres et explications commerciales. Textes clairs et corrects pour la V1 ; perfectionnement éditorial complet en V2.
5. **Mettre en place l’essai et le paiement** : dates d’essai, paiement confirmé côté serveur, activation, expiration, achat restauré, annulation/remboursement et messages compréhensibles. Vérifier les droits sans synchroniser les progrès en ligne.
6. **Passer à une progression durable** : supprimer la politique de remise à zéro pour les versions stables, tester les migrations et les sauvegardes, conserver les données après expiration de l’essai.
7. **Recetter et livrer la V1.0** : vérifier le parcours entier et les paiements sur l’hébergement cible et sur de vrais téléphones. Préparer la distribution restreinte des tests utilisateurs.

### Critères de sortie V1.0

- Configuration → première activité → résultat → activité suivante fonctionne sans blocage.
- Le parcours couvre toute l’étendue annoncée pour chaque instrument, avec les notes naturelles et altérées dans les deux sens de réponse.
- Les passages entre zones et les exercices par corde/duo/mélange restent cohérents avec les notes déjà rencontrées ; aucune partie annoncée comme incluse n’est réservée à une version ultérieure.
- Aucun bouton essentiel coupé, réponse ambiguë ou perte de session connue sur les appareils ciblés.
- Textes de jeu utilisables sans accompagnement du créateur.
- Le prix, la durée d’essai et ce qui est acheté sont explicités avant paiement.
- Un paiement confirmé donne les bons droits, un paiement abandonné n’en donne pas, l’achat se restaure et l’expiration n’efface rien.
- Le fonctionnement hors ligne et ses limites commerciales sont définis et testés.
- Une mise à jour V1.x conserve progression et succès.
- Aucun nouveau mode avancé n’est requis pour déclarer la V1 fonctionnelle.

L’objectif « jeu très amusant » guide les arbitrages avant livraison ; il ne sera pas déclaré démontré sur la seule base des tests techniques.

## Après V1 — Tests, ajustements, marketing puis publicité

### 1. Tester la V1 auprès de joueurs

Observer des débutants et des guitaristes qui cherchent à gagner en fluidité. Tester l’entrée dans le jeu, la compréhension, le plaisir, la fatigue, l’envie de rejouer et la perception des progrès. Vérifier aussi la compréhension de l’essai et de l’achat, sans confondre achats de test et ventes réelles.

Les questions utiles : finit-on une première activité ? Sait-on quoi faire ensuite ? Revient-on jouer de son propre choix ? Le joueur sait-il expliquer ce qu’il apprend ? Les extraits évoquent-ils réellement les morceaux ? Quelles difficultés empêchent de répondre vite ?

### 2. Livrer les ajustements V1.x

Corriger les blocages et les frictions constatées ; ajuster les textes, le volume des questions, la difficulté et les retours. Les V1.x servent à stabiliser la même promesse. Elles ne deviennent pas une voie détournée pour ajouter Arcade, Explorer ou un compte.

### 3. Construire le marketing et lancer une campagne

Après ces ajustements : proposition de valeur, page de vente, démonstration, messages et supports publicitaires. Recueillir les témoignages avec autorisation. Mettre en place des mesures sobres de l’essai, de la première activité terminée et de la conversion en achat, avec l’information/les consentements nécessaires.

Commencer la publicité avec un budget limité, puis observer les ventes, les remboursements, les retours et le coût d’acquisition rapporté à la marge. Quelques ventes servent de premier signal ; elles ne démontrent pas à elles seules qu’une campagne est rentable.

### Porte de décision avant V2

La V1 fonctionne, des personnes paient réellement et les retours montrent une raison de continuer à investir. Les critères chiffrés et le budget seront fixés avant la campagne, à partir du prix et des coûts retenus. Si le signal est insuffisant, améliorer la V1, son positionnement ou son acquisition avant d’augmenter le périmètre.

## V2.0 — Étendre un produit qui a trouvé ses premiers acheteurs

Déclenchement conditionné au bilan de la V1 ; pas de développement en parallèle avant ce bilan.

### Périmètre proposé

| Chantier | Contenu |
|---|---|
| Compte et synchronisation | Création/récupération du compte, rattachement de l’achat et des progrès V1, synchronisation après jeu hors ligne, conflits, export et suppression. Aucune progression V1 perdue à l’activation du compte. |
| Révisions personnalisées | Prochaine séance recommandée, rappels espacés, difficultés locales, vérifications sans aide et reprise raisonnable après une absence. |
| Mode Arcade initial | Partie sans fin à trois vies sur l’étendue apprise/choisie, difficulté et délai progressifs ; variantes notes naturelles et chromatiques. Arpèges avancés en V3. |
| Mode Explorer initial | Atlas interactif des notes, adapté à l’instrument et à l’accordage. Atlas des harmoniques en V3. |
| Suivi des progrès | Distinguer pratique récente, précision, fluidité et rappel confirmé après délai. Bilans et recommandations compréhensibles. |
| Textes finalisés | Révision pédagogique et commerciale complète à partir des observations et des ventes. Les textes seront stabilisés, puis corrigés si de nouveaux faits montrent un problème. |

Le parcours complet des notes appuyées est déjà un prérequis livré en V1. La V2 améliore son suivi et ses révisions ; elle n’en conditionne pas l’accès ni l’achèvement. Les gammes spécialisées, les arpèges avancés et les harmoniques restent en V3.

Ordre recommandé : compte et reprise des données → révisions personnalisées et suivi → Explorer → Arcade → validation éditoriale et recette globale. Livrer ces chantiers par lots vérifiables plutôt que multiplier les changements simultanés.

### Critères de sortie V2.0

- Les nouveaux modes et les révisions exploitent le parcours complet V1 et respectent la configuration de l’instrument.
- Le parcours conserve une progression compréhensible et des révisions utiles.
- Deux appareils retrouvent les mêmes progrès ; les séances hors ligne ne perdent ni ne doublonnent les résultats.
- Arcade et Explorer apportent chacun un usage identifiable et restent compréhensibles sans tutoriel externe.
- Les résultats des tests et les retours clients justifient les choix de difficulté et les textes.

## V3.0 — Compléter les fonctionnalités avancées

Le périmètre des fonctionnalités avancées connu aujourd’hui est celui-ci ; de nouvelles idées ne s’y ajoutent pas automatiquement.

- **Arcade avancé** : gammes choisies, arpèges, dyades/triades/tétrades et mélanges progressifs.
- **Mode Créatif** : construction et sauvegarde d’entraînements personnalisés.
- **Explorer des harmoniques** : atlas des positions, hauteurs et possibilités sonores.
- **Apprentissage des harmoniques naturelles et artificielles**, avec positions de main gauche quand nécessaire.
- **Parcours de gammes** : par zone, par corde et en diagonale ; choix de tonique et modalités théoriques à définir.
- **Succès avancés et collections enrichies**, attachés à des compétences ou usages utiles.
- **Enregistrement et détection sonore sur l’instrument** : étude de faisabilité, puis intégration si les essais confirment une fiabilité suffisante. Cette capacité ne sera pas promise commercialement avant ces essais.

Chaque lot a son propre prototype, ses critères et sa recette. « Toutes les fonctionnalités avancées » désigne cette liste validée, pas une version qui ne pourrait jamais sortir parce que de nouvelles idées apparaissent.

## Réaffectation des huit anciennes phases

| Ancienne phase | Nouvelle destination |
|---|---|
| 1 — Cadrage | Réalisé ; actualiser la promesse de V1 sur l’ensemble du manche. |
| 2 — Progression | Parcours complet par familles, zones, cordes, duos, mélanges et octaves en V1. |
| 3 — Pilote | Déjà implémenté ; stabilisation et recette V1. |
| 4 — Révisions | Statistiques et reprise manuelle existantes en V1 ; personnalisation et espacement en V2. |
| 5 — Tests et extension | Production du parcours complet avant V1 ; tests utilisateurs après V1 et corrections en V1.x. |
| 6 — Instruments et données | Instruments existants et sauvegarde durable en V1 ; transferts/continuité entre appareils en V2. |
| 7 — Fiabilité PWA | Indispensable avant V1, puis entretenue à chaque livraison. |
| 8 — Extensions | Zones et travail des notes appuyées en V1 ; succès existants conservés ; Arcade/Explorer notes/compte en V2 ; autres fonctions avancées en V3. |

## Décisions nécessaires pour préparer le prochain lot V1

1. Prix, formule d’achat et droits sur les futures versions majeures.
2. Définition d’un « client » bénéficiant de l’accès : achat de l’application et éventuels clients Le Compositeur concernés.
3. Déclenchement de l’essai et solution de paiement/vérification/restauration des droits.
4. Carte détaillée du parcours complet et liste finale des corrections/textes indispensables pour toutes les zones.

Ces décisions précèdent leur implémentation ; elles n’empêchent pas de formaliser dès maintenant cette roadmap.
