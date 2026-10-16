# Daily Fretboard Trainer — v0.8

Cette livraison reprend les retours de jeu sur le cadrage, les questions, les résultats et la configuration initiale. Elle conserve le pilote musical, sans ajouter de nouvelle phase pédagogique.

## Identité et versions de test

Le nom **Daily Fretboard Trainer** apparaît dans l’accueil, la navigation, les paramètres, le titre du navigateur, la fiche PWA et les exports. Le nom court de l’icône installée est « Daily Fretboard ». Le dépôt et l’adresse d’hébergement conservent leurs chemins existants.

Les anciens historiques locaux de cette application sont supprimés au premier chargement de la v0.8. L’instrument, son accordage, la notation, le son et le thème sont conservés. Les anciennes statistiques et les anciens déblocages ne sont pas importés.

Chaque version v0 possède désormais son propre espace de progression. Une réouverture de la même version conserve la séance ; une nouvelle version démarre un parcours vide. Les sauvegardes d’une autre version v0 sont refusées avec une explication. La transition vers les versions stables prévoit un espace commun, afin que les mises à jour v1 n’effacent pas l’avancée ; les futures modifications de schéma devront disposer de migrations compatibles.

Le parcours historique a été retiré du code actif. Les anciens ZIP applicatifs sont retirés de la branche courante. Les dossiers de conception et l’historique Git demeurent des références ; les fichiers déjà déposés sur le serveur ne sont pas supprimés à distance.

## Un manche entièrement visible

Le diagramme s’adapte à la largeur **et** à la hauteur disponibles. Il n’impose plus de zoom minimal qui déborde du panneau. Les flèches et le geste de glissement sont retirés de cette position : toutes les cases utiles de chaque question sont visibles.

Les proportions des cases restent calculées avec le tempérament égal. Le fondu occupe toujours deux cases après la dernière case utile. Les marges du bois autour des cordes extrêmes sont réduites ; les numéros des cordes et des cases restent en dehors des zones de réponse. Le sillet et les frettes gardent leurs épaisseurs distinctes.

Les panneaux sont côte à côte et de même hauteur en paysage, empilés en portrait. Le manche reste horizontal. Sur une fenêtre très étroite, les boutons accessibles restent l’alternative aux petits espacements physiques entre cordes.

## Découverte et explications

- Dans la découverte des cordes à vide, une réponse valide fait apparaître en vert tous les départs valides. L’exploration de chaque corde reste comptée séparément.
- Après une réponse de dénomination, tous les emplacements admissibles présents dans la leçon sont indiqués en vert ; pour une recherche de hauteur, les contraintes de corde et d’octave sont respectées.
- Les légendes de positions apparaissent **après le premier essai**, jamais comme une liste de réponses avant la recherche. Les boutons de démonstration et de démarrage restent grisés tant que leur condition n’est pas remplie.
- Les repères de contexte sont bleu-gris ; le vert marque les réponses correctes et le rouge une mauvaise réponse.
- La quinte de Mi vers Si ne réintroduit plus les autres cordes connues. Son groupe de questions porte seulement sur **E2 et B2** : le Ré provenait de cet ajout automatique de contexte.

Les explications d’intervalles indiquent désormais les deux hauteurs et leurs cordes. Elles relient l’écart entendu aux positions montrées sur le diagramme.

La leçon **« La carte de E, d’une corde à l’autre »** précise : cordes **6 et 1**, toutes deux en Mi à vide, **E2 et E4**, donc deux octaves d’écart. À case égale, le nom reste identique. Après le premier essai, le diagramme relie ces correspondances. Le modèle musical reprend le même motif naturel sur la corde grave puis sur la corde aiguë ; le jeu vérifie la corde indiquée, même si un autre emplacement porte le même nom.

Ce mécanisme dépend de l’accordage réel : il ne suppose pas que les deux cordes de Mi existent sur tous les instruments.

## Des séries utilisables pour observer les progrès

Chaque activité contient au moins **20 questions**, sans compter la découverte et la séquence musicale. Chaque position enseignée revient au moins **trois fois dans chaque sens** :

1. nommer une position affichée ;
2. retrouver la position demandée.

Les questions restent regroupées par sens. Chaque répétition est mélangée, sans répétition immédiate lorsque le groupe contient plus de deux positions. À deux positions, une répétition ponctuelle est permise afin de ne pas produire une alternance prévisible Mi–Si–Mi–Si ; trois demandes identiques ne se suivent pas.

| Activité en guitare six cordes standard | Questions initiales |
| --- | ---: |
| Cordes à vide | 36 |
| Chaque intervalle à deux positions | 20 |
| Correspondances entre les deux cordes de Mi | 36 |
| Bilan des repères graves | 48 |
| Phrase musicale depuis les noms | 48 |
| Diagnostic naturel complet, facultatif | 108 |

Les mauvaises réponses peuvent susciter des reprises espacées dans le même bloc. Elles sont identifiées et n’augmentent pas artificiellement le nombre de premières réponses correctes. Ce nombre de répétitions rend les statistiques moins anecdotiques ; il ne prouve pas, à lui seul, une acquisition durable.

