# Phase 1 — Cadrage proposé pour validation

État : conception terminée, non implémentée. Référence technique : ADH Reborn v0.4, commit `ec398fb`. Les seuils ci-dessous sont des hypothèses de pilote ; aucune efficacité d’apprentissage n’a encore été mesurée.

## ADH-01 — Public, promesse et prérequis

### Public principal

Guitariste électrique ou acoustique qui sait produire une note isolée, mais retrouve encore les noms par calcul, par voisinage ou après une hésitation. Il veut choisir des notes pour un riff, une phrase ou une ligne de basses. Aucun niveau de lecture de partition, d’accords, de gammes ou d’improvisation n’est requis.

Le téléphone seul reste un usage complet pour apprendre la carte. La pratique instrumentale ajoute un autre objectif, évalué à part. L’utilisateur choisit sa configuration favorite ; le parcours de référence ci-dessous en 6 cordes standard est un support de conception, pas un changement de sa préférence ni de la gratuité du premier instrument.

### Texte d’accueil prêt à intégrer plus tard

> Apprenez à nommer et retrouver les notes des cases 0 à 4 de votre manche. Commencez avec des repères simples, puis cherchez sans aide. Sur téléphone, vous entraînez votre carte du manche. Avec votre guitare, vous pouvez aussi appliquer ces repères à de petites phrases. Ni partition ni connaissance des accords n’est nécessaire.

Ce résultat ne garantit ni la connaissance du manche entier, ni une improvisation sans hésitation, ni une compétence d’exécution instrumentale automatiquement constatée. Les harmoniques restent une extension ultérieure.

### Choix d’usage

- **Sans guitare maintenant** : découverte, déduction, deux sens de rappel, suites de positions et révisions. Les tâches physiques restent disponibles plus tard, sans pénalité et sans verrou.
- **Avec ma guitare** : mêmes activités, puis petits essais sur l’instrument. Préciser « résultat déclaré » après une autoévaluation. Aucune détection par microphone n’est requise.
- Ce choix est une disponibilité de séance, modifiable librement ; il ne constitue pas un changement d’instrument ou d’accordage payant.

### Préparation facultative P01–P03, hors des 24 micro-leçons

| Préparation | Démonstration à prévoir | Action vérifiable | Résultat |
| --- | --- | --- | --- |
| P01 : corde, case, à vide | Instrument et diagramme ; sillet, première frette, espace de la case 1 | Montrer la grosse corde ; distinguer case 0 et case 1 | Repérage guidé vérifié à l’écran |
| P02 : produire une note | Poser un doigt juste avant la frette du côté du chevalet, dans la case ; pincer une seule corde ; éviter d’étouffer la corde | Essayer une note à vide puis une note appuyée | Essai instrumental déclaré ; « je n’ai pas de guitare » reste possible |
| P03 : lire une coordonnée | « Corde 6, case 1 » ; numérotation des cordes depuis la plus fine | Pointer deux coordonnées différentes | Diagnostic d’entrée, sans vitesse imposée |

Le débutant absolu suit ces cartes ; l’utilisateur déjà à l’aise peut vérifier rapidement son repérage et les passer. La préparation ne promet pas une technique de guitare complète. Le doigté précis, le médiator et la posture ne sont pas des prérequis nouveaux imposés pour le rappel des notes.

La première explication n’énumère pas les noms des six cordes. Le nom de Mi apparaît avec ses repères ; la vue des départs de cordes s’ouvre progressivement, en mettant Mi puis La en avant. Les termes « demi-ton », « octave », « altération », « unisson » et « fondamentale » seront définis au moment de leur usage.

### Critères d’acceptation du cadrage

L’accueil énonce zone, résultat et distinction téléphone/guitare ; les modes sans guitare et sans son restent utilisables pour les tâches visuelles ; aucun accord ni partition n’est requis ; la préparation possède une action observable et une déclaration physique distinctes. Leur affichage réel sera vérifié dans la phase 3, pas déclaré réalisé maintenant.

## ADH-02 — Carte de compétences

Les éléments sont rattachés à une configuration, une position ou une relation. Une note nommée sans octave est une classe de hauteur ; une position conserve toujours sa corde, sa case et sa hauteur réelle. Les deux cordes de Mi ne sont donc pas fusionnées comme une seule position.

