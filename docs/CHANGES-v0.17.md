# Daily Fretboard Trainer — v0.17

## Planches visuelles

Deux ensembles sont livrés séparément du jeu pour permettre un choix explicite.

- **[Six manches harmonisés](v0.17/manches.png)** : chacun montre le fond, les cordes, les frettes, le sillet et les pastilles neutre/juste/fausse. Les valeurs hexadécimales et les contrastes locaux accompagnent les propositions. [PDF](v0.17/manches.pdf).
- **[Six thèmes utiles](v0.17/themes.png)** : Atelier, Studio nuit, Scène, Papier, Repères inclusifs et Lecture renforcée. Chaque maquette présente le même exercice avec une intention différente. [PDF](v0.17/themes.pdf).

[Le dossier de choix](v0.17/CHOIX-VISUELS.md) argumente chaque proposition et décrit le futur réglage du manche indépendant du thème général. Les couleurs sont aussi fournies dans [un fichier structuré](v0.17/palettes.json). **Aucun nouveau thème ni sélecteur de manche personnalisé n’est installé dans les Paramètres à cette étape.** Les thèmes actuels restent disponibles.

Les planches sont produites avec la même géométrie et le même dessin de manche que le programme. Leurs sources sont dans `tools/design/`, et les versions HTML permettent une consultation locale. La mesure de contraste des couleurs opaques ne constitue pas une certification globale d’accessibilité.

## Conseils sur les Singletons appliqués

La recommandation de services uniques est implémentée sous forme de modules partagés, plutôt que de classes globales rigides.

| Service | Responsabilité |
|---|---|
| `services/audio-service.js` | Un contexte Web Audio à la demande, cache borné, voix, séquences, phrases accompagnées et arrêt des sources |
| `services/storage-service.js` | Accès au stockage navigateur, validation des sauvegardes, import/export, protection des données illisibles et remontée des erreurs |
| `services/app-store.js` | Source unique des préférences, instantanés immuables, mises à jour et abonnements explicites |
| `services/platform-service.js` | Thème système, visibilité, plein écran, redimensionnement et invitation d’installation, avec nettoyage des écouteurs |

`app.js` assemble ces services et les injecte dans les contrôleurs. `PilotController` ne lit plus directement `localStorage`. Les notes successives peuvent toujours résonner ensemble ; un changement de voix, Muet ou une sortie arrête les lectures concernées.

Les règles de démonstration restent partagées et immuables. Les séances, résultats par instrument, questionnaires et chronomètres restent indépendants. Aucun bus d’événements général, Singleton de vue ou gestionnaire global de chronomètre n’est ajouté. Le service worker garde son cycle de vie natif. Les détails sont dans [l’inventaire actualisé](SINGLETONS.md).

## Sauvegardes plus robustes

L’import valide la configuration et l’historique avant d’écrire. Si une écriture échoue, il tente de restaurer les deux anciennes valeurs ; le message distingue un retour réussi d’une impossibilité de restauration. Le navigateur ne fournit pas de transaction native entre ces deux clés. Une sauvegarde illisible reste protégée contre l’écrasement automatique, jusqu’à un remplacement explicite validé.

Lorsque le stockage est lisible mais refuse les écritures, les préférences déjà présentes restent utilisables et l’indisponibilité de sauvegarde est signalée.

## Vérifications

- 81 tests automatisés, dont neuf nouveaux cas couvrant les services, et vérification syntaxique.
- Onboarding sur six instruments et huit tailles d’écran : préférences, commandes, accordages et écoutes.
- Manche stable et réponses rapides, démonstrations nommées et affichage sur cinq tailles.
- 22 activités du parcours standard terminées de bout en bout.
- Un seul contexte audio dans la PWA malgré plusieurs écoutes ; lecture accompagnée et arrêt vérifiés.
- Export puis restauration après changement d’instrument, avec restitution du profil et de ses résultats.
- Thème suivant le système, conservation des choix d’apparence et nettoyage des abonnements.
- Paquet servi depuis un sous-dossier, six images et quatre services disponibles hors connexion.

Ces essais Chromium ne remplacent pas les retours sur appareils réels ou les tests avec des utilisateurs concernés par les besoins d’accessibilité.

## Installation FTP

Décompresser [le ZIP v0.17](../downloads/daily-fretboard-trainer-v0.17.zip), copier son contenu dans `adh-pwa/v0.17/`, puis ouvrir `https://media.lecompositeur.com/adh-pwa/v0.17/`. Le serveur o2switch n’est pas modifié automatiquement. Comme convenu en v0, une nouvelle version repart sans les anciens parcours ; l’instrument et les préférences restent conservés.
