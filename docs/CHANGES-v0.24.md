# v0.24 — Premiers Parcours bêta et manche continu

**Livraison du 19 octobre 2026 — Daily Fretboard Trainer 0.24.0**

Cette version implémente le périmètre « Premiers Parcours » de la [spécification révisée fournie](beta-v0.24/SPECIFICATION-UTILISATEUR.md), avec les décisions prises ensuite dans la conversation. Il s’agit de la bêta pédagogique ; le périmètre V1 jusqu’à la case 24 et le paiement restent dans la [roadmap générale](ROADMAP-GENERALE.md).

## Parcours disponibles

| Parcours | Contenu livré | Vérification |
|---|---|---|
| **Grand Débutant — facultatif** | Quatre chapitres : instrument, diagramme, noms des notes et accordage, nom/hauteur/octave. | Cours visuels, choix ou coordonnées à retrouver ; aucun chronomètre ni étoiles. Ignorer ne valide pas le cours. |
| **Zone I — 0–4** | Cordes à vide, familles naturelles, correspondances, altérations et mélanges. | Nommer et retrouver séparément, résultats et couverture des positions. |
| **Zone II — 4–8** | Entrée avec raccord en case 4 ; mêmes principes appliqués aux nouveaux emplacements. | Aucune corde à vide fictive ni sillet ajouté en case 4. |
| **Zone III — 8–12** | Raccord en case 8, nouvelles positions et lien entre les cordes à vide et la case 12. | Comparaisons calculées sur les hauteurs réelles ; cordes altérées traitées après les naturelles. |
| **Première corde physique — 0–12** | La corde `n` de l’instrument ; découverte, naturelles, correspondances, altérations et mélanges. | Une seule corde continue ; distinction entre à vide et son octave en case 12. |
| **Deuxième corde physique — 0–12** | Corde `n−1`, avec ses notes et ses octaves réelles. | Même moteur, autre périmètre. |
| **Troisième corde physique — 0–12** | Corde `n−2`, disponible dans la pratique ciblée. | Même moteur, autre périmètre. |
| **Niveau 1 guidé** | Références aux chapitres de Zone I et des deux premières cordes, réparties en six étapes avec reprises conseillées. | Une activité conserve son identifiant et ses résultats dans les deux chemins d’accès. |

Pour la guitare six cordes standard : **84 chapitres ciblés**, auxquels s’ajoutent les **quatre chapitres Grand Débutant**. Le Niveau 1 réutilise 42 chapitres ; il ne crée pas de copies. Cela représente 214 activités évaluées, 72 découvertes de familles et les cours visuels. Le catalogue n’affiche pas cette totalité comme une longue liste obligatoire : on choisit un parcours, puis un chapitre.

Les trois zones réunies couvrent **78 positions physiques distinctes** sur six cordes, de 0 à 12. Les cases 4 et 8 ne sont pas comptées deux fois. Le Niveau 1 en couvre 46. Les décomptes changent avec l’instrument.

## Arbitrages du document révisé

1. **Mélanges : au moins 30 % de nouvelle famille.** Sur 24 questions, cela impose **huit questions**, et non sept. Le nombre et les emplacements dans la série varient ; le quota n’impose pas systématiquement les premières questions.
2. **Bilans courts, décision confirmée dans la conversation.** Une activité garde 20–24 questions et un seul sens de réponse. Les derniers mélanges servent de bilans naturels/complets, sans clone supplémentaire. La couverture exhaustive est vérifiée grâce aux exercices du parcours, sans exiger qu’un bilan contienne à lui seul toutes les positions.
3. **Ordre physique des cordes.** Les trois parcours sont `n`, `n−1`, `n−2`. Un accordage réentrant conserve ses numéros et fait l’objet d’une explication. Il n’est pas trié selon la hauteur sonore.
4. **Manche continu.** L’ancienne proposition des trois fragments est remplacée par la solution paysage conseillé + portrait jouable décrite ci-dessous.
5. **Pas de question de nomination à réponse unique.** Si une famille ne contient qu’une hauteur, elle est découverte puis reconnue dans les mélanges. Les doublons entre une famille seule et un mélange identique sont omis. Un accordage entièrement à l’unisson reporte aussi sa nomination vers les mélanges utiles.
6. **Variété des séries.** Les mélanges n’enchaînent pas trois fois le même nom. Une activité isolant une famille varie les hauteurs ; si toute la tâche porte sur une même hauteur et plusieurs cordes, la variété porte sur les positions demandées. Une tâche sans alternative ne peut pas fabriquer une autre note.
7. **Naturelles avant altérations.** Les noms altérés des cordes à vide restent expliqués dans l’accordage ; ces positions ne se glissent pas dans les mélanges annoncés naturels. Leur famille complète intervient après les naturelles.
8. **Validation sans verrou.** Chaque chapitre associe découverte/cours, activités pertinentes et couverture autonome dans les deux sens. Un score de 90 % ne prouve pas à lui seul que tous les emplacements ont été rencontrés. La vitesse reste un défi facultatif ; cinq étoiles demandent 100 % et une moyenne ≤ 1 s.

