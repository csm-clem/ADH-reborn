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

- Guitares 6/7/8 cordes, basses 4/5/6 cordes ; accordages standards ou personnalisés au premier lancement.
- Progression par corde, découverte puis introduction de deux, trois, quatre et cinq positions, recherche inverse et consolidation cumulative.
- Position → nom et nom → position, sans microphone. Les questions couvrent chaque position avant de répéter.
- 3 étoiles à 90 % de premières réponses correctes ; 4 à 95 % et médiane ≤ 2,5 s ; 5 à 100 % et médiane ≤ 1,5 s. Seuils provisoires à calibrer avec des guitaristes.
- Manche vectoriel horizontal en paysage, vertical en portrait, commandes lisibles et déplacement tactile. Les rotations recadrent silencieusement le manche ; le passage en arrière-plan met en pause.
- Notation internationale/latine, thème clair/sombre, synthèse de corde pincée désactivable.
- Progression locale par configuration, séance reprenable, statistiques, export/import validé.
- Manifest, icônes d’installation et service worker mettant l’ensemble des ressources du jeu en cache.

## Périmètre commercial

Ce MVP gratuit n’encaisse aucun paiement. La configuration initiale peut être corrigée avant la première séance terminée. L’ajout de configurations et les zones 5–9 et 8–12 sont annoncés mais ne sont pas commercialisés. Un futur déblocage payant doit être vérifié par un service de licences ; une restriction locale ne constitue pas une protection commerciale.

## Architecture

- `core.js` : notes MIDI scientifiques, accordages, parcours, questions, scores et validation des sauvegardes. Indépendant du navigateur.
- `app.js` : interface et interactions, stockage local, synthèse audio.
- `style.css` : affichage adaptatif et orientation du manche.
- `clock.js` : chronométrage actif, pauses et gestes exclus.
- `sound.js` : synthèse de corde pincée Karplus–Strong.
- `brand.css` et `fonts/` : charte Le Compositeur et polices locales.
- `sw.js` : cache de la version publiée. Incrémenter son nom de cache pour toute mise à jour des ressources.
- `tools/serve.mjs` : serveur de développement.
- `tests/` : exactitude musicale, progression, couverture, scores, chronométrage, géométrie, synthèse sonore et ressources hors ligne.

Le moteur musical de ce MVP est une petite implémentation indépendante en JavaScript : aucune dépendance GUI Rust ou ressource de l’ancien atlas n’est nécessaire. Le calcul des harmoniques de `adh-core` pourra être intégré séparément après correction et validation musicale.

## Hébergement

Tous les fichiers nécessaires sont statiques et leurs URLs sont relatives : le site peut être hébergé à la racine ou dans un sous-dossier. Exécuter `npm run package` et publier le contenu de `dist/` sur HTTPS. Le [ZIP prêt pour FTP](downloads/adh-pwa-v0.2.zip) permet aussi un dépôt sans Node.js. Voir [les changements et instructions v0.2](docs/CHANGES-v0.2.md). Éviter un cache HTTP long sur `sw.js` et `index.html`.

Pour vérifier hors ligne : charger en HTTPS, attendre l’activation du service worker, recharger une fois, fermer l’application, couper le réseau, rouvrir et terminer une séance. Ne pas supprimer les données du site : la progression locale disparaîtrait aussi. Une copie JSON permet de la restaurer.

Les interfaces et ressources ont été créées pour ADH Reborn ; Complete Music Trainer sert de référence pédagogique, sans reprise de code ni de ressources.
