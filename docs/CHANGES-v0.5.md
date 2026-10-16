# v0.5 — Rapport de phase 3 : pilote pédagogique actif

Livraison du 16 octobre 2026. Cette version met en œuvre la **tranche pilote**, adaptée au parcours par intervalles validé après les phases 1 et 2. Elle ne constitue pas encore la production exhaustive du parcours naturel ni la phase 4 de révisions automatisées.

## Décisions retenues

- **Cordes à vide ensemble**, puis relations musicales entre cordes : pas de succession de chapitres consacrés chacun à une seule corde.
- **Sept choix naturels** dans la roue. L’atelier d’altérations, y compris F♯, est entièrement reporté selon votre réponse.
- Si l’accordage contient déjà des cordes F♯ ou C♯, un **préambule limité aux noms réels de cet accordage** explique cette exception. Sa palette contient seulement les noms présents à vide ; elle n’introduit pas une roue chromatique. Le parcours naturel reprend ensuite.
- La référence est la **hauteur réellement la plus grave**, même dans un accordage réentrant. Les numéros physiques des cordes restent ceux de l’instrument.
- Ordre des liens : quinte, quarte, tierce, seconde, octave, septième, sixte. Les qualités sont calculées depuis les notes naturelles disponibles, jamais copiées depuis un modèle majeur universel.
- Une activité terminée débloque la suivante. Le résultat est nommé **« travaillé »**, sans obligation de rapidité et sans affirmation de consolidation. Les étoiles restent un défi facultatif ; cinq étoiles demandent 100 % de premières réponses correctes sans aide demandée et une médiane ≤ 1 seconde.

Ces choix permettent de tester l’action, le plaisir des relations et la compréhension des consignes avant de multiplier les contenus. Leur efficacité pédagogique et la durée confortable restent à observer avec des utilisateurs.

## Ce qui est jouable

Sur guitare six cordes standard, le pilote comprend **11 activités** :

1. Exploration et reconnaissance des six cordes à vide.
2. Quinte juste : Mi–Si.
3. Quarte juste : Mi–La.
4. Tierce mineure : Mi–Sol.
5. Seconde mineure : Mi–Fa.
6. Octave : Mi–Mi.
7. Septième mineure : Mi–Ré.
8. Sixte mineure : Mi–Do.
9. Transfert des repères entre les deux cordes de Mi, en expliquant leurs deux octaves d’écart.
10. Rappel des repères graves dans les deux sens, sans indice ni son cible avant la réponse.
11. Petite phrase depuis les noms : Mi–Sol–Si–La–Mi.

Le nombre et les emplacements changent avec l’accordage. L’étape de transfert est générée une fois par famille de cordes portant le même nom ; elle distingue les unissons des octaves.

Chaque découverte demande une action : explorer les départs à vide, ou chercher un repère avant de montrer la démonstration. Un diagramme, une légende lisible et un modèle sonore accompagnent la relation. L’entraînement mélange les positions et les deux sens de réponse, puis propose une suite de notes à jouer sur le manche tactile. La petite application sur guitare peut être déclarée ensuite ou passée en mode téléphone seul.

## Couverture de la phase 3

| Tâche | Réalisation et adaptation |
| --- | --- |
| ADH-07 — Micro-leçon active | Exploration/prédiction, démonstration vectorielle et sonore, essai sans noms, entraînement mélangé, motif et correction. |
| ADH-08 — Tranche pilote | Remplacement du pilote Mi/La figé par les cordes réelles, les sept relations demandées et les transferts disponibles. Atelier F♯ reporté par décision utilisateur. |
| ADH-09 — Réponses | Position → nom, nom → position sur une corde, recherche libre acceptant toutes les occurrences admissibles. Saisie du nom dans les bilans ; recherche des familles complètes dans le diagnostic facultatif. |
| ADH-10 — Instrument | Suite de noms à jouer et nommer, modèle sonore, aide aux premiers gestes, autoévaluation séparée : notes, continuité, hésitation, geste, support. Mode téléphone sans guitare. |
| ADH-11 — Corrections | Bonne position montrée et explication selon le cas : voisin d’une case, mauvaise corde, bon nom hors de la consigne, registre incorrect dans un motif. Signalement d’un mauvais toucher sans effacer l’erreur initiale. Les corrections d’altérations attendent leur futur atelier. |