## Affichage et toucher

### Exercices par zone

Les cases visibles correspondent réellement à la zone étudiée. Le diagramme et les boutons n’exposent pas de positions hors zone. La corde 1 reste en haut. Les exercices de recherche donnent davantage de hauteur au manche, sans modifier les proportions des figures pédagogiques hors gameplay.

### Exercices sur une corde entière

- Un seul manche horizontal continu, à vide jusqu’à la case 12.
- Aucun défilement ni déplacement de cadrage nécessaire pour répondre.
- Paysage conseillé, sans verrouillage d’orientation ni dépendance à une API de rotation.
- En portrait, et sur un paysage trop étroit, une vue continue sert de référence et de grands boutons permettent de choisir la case. Les boutons ne représentent pas de fausses cordes.
- En paysage suffisamment large, la corde tactile utilise la largeur disponible. Les cases conservent une largeur décroissante, adoucie au besoin pour garder des cibles de 44 px ; les zones de toucher ne se chevauchent pas.
- Le choix manuel d’utiliser les boutons reste conservé entre activités. La rotation ne change pas la question et le temps de réorganisation est exclu du chronomètre.
- Les éléments du manche sont conservés entre réponses par le rapprochement DOM existant. Les animations ne remplacent pas le SVG à chaque toucher.

## Cours et entrée dans le jeu

Les nouveaux cours utilisent le diagramme et la charte communs au gameplay : emplacements, noms avec octaves, sillet, inlays et couleurs. Les correspondances sont calculées à partir du profil ; elles ne reprennent pas une forme de guitare standard pour tous les accordages.

Le Grand Débutant propose de petites vérifications. Les entrées des nouvelles zones et cordes expliquent leur géométrie. Les cours de correspondances distinguent même hauteur, une octave et plusieurs octaves avec des paires réelles. Une explication n’est pas répétée pour chacune des paires : les comparaisons suivantes servent de vérification.

Les micro-tutoriels « Nommer », « Nommer avec octave » et « Retrouver » précèdent leur première utilisation. Une démonstration montre une réponse résolue. La transition « À vous de jouer ! » reste réservée au départ des questions évaluées. Voir aussi la [fiche d’entrée et de micro-tutoriels](beta-v0.24/ONBOARDING-ET-TUTORIELS.md).

## Données et compatibilité

- Les clés de stockage restent stables ; aucune remise à zéro des données v0.
- Les tentatives, succès datés, préférences et anciennes sauvegardes sont conservés.
- Les nouveaux champs sont ajoutés au profil : navigation dans les parcours et résultats des cours. Les positions jusqu’à la case 24 sont acceptées par la validation des sauvegardes, même si la bêta ne propose que 0–12.
- Les preuves de couverture sont suivies par position et par sens. Un résultat en Zone I ne valide pas les cases encore inconnues d’une autre zone ou d’une corde entière.
- Les cours ignorés restent incomplets. Une activité réussie depuis le Niveau 1 apparaît immédiatement dans sa pratique ciblée.
- La recherche des erreurs conserve le périmètre source, y compris pour une note en case 12.
- La nomination des cordes à vide distingue maintenant leur octave. Les anciennes tentatives de simple nomination restent dans l’historique, mais ne certifient pas automatiquement cette nouvelle tâche. Son record utilise un contexte de comparaison distinct.
- Le mode débug simule désormais toute la bêta, cours compris. Il reste réversible et ne remplace pas les données réelles sur disque ni dans un export.

