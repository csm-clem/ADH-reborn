# Daily Fretboard Trainer — revue générale de la v0.29

Date : 19 octobre 2026. Base de comparaison : v0.28. Cette livraison conserve les données de progression stables.

## Décisions et corrections livrées

### Manche complet dans les activités sur une corde

Le filtre pédagogique sélectionne toujours la corde et les positions à travailler. Il ne filtre plus le dessin de l’instrument. Les activités, les révisions d’une corde et leurs schémas d’explication montrent les cordes voisines, avec leurs vrais numéros physiques. Le numéro de la corde travaillée est mis en évidence ; les questions de recherche conservent également leur bande de repérage. Toucher une autre corde ne devient pas une bonne réponse.

L’ancienne règle ouvrait obligatoirement les boutons de réponse en portrait. Elle est supprimée. Le manche reste touchable ; les boutons s’ouvrent à la demande, restent ouverts entre les questions, et se referment manuellement. Pour les activités de corde entière, le manche reste également actif quand les boutons sont ouverts. Les cibles des boutons conservent leur taille de confort et les proportions du manche ne sont pas étirées.

### Reflets des succès

Le suivi du doigt et de la souris reste immédiat. La bande spéculaire passe de 72 % à 22 % d’opacité maximale, avec une lumière moins blanche ; la contribution holographique passe d’un multiplicateur de 3,5 à 0,9. Les niveaux de rareté gardent leurs différences de finition. Le retour à plat, le défilement vertical et les boutons restent fonctionnels. Papier, Inclusif-contrasté et la réduction des animations conservent leurs protections visuelles.

### Glisser de la carte des progrès sur ordinateur

La carte du manche 0–24 accepte le geste « saisir puis déplacer » avec le bouton gauche de la souris. Le curseur change entre la main ouverte et fermée. Un seuil de six pixels distingue le déplacement du clic : un glissement ne doit pas ouvrir la fiche d’une note. Le clic simple, le clavier, le défilement tactile et la barre proportionnelle sont conservés. La barre suit le déplacement. Le geste est arrêté au relâchement ou à la perte de focus.

Ce changement concerne la carte défilante de **Mes progrès**. Il n’ajoute pas de défilement aux questions de jeu ni de déplacement automatique du manche vers la réponse.

### Petites corrections découvertes pendant le contrôle

- Le rouge de marque Atelier utilisé sur les petits textes passe de `#d54527` à `#cc4025` : la différence visuelle est légère, mais le contraste dépasse plus confortablement 4,5:1 sur blanc.
- Le groupe des boutons de réponse reçoit un rôle accessible cohérent avec son libellé.
- Les compteurs des catégories de succès ne sont plus atténués par une opacité supplémentaire.
- La recette hors ligne lit la version courante au lieu de chercher un ancien nom de cache `0.25.0`. Elle ouvre explicitement les boutons lorsqu’elle veut tester cette alternative devenue facultative.

## Proposition « sunrise » — à choisir

Une planche compare l’apparence actuelle et trois directions, avec de vrais boutons HTML, une barre de progression et un basculement de fond Atelier/Studio nuit.

| Proposition | Couleurs principales | Pertinence |
|---|---|---|
| **A · Aube cuivrée — recommandée** | Cuivre → corail → rose profond | Proche de la charte Atelier ; plus de chaleur et un dégradé nettement perceptible. |
| B · Soleil corail | Rose → corail → ambre | Plus solaire et accueillante. |
| C · Aube boréale | Ambre → rose → violet | Plus expressive ; donne davantage d’autonomie graphique à DFT. |

Un liseré lumineux discret et une ombre courte apportent du relief. Les lettres restent blanches ; le contraste minimal des dégradés proposés est d’environ 5,2:1 ou davantage. Les actions secondaires restent sobres. Les notes, les corrections et les réponses ne changeraient pas de couleur. Papier et Inclusif-contrasté garderaient leur traitement sobre.

**Les propositions ne sont pas encore appliquées à l’application.** Elles sont un livrable de choix visuel, conformément à la demande « propose ». Les corrections de contraste décrites plus haut sont, elles, appliquées.

## Vérifications effectuées

Les tests combinent lecture du code, règles musicales et pédagogiques, entrées réelles dans Chromium, captures et contrôles automatiques. Les profils de test sont isolés ; aucun message de signalement n’a été envoyé et aucun paiement n’a été effectué.

