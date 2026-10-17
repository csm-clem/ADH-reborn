# Daily Fretboard Trainer

PWA d’apprentissage des notes du manche, sur les **cases 0 à 4**, adaptée à l’instrument et à l’accordage choisis. Version actuelle : **0.19.0**.

## Priorités de développement

La [roadmap V1 / V2 / V3](docs/ROADMAP-GENERALE.md) est la référence actuelle : V1 simple et payable, puis tests utilisateurs et ajustements, marketing et publicité ; V2 conditionnée aux premiers résultats commerciaux ; V3 pour compléter les fonctions avancées. Les huit anciennes phases restent des documents de conception historiques.

## Lancer et vérifier

Node.js 20 ou supérieur, aucune dépendance d’exécution :

```sh
npm start
npm run check
npm test
npm run package
```

Ouvrir `http://localhost:4173`. Sur un téléphone distant, utiliser l’hébergement HTTPS pour tester l’installation et le mode hors ligne. La recette Chromium est décrite dans [tools/qa/README.md](tools/qa/README.md).

## Le pilote actuel

- Guitares 6/7/8 cordes et basses 4/5/6 cordes, bibliothèque de 32 accordages et éditeur sonore par demi-ton. Configuration initiale contenue dans l’écran, avec pagination des cordes sur écran court.
- Six images WebP fournies par le porteur du projet, intégrées localement et disponibles hors ligne.
- Parcours par familles calculé depuis les hauteurs réelles : accordage, chaque famille isolée, puis son mélange avec les positions déjà apprises. Cinquante activités en guitare six cordes standard, organisées en paires « nommer » / « retrouver ».
- **20 à 30 questions maximum**, un seul type de réponse par exercice. Séries mélangées et équilibrées ; les grandes listes répartissent leurs positions dans cette limite. Les exercices « retrouver » conservent une courte suite musicale finale, pour un maximum de 30 réponses en tout.
- Roue de hauteurs (E2/E3/E4…) pour les familles isolées ; roue de sept notes naturelles pour les mélanges ; altérations utiles dans un second anneau intérieur. Choix dièses/bémols dans les Paramètres et pendant le jeu.
- Révisions cumulatives : au moins 20 % de questions sur la nouvelle famille dans ses mélanges ; exercices isolés réellement limités à leur famille.
- Accès libre à toutes les activités disponibles ; ordre recommandé sans verrou. Repère de réussite à **90 % de premières réponses correctes**, sans condition de vitesse. Une correction ne remplace pas la première erreur. Défi facultatif : cinq étoiles à 100 % et moyenne ≤ 1 seconde.
- Exemples graphiques à la première rencontre de chaque format et micro-leçons sur les noms et positions des notes. Les instructions ne consomment pas le temps de réponse.
- Corrections à hauteur exacte : E2 et E4 ne sont pas confondus. Démonstration distincte des essais de l’élève.
- Manche horizontal, entièrement cadré sans glissement pour répondre. Deux panneaux de même hauteur en paysage, empilés en portrait. Réponses tactiles et boutons accessibles, corde 1 en haut.
- Préparation plein écran d’une seconde (« À vous de jouer ! »), exclue du chronométrage, question suivante immédiatement disponible après chaque réponse, corrections sur la seule cible, indépendantes et superposables, pause floutée avec Muet accessible, plein écran.
- Guitare électrique clean par défaut et basse électrique automatique pour les basses, par synthèse locale. Sélecteur acoustique / électrique clean / basse clean dans les Paramètres. Questions et erreurs silencieuses ; son uniquement après une bonne réponse. Écoute des exemples dans les introductions, notation CDE ou Do–Ré–Mi, charte Le Compositeur, installation et mode hors ligne.

Le parcours six cordes standard propose 25 œuvres distinctes pour ses 25 finales musicales, avec des départs en octaves pour ses 12 familles. Les autres configurations utilisent également des hauteurs exactes ; si aucun passage disponible ne convient, la suite d’entraînement reste explicitement annoncée. Voir [les sources musicales](docs/MELODIES-SOURCES.md).