## Organisation du code

| Module | Responsabilité |
|---|---|
| `curriculum-rules.js` | Ordre des familles, zones, taille des séances et quota de nouvelles notes. |
| `pilot.js` | Génération des questions, exactitude des réponses, variété et validation des sauvegardes. |
| `beta-catalog.js` | Parcours, chapitres canoniques, références guidées et preuves de progression. |
| `beta-courses.js` | Contenus et vérifications des cours, calculés depuis le profil. |
| `beta-home.js` | Navigation parcours → chapitre → activité et prochaine action. |
| `course-ui.js` | Affichage et état des cours non chronométrés. |
| `core.js` / `neck-view.js` | Géométrie et représentation communes des manches. |
| `pilot-ui.js` | Une seule interface de jeu adaptée au périmètre et au type de question. |

Les exercices ne recopient pas une page HTML par question. Les nouveaux parcours réutilisent le moteur, les services audio/stockage, les composants d’interface et les règles de correction existants.

## Vérifications effectuées

- `npm run check` : tous les modules JavaScript vérifiés.
- `npm test` : **24 fichiers de tests passent**, dont 12 scénarios dédiés à cette bêta.
- Tests du catalogue sur les six instruments ; cas personnalisés, réentrants et à l’unisson ; quotas, absence de triples répétitions, couverture, octaves exactes et sauvegardes.
- Recette Chromium : **41 scénarios** de mise en page, de parties complètes et de cours. Formats 320×568, 390×844, 667×375, 844×390 et 1440×900. Aucune erreur JavaScript constatée dans ces scénarios.
- Essai hors ligne : rechargement, nouveaux modules en cache, cours, réponse d’octave erronée, correction rouge nommée, conservation du SVG et sortie vers le chapitre. Un cours ignoré ne reçoit pas de validation.
- Mode débug complet et retour aux vraies données, sans écriture des résultats simulés.
- Archive FTP contrôlée : fichiers applicatifs identiques aux sources, dépendances et médias présents.

Les résultats de recette sont conservés dans [le dossier de validation](beta-v0.24/). Ils ne prouvent pas encore l’efficacité pédagogique ou le plaisir de jeu auprès de nouveaux utilisateurs.

## Limites et suite de la recette

- **Un essai sur iPhone réel reste nécessaire**, Safari puis PWA installée : audio, rotation, zones sûres et commandes système. Chromium ne remplace pas cet essai.
- Les nouveaux périmètres utilisent des suites d’entraînement clairement nommées. Le catalogue des morceaux vérifiés de la Zone I est conservé ; aucun morceau connu n’est attribué arbitrairement aux nouveaux exercices.
- Le formulaire de signalement continue de dépendre du serveur PHP et de son envoi d’email. Aucun email de test n’a été envoyé dans cette recette.
- Le parcours V1 au-delà de ce périmètre bêta, les autres cordes, les duos, les exercices étendus, les comptes/synchronisation et le paiement ne sont pas ajoutés par cette livraison.

## Déploiement

Télécharger [l’archive FTP v0.24](../downloads/daily-fretboard-trainer-v0.24.zip), puis déposer **son contenu** sur l’hébergement HTTPS, dossier `api/` compris.

Une URL stable telle que `adh-pwa/app/` facilite les mises à jour. Pour garder un dossier versionné, déposer dans `adh-pwa/v0.24/` et placer [latest.json](../downloads/latest.json) dans `adh-pwa/`. La nouvelle version sera proposée aux versions qui connaissent ce mécanisme ; elle n’est pas activée de force.

Exporter une sauvegarde depuis l’application avant le transfert. Les données du navigateur doivent être conservées. Le code est livré dans le dépôt ; aucun transfert FTP vers o2switch n’a été effectué automatiquement.
