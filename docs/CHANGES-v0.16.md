# Daily Fretboard Trainer — v0.16

## Manche stable et jeu

Le rendu ne remplace plus tout le contenu HTML à chaque toucher : `dom-view.js` réconcilie les éléments par clés. Le SVG, les cordes et les cibles tactiles restent en place, avec leurs dimensions calculées. Les pastilles entrent par un pop bref et élastique ; les corrections sortent en grossissant et en s’effaçant. Les effets peuvent se superposer sans bloquer la question suivante. Le ripple de toucher est supprimé. En cas d’erreur, seul le nom attendu apparaît sur le manche, dans une couleur neutre.

Les cordes sont espacées davantage uniquement dans le manche de jeu. Les mini-schémas conservent leur géométrie. Les notes naturelles occupent l’anneau extérieur de la roue ; les cinq altérations possibles sont à l’intérieur, dans leurs intervalles réels. Aucun emplacement supplémentaire entre E/F ou B/C, aucun texte au centre.

## Démonstrations et pédagogie

Un objet de règles immuable, `DEMO_RULES`, partagé par toutes les démonstrations, montre la cible en vert avec son nom. Le point d’appui des intervalles n’est pas affiché. Les cordes à vide peuvent toutes être illustrées : ce ne sont pas des points d’appui supplémentaires. Les exemples « Quelle est cette note ? » incluent bien la réponse attendue dans la roue. Les noms restent visibles avant l’étape « sans les noms ».

Le terme est désormais « sillet », avec une définition à sa première présentation : « la barre verticale épaisse ». Les boutons « À moi d’essayer » sont centrés sous le contenu de la leçon. Les boutons de pause sont espacés.

Si la note la plus grave à vide est altérée, la référence du parcours naturel devient sa voisine **case 1 sur cette même corde**. L’accordage réel ne change jamais. Le préambule continue à nommer les cordes altérées. Cela ouvre notamment le parcours de la guitare huit cordes en F♯, avec G comme référence naturelle.

## Interface

Les boutons de navigation gardent le composant partagé en pilule. Les étiquettes, boutons de positions et cellules de progrès utilisent des rectangles arrondis. La carte des progrès passe sur une surface neutre, avec pourcentages, compteurs et détails à la demande. Les boutons de position restent ouverts tant que l’élève ne les masque pas. Sur un écran très court, leur panneau peut défiler pour conserver de vraies cibles tactiles.

Le thème **Contraste renforcé** s’ajoute à Claire, Sombre et Selon l’appareil : texte sombre sur fond clair, contours plus présents, focus et symboles complémentaires. Il ne s’agit pas d’une certification d’accessibilité. Le choix de la nouvelle couleur du manche courant attend ton avis : [six maquettes](v0.16/choix-couleurs.png).

Les principes et les sources consultées sont dans la [revue UX](UX-REVUE-v0.16.md). La position relative questions/réponses reste conservée.

## Temps moyen et musique

Le calcul passe de la médiane à la **moyenne arithmétique** pour le résultat, les étoiles, les comparaisons de records et le partage. Seules les premières réponses correctes chronométrables sans aide servent au temps affiché. Cinq étoiles exigent toujours 100 % et désormais une moyenne ≤ 1 s, sans aide. Une réponse lente pèse donc davantage. Le record reste limité au même exercice et à la même configuration d’instrument.

Les fiches des exercices « retrouver » avec extrait connu proposent une phrase accompagnée à écouter, interrompable et respectant Muet. Les phrases développées sont distinctes des petits extraits contraints de l’entraînement. Certaines cellules modernes restent des arrangements courts ; les étendues exactes et les sources sont détaillées dans [Récompenses musicales](RECOMPENSES-MUSICALES.md). Ce ne sont pas des enregistrements des œuvres.

## Architecture à décider

Les règles de démonstration sont le seul nouveau Singleton introduit ici, sous forme d’un export de module immuable. [L’inventaire](SINGLETONS.md) recommande ensuite d’extraire les services audio et stockage/préférences, sans rendre globaux les séances ni les chronomètres. Ces refactorisations supplémentaires attendent ton choix.

## Vérification

- 72 tests Node et vérification syntaxique.
- Parcours standard : 22 activités terminées, au moins 20 questions chacune, résultats et suite accessibles, aucune erreur JavaScript.
- Onboarding : six instruments × huit formats, commandes accessibles et absence de défilement global.
- Manche : six instruments × cinq formats ; cellules et axes cadrés.
- Réponses rapides : conservation du même SVG et des mêmes cibles, dimensions stables, roue active, boutons persistants, double roue et démonstration nommée.
- Fiche de résultat : six formats, commandes visibles ; écoute en icône sur très petit écran.
- Écoute accompagnée : 43 événements Web Audio programmés, arrêt fonctionnel, aucune erreur JavaScript.
- Sous-dossier FTP : ressources et six images en cache, démarrage hors connexion.

Ces essais Chromium ne remplacent pas les retours tactiles sur les appareils réels, l’écoute sur leurs haut-parleurs ou une étude d’accessibilité avec des utilisateurs concernés.

## Installation

Décompresser [le ZIP](../downloads/daily-fretboard-trainer-v0.16.zip) et déposer **son contenu** dans `adh-pwa/v0.16/`, puis ouvrir `https://media.lecompositeur.com/adh-pwa/v0.16/`. Le dépôt GitHub n’installe pas automatiquement les fichiers sur o2switch. Comme convenu en v0, la progression des versions précédentes est retirée ; l’instrument et les préférences sont conservés.
