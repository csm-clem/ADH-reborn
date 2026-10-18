# Recette v0.23

## Contrôles réussis

- `npm run check` : syntaxe de tous les modules du moteur et des nouveaux contrôleurs.
- `npm test` : **119 tests**, dont migration d’une vraie structure de progression v0.22, sauvegarde refusée/illisible, imports, reprise des critères de succès, demande de session audio Safari et registre des récompenses.
- `tools/qa/v023.py` : configuration en trois écrans, cinq cartes d’introduction, rappel d’accordage, migration de 100 tentatives et de leurs succès, recto-verso accessible, timbre saturé, guide iPhone, mise à jour différée et reprise du second exercice d’un défi. Aucun événement `pageerror`.
- `tools/qa/update-cycle-v023.py` : deux véritables générations de service worker simulant 0.23 → 0.24 sur la même URL. Refus conservé après fermeture de tous les onglets ; nouvelle proposition au retour ; acceptation et activation de la nouvelle version, sans modification des progrès.
- `tools/qa/audio-runtime-v023.py` : 14 restitutions réellement programmées dans Web Audio. Aucun départ en retard, buffers suffisamment longs, hauteur fondamentale cohérente avec le registre de référence.
- `tools/qa/package-offline.py` : démarrage depuis un sous-dossier FTP, six illustrations mises en cache, configuration et parcours de 50 activités utilisables hors connexion.
- Vérification complémentaire : commandes de l’éditeur personnalisé accessibles pour les six instruments en 320×568, 844×390 et 280×320 ; repère de corde visible et réponse correcte acceptée dans un exercice B3.
- Archive FTP comparée au contenu du dossier `dist/`, fichiers déposables sans outil de compilation.

Les tests automatisés d’audio ne remplacent pas une comparaison humaine avec le morceau. Les sources, adaptations et demandes musicales non achevées sont détaillées dans [l’audit](audit-musical.md).

## Captures

- [Choix de l’instrument](configuration-instrument.png)
- [Choix des noms de notes](configuration-notation.png)
- [Repères fixes et pastilles de notes](tutoriel-reperes.png)
- [Rappel de l’accordage](premiere-consigne.png)
- [Corde demandée pendant le jeu](corde-demandee.png)
- [Recto d’un succès](succes-recto.png)
- [Verso et critère de déblocage](succes-verso.png)
- [Mise à jour facultative](mise-a-jour.png)

## À vérifier sur les appareils et l’hébergement réels

- iPhone/Safari : activation audio avec le mode silencieux matériel, interruption par une autre application, reprise, écran verrouillé et installation via le menu de partage. Le matériel iPhone n’était pas disponible dans cet environnement.
- o2switch : effectuer le premier transfert, ouvrir la nouvelle URL et vérifier une progression réelle ; confirmer aussi la réception d’un signalement de bug. Aucun courriel réel n’a été envoyé lors de cette recette.
- Chant d’Immigrant Song : transcription et comparaison audio encore à terminer.
- Come As You Are : décision attendue sur la version standard transposée dans le mélange F♯ ou le maintien strict de la tonalité originale pour l’extrait.
