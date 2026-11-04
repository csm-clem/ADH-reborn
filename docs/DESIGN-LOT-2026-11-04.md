# DFT — lot de conception du 4 novembre 2026

État : travail local, sans publication. Les propositions précédentes 1 à 5 sont refusées. Les identifiants GD ci-dessous sont ceux de la nouvelle demande et remplacent les anciens identifiants d’audit homonymes.

## Trajectoire — historique dans Progrès

Trois courbes représentent les parties Arcade terminées : points totaux de la partie, plus longue série de notes d’affilée et temps moyen des bonnes réponses. Il ne s’agit ni d’un cumul de points à vie ni d’un record glissant : une moins bonne partie reste visible. Les séries sont séparées par mode, instrument, accordage et version de règles existante. Aucun changement du versionnement Arcade n’est ajouté dans ce lot.

Chaque point contient la date de fin, le mode, la version de règles et les trois mesures. Un résultat sans bonne réponse conserve un temps absent ; il n’est pas converti en zéro. Une interruption ou une relance sans partie terminée ne crée pas de point. Les courbes utilisent le temps réel en abscisse, un point unique reste visible, une mesure absente interrompt le tracé. Les valeurs exactes et dates sont accessibles dans un tableau. Conservation : 1 000 parties par configuration, export/import avec la sauvegarde, anciennes sauvegardes sans historique acceptées. Aucune reconstruction fictive à partir des meilleurs scores.

## GD-01 — les erreurs de découverte enseignent

Quand le joueur touche une mauvaise position, sa pastille et son nom réel avec octave apparaissent côte à côte. Le texte confirme la note touchée. Les bonnes positions encore inconnues ne sont pas mises en évidence. Les positions déjà trouvées restent visibles ; toucher une erreur ne fait pas avancer leur compteur. Cette exploration ne crée aucun événement évalué, aucune étoile et aucune preuve autonome. Les formats Nommer/Retrouver évalués gardent leurs contraintes de hauteur et de position.

## GD-02 — deux explorations complémentaires

### A. Avant un exercice

Sur « Nouvel exercice », le manche de la zone est explorable : toucher, clic ou clavier indiquent la note exacte sélectionnée, son numéro de corde et sa case. Le son suit le réglage partagé Muet. Les exemples initiaux restent des démonstrations ; la dernière sélection libre est nommée sur le diagramme. Aucun temps ni score de l’exercice ne démarre avant « À moi d’essayer ». Un essai libre ne valide pas la découverte évaluée ou la couverture autonome. Les exemples mélodiques conservent leurs commandes d’écoute.

Le manche reste limité à la zone de l’activité ; l’exploration n’a aucune incidence sur l’ordre des questions. Si un exemple coïncide avec une question à évaluer, les mécanismes existants de séparation de démonstration et d’aide doivent conserver cette distinction.

### B. Explorer indépendant

Entrée : bouton « Explorer le manche » dans Progrès. L’instrument et l’accordage actifs sont utilisés. Toutes les cases 0–24 sont disponibles dès l’entrée ; aucun chapitre préalable ni déblocage. Le manche défile horizontalement, avec vrais numéros de corde et de case. Une sélection affiche un nom avec octave et un son si activé. Le clavier utilise les commandes du manche partagé et Entrée/Espace pour sélectionner. Muet reste disponible ; revenir au parcours n’enregistre ni score ni acquis. Changer d’instrument puis revenir recharge ses hauteurs et efface la sélection précédente.

Le mode libre sert à vérifier des relations ; les leçons servent à les expliquer ; les exercices évalués servent à constater un rappel. Les interactions libres ne sont jamais converties en preuves de maîtrise.

## GD-03 — spécification pédagogique des exercices mélodiques

### Audit de l’existant

Les finales actuelles ont souvent quatre à six notes. Les œuvres sont choisies pour leur compatibilité avec le groupe de positions ; en l’absence d’œuvre compatible, le repli utilise bas du groupe → haut du groupe → milieu → départ. Ce repli n’assure ni phrase musicale ni progression. Le registre de l’écoute développée et celui de l’exercice peuvent différer. La reprise à zéro vérifie l’ordre d’une chaîne mais ne démontre pas sa mémorisation durable. Les propositions de report de finale précédemment refusées ne sont pas réintroduites.

