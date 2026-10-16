# Daily Fretboard Trainer

PWA d’apprentissage des notes du manche, sur les **cases 0 à 4**, adaptée à l’instrument et à l’accordage choisis. Version actuelle : **0.8.0**.

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
- Illustrations vectorielles distinctes : guitare à double échancrure de type Stratocaster, Soloist sept cordes, headless huit cordes, basse classique quatre cordes, basses sculptées cinq/six cordes.
- Parcours calculé depuis les hauteurs réelles : cordes à vide, intervalles naturels, cordes de même nom, bilan et phrase musicale. Onze activités en guitare six cordes standard.
- Au moins **20 questions par activité**, chaque position au moins trois fois dans chaque sens. Un bloc « nommer », puis un bloc « retrouver », chacun mélangé.
- Roue de sept notes naturelles ; exception explicitée pour les noms altérés des cordes à vide de certains accordages.
- Validation à **90 % de premières réponses correctes**, sans condition de vitesse. Une correction ne remplace pas la première erreur. Défi facultatif : cinq étoiles à 100 % et médiane ≤ 1 seconde.
- Manche horizontal, entièrement cadré sans glissement pour répondre. Deux panneaux de même hauteur en paysage, empilés en portrait. Réponses tactiles et boutons accessibles, corde 1 en haut.
- Préparation par une roue de 1,5 seconde, passage automatique après une bonne réponse en 500 ms, pause floutée avec Muet accessible, plein écran.
- Notes pincées, modèles joués en arpège, notation CDE ou Do–Ré–Mi, charte Le Compositeur, installation et mode hors ligne.

La carte naturelle complète, les ateliers d’altérations, les révisions différées et le microphone restent à produire. Une tonique altérée à vide limite actuellement le pilote aux cordes à vide ; l’application le signale et ne change jamais l’accordage pour contourner cette limite.

Voir [le rapport v0.8](docs/CHANGES-v0.8.md) et les dossiers de conception dans `docs/` pour les choix pédagogiques.

Pour préparer une nouvelle livraison, synchroniser la version dans `release.js`, `package.json` et le nom du cache de `sw.js` ; les tests vérifient cet alignement.

## Progression des versions de test

Chaque nouvelle version **v0** utilise un historique neuf. Le chargement supprime les anciennes progressions de cette application tout en gardant l’instrument favori, la notation, le son et le thème. Une actualisation ou une réouverture de la même version conserve la séance et les résultats.

Les exports/imports sont propres à la version v0 courante. Le mécanisme de stockage utilise un espace commun aux versions stables à partir de v1 ; les futures évolutions de schéma devront conserver leurs migrations. Aucune donnée des autres applications du domaine n’est effacée.

Le code de l’ancien parcours et les anciens ZIP applicatifs sont retirés de la branche courante. Les documents de conception et l’historique Git restent des références du projet.

## Architecture

- `core.js` : notes, accordages, fréquences, géométrie du manche et étoiles.
- `pilot.js` : plan adapté à l’accordage, séries de questions, réponses et validation de la progression.
- `pilot-ui.js` / `pilot.css` : découverte, exercices, motifs, statistiques et résultats.
- `app.js` : navigation commune, préférences, export/import et audio.
- `release.js` / `state.js` : identité du produit, version et politique de stockage.
- `tuning.js` : bibliothèque d’accordages, transpositions et pagination des cordes.
- `onboarding.js` / `onboarding.css` : configuration initiale et éditeur sonore.
- `instrument-art.js` : dessins vectoriels originaux des instruments.
- `clock.js` / `sound.js` : chronomètre actif et synthèse de corde pincée.
- `style.css`, `brand.css`, `fonts/` : interface et charte Le Compositeur.
- `sw.js` : fichiers hors ligne et remplacement du cache de cette application.

## Hébergement FTP

Le site est entièrement statique et utilise des URL relatives. Copier **le contenu** de `dist/`, ou du [ZIP prêt pour FTP](downloads/daily-fretboard-trainer-v0.8.zip), dans le dossier servi en HTTPS.

Adresse conseillée pour cette livraison : `https://media.lecompositeur.com/adh-pwa/v0.8/`. Le dossier du serveur n’a pas été modifié automatiquement. Éviter un cache HTTP long sur `sw.js` et `index.html`.

Pour vérifier hors ligne : charger la page, attendre l’activation du service worker, recharger une fois, couper le réseau et rouvrir l’application. Les progrès sont locaux au navigateur ; une sauvegarde JSON permet de les restaurer dans la même version de test.

## Périmètre commercial

Aucun achat n’est disponible dans ce MVP. Le choix initial est corrigeable avant le premier exercice terminé. Les instruments supplémentaires et les zones 5–9 et 8–12 restent à commercialiser ultérieurement, avec un service de licences adapté.

Les interfaces et dessins sont originaux. Complete Music Trainer et Guitar Pro sont des références d’usage ; aucun de leurs fichiers graphiques ou codes n’est repris.