Les recherches indiquent la hauteur scientifique : **« Trouvez E3. Sur la corde 4. »** Les cordes à vide demandent également une hauteur précise, évitant de valider E4 lorsqu’E2 est demandé. Les mentions répétées « cases 0 à 4 » sont retirées des consignes ; la position reste affichée sous le manche.

## Résultats et déblocage

Le seuil conservé est **90 % de premières réponses correctes**, arrondi au nombre entier supérieur. Il faut aussi terminer la série. Par exemple : 18/20, ou 33/36. Aucune vitesse n’est requise pour avancer.

- Activité validée : bouton principal **« Leçon suivante »** ; refaire et revenir au parcours sont secondaires.
- Activité non validée : bouton principal **« Refaire cette activité »** ; la leçon suivante reste verrouillée, même après les reprises correctives.
- Dernière activité : le bouton principal ramène au parcours.

Les étoiles restent un défi secondaire : cinq étoiles demandent 100 % et une médiane ≤ 1 seconde. Les barres de résultats passent sur plusieurs lignes si la série est longue, afin d’éviter un débordement du diagnostic sur téléphone.

## Préparation, pause et audio

Le compte chiffré est remplacé par une **roue qui se remplit dans le sens horaire en 1,5 seconde**, avec « À vous de jouer ». Son animation suit le chronomètre actif et s’interrompt en pause.

La pause applique un flou de **16 px** et une désaturation aux panneaux de jeu. Le haut de l’écran reste utilisable, notamment Muet et le plein écran. La bonne réponse conserve son passage automatique après **500 ms** ; une pause suspend cette temporisation.

Les modèles sont joués note après note, sans chevauchement : **420 ms** entre les départs des notes des exercices, **230 ms** pour écouter l’accordage dans l’onboarding. La note précédente s’éteint avant la suivante. Une action de jeu ou le passage en muet annule les sons encore programmés. Les séquences mélodiques finales sont conservées.

## Configuration et instruments

Les résumés horizontaux d’accordage se lisent **du grave vers l’aigu**. Dans l’éditeur vertical, les cordes restent rangées **corde 1 en haut**.

Les dessins vectoriels sont refaits avec des silhouettes, accastillages et nombres de cordes distincts :

| Configuration | Apparence de référence |
| --- | --- |
| Guitare 6 cordes | Double échancrure de type Stratocaster, trois micros et vibrato |
| Guitare 7 cordes | Type Soloist, corps anguleux et deux humbuckers |
| Guitare 8 cordes | Sans tête, silhouette ergonomique de type Hz8 |
| Basse 4 cordes | Type Fender, plaque de protection et tête à mécaniques en ligne |
| Basses 5 et 6 cordes | Type Ibanez, corps sculpté et deux micros larges |

Ce sont des illustrations originales en SVG, sans image externe, logo de fabricant ni fichier repris d’un autre logiciel. Elles illustrent la famille de l’instrument ; elles ne prétendent pas reproduire une référence commerciale à l’identique.

[Aperçu des instruments](v0.8/instruments.png) · [Accueil](v0.8/onboarding.png) · [Transfert entre cordes](v0.8/transfer.png) · [Résultats](v0.8/result.png).

## Vérifications et limites

- **38 tests unitaires** : calculs musicaux, accordages, répétitions par direction, échantillon minimal, seuil de passage, correspondances, sauvegardes, politique des versions, géométrie, synthèse, dessins et ressources PWA.
- Recette Chromium : les onze activités standard terminées via l’interface ; bonne transition après réussite, verrouillage après échec, reprises après erreur, conservation des aides, export/import et redémarrage hors ligne.
- Géométrie : six instruments, cinq tailles pour la position entière ; panneaux et roue contrôlés sur sept tailles, jusqu’à 240 × 320.
- Onboarding : six instruments et huit formats, préréglages, toutes les vues de réglage, ordre des cordes, modifications sonores et enregistrement exact.
- Audio : contexte actif, buffers non silencieux, programmation séquentielle sans chevauchement, son de la première question et interruption par Muet.
- Variantes : sept cordes, DADGAD, préambule des cordes altérées, transfert de Mi et diagnostic complet avec familles.

Ces vérifications techniques ne remplacent pas l’écoute sur un téléphone réel ni une étude de l’apprentissage. Les limites pédagogiques du pilote restent celles déjà annoncées : carte naturelle complète à poursuivre, tonique altérée limitée aux cordes à vide, ateliers d’altérations reportés, pas de microphone ni de révisions différées automatisées.

## Installation avec FileZilla

1. Télécharger [daily-fretboard-trainer-v0.8.zip](../downloads/daily-fretboard-trainer-v0.8.zip).
2. Décompresser le ZIP puis copier **son contenu** dans `adh-pwa/v0.8/` sur `media.lecompositeur.com`.
3. Ouvrir **https://media.lecompositeur.com/adh-pwa/v0.8/**.

Le premier chargement supprime les anciens parcours locaux de cette application, conformément au choix de remettre les v0 à zéro. Le dossier FTP n’a pas été modifié automatiquement. Les anciennes adresses déjà présentes sur le serveur doivent être retirées avec FileZilla si elles ne doivent plus être accessibles.
