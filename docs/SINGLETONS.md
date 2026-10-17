# Services uniques : décisions appliquées — v0.17

L’accord donné pour appliquer les conseils de cet inventaire est pris en compte. Les ressources communes sont extraites en **services uniques de modules**, injectés aux contrôleurs. Aucune classe `getInstance()` n’est nécessaire : JavaScript réutilise le même export de module. Chaque service expose une fabrique pour les tests isolés ; l’application utilise une seule instance exportée.

| Cas | Décision et réalisation |
|---|---|
| Règles d’affichage des démonstrations | `DEMO_RULES`, objet immuable partagé, conservé depuis la v0.16 |
| Moteur audio | **Implémenté** dans `services/audio-service.js` : un contexte Web Audio créé à la première interaction, cache borné à 128 sons, sources actives, lecture de notes, séquences, accompagnements et annulation. Les notes de gameplay continuent à résonner lors du toucher suivant |
| Sauvegardes et import/export | **Implémenté** dans `services/storage-service.js` : accès navigateur centralisé, validation des sauvegardes, protection d’un historique illisible, signalement des erreurs, import des deux ensembles de données avec restauration en cas d’échec d’écriture |
| Préférences partagées | **Implémenté** dans `services/app-store.js` : source unique, instantanés immuables et abonnements explicites. Son, notation, thème, instrument et préférence des boutons sont lus depuis ce magasin. Aucun second état global concurrent |
| Thème système, plein écran et événements navigateur | **Implémenté** dans `services/platform-service.js` : une seule souscription à chaque événement, connexion remplaçable avec nettoyage, suivi du thème système, redimensionnement temporisé, visibilité, plein écran et invitation d’installation |
| Règles pédagogiques, instruments et géométrie | Fonctions pures et catalogues partagés conservés ; aucun Singleton mutable ajouté |
| Composants visuels et rendu | Fonctions et styles partagés ; plusieurs vues peuvent coexister. Pas de Singleton de composant |
| Chronomètres | **Restent indépendants** : une horloge de réponse et une de préparation par contrôleur. Aucun chronomètre global |
| Séances, profils et résultats | **Restent séparés** dans chaque contrôleur et par clé d’instrument/accordage. Le service de stockage ne devient pas une séance globale |
| Cache | Rattaché au service propriétaire, borné pour l’audio ; pas de gestionnaire universel |
| Bus d’événements / routeur | Pas de bus global ajouté. Abonnements explicites limités aux préférences et au statut de stockage |
| Service worker | Cycle de vie du navigateur conservé ; les nouveaux fichiers sont dans le cache hors connexion |
| Connexion et synchronisation | Toujours en phase 8 : futur client partagé, données isolées par compte ; aucun état global d’authentification prématuré |

## Conséquences concrètes

- Les vues ne créent plus leur moteur audio ou leurs accès à `localStorage`.
- Changer de son, couper le son ou quitter un écran arrête les lectures concernées ; des réponses successives peuvent toujours se superposer musicalement.
- Modifier une préférence produit une mise à jour explicite ; les consommateurs lisent le même instantané. Le thème système suit l’appareil tant que cette option est sélectionnée.
- Un historique illisible est protégé contre une sauvegarde automatique par-dessus. Un import validé constitue son remplacement explicite.
- L’import valide tout avant d’écrire. En cas d’échec, il tente de restaurer les deux anciennes valeurs ; si le stockage refuse aussi cette restauration, le message le dit. Le stockage navigateur n’offre pas de transaction native entre deux clés.
- Les écouteurs du navigateur peuvent être déconnectés, et une reconnexion remplace les précédents : pas de duplication cachée des actions.

Les tests couvrent notamment le contexte audio unique et les résonances, l’annulation pendant le déblocage audio, les sauvegardes corrompues, les échecs d’écriture, l’immutabilité des préférences et le nettoyage des événements.