### Nouveau contrat proposé pour validation pédagogique

L’exercice reste une tâche de lecture de notes et de localisation, sans microphone obligatoire. Le joueur voit les notes successives et la contrainte de position éventuelle. L’écoute est une aide facultative. Aucune bonne réponse ne doit dépendre uniquement de l’imitation sonore, ni d’une connaissance de solfège rythmique non enseignée.

Une mélodie est décrite par : ID stable, profil, activité source, ensemble cumulatif admis, groupe nouveau, séquence MIDI, positions autorisées à chaque attaque, durées en pulsations, silences, niveau, graine de variation et provenance (originale ou œuvre sourcée). Il est interdit d’assembler aléatoirement des notes puis d’attribuer un titre connu au résultat.

### Progression et exemples originaux

Les exemples ci-dessous sont des propositions originales en guitare 6 standard ; leur adoption ne vaut pas remplacement des œuvres existantes. Chaque exemple exige la présence réelle de toutes ses notes dans le groupe cumulatif de l’activité. Si une condition manque, ne pas transposer aveuglément ni introduire une note future.

| Niveau | Condition pédagogique | Phrase et positions possibles | Rythme en pulsations |
| --- | --- | --- | --- |
| M1 — un souffle | E2/F2/G2 déjà rencontrés ensemble, corde 6, cases 0/1/3 | E2 F2 G2 F2 E2 ; cases 0–1–3–1–0 | 1, 1, 2, 1, 3 |
| M2 — question et réponse | A2/B2/C3 appris, corde 5 cases 0/2/3 | A2 B2 C3 — B2 A2 B2 A2 | 1, 1, 2, silence 1, 1, 1, 1, 2 |
| M3 — relier deux cordes | E2/G2/A2/B2 disponibles sur cordes 6 et 5 | E2 G2 A2 B2 A2 G2 E2 | 1, 1, 1, 2, 1, 1, 3 |
| M4 — changer de point d’appui | G3/A3/B3/C4/D4 appris, cordes 3 et 2 | G3 B3 D4 C4 B3 A3 G3 ; B3 d’abord sur corde 3 case 4, puis variante sur corde 2 à vide | 1, 1, 2, 1, 1, 1, 3 |

Les niveaux ne sont pas imposés par le seul numéro du chapitre. Le générateur doit analyser le groupe cumulatif et les transitions disponibles. Un accordage différent peut nécessiter un autre niveau ou une autre phrase ; aucune sortie hors périmètre n’est autorisée.

### Règles de sélection et génération

1. Construire l’ensemble admissible depuis l’activité et son accordage réel, incluant les familles apprises au cumul. Exclure toute note absente de ce groupe.
2. Choisir d’abord un gabarit musical validé à la main, avec début, respiration et fin. Les degrés et rythmes du gabarit sont identifiés ; on ne tire pas chaque note indépendamment.
3. M1 : 4–6 attaques, une corde, mouvements conjoints dans les notes apprises, pas de saut supérieur à une tierce. M2 : 6–8 attaques, au plus deux changements de direction, petits sauts jusqu’à une quarte. M3 : 7–10 attaques et 1–3 changements de corde. M4 : 8–12 attaques, réponse variée et choix d’unisson explicite. Ces tailles sont des contrats proposés, à recetter avant intégration.
4. Au moins deux attaques doivent faire travailler la famille nouvelle quand le contrat vise cette famille ; le reste réactive les précédentes. Pour une synthèse, répartir les familles sans prétendre couvrir chaque position en une seule phrase.
5. Éviter plus de deux attaques identiques consécutives sauf répétition musicale justifiée dans le gabarit ; éviter montées/descentes automatiques couvrant mécaniquement tout le groupe.
6. Choisir les positions en contrôlant nombre de changements de corde, distance des cases et unissons. Une phrase mélodiquement simple peut être spatialement difficile : les deux difficultés sont enregistrées séparément.
7. Valider toutes les attaques et transitions avant présentation. Si aucun gabarit n’est réalisable, sélectionner un gabarit plus simple et l’annoncer comme suite originale d’entraînement. Ne jamais élargir silencieusement le périmètre.
8. Conserver la graine et l’ID lors d’une reprise. Les variations ne changent pas après une erreur.