| ID | Compétence et action observable | Vérification prévue | Leçons principales | Preuve |
| --- | --- | --- | --- | --- |
| C01 | Se repérer : pointer une coordonnée, distinguer 0 et première case, identifier une corde | 6 consignes de repérage, dont 0/1 et au moins deux cordes ; 6/6 attendu pour ce diagnostic court | ML01, ML03 | Réponse écran, aide enregistrée |
| C02 | Convertir les sept noms français et internationaux dans les deux sens | 14 demandes, une par nom et par sens ; résultats locaux, pas seulement total | ML02 | Réponse sans traduction visible ; facultatif pour poursuivre |
| C03 | Nommer une position donnée | Diagramme neutre ou coordonnée ; produire le nom sans étiquette de réponse | ML04, ML05, ML07, ML10, ML11, ML13, ML16, ML22 | Nom proposé, première réponse et format de réponse |
| C04 | Retrouver une position à partir du nom | Pointer une seule position conforme aux contraintes annoncées | Même famille d’ancrages, ML08, ML15, ML22 | Position proposée et ensemble des réponses admissibles |
| C05 | Déduire une note voisine | Prédire ±1 ou ±2 demi-tons depuis un ancrage ; expliquer ou appliquer le déplacement | ML04, ML07, ML16, ML17 | Déplacement et hauteur attendue ; distinguer déduction et rappel direct |
| C06 | Relier deux positions ou deux noms | Distinguer même nom/deux octaves, octave simple, unisson et noms enharmoniques | ML05, ML12, ML14, ML18 | Relation choisie avec exemple non simplement récité |
| C07 | Utiliser une courte suite de noms | Exécuter une suite de 4–5 notes ; retrouver une fondamentale depuis un nom d’accord | ML06, ML09, ML19–ML21, ML23 | Ordre des positions à l’écran ; jeu physique déclaré à part |
| C08 | Retrouver les acquis après délai | Nouveau cycle de rappel ≥24 h après la dernière pratique de chaque élément, sans fiche préalable | ML24 | Première réponse autonome, dates et sens distincts |

C07 possède deux sous-domaines : C07-écran et C07-guitare. Les résultats ne s’additionnent pas comme s’ils mesuraient la même action. C08 est une confirmation des autres associations, pas une nouvelle note à apprendre.

### Contrat de chaque activité

Chaque activité doit spécifier : compétence principale et secondaires éventuelles, configuration, positions admissibles, sens de réponse, format, aides disponibles et utilisées, caractère entraînement/évaluation et mode de preuve. Le JSON de parcours décrit ces associations au niveau de conception ; il ne remplace pas les futures données d’activité.

Pour « un G », toutes les positions étudiées de G sont admissibles ; une seule suffit. Pour « G sur Mi grave », seule la position G de cette corde dans la zone convient. Pour « même hauteur », l’ensemble des réponses est filtré sur la hauteur réelle, pas seulement sur la lettre. Les indices de registre sont explicitement annoncés. La recherche de toutes les occurrences reste une extension avancée, sans l’imposer à l’exercice ordinaire.

### Échelle d’aide

| Niveau | Ce que l’utilisateur peut voir ou demander | Interprétation |
| --- | --- | --- |
| A3 : découverte | Noms sur les positions, solution/démonstration, correspondance bilingue si pertinente | Exposition active, jamais preuve de rappel autonome |
| A2 : entraînement guidé | Corde mise en valeur, ancrages nommés, relation illustrée ; correction disponible | Apprentissage accompagné |
| A1 : rappel contextualisé | Corde annoncée ou contexte fourni ; réponse cachée ; réécoute/indice sollicitable | Preuve limitée au contrat de cette tâche ; aide sollicitée enregistrée |
| A0 : vérification | Aucune aide qui fournisse la réponse ; uniquement le stimulus nécessaire à la consigne | Candidat à une confirmation autonome |

Donner une corde dans une question portant précisément sur cette corde n’est pas automatiquement une aide. En revanche, éclairer la bonne corde lorsqu’il faut choisir parmi plusieurs en est une. On retire une aide à la fois ; on ne change pas simultanément corde, zone, format et contrainte de temps.

Les 12 réponses circulaires actuelles mesurent une réponse parmi un clavier de hauteurs. Elles restent utiles à l’entraînement. Une évaluation de **nom produit** utilisera une saisie ou une composition lettre + altération, sans propositions réduites à quelques réponses. Une réussite parmi des propositions et un nom produit doivent rester identifiables et ne pas être présentés comme strictement équivalents. L’ergonomie de cette saisie est à vérifier dans le pilote.

La note automatique et le repère sonore de la v0.4 restent utiles à l’entraînement. Un bilan de rappel visuel n’émet pas la note cible avant la première réponse ; une réécoute ou un indice demandé fait sortir cet essai de la validation A0. Les sons de correction après réponse restent permis.

## ADH-03 — États, validation et progression

### États distincts

