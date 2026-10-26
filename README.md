# Daily Fretboard Trainer

PWA d’apprentissage des notes du manche, adaptée à l’instrument et à l’accordage choisis. Version bêta actuelle : **0.37.0** — cours étendus corrigés et raccourcis ; manche 0–24 défilable dans les cours et les exercices de la prévisualisation.

[Archive FTP v0.37](downloads/daily-fretboard-trainer-v0.37.zip) · [Rapport de livraison](docs/CHANGES-v0.37.md) · [Spécification révisée](docs/beta-v0.24/SPECIFICATION-UTILISATEUR.md)

## Priorités de développement

Le [tableau de bord partagé](https://daily-fretboard-roadmap.quirkybison9.chatgpt.site/) est la référence à consulter et mettre à jour à chaque intervention. La [roadmap V1 / V2 / V3](docs/ROADMAP-GENERALE.md) en conserve le contexte : V1 avec le parcours complet des notes appuyées et le paiement, puis tests utilisateurs et ajustements, marketing et publicité ; V2 conditionnée aux premiers résultats commerciaux ; V3 pour compléter les fonctions avancées. Les huit anciennes phases restent des documents de conception historiques.

## Lancer et vérifier

Node.js 20 ou supérieur pour le serveur local et les tests ; aucune dépendance JavaScript d’exécution. Le formulaire de signalement utilise PHP 8.1+ et `mail()` sur l’hébergement o2switch :

```sh
npm start
npm run check
npm test
npm run package
```

Les [contrôles de maintenance et de livraison](docs/MAINTENANCE-VALIDATION.md) découvrent automatiquement les nouveaux modules et vérifient aussi les ressources HTML/CSS, les icônes et la syntaxe du paquet préparé pour publication.

Ouvrir `http://localhost:4173`. Sur un téléphone distant, utiliser l’hébergement HTTPS pour tester l’installation et le mode hors ligne. La recette Chromium est décrite dans [tools/qa/README.md](tools/qa/README.md).

## La bêta actuelle

- Guitares 6/7/8 cordes et basses 4/5/6 cordes, bibliothèque de 32 accordages et éditeur sonore par demi-ton. Configuration initiale contenue dans l’écran, avec pagination des cordes sur écran court.
- Six images WebP fournies par le porteur du projet, intégrées localement et disponibles hors ligne.
- Parcours par familles calculé depuis les hauteurs réelles : accordage, chaque famille isolée, puis son mélange avec les positions déjà apprises. 214 activités évaluées pour la guitare six cordes standard, plus 72 découvertes de familles et les cours courts ; le nombre dépend des hauteurs réellement disponibles. Les cas sans discrimination sont travaillés en mélange plutôt que dans une roue à une seule réponse.
- **20 à 30 questions maximum**, un seul type de réponse par exercice. Séries mélangées et équilibrées ; les grandes listes répartissent leurs positions dans cette limite. Les exercices « retrouver » conservent une courte suite musicale finale, pour un maximum de 30 réponses en tout.
- Roue de hauteurs (E2/E3/E4…) pour les familles isolées ; roue de sept notes naturelles pour les mélanges ; altérations utiles dans un second anneau intérieur. Choix dièses/bémols dans les Paramètres et pendant le jeu.
- Révisions cumulatives : au moins 30 % de questions sur la nouvelle famille dans ses mélanges ; exercices isolés réellement limités à leur famille.
- Accès libre à toutes les activités disponibles ; ordre recommandé sans verrou. Repère de réussite à **90 % de premières réponses correctes**, sans condition de vitesse. Une correction ne remplace pas la première erreur. Défi facultatif : cinq étoiles à 100 % et moyenne ≤ 1 seconde.
- Exemples graphiques à la première rencontre de chaque format et micro-leçons sur les noms et positions des notes. Les instructions ne consomment pas le temps de réponse.
- Corrections à hauteur exacte : E2 et E4 ne sont pas confondus. Démonstration distincte des essais de l’élève.
- Manche horizontal, entièrement cadré sans glissement pour répondre. Les exercices par zone gardent deux panneaux en paysage, empilés en portrait. Une corde entière reste continue, avec paysage conseillé ; en portrait, des boutons de cases prennent le relais si les cibles sont trop étroites. Corde physique 1 en haut.
- Préparation plein écran d’une seconde (« À vous de jouer ! »), exclue du chronométrage, question suivante immédiatement disponible après chaque réponse, corrections sur la seule cible, indépendantes et superposables, pause floutée avec Muet accessible, plein écran.
- Guitare électrique clean par défaut et basse électrique automatique pour les basses, par synthèse locale. Sélecteur acoustique / électrique clean / basse clean dans les Paramètres. Questions et erreurs silencieuses ; son uniquement après une bonne réponse. Écoute des exemples dans les introductions, notation CDE ou Do–Ré–Mi, charte Le Compositeur, installation et mode hors ligne.

Le parcours six cordes standard utilise actuellement 14 passages connus distincts. Les airs retirés et les morceaux en attente ne sont pas attribués aux activités ; les activités restent accessibles avec une suite d’entraînement explicitement nommée. Les autres configurations utilisent également des hauteurs exactes ; si aucun passage disponible ne convient, la suite d’entraînement reste explicitement annoncée. Voir [l’audit musical et ses limites](docs/v0.23/audit-musical.md).

Les résultats présentent score, précision, moyenne et records du même exercice, avec erreurs sur le manche, révision ciblée et carte de partage PNG. L’accueil regroupe trois branches : Grand Débutant, Progression Guidée et Pratique ciblée. Les acquis, les statistiques et les records sont conservés indépendamment du journal détaillé des 250 dernières tentatives. La collection Succès propose repères, fluidité et pochettes musicales : critères transparents, preuves conservées, filtres, vue album/liste et écoute des phrases obtenues. Chaque carte indique son pourcentage et les étapes du défi. Un mode débug v0 réversible simule le parcours terminé sans remplacer les vrais résultats. Quatre palettes coordonnées sont proposées dans les Paramètres. Le bouton Signaler un bug ouvre un formulaire intégré ; l’envoi nécessite le relais PHP inclus et une connexion. Les récompenses musicales reprennent le registre exact de l’exercice.

Les familles naturelles et altérées sont calculées pour chaque accordage. La bêta propose les trois zones jusqu’à la case 12, trois cordes complètes et un Niveau 1 guidé. Les révisions peuvent être recommandées après une pause ou une difficulté. Les extensions au-delà de ce catalogue, la planification espacée avancée et le microphone restent dans la roadmap. La carte des progrès affiche déjà le manche entier de 0 à 24 avec défilement horizontal.

Voir [le rapport v0.23](docs/CHANGES-v0.23.md) et les dossiers de conception dans `docs/` pour les choix pédagogiques.

Pour préparer une nouvelle livraison, synchroniser la version dans `release.js`, `package.json` et le nom du cache de `sw.js` ; les tests vérifient cet alignement.

## Progression des versions de test

Depuis la v0.23, les versions de test conservent les progrès sans compte. Une sauvegarde v0.22 compatible encore présente sur la même origine est migrée vers une clé durable, sans supprimer l’archive. Les imports v0 compatibles sont acceptés. Une donnée illisible est protégée et une écriture refusée n’est pas assimilée à une sauvegarde réussie.

Les nouvelles mises à jour sont proposées, jamais imposées, y compris après fermeture des onglets. Voir les deux modes de déploiement (URL fixe ou annonce `latest.json` entre dossiers versionnés) dans [le rapport v0.23](docs/CHANGES-v0.23.md). Le tout premier passage depuis une v0.22 déjà installée demande une ouverture manuelle de la nouvelle URL.

Les futures modifications de schéma devront ajouter leur convertisseur et ses tests. Aucune donnée des autres applications du domaine n’est supprimée.

## Architecture

- `ui.css`, `tokens.css`, `components.css` : couches CSS, fondations et composants communs ; contrat dans [DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md).
- `achievement-rules.js`, `achievement-data.js`, `achievements-ui.js` : catalogue, preuves et collection des succès.
- `themes.js` : choix et descriptions des quatre palettes.
- `progress.js` / `progress.css` : carte visuelle des positions et résultats par compétence.
- `neck-view.js` / `neck.css` : rendu commun du manche pour les exercices et les petits schémas ; géométrie dans `core.js`.
- `answer-wheel.css` : composant de roue à un ou deux anneaux.
- `discovery-feedback.js` : indications de hauteur pour les recherches libres.
- `core.js` : notes, accordages, fréquences, géométrie du manche et étoiles.
- `pilot.js` : plan adapté à l’accordage, séries de questions, réponses et validation de la progression.
- `results.js` / `result-ui.js` : métriques, records par exercice, diagrammes d’erreurs et export de la carte de résultat.
- `melodies.js` : sélection d’extraits sourcés, transposés uniquement dans les hauteurs de l’exercice.
- `result.css` : mise en page compacte et adaptative de la fiche de résultat.
- `pilot-ui.js` / `pilot.css` : découverte, exercices, motifs, statistiques et résultats.
- `app.js` : navigation commune, préférences, export/import et audio.
- `release.js` / `state.js` : identité du produit, version et politique de stockage.
- `tuning.js` : bibliothèque d’accordages, transpositions et pagination des cordes.
- `onboarding.js` / `onboarding.css` : configuration initiale et éditeur sonore.
- `instrument-art.js` et `instruments/` : images locales des six instruments.
- `learning-help.js` : introductions graphiques des formats et descriptions sonores des intervalles.
- `clock.js` / `sound.js` : chronomètre actif et synthèse de corde pincée.
- `style.css`, `brand.css`, `fonts/` : interface et charte Le Compositeur.
- `sw.js` : fichiers hors ligne et remplacement du cache de cette application.

## Hébergement FTP

Le site est entièrement statique et utilise des URL relatives. Copier **le contenu** de `dist/`, ou du [ZIP prêt pour FTP](downloads/daily-fretboard-trainer-v0.28.zip), dans le dossier servi en HTTPS.

Adresse conseillée pour cette livraison : `https://media.lecompositeur.com/adh-pwa/v0.20/`. Le dossier du serveur n’a pas été modifié automatiquement. Éviter un cache HTTP long sur `sw.js` et `index.html`.

Pour vérifier hors ligne : charger la page, attendre l’activation du service worker, recharger une fois, couper le réseau et rouvrir l’application. Les progrès sont locaux au navigateur ; une sauvegarde JSON permet de les restaurer dans une version compatible.

## Périmètre commercial

Modèle retenu : **essai gratuit de sept jours avec accès complet et illimité, puis application entièrement payante**. Les exercices ne sont pas verrouillés par la progression. Aucun achat séparé par zone ou instrument n’est prévu.

Le prototype reste accessible sans paiement ni expiration automatique. Le paiement et la gestion de l’essai commercial seront intégrés avant l’ouverture commerciale ; voir [la décision commerciale](docs/MODELE-COMMERCIAL.md).

Les interfaces et exemples graphiques sont originaux ; les images des instruments ont été fournies par le porteur du projet. Complete Music Trainer et Guitar Pro restent des références d’usage.

## Livraison v0.16

[Rapport des changements](docs/CHANGES-v0.16.md) · [Revue UX et sources](docs/UX-REVUE-v0.16.md) · [Choix des couleurs](docs/v0.16/choix-couleurs.png) · [Décisions Singletons](docs/SINGLETONS.md) · [Récompenses musicales](docs/RECOMPENSES-MUSICALES.md).

## Livraison v0.17

[Rapport v0.17](docs/CHANGES-v0.17.md) · [Manches et thèmes proposés](docs/v0.17/CHOIX-VISUELS.md) · [Six manches](docs/v0.17/manches.png) · [Six thèmes](docs/v0.17/themes.png). Les services audio, stockage, préférences et événements navigateur sont désormais partagés et injectés ; les séances et les horloges restent indépendantes.

## Livraison v0.20

[Rapport v0.23](docs/CHANGES-v0.23.md) · [Audit musical](docs/v0.23/audit-musical.md) · [Validation](docs/v0.23/validation.md) · [Roadmap générale](docs/ROADMAP-GENERALE.md). Manche et accueil corrigés, collection retravaillée, contrastes renforcés, signalement de bug et catalogue musical revu : 14 passages attribués au parcours standard ; deux demandes musicales restent à terminer.

## Livraisons contrôlées

`npm run release` prépare la bêta, ses tests et son ZIP. `npm run release:production` produit une archive séparée sans simulation. Voir le [rapport v0.33](docs/CHANGES-v0.33.md). Le workflow GitHub vérifie également les parcours, la migration et le hors-ligne.

[Journal des modifications DFT](docs/JOURNAL-DFT.md) — également accessible dans les Paramètres de l’application.

## Prévisualisation du parcours V1

Le catalogue étendu se teste avec `?curriculum=full`. Cette prévisualisation conserve les anciennes données et identifiants ; elle reste hors du parcours par défaut tant que la recette du parcours complet n’est pas terminée. Le choix tactile est confirmé : manche continu défilable pour 0–24, boutons optionnels. Suivi : V1-06 à V1-09 dans le tableau de bord.