| Domaine | Vérification et résultat |
|---|---|
| Règles et régressions | 29 fichiers de tests Node passent. Les quatre nouveaux scénarios vérifient le contexte complet de l’instrument, l’alternative facultative et la conservation de la corde évaluée, ainsi que son cours d’entrée. Les six profils instrumentaux sont couverts par ces règles. |
| Exercices bêta | 25 dispositions, sept activités terminées via leurs contrôles réels (20 ou 24 questions), neuf cours terminés. Les réponses restent associées au bon emplacement ; le même SVG reste en place pendant l’enchaînement. |
| Corde entière | 25 configurations : guitares 6/7/8, basses 4/5, chacune sur 320 × 568, 390 × 844, 667 × 375, 844 × 390 et 1440 × 900. Toucher direct avant/après ouverture des boutons, réponse via les boutons, maintien puis fermeture manuelle. |
| Navigation et onboarding | Éditeur personnalisé vérifié sur les six instruments et deux formats (12 configurations), ajustements par corde et de toutes les cordes, pagination et conservation du profil. Trois étapes d’entrée contrôlées sur cinq formats. Aucun bouton hors écran dans ces essais. Changement des cinq préférences d’apparence et ouverture/fermeture du formulaire de bug. |
| Souris et clavier | Glissement réel de la carte des progrès, barre synchronisée, absence d’ouverture parasite ; clic et sélection au clavier encore possibles. |
| Succès tactiles | Contact, déplacement de trois pixels, glissement, retour à plat, défilement vertical et boutons sur des cartes communes, rares et légendaires. Réduction des animations respectée. |
| Résultats | 16 dispositions sur quatre thèmes, puis trois dispositions avec un succès musical réellement obtenu. Accès à la carte exacte avec focus et filtres adaptés. |
| Accessibilité automatique | Axe-core 4.14.0 : 20 états/écrans, incluant les quatre thèmes sur Réglages, Progrès et Succès. Aucune violation automatique restante parmi les règles WCAG A/AA testées. Contrôle réalisé après stabilisation des transitions ; ce résultat ne constitue pas une certification d’accessibilité. |
| Audio | 13 récompenses disponibles planifiées dans un vrai AudioContext Chromium : aucune note programmée en retard, maintien des sons vérifié, hauteur de la première note cohérente avec la fréquence demandée. Cela vérifie le moteur, pas la fidélité artistique au morceau original. |
| Hors ligne | Paquet FTP compilé : rechargement hors ligne, ressources pédagogiques, cours, réponse de mauvaise octave rejetée, correction et manche stable. |
| Mise à jour | Véritable ZIP v0.28 puis paquet v0.29 servi à la même URL : refus conservant l’ancienne version, nouvelle proposition au lancement suivant, activation après accord, données de progression strictement identiques après migration. |

Les captures et les résultats détaillés se trouvent dans le dossier `v0.29/` du dépôt. Les tests tactiles utilisent des entrées injectées dans Chromium. Aucun iPhone physique, pilote audio Windows ni écran avec lecteur d’écran n’a été validé pendant cette revue.

## Défauts, limites et améliorations à prioriser

### 1. Confort et accessibilité — problèmes constatables

| Priorité | Constat et reproduction | Conséquence | Proposition |
|---|---|---|---|
| **P1 · confort tactile** | Ouvrir une activité de corde entière en portrait sur un petit téléphone. La grille complète à treize positions tient dans la largeur, mais certaines cases mesurent environ 14,8 px de large et certaines rangées moins de 8 px de haut dans les configurations mesurées. | Le toucher direct fonctionne, mais il reste exigeant pour de gros doigts. Afficher tout l’instrument ne résout pas mécaniquement la précision. | Garder le paysage conseillé et les boutons facultatifs déjà livrés. Prototyper ensuite une loupe temporaire au maintien, ou un agrandissement manuel clairement commandé, puis tester avec des débutants. Aucun cadrage ne doit révéler automatiquement la réponse. |
| **P2 · navigation clavier** | Les cases interactives du manche sont toutes des étapes de tabulation (`tabindex=0`). Le manche complet 6 cordes × 13 positions représente 78 cibles. | La navigation clavier reste possible, mais demande trop de tabulations. | Introduire un seul point d’entrée au manche et des déplacements par flèches, en conservant les boutons de réponse et leurs libellés. Tester aussi avec un lecteur d’écran. |
| **P2 · cadrage** | Sur un téléphone portrait, la bande du manche 0–12 respecte ses proportions mais occupe une faible partie de la hauteur de son panneau. | L’espace vide peut faire croire que le manche pourrait être davantage agrandi, alors que sa largeur le limite déjà. | Ajuster éventuellement le cadre à l’aspect de la bande, après validation visuelle. Ne pas étirer les cordes, ne pas déplacer automatiquement les questions et réponses : leur disposition reste celle validée. |

Aucun blocage fonctionnel n’a été reproduit dans les scénarios qui ont passé. Ces trois constats restent à traiter comme des sujets de confort et d’accessibilité ; le premier est le plus important à confronter aux testeurs.

### 2. Vérifications indispensables sur appareil ou hébergement réel