### Variations contrôlées

Une seule dimension change à la fois : fin de phrase alternative utilisant les notes connues ; déplacement d’une occurrence vers un unisson autorisé ; échange de deux rythmes déjà enseignés ; réponse à un motif initial. Une transposition ne s’applique que si toutes les hauteurs et positions restent admissibles et si le texte de provenance reste exact. Les extraits d’œuvres conservent leurs contraintes de source ; ne pas réécrire un riff connu pour satisfaire un algorithme générique.

### Consignes, aides et correction

Consigne générale : « Lis les notes dans l’ordre et retrouve-les sur le manche. » Si une position est imposée : « Respecte aussi la corde indiquée. » Si seule la hauteur est demandée : toutes ses positions admissibles sont acceptées. Le même nom à une autre octave ne suffit pas.

Aides : écouter la phrase, réécouter un segment explicite, afficher les noms. Une aide est enregistrée dans la preuve mélodique, distincte de la précision des questions précédentes. La correction nomme la hauteur touchée et celle attendue, sans confondre un unisson valide et une mauvaise position. Une erreur conserve le contrat actuel de reprise de chaîne ; aucun report de finale n’est introduit.

Réussite : chaîne terminée dans l’ordre avec toutes les hauteurs / positions conformes ; précision initiale, nombre de reprises et aides sont mesurés séparément. Aucun tempo obligatoire pour la réussite de repérage. Un défi de régularité éventuel serait distinct et exigerait un accord ultérieur. L’obtention musicale ne modifie pas rétroactivement les erreurs de Nommer/Retrouver.

### Recette avant branchement des nouvelles phrases

Contrôler automatiquement 100 % des hauteurs et positions sur chaque profil proposé ; contrôler les bornes, familles nouvelles et transitions. Faire écouter chaque gabarit pour sa cohérence et sa mémorisation. Tester lecture sans son, avec son et sur instrument. Comparer la rétention des positions entre une suite actuelle et une phrase proposée, à nombre d’expositions comparable. Aucun résultat de ce test n’est encore revendiqué.

Ce livrable est une spécification, conformément à la demande GD-03. Le catalogue et le moteur des mélodies existants ne sont pas remplacés dans ce lot sans validation des phrases proposées.

## GD-04 et GD-05 — grave, aigu et unissons

Grand Débutant reçoit une démonstration sur une corde (cases 0, 2, 4), jouable successivement. La direction entre cordes est montrée uniquement si les hauteurs à vide sont strictement croissantes dans l’ordre physique utilisé ; les accordages réentrants et les doublons masquent entièrement cette explication. La comparaison entre cordes concerne des cases égales ; elle ne permet pas de classer arbitrairement deux positions de cases différentes.

En guitare 6 standard, la leçon explique l’intervalle Sol–Si de quatre demi-tons contre cinq entre les autres cordes voisines, puis fait entendre B3 deux fois : Sol case 4 et Si à vide. La particularité concerne l’intervalle entre cordes, pas une propriété mystérieuse de la corde de Sol. Une quarte au-dessus de Sol est Do ; la justification fondée sur Fa et une casse supposée de corde est écartée.

L’introduction au Si en zone I reprend les positions et la comparaison. Dans une tâche de hauteur, les unissons admissibles conviennent ; dans une tâche exigeant une corde, la consigne explicite cette contrainte. Les règles évaluées existantes ne sont pas élargies arbitrairement.

## GD-07 — résultats et maquettes

Barème retenu après clarification : 0 pour aucune réponse ou >10 erreurs ; 1 pour 6–10 ; 2 pour 3–5 ; 3 pour 0–2 sans condition de vitesse ; 4 pour 0–1 et moyenne ≤2 500 ms ; 5 pour 0 et moyenne ≤1 000 ms. Pour 4/5, chaque première réponse doit fournir un temps admissible, sans aide. Les temps des erreurs ne sont pas inclus dans la moyenne mais doivent eux aussi être valides pour prétendre à 4 étoiles. Les reprises ne remplacent pas une première réponse. Le seuil de séance réussie à 90 % reste distinct du nombre d’étoiles.

