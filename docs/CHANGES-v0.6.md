# v0.6 — Manche agrandi et jeu plus fluide

Cette version applique les retours sur la v0.5. Le pilote pédagogique reste limité à la zone 0–4 ; aucun atelier d’altérations n’est ajouté.

## Affichage des exercices

- La roue conserve la même position et la même taille lorsqu’un commentaire de correction apparaît. Le commentaire dispose d’un emplacement réservé.
- Le jeu occupe la hauteur visible du navigateur, avec des panneaux bornés par le viewport. Portrait : manche puis réponses. Paysage : deux panneaux de même hauteur ; sur un paysage court, la roue et son commentaire se répartissent à l’intérieur du panneau de réponses.
- Les contenus longs défilent **dans leur panneau**, plutôt que de pousser les réponses sous l’écran. Sur une fenêtre exceptionnellement petite, un défilement interne reste nécessaire pour conserver des cibles tactiles de 44 px.
- Les boutons non disponibles sont explicitement gris, notamment « J’essaie sans les noms ». Leur couleur revient lorsqu’ils sont utilisables.
- Mauvaise réponse en rouge, bonne réponse en vert, sur la roue et dans les boutons accessibles ; une recherche incorrecte sur le manche montre aussi les deux positions lorsqu’elles sont dans la portion dessinée.

## Manche et orientation des cordes

- Le zoom utilise toute la hauteur disponible dans le panneau, quitte à nécessiter un déplacement horizontal. Les proportions des cases restent calculées selon le tempérament égal.
- Le fondu commence à la fin de la dernière case utile et s’achève **deux cases plus loin**. Les activités à vide n’affichent plus inutilement un long manche.
- Cordes et frettes épaissies ; le sillet est encore plus épais.
- Les commandes de déplacement et les boutons accessibles restent disponibles pour toutes les tâches demandant de choisir une position : découverte, recherche, motif et familles.
- L’alternative par boutons peut rester ouverte pendant une correction. Elle dispose de son propre défilement lorsque toutes les cordes ne tiennent pas en hauteur.
- Corde 1 en haut dans les boutons de réponse et les tableaux de progression, puis les autres cordes jusqu’à la plus grave en bas. Les anciennes statistiques suivent aussi cet ordre.
- Une recherche de note ne place plus le focus sur une case du manche : aucun emplacement n’est présélectionné. Les aides demandées explicitement et les corrections restent distinctes.
- Les motifs indiquent simplement « Corde 6 », par exemple. Une autre position de même hauteur reste acceptée, comme l’indique la consigne générale.

## Rythme et contenu

- Décompte 3–2–1 de **500 ms par chiffre**, soit environ 1,5 seconde au total, exclu du temps de réponse.
- Réponse juste : correction visible puis question suivante après **500 ms**, sans clic supplémentaire. Une erreur attend toujours « Continuer » pour laisser le temps de comprendre.
- La pause suspend aussi le passage automatique. Elle floute et désature le jeu ; le bouton muet, le plein écran et les commandes de reprise restent accessibles dans le bandeau supérieur.
- Plein écran proposé dans les exercices et les paramètres, avec une explication si l’API n’est pas disponible dans le navigateur. Le plein écran dépend des capacités du navigateur ; installer la PWA reste une autre façon d’ouvrir l’application depuis l’écran d’accueil.
- **Suppression des autoévaluations** : aucun questionnaire instrumental, aucune note déclarative à saisir, aucun écran intermédiaire après le motif. On termine la séquence puis on consulte son résultat.
- Deux blocs de questions dans une même activité : d’abord nommer les positions, puis retrouver ces mêmes positions. Les questions sont mélangées à l’intérieur de chaque bloc ; une position conserve bien son pendant dans l’autre sens.
- Une erreur peut recevoir un nouvel essai après deux autres questions **du même type**, lorsqu’il en reste suffisamment. Elle rejoint aussi la liste de reprise manuelle. La première réponse reste conservée.
- Le diagnostic avancé utilise désormais la roue, avec **sept notes naturelles**, sans saisie manuelle. Les positions et l’ordre des familles de notes sont mélangés. La roue reste un format à choix : ses résultats ne sont plus présentés comme un test de production écrite du nom.
- L’exception déjà validée pour les noms réels des cordes altérées d’un accordage demeure limitée au préambule. La roue naturelle n’est pas étendue à douze notes.

## Aperçus

[Correction avec roue immobile et couleurs rouge/vert](pilote-v0.6/correction.png) · [Pause et commandes accessibles](pilote-v0.6/pause.png).

## Historique et reprise

Les anciens résultats et exports restent lisibles. Une séance v0.5 en cours conserve sa question actuelle et ses réponses déjà données ; les questions restantes sont regroupées par type. Un ancien écran d’autoévaluation conduit directement au résultat lors de la reprise. Les anciennes déclarations éventuellement présentes dans un fichier de sauvegarde restent conservées comme données historiques, sans réapparaître dans l’interface.

## Vérifications

- **27 tests unitaires** : règles musicales et sauvegardes, regroupement des questions avec leurs pendants, mélange contrôlé et fondu limité exactement à deux cases.
- Recette Chromium sur sept dimensions, de 240 × 320 à 1280 × 720 : panneaux contenus dans l’écran, roue immobile pendant correction, tailles tactiles préservées et défilement interne de secours.
- Décompte observé à trois chiffres de 500 ms, passage automatique différé, interruption de ce passage en pause, bouton muet accessible pendant la pause et entrée/sortie du plein écran.
- Cordes 1 → 6 dans les tableaux, boutons accessibles et corrections rouge/vert, absence de case présélectionnée, diagnostic avec roue et ordre mélangé.
- Parcours complet des 11 activités six cordes, variantes sept cordes/DADGAD/Drop B, audio, import/export, conservation de l’historique et redémarrage hors ligne.

Les contrôles automatisés vérifient le comportement dans Chromium. Le confort tactile et le rendu sonore restent à essayer sur ton téléphone réel.

## Installation avec FileZilla

1. Exporter la progression depuis les paramètres de la version actuellement utilisée.
2. Télécharger [adh-pwa-v0.6.zip](../downloads/adh-pwa-v0.6.zip), puis le décompresser.
3. Déposer **le contenu du ZIP** dans `adh-pwa/v0.6/` sur `media.lecompositeur.com`.
4. Fermer les anciens onglets, puis ouvrir **https://media.lecompositeur.com/adh-pwa/v0.6/**.

Les données locales restent accessibles sur le même sous-domaine et dans le même navigateur. Ne pas effacer les données du site pour actualiser. Cette livraison ne dépose aucun fichier sur l’hébergement o2switch.