- **Découvert** : l’utilisateur a vu une démonstration et effectué une action guidée correcte sur l’élément. Ouvrir une fiche seule ne suffit pas.
- **Travaillé** : il a effectué au moins deux essais de première réponse dans le sens concerné, au-delà du simple toucher de démonstration. Une erreur n’interdit pas cet état ; il décrit une pratique, pas une maîtrise.
- **Consolidé** : rappel autonome confirmé pour cet élément et ce sens, dans deux sessions distinctes, dont une après un délai réel.
- **À revoir** : signal local après erreur ou vérification échouée. La confirmation actuelle peut redevenir « travaillé » ; la date d’une ancienne consolidation reste dans l’historique.

L’état est suivi par position **et par sens**. Une position peut être consolidée pour « nommer », mais encore travaillée pour « retrouver ». Le bilan de zone n’affiche « consolidé » que si ses 30 positions remplissent les règles dans les deux sens ; les relations C06 et l’usage C07 ont leur propre résultat. La conversion facultative C02 ne bloque pas le parcours principal.

Les tâches sur guitare portent séparément les statuts « non essayé », « essayé » et « réussi selon mon autoévaluation », avec date et aides. Elles n’obtiennent pas un badge de mesure automatique.

### Règle initiale de consolidation à tester

1. Couvrir tous les éléments du groupe annoncé dans chaque sens ; un bon score sur un sous-ensemble ne couvre pas le reste.
2. Obtenir au moins 90 % de premières réponses correctes dans le cycle d’évaluation de chaque sens, sans aide de réponse. Calculer le nombre nécessaire par arrondi supérieur : 11/12, 9/10, 27/30.
3. Pour consolider une position dans un sens, disposer de **deux premières réponses autonomes correctes dans deux sessions distinctes**, et non de deux clics après une correction. La seconde doit intervenir au moins 24 h après la dernière pratique de cet élément.
4. Une erreur locale empêche de confirmer cet élément même si le total atteint 90 %. Les autres éléments correctement confirmés conservent leur état.
5. Une réponse lente mais exacte reste valide. Le seuil de vitesse n’est pas un verrou pédagogique.

Un cycle de zone couvre 30 positions dans chaque sens, soit 60 items ; il peut être découpé en lots de 10–12 et repris. Le bilan différé peut également être fractionné. Une séance de cinq minutes est une préférence de volume, pas l’obligation d’achever un examen complet en cinq minutes. Le cycle n’est déclaré complet qu’après couverture réelle.

Les 24 h sont une règle pratique initiale pour distinguer deux moments d’apprentissage, pas un intervalle scientifiquement optimal. Le délai se compte depuis la dernière pratique de l’élément, pas simplement depuis l’ouverture de l’application. Si l’élève révise avant le bilan, l’activité reste de l’entraînement immédiat et une confirmation ultérieure reste à prévoir.

### Avancer sans attendre toutes les confirmations différées

Pour passer à une nouvelle découverte, on demande que les prérequis aient été rencontrés et travaillés, avec une première réussite guidée sur le petit groupe. Une exactitude guidée de 90 % est un repère de préparation, pas la preuve de consolidation. Si le groupe reste difficile, proposer un groupe réduit et une reprise ; ne pas imposer la vitesse ni attendre 24 h après chaque micro-leçon. Les deux sens sont introduits dès la découverte des notes, avec guidage suffisant.

### Étoiles et compétence

Conserver le défi de jeu actuel : 3 étoiles à 90 %, 4 à 95 % et médiane ≤2,5 s, 5 à 100 % et médiane ≤1 s. Les étoiles qualifient une tentative dans son format ; elles ne deviennent pas l’état pédagogique d’une position. Une vitesse de saisie de texte n’est pas comparable à un toucher sur un cercle : aucun badge de fluidité commun ne sera attribué entre ces formats sans ajustement et validation ultérieure.

### Conservation des résultats existants, sans migration maintenant

L’historique v0.4 permet d’identifier configuration, cible, sens, exactitude, temps et date de séance. Il ne contient ni niveau d’aide, ni valeur de la réponse incorrecte, ni preuve de délai sans pratique, ni tâche physique. Conserver cet historique et les étoiles acquises. Présenter ces résultats comme « entraînement antérieur — à confirmer » dans le futur parcours ; ne pas les convertir automatiquement en consolidation ou pratique instrumentale. Une date ancienne et une bonne note ne suffisent pas à prouver un rappel différé.

## Critères de sortie de phase 1

Public et promesse définis ; préparation spécifiée ; huit compétences reliées à des vérifications ; formats et aides qualifiés ; sens distincts ; états et règles de couverture/délai définis ; vitesse séparée de la progression ; résultat instrumental explicitement déclaratif. **Les critères de conception sont satisfaits. Leur compréhension réelle par des élèves reste à observer au pilote.**