Les résultats présentent score, précision, moyenne et records du même exercice, avec erreurs sur le manche, révision ciblée et carte de partage PNG. La collection Succès propose repères, fluidité et pochettes musicales : critères transparents, preuves conservées, filtres, vue album/liste et écoute des phrases obtenues. Quatre palettes coordonnées sont proposées dans les Paramètres.

Les familles naturelles et altérées sont calculées pour chaque accordage. Les révisions différées, les autres zones accessibles dans l’interface et le microphone restent à produire. Le moteur pédagogique des zones suivantes est préparé et testé ; leur accès utilisateur reste une extension future.

Voir [le rapport v0.19](docs/CHANGES-v0.19.md) et les dossiers de conception dans `docs/` pour les choix pédagogiques.

Pour préparer une nouvelle livraison, synchroniser la version dans `release.js`, `package.json` et le nom du cache de `sw.js` ; les tests vérifient cet alignement.

## Progression des versions de test

Chaque nouvelle version **v0** utilise un historique neuf. Le chargement supprime les anciennes progressions de cette application tout en gardant l’instrument favori, la notation, le son et le thème. Une actualisation ou une réouverture de la même version conserve la séance et les résultats.

Les exports/imports sont propres à la version v0 courante. Le mécanisme de stockage utilise un espace commun aux versions stables à partir de v1 ; les futures évolutions de schéma devront conserver leurs migrations. Aucune donnée des autres applications du domaine n’est effacée.

La connexion et la synchronisation entre appareils sont réservées à la phase 8.

Le code de l’ancien parcours et les anciens ZIP applicatifs sont retirés de la branche courante. Les documents de conception et l’historique Git restent des références du projet.

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

Le site est entièrement statique et utilise des URL relatives. Copier **le contenu** de `dist/`, ou du [ZIP prêt pour FTP](downloads/daily-fretboard-trainer-v0.19.zip), dans le dossier servi en HTTPS.

Adresse conseillée pour cette livraison : `https://media.lecompositeur.com/adh-pwa/v0.19/`. Le dossier du serveur n’a pas été modifié automatiquement. Éviter un cache HTTP long sur `sw.js` et `index.html`.

Pour vérifier hors ligne : charger la page, attendre l’activation du service worker, recharger une fois, couper le réseau et rouvrir l’application. Les progrès sont locaux au navigateur ; une sauvegarde JSON permet de les restaurer dans la même version de test.

## Périmètre commercial

Modèle retenu : **essai gratuit de sept jours avec accès complet et illimité, puis application entièrement payante**. Les exercices ne sont pas verrouillés par la progression. Aucun achat séparé par zone ou instrument n’est prévu.

Le prototype reste accessible sans paiement ni expiration automatique. Le paiement et la gestion de l’essai commercial seront intégrés avant l’ouverture commerciale ; voir [la décision commerciale](docs/MODELE-COMMERCIAL.md).

Les interfaces et exemples graphiques sont originaux ; les images des instruments ont été fournies par le porteur du projet. Complete Music Trainer et Guitar Pro restent des références d’usage.

## Livraison v0.16

[Rapport des changements](docs/CHANGES-v0.16.md) · [Revue UX et sources](docs/UX-REVUE-v0.16.md) · [Choix des couleurs](docs/v0.16/choix-couleurs.png) · [Décisions Singletons](docs/SINGLETONS.md) · [Récompenses musicales](docs/RECOMPENSES-MUSICALES.md).

## Livraison v0.17

[Rapport v0.17](docs/CHANGES-v0.17.md) · [Manches et thèmes proposés](docs/v0.17/CHOIX-VISUELS.md) · [Six manches](docs/v0.17/manches.png) · [Six thèmes](docs/v0.17/themes.png). Les services audio, stockage, préférences et événements navigateur sont désormais partagés et injectés ; les séances et les horloges restent indépendantes.

## Livraison v0.19

[Rapport v0.19](docs/CHANGES-v0.19.md) · [Répertoire musical](docs/v0.19/repertoire.md) · [Validation](docs/v0.19/validation.md) · [Roadmap générale](docs/ROADMAP-GENERALE.md). Collection des succès, quatre palettes coordonnées et 25 passages musicaux différents pour le parcours six cordes standard.