| Sujet | Ce que la revue établit | Ce qui manque |
|---|---|---|
| Audio iPhone / Windows | Le moteur produit les bonnes fréquences et programme les notes sans retard dans Chromium. | Safari sur iPhone physique, sortie du mode silencieux, reprise après interruption, première attaque après une période sans son et latence acoustique d’un PC Windows réel. Le problème de pilote ne peut pas être déclaré résolu sur cette seule base. |
| Glisser/reflets sur iOS | Les gestes tactiles Chromium, l’annulation et le défilement passent. | Confirmer le même comportement dans Safari et dans la PWA installée, en particulier près des bords de l’écran. |
| Signalement de bug | Le formulaire s’ouvre et les validations serveur existent. Aucun e-mail n’a été envoyé pendant l’audit. | Vérifier l’envoi et la réception sur o2switch, avec PHP et sa configuration `mail()`. |
| Publication des mises à jour | Le passage réel de 0.28 à 0.29 fonctionne à URL fixe dans la recette locale. | Le déploiement FTP et la configuration réelle de `latest.json` sur le domaine ne sont pas vérifiés ici. Un dossier de version différent garde aussi une identité et une URL de lancement de PWA distinctes dans le manifeste. Une URL permanente `/adh-pwa/app/` reste préférable. |
| Fidélité musicale | Le moteur rejoue ce qui est décrit dans les données. Le catalogue suspend les passages non suffisamment corroborés. | Validation humaine note par note, rythme et registre contre les sources retenues. La cohérence mathématique d’un buffer audio ne suffit pas à certifier une transcription. |

Le fichier `music-audit.js` conserve notamment en attente Immigrant Song (voix), I Was Made for Lovin’ You, Superstition, Get Lucky, Blue Monday, Sweet Dreams, Bad Guy et Thunderstruck. Leur présence en attente n’est pas un morceau nouvellement corrigé par cette livraison.

### 3. Écarts avec la V1 et améliorations d’architecture

| Priorité | Chantier | Action proposée |
|---|---|---|
| **Bloquant V1 commerciale** | Essai de sept jours, achat et restauration des droits | Définir le raccordement serveur/paiement, puis réaliser et tester le cycle d’achat et les droits hors ligne. Ce cycle commercial n’est pas fourni par cette bêta. |
| **Bloquant V1 pédagogique** | Parcours complet du manche | La bêta couvre trois zones et les trois premières cordes ciblées, avec le parcours guidé correspondant. Étendre puis vérifier le reste du parcours prévu en V1 : toutes les cordes, étendue jusqu’à 24, duos, mélanges et raccords. Ne pas confondre une carte des progrès 0–24 avec des cours complets sur 0–24. |
| **À retirer avant V1** | Mode débug | Retirer son code et son entrée de la livraison commerciale, après les essais de la bêta. |
| P1 · continuité des données | Accès depuis un autre navigateur/appareil | Les données restent locales. Garder l’export/import ; implémenter l’identité/restauration prévue pour V1 et la synchronisation selon la roadmap. Aucun transfert automatique entre appareils ne doit être annoncé aujourd’hui. |
| P2 · styles | Dette CSS des anciennes itérations | Les composants et tokens sont centralisés, mais les feuilles de pages contiennent encore plusieurs règles historiques qui se surchargent. Nettoyer progressivement les anciennes variantes avec les captures de référence, plutôt que multiplier les exceptions. |
| P2 · stabilité visuelle | Recette réutilisable | Conserver les recettes actuelles et leurs captures, ajouter une exécution automatique sur chaque modification du manche, des résultats, du tuner ou des thèmes. Les anciens scripts aux numéros de version et nombres d’activités figés doivent être distingués des recettes de la bêta actuelle. |
| P2 · conservation | Sauvegardes de secours | Rendre l’export de progression facile à retrouver et expliquer en une phrase les limites du stockage local. Ne pas demander aux testeurs de vider les données du site pour résoudre un cache. |

## Ordre conseillé pour la prochaine itération

1. Valider le rendu sunrise : **Aube cuivrée** est le choix recommandé.
2. Faire tester une activité de corde entière en portrait puis en paysage à deux ou trois débutants, en observant les erreurs de visée ; arbitrer ensuite la loupe ou le zoom manuel.
3. Exécuter la courte recette physique iPhone/Windows et le test d’envoi sur o2switch.
4. Poursuivre les chantiers stricts de V1 : parcours complet, accès commercial, conservation/restauration et finition pédagogique. Les nouveaux modes restent hors de cette itération.

La v0.29 est préparée pour FTP. Aucun fichier n’a été envoyé sur o2switch par cette intervention.

[Consulter les captures et rapports de vérification](https://github.com/csm-clem/ADH-reborn/tree/main/docs/v0.29).