Les positions d’une activité sont sollicitées dans les deux sens. Les recherches libres créditent **la position effectivement choisie** ; elles ne créditent pas artificiellement celle qui servait à générer la question. Pour les cordes à vide, la recherche ne donne pas le numéro de corde qui révélerait déjà la réponse et accepte les deux Mi ouverts.

Après une erreur d’entraînement, un nouvel essai est placé après deux autres questions s’il reste assez de questions. La première réponse reste fausse dans le score. Le repère rejoint aussi une liste de reprise manuelle ultérieure. Il n’existe ni boucle infinie d’erreurs, ni calendrier automatique de révision dans cette livraison.

## Adaptation aux instruments : cas vérifiés

| Configuration | Comportement |
| --- | --- |
| EADGBE | Mi grave comme référence ; 18 positions naturelles dans la zone ; une famille de deux cordes de Mi. |
| BEADGBE | Si grave comme référence ; Si–Fa est une **quinte diminuée**, explicitement expliquée. |
| DADGAD | La quarte Ré–Sol utilise Ré3–Sol3 : Sol2 est absent de la zone 0–4. Le changement de registre est annoncé. Familles de Ré et de La générées séparément. |
| B–F♯–B–E–A–C♯–F♯ | Préambule explicite sur les cordes altérées ; retour aux notes naturelles. Relations déplacées vers un registre disponible lorsque nécessaire. |
| Accordage réentrant | Recherche de la hauteur minimale réelle, sans assimiler automatiquement le bas du diagramme à la tonique. |
| Tonique altérée, par exemple guitare huit cordes standard en F♯ | Cordes à vide accessibles, mais pilote d’intervalles naturels annoncé incompatible : une tonique F♯ ne peut pas appartenir aux sept notes naturelles. Aucune substitution silencieuse. Le parcours précédent reste accessible. |
| Note ou relation absente entre 0 et 4 | Lien indisponible signalé ; aucune case supplémentaire ajoutée en silence. |

Le pilote sait donc adapter ses calculs, tout en annonçant les configurations dont toutes les contraintes ne peuvent pas être satisfaites ensemble.

## Mesure et sauvegardes

- Historique précédent conservé et accessible via « Ouvrir le parcours précédent ». Ses étoiles ne deviennent pas des preuves de maîtrise du nouveau parcours.
- Stockage du pilote distinct, par instrument et accordage. Export JSON commun aux deux historiques ; validation des deux avant toute restauration.
- Reprise d’une séance avec ses premières réponses, correction en cours, aides demandées et temps actif conservés. Le décompte, la pause et les gestes de déplacement sont exclus du chrono.
- Résultats **nommer** et **retrouver** séparés ; reprise après erreur identifiée. Les demandes d’indice et de réécoute sont enregistrées.
- Le son cible automatique reste une aide d’entraînement enregistrée séparément. « Sans aide demandée » ne signifie donc pas « bilan sans aide ». Seuls les bilans retirent ce son et les indices avant réponse ; leurs temps ne sont pas mélangés avec une prétendue mesure de rappel visuel autonome.
- Essais sur guitare déclaratifs ; aucune reconnaissance sonore ni note de jeu instrumental automatique.
- Une sauvegarde locale illisible n’est pas écrasée par un nouveau pilote. Un export permet de récupérer les nouveaux résultats restés en mémoire.

## Interface et audio

Conservation du manche horizontal dans les deux orientations, bois clair et frettes grises. Paysage : deux panneaux de même hauteur ; portrait : manche puis consigne/réponses. Déplacement horizontal lorsque nécessaire, palette circulaire naturelle, commande muet et alternative de réponse par boutons accessibles.

Le démarrage conserve le décompte automatique de trois secondes et déverrouille Web Audio pendant le geste de départ. Les motifs réutilisent le timbre de corde pincée ; la mise en pause ou en mode muet annule aussi les notes programmées. Navigation au clavier des réponses et du manche, focalisation de la commande suivante après réponse.

