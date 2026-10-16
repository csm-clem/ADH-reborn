# ADH Reborn

PWA d’apprentissage des notes du manche. Un parcours sur les cases **0 à 4**, adapté à la configuration favorite choisie par l’utilisateur.

## Lancer et vérifier

Node.js 20 ou supérieur, aucune dépendance à installer :

```sh
npm start
npm run check
npm test
```

Ouvrir `http://localhost:4173`. Sur un téléphone distant, le service worker demande HTTPS : une simple adresse HTTP du réseau local ne suffit pas à tester l’installation et le mode hors ligne.

## Ce qui est disponible

La v0.6 ouvre un **pilote pédagogique actif** sur les cordes à vide, les intervalles naturels et les transferts entre cordes équivalentes. Le plan dépend des hauteurs réelles de l’accordage. Sur six cordes standard, 11 activités permettent d’éprouver le format avant de produire tout le parcours.

- Guitares 6/7/8 cordes, basses 4/5/6 cordes ; accordages standards ou personnalisés au premier lancement. Les configurations incompatibles avec une tonique naturelle sont signalées.
- Roue de sept noms naturels, position → nom et nom → position ; roue naturelle également dans les bilans. Exception explicitée pour nommer les cordes altérées d’un accordage.
- Découverte active, diagramme et modèle sonore, réponses mélangées, motif tactile, sans formulaire d’autoévaluation.
- Premières réponses conservées, reprises et aides identifiées, progrès distincts dans les deux sens. Aucune vitesse imposée pour avancer ; défi cinq étoiles à 100 % et médiane ≤ 1 seconde.
- Manche horizontal dans les deux orientations ; panneaux côte à côte de même hauteur en paysage, empilés en portrait. Décompte de 1,5 seconde, passage automatique après 500 ms, pause et commande muet accessible, plein écran.
- Notation internationale/latine, charte Le Compositeur, synthèse de corde pincée, usage hors ligne.
- Historique et parcours précédents conservés séparément. Séance reprenable, statistiques, export/import des deux historiques.

Le reste de la carte naturelle, les ateliers d’altérations et la planification des révisions différées restent à produire. Voir le [rapport détaillé de phase 3](docs/CHANGES-v0.6.md) pour les choix, limites et vérifications.

## Périmètre commercial

Ce MVP gratuit n’encaisse aucun paiement. La configuration initiale peut être corrigée avant la première séance terminée. L’ajout de configurations et les zones 5–9 et 8–12 sont annoncés mais ne sont pas commercialisés. Un futur déblocage payant doit être vérifié par un service de licences ; une restriction locale ne constitue pas une protection commerciale.

## Architecture

- `core.js` : notes MIDI scientifiques, accordages, parcours, questions, scores et validation des sauvegardes. Indépendant du navigateur.
- `app.js` : interface commune, ancien parcours, stockage local et audio.
- `pilot.js` : plan dérivé de l’accordage, questions, corrections et validation du stockage du pilote.
- `pilot-ui.js` et `pilot.css` : contrôleur et interface du pilote actif.
- `style.css` : affichage adaptatif du manche.
- `clock.js` : chronométrage actif, pauses et gestes exclus.
- `sound.js` : synthèse de corde pincée Karplus–Strong.
- `brand.css` et `fonts/` : charte Le Compositeur et polices locales.
- `sw.js` : cache de la version publiée. Incrémenter son nom de cache pour toute mise à jour des ressources.
- `tools/serve.mjs` : serveur de développement.
- `tests/` : exactitude musicale, progression, couverture, scores, chronométrage, géométrie, synthèse sonore et ressources hors ligne.

Le moteur musical de ce MVP est une petite implémentation indépendante en JavaScript : aucune dépendance GUI Rust ou ressource de l’ancien atlas n’est nécessaire. Le calcul des harmoniques de `adh-core` pourra être intégré séparément après correction et validation musicale.

## Hébergement

Tous les fichiers nécessaires sont statiques et leurs URLs sont relatives : le site peut être hébergé à la racine ou dans un sous-dossier. Exécuter `npm run package` et publier le contenu de `dist/` sur HTTPS. Le [ZIP prêt pour FTP](downloads/adh-pwa-v0.6.zip) permet aussi un dépôt sans Node.js. Voir [les changements et instructions v0.6](docs/CHANGES-v0.6.md). Éviter un cache HTTP long sur `sw.js` et `index.html`.

Pour vérifier hors ligne : charger en HTTPS, attendre l’activation du service worker, recharger une fois, fermer l’application, couper le réseau, rouvrir et terminer une séance. Ne pas supprimer les données du site : la progression locale disparaîtrait aussi. Une copie JSON permet de la restaurer.

Les interfaces et ressources ont été créées pour ADH Reborn ; Complete Music Trainer sert de référence pédagogique, sans reprise de code ni de ressources.