Une phrase sous les étoiles indique exactement les conditions manquantes pour cinq étoiles : précision, autonomie ou temps ≤1 s. Le popup explique tous les niveaux. Les étoiles agrandies et la mention de record disposent d’un i cerclé en exposant, inclus dans la commande existante accessible au clavier.

Avec erreurs : bouton « Comprendre mes erreurs », détail des choix et révision ciblée. Sans faute : « Mon bilan de maîtrise », moyenne admissible, positions relativement rapides/lentes avec effectifs, dispersion des temps si au moins quatre mesures et conseil de consolidation sans diagnostic inventé. Une seule position ou l’absence de temps donnent un état insuffisant explicite. Le détail conserve la liste des positions traitées.

Les maquettes fonctionnelles sont dans [resultats-maquettes.html](design/resultats-maquettes.html). Elles utilisent le vrai calcul des étoiles et permettent de varier erreurs, temps et aides. Elles sont des exemples synthétiques, pas des statistiques de joueur.

## GD-08 — entrée Arcade

Le menu invite les joueurs déjà à l’aise pour nommer les premières notes à tester leurs réflexes. Il annonce l’ajout des zones et la réduction du délai, et recommande le Parcours pour apprendre sans compte à rebours. Aucun niveau requis, verrou ou diagnostic de départ n’est ajouté.

## Liste de validation humaine — sans cases à cocher

- Toucher une mauvaise position en découverte : lire le nom réel et son octave à côté de la pastille, sans révélation d’une bonne position inconnue.
- Vérifier que cette erreur ne valide aucun emplacement et ne crée pas de réponse évaluée.
- Explorer librement une introduction courte et une introduction 24 cases, au doigt, à la souris et au clavier.
- Démarrer ensuite l’exercice et vérifier la séparation des exemples, aides et temps évalués.
- Ouvrir Explorer depuis Progrès ; atteindre les cases 0 et 24 sur chaque instrument, sans score ni chronomètre.
- Vérifier son, Muet, défilement sans activation accidentelle, changement d’accordage et retour au parcours.
- Terminer plusieurs parties Arcade, dont une moins bonne, et vérifier chaque point de Trajectoire.
- Vérifier mode, profil, date, trois mesures, partie sans bonne réponse, un seul point et période sans parties.
- Recharger, exporter/importer puis retrouver les mêmes courbes ; importer aussi une ancienne sauvegarde sans historique.
- Écouter les trois notes de la démonstration sur une corde et vérifier le sens grave/aigu.
- Vérifier l’explication entre cordes avec accordage croissant, puis son absence avec accordage réentrant ou hauteurs égales.
- Comparer les deux Si3 en guitare standard, dans Grand Débutant et l’introduction au Si.
- Contrôler qu’une tâche de hauteur accepte ses unissons admissibles, tandis qu’une tâche de position précise sa corde.
- Recetter les exemples et gabarits GD-03 musicalement avant leur intégration ; vérifier toutes leurs notes contre le groupe cumulatif.
- Tester les limites 11/10/6/5/3/2/1/0 erreurs, 2 500 et 1 000 ms exactement, ainsi que réponses aidées et temps invalides.
- Ouvrir le popup des étoiles et celui du record au clavier ; fermer et retrouver le focus.
- Vérifier les trois cas de maquettes : sans faute rapide, sans faute lent, erreurs ; tester aussi les aides.
- Vérifier que le bilan sans faute n’invente pas de faiblesse, et que la révision ciblée reste accessible lorsqu’il y a des erreurs.
- Lire l’introduction Arcade et confirmer qu’elle recommande des compétences sans inventer de déblocage.
- Contrôler petit écran, paysage, contraste, zoom et mouvement réduit sur appareils physiques.
- Vérifier après packaging que les nouveaux modules sont dans le paquet et dans le cache hors ligne.
- Confirmer qu’aucune règle Arcade, aucun ancien succès et aucune proposition refusée n’a été ajouté par ce lot.

