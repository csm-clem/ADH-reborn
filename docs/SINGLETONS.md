# Singletons : décisions proposées — v0.16

Un Singleton garantit une instance partagée. En JavaScript, un objet exporté par un module peut déjà remplir ce rôle ; une classe avec `getInstance()` n’est pas nécessaire. Il convient surtout à une ressource unique ou à des règles immuables. Il ne corrige pas, à lui seul, un défaut de styles ou de rendu.

| Cas dans cette PWA | Recommandation | État / décision attendue |
|---|---|---|
| Règles d’affichage des démonstrations | Un objet immuable partagé : cible verte nommée, aucun point d’appui supplémentaire | **Implémenté**, explicitement demandé : `DEMO_RULES` dans `demo-rules.js` |
| Audio : contexte, cache de sons, sources en cours, annulation des séquences | Extraire le moteur actuel dans un service unique injecté aux vues | **Recommandé ensuite**, à valider. Ces ressources sont déjà uniques dans `app.js` ; pas de nouvelle classe créée ici |
| Sauvegardes, import/export et erreurs de stockage | Un service unique de stockage, injecté dans les contrôleurs | **Recommandé ensuite**, à valider ; conserver les données distinctes de chaque profil |
| Préférences : thème, notation, son | Un magasin partagé avec abonnements explicites, associé au service de stockage | Utile avec la croissance ; aujourd’hui `state` est déjà partagé. Éviter un second état concurrent |
| Observateur du thème système et plein écran | Une seule souscription / un service de plateforme avec nettoyage | Optionnel ; centralisation du cycle de vie suffisante |
| Règles pédagogiques, palettes, géométrie et catalogue d’instruments | Modules purs et constantes immuables | **Pas de Singleton mutable** : leur centralisation existe déjà et suffit |
| Composants visuels, boutons, manche, rendu DOM | Fonctions et styles partagés | **Pas de Singleton** : chaque vue doit pouvoir avoir plusieurs exemplaires. Le flash est corrigé par la conservation du DOM |
| Compteur de temps | Une horloge par fonction / séance, testable et indépendante | **Éviter un Singleton global** : préparation et temps de réponse ne doivent pas se contaminer |
| Séance, questionnaire, profil et résultats | Instances/données séparées, passées explicitement | **Éviter** : un état global caché risquerait de mélanger instruments et tentatives |
| Chargement des ressources et cache | Cache borné partagé derrière le service concerné | Pertinent pour l’audio ; pas besoin d’un gestionnaire universel |
| Bus d’événements / routeur | Routage simple et callbacks explicites tant que cela suffit | Ne pas ajouter de bus global sans besoin concret : dépendances difficiles à retracer |
| Service worker | Cycle de vie géré par le navigateur | Aucun Singleton applicatif à ajouter |
| Future connexion / synchronisation (phase 8) | Client d’API partagé ; données isolées par compte et session | À concevoir lors de cette phase, sans figer maintenant un état global d’utilisateur |

**Choix proposé :** valider ensuite l’extraction du moteur audio, puis du stockage/préférences. Ne pas transformer systématiquement les modules en Singletons. Seules les règles de démonstration sont refactorées ainsi dans cette livraison.