## Aperçus du pilote

Captures Chromium, données de recette : [découverte des cordes à vide](pilote-v0.5/cordes-a-vide.png), [quinte en paysage](pilote-v0.5/quinte-paysage.png), [résultat d’une activité](pilote-v0.5/resultat.png).

## Limites assumées avant la suite

Le pilote **n’enseigne pas encore toutes les positions naturelles** des cordes intermédiaires et aiguës. Le transfert des cordes équivalentes est jouable ; la production complète des autres repères aigus et des chapitres de familles reste à réaliser après vos retours. Le diagnostic facultatif sait déjà examiner toute la carte naturelle, dans les deux sens, puis toutes les occurrences de chaque nom disponible : il teste des prérequis, il ne les enseigne pas à un débutant.

Le nombre de questions est borné, calculé depuis les positions de l’activité ; ce n’est pas encore un moteur adaptatif calibré par essais utilisateurs. Le rappel différé automatique, la validation après un délai réel, la détection microphone et les paiements sont hors de cette phase. Aucun progrès sur une activité terminée n’est étiqueté « consolidé ».

## Vérification technique

- **26 tests unitaires**, dont 10 nouveaux : hauteurs, qualités d’intervalles, zone et couverture des tâches, réponses admissibles, corrections, notation, séparation des résultats et validation des sauvegardes.
- Vérification syntaxique des scripts JavaScript.
- Chromium : parcours complet des 11 activités six cordes, erreur puis reprise sans doublon après rechargement, aides et chrono conservés, diagnostic avec 36 questions et sept familles, cas sept cordes/DADGAD/Drop B, colonnes égales, absence de débordement sur écrans de 320 à 1280 px, redémarrage hors ligne.
- Import/export des deux historiques, refus d’un import incohérent sans mutation, préservation d’un stockage local illisible, commandes clavier, audio actif non silencieux et mode muet.

Ces contrôles vérifient le fonctionnement. Ils ne remplacent pas un essai sur téléphone réel ni une validation de l’apprentissage ou de l’agrément sonore.

Les scripts reproductibles et leurs prérequis sont dans [tools/qa/README.md](../tools/qa/README.md).

## Installation par FileZilla

1. Exporter votre progression depuis les paramètres de la version utilisée.
2. Télécharger et décompresser [adh-pwa-v0.5.zip](../downloads/adh-pwa-v0.5.zip).
3. Copier **son contenu** dans le dossier `adh-pwa/v0.5/` du sous-domaine `media.lecompositeur.com`.
4. Fermer les anciens onglets et ouvrir **https://media.lecompositeur.com/adh-pwa/v0.5/**.
5. Vérifier le son, le mute, une pause et une reprise ; attendre le service worker, recharger une fois, puis essayer hors ligne.

Le ZIP contient le site compilé pour cet hébergement statique : aucun outil de développement à envoyer. Sur le même sous-domaine et le même navigateur, les données locales antérieures restent disponibles. Ne pas effacer les données du site pour actualiser. Aucun fichier n’a été envoyé sur votre serveur par cette livraison.

## Retours utiles pour valider le pilote

- Dans les cordes à vide, comprenez-vous immédiatement où toucher et pourquoi deux réponses Mi sont possibles ?
- La première relation Mi–Si vous paraît-elle plus musicale et engageante que les anciens exercices ?
- Les changements de consigne « une corde précise » / « une position au choix » sont-ils suffisamment visibles ?
- Pouvez-vous expliquer la relation sans relire la démonstration ? Le nombre de questions entretient-il le jeu ou devient-il répétitif ?
- Le passage au bilan avec nom à saisir est-il compréhensible ? Après une pause, retrouvez-vous les repères sans aide ?
- Sur guitare, la suite est-elle jouable et l’autoévaluation assez simple ? Indiquer le modèle de téléphone, l’accordage et l’activité pour tout blocage.

La prochaine décision porte sur ce format actif et son rythme. Elle précède la production exhaustive des repères aigus, des familles enseignées et du système de révisions.
