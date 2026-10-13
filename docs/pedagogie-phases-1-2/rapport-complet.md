# ADH — Rapport des phases 1 et 2

**13 octobre 2026 · proposition à valider · référence produit : v0.4 / ec398fb**

Les phases 1 et 2 sont réalisées sous forme de **dossier de conception vérifié** : cadrage, modèle de compétences, règles de progression, plan des 24 leçons, correspondance des 76 fiches et textes conceptuels proposés. L’application, son stockage et son ZIP restent inchangés. Aucun pilote, système de révision, média audio nouveau ni migration n’a été implémenté. Le travail s’arrête avant la phase 3.

## Décision principale

Remplacer la succession de petites séries par corde par un parcours qui enseigne des **relations utiles**, pratique les deux sens de rappel et fait appliquer les notes dès les premières étapes. Séparer l’avancement dans le cours, les étoiles d’une tentative, le rappel confirmé après délai et les essais sur guitare.

La connaissance du nom des notes reste la priorité. Le téléphone seul suffit pour ce parcours de carte du manche ; une guitare ajoute des tâches physiques sans conditionner l’accès à la suite. La préparation du débutant absolu est courte et facultative. La première zone reste 0–4 ; aucune case supplémentaire, harmonique ou infrastructure de microphone n’est ajoutée.

## Ce qui a été livré pour chaque tâche

| Tâche | Livrable | État |
| --- | --- | --- |
| ADH-01 | Public, promesse prête à intégrer, prérequis, préparation P01–P03, usages avec/sans guitare | Cadrage achevé ; affichage futur dans le pilote |
| ADH-02 | Huit compétences, preuves attendues, formats, sens de réponse et niveaux d’aide | Carte achevée |
| ADH-03 | Découvert/travaillé/consolidé, règles de couverture et délai, séparation des tâches déclarées | Règles proposées et vérifiées sur exemples |
| ADH-04 | 24 objectifs en huit étapes, prérequis ordonnés, premiers motifs, couverture des 30 positions | Plan achevé |
| ADH-05 | 76 correspondances qualifiées par instrument, destinations et quatre décisions par type de contenu | Inventaire complet |
| ADH-06 | 24 propositions de textes, exemples exacts, comparaisons de hauteurs et règles enharmoniques | Réécriture conceptuelle proposée ; écrans et médias non produits |

Les critères de **conception** sont remplis. La compréhension par des élèves, le transfert sur guitare et le confort des futurs formats n’ont pas encore été validés expérimentalement. Les formulations « à implémenter » de la roadmap sont traduites ici en spécifications et contenus, conformément à l’arrêt demandé avant la phase suivante.

## Écart entre la roadmap et l’existant audité

La roadmap part des documents v0.3. Le code disponible est la v0.4 : décompte de départ, manche horizontal sans rotation, deux colonnes en paysage, fond clair, repère sonore et diagrammes de micro-leçons sont déjà présents. Ils sont **à réemployer**, pas à recréer.

Le comptage de 35 fiches pour six cordes et 41 pour sept cordes demeure exact. Les accordages, fréquences, hauteurs et positions 0–4 ont été vérifiés à partir des données du moteur actuel.

| Observation dans la v0.4 | Conséquence sur les choix |
| --- | --- |
| `name` demande de choisir parmi douze noms ; `find` exige une position cible sur une corde annoncée | Distinguer reconnaissance, nom produit, recherche restreinte et choix libre d’une occurrence |
| Les scores `mix` mélangent les deux sens | Maintenir deux mesures au lieu d’un unique pourcentage de maîtrise |
| Le dernier `mix` de six cordes comporte 24 questions pour 30 positions | Un exercice parfait ne couvre pas la zone entière ; vérifier la couverture par position et par sens |
| Simulation du dernier `mix` : 24 positions vues, 12 réponses `name`, 12 `find` | Aucune preuve que les 30 positions aient été retrouvées dans les deux sens |
| Les niveaux d’aide et les réponses erronées proposées ne sont pas stockés | Ne pas attribuer un rappel autonome ou une cause précise à partir de cet historique |
| Le niveau d’étoiles débloque la fiche suivante ; le meilleur score reste mémorisé | Conserver le jeu, mais séparer ses étoiles de la consolidation pédagogique |
| L’historique ne vérifie ni délai réel sans pratique ni tâche physique | Marquer les nouvelles capacités « à confirmer », conserver les acquis anciens sans surinterprétation |
| Le générateur construit un produit de cordes × cases | Le futur groupe Mi/La doit utiliser une liste explicite de positions connues : Mi 0/1/3 et La 0/2/3, sans introduire involontairement les cases inconnues |
| Le son est joué avant la réponse dans les exercices visuels actuels | Le conserver en entraînement ; le désactiver avant réponse uniquement dans un futur bilan visuel A0 |

## Pourquoi ces choix

### 1. Des ancrages naturels avant l’ensemble chromatique

Les 30 positions de la six cordes se répartissent en 18 positions naturelles et 12 altérées. Des ancrages E/F/G ou A/B/C offrent une relation réutilisable et un territoire court. Les notes intermédiaires sont ensuite déduites par demi-ton avant automatisation. Cela remplace l’ajout indistinct d’une case et d’un nom à chaque fiche.

La contrepartie est un entraînement initial sur des cases non contiguës. Le moteur devra donc accepter des ensembles explicites de positions. ML16 ne sera pas une série qui lance simultanément douze nouveautés : le concept est unique, les groupes d’entraînement restent petits.

### 2. Relier Mi grave et Mi aigu très tôt

Le même trajet 0–1–3 donne E–F–G sur les deux cordes. Cette relation réduit la répétition et apprend à choisir le registre. Elle ne supprime pas la vérification sur la deuxième corde. Ces cordes sont séparées de **deux octaves**, pas d’une seule.

### 3. Une application musicale avant la carte complète

Le motif E–F–G–F–E arrive à la fin de l’étape 2 ; E–A–B–A à la fin de l’étape 3. Les notes sont déjà connues, le rythme simple et les accords facultatifs. Le téléphone vérifie une suite de positions ; la guitare vérifie autre chose et reste déclarative.

### 4. Avancer sans exiger d’abord la vitesse

Un score exact peut permettre d’avancer avec un niveau de consolidation encore incomplet. Les cinq étoiles à 1 seconde sont conservées comme défi optionnel du jeu actuel. Elles ne deviennent pas une condition d’accès aux relations et aux applications. Comparer une saisie de nom à un toucher parmi douze cercles serait trompeur : les formats restent distincts.

### 5. Consolidation locale et différée

Le total de 90 % ne doit pas masquer une note toujours confondue. La confirmation exige deux premières réponses autonomes correctes dans le même sens, dans deux sessions distinctes, dont une au moins 24 h après la dernière pratique. Une erreur laisse cette position à revoir sans effacer toute une corde. Couvrir la zone dans les deux sens exige 60 items par cycle ; ce cycle peut être fractionné.

Les seuils de 90 % et 24 h sont des hypothèses explicites pour le pilote. Ils ne prouvent pas qu’une note sera immédiatement disponible en improvisation.

### 6. Préserver les outils utiles et les anciennes données

Les calculs musicaux, le manche, la synthèse, le chrono actif, le décompte et les exercices utiles restent des bases. Les 52 fiches d’introduction sont fusionnées ; les 13 `find` conservés et replacés ; les 11 présentations `mix` remplacées par des révisions ciblées. Les consignes techniques sont déplacées vers l’aide d’interface. Le générateur `mix` reste réutilisable après adaptation.

Les résultats anciens deviennent des indices de pratique à confirmer, pas une maîtrise physique ou une rétention automatiquement reconnue. Aucune migration n’est réalisée dans ces phases.

### 7. Respecter le choix d’instrument

Le parcours de référence six cordes facilite la conception des relations et du pilote. Il ne force pas l’utilisateur à remplacer sa guitare favorite. Les cinq fiches du Si grave et les mélanges sept cordes sont dirigés vers `EXT7`, une destination réservée à la phase 6. Les notes communes sont reconnues par hauteur et numéro physique, pas par l’indice de tableau.

Le nouveau parcours sept cordes n’est donc pas déclaré achevé : seule sa correspondance avec l’existant est achevée. Les usages sans/avec guitare et les notations sont des choix de confort ; ils ne modifient pas la formule commerciale déjà discutée.

## Contrôles réalisés

- 24 leçons exactement, trois par étape ; tous les prérequis renvoient à une leçon antérieure.
- 30 positions uniques en six cordes, chacune rattachée à une découverte, un ancrage et une vérification dans les deux sens.
- 18 naturelles et 12 altérées ; toutes les positions sont dans 0–4.
- 76 anciennes fiches identifiées une seule fois : 35 en six cordes, 41 en sept cordes. Toutes ont une destination valide.
- Relations vérifiées : E2/E4 = 24 demi-tons ; E2/E3 et A2/A3 = 12 ; Sol case 4 = Si à vide = B3.
- Tous les emplacements des motifs proposés utilisent des notes déjà étudiées.
- Les dièses, bémols et équivalences de graphie sont cohérents avec les hauteurs réelles ; aucune extension silencieuse en case 5 pour la déduction des bémols.
- Les fichiers du produit à `ec398fb` restent inchangés. Les livrables sont uniquement de la documentation et des données de conception.

Ces contrôles portent sur le plan et les données musicales. Aucun test utilisateur n’a été effectué, aucune promesse d’efficacité n’est déduite de ces contrôles.

## Ce qui doit être validé avant la phase 3

1. Le parcours de 24 idées, avec ancrages naturels et deux cordes de Mi reliées tôt.
2. Le téléphone seul comme parcours de carte complet ; les tâches physiques facultatives et séparées.
3. La distinction entre étoiles, pratique et rappel consolidé ; aucune vitesse obligatoire pour apprendre.
4. Les règles initiales 90 %, couverture locale et confirmation ≥24 h, à ajuster après observation.
5. Les textes conceptuels proposés et l’ordre du retrait des aides.
6. La référence six cordes pour le pilote, avec conservation du sept cordes actuel et adaptation nouvelle en phase 6.

## Arrêt et prochaine étape, non exécutée

Après validation, la phase 3 construira une tranche représentative : repères de Mi et La, relation des deux Mi, rappel dans les deux sens, petite application et leçon F♯ avec ses prérequis. Elle testera le format actif, les choix de réponse et les corrections. Produire les huit étapes en application, automatiser les révisions et migrer les données avant ce pilote irait au-delà de la demande actuelle.

Le reste de ce dossier contient le détail des phases 1 et 2, les 24 propositions de textes et les annexes de correspondance/couverture. La roadmap fournie reste la référence de périmètre ; ses références pédagogiques ne sont pas présentées comme des études validant notre produit.


---

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


---

# Phase 2 — Reconstruction proposée pour validation

État : conception terminée, aucune modification du parcours dans l’application. Le découpage de 24 micro-leçons est une hypothèse à éprouver, non une bibliothèque finale figée.

## ADH-04 — Huit étapes, 24 micro-leçons

Le parcours de référence utilise une guitare 6 cordes standard E2 A2 D3 G3 B3 E4, cordes numérotées 6 à 1 du grave vers l’aigu. Les hauteurs indiquées sont les hauteurs sonores réelles, sans lecture de partition. La préférence d’instrument de l’utilisateur n’est pas modifiée.

| Étape | Micro-leçons | Vérification principale |
| --- | --- | --- |
| 1. Se repérer | ML01 diagramme ; ML02 noms français/internationaux ; ML03 départs à vide | Coordonnée comprise ; conversion facultative ; premiers repères de Mi/La guidés |
| 2. Mi | ML04 E/F/G grave ; ML05 transfert à Mi aigu ; ML06 phrase E–F–G–F–E | Trois ancrages sur chacun des Mi ; même nom ≠ même hauteur ; première application |
| 3. La | ML07 A/B/C ; ML08 sélection entre Mi et La ; ML09 ligne E–A–B–A | Choix d’une occurrence conforme à la consigne, dans les deux sens |
| 4. Ré et Sol | ML10 D/E/F ; ML11 G/A/B ; ML12 octaves E2/E3 et A2/A3 | Deux nouvelles cordes, puis deux relations d’octave concrètes |
| 5. Si et relations | ML13 B/C/D ; ML14 unisson B3 ; ML15 recherche entre cordes | Les 18 positions naturelles ; nom, hauteur et emplacement distingués |
| 6. Altérations | ML16 dièses ; ML17 bémols ; ML18 enharmonie | Les 12 positions restantes, par déduction puis rappel ; graphie séparée de hauteur |
| 7. Applications | ML19 suite nommée ; ML20 référence sonore ; ML21 fondamentale | Notes utilisées dans une tâche, sans partition ni accord obligatoire |
| 8. Consolidation | ML22 rappel sans aide ; ML23 phrase nouvelle ; ML24 bilan différé | Couverture des 30 positions dans les deux sens, rétention et transfert séparés |

Les titres ne désignent pas des séries uniformes de vingt questions. Une micro-leçon enseigne une idée ; ses exercices peuvent revenir sans recopier son texte. Les tailles de lots et la planification automatique relèvent des phases 3 et 4.

### Décisions qui évitent les sauts de difficulté

- Mi aigu suit très tôt Mi grave. La similitude est enseignée au lieu de refaire les mêmes introductions en fin de parcours.
- Les 18 positions naturelles servent d’ancrages. Les 12 positions altérées sont visibles comme emplacements non encore nommés, puis enseignées à l’étape 6.
- « Première recherche » signifie d’abord une position sur une corde donnée, puis une occurrence admissible parmi des cordes déjà connues. Aucune recherche de toutes les occurrences n’est obligatoire.
- Le début montre Mi puis La avant de présenter le panorama des cordes à vide. Voir les six départs ne signifie pas les avoir tous appris ; leur entraînement se répartit ensuite entre les étapes.
- La traduction Do–C est proposée mais n’est pas un prérequis bloquant. Son test cache la traduction.
- ML16 est un concept et plusieurs petits groupes d’entraînement, pas douze nouvelles positions demandées immédiatement. Commencer par F♯, ensuite varier les ancrages et les cordes ; retirer les aides seulement après réussite.
- ML17 utilise d’abord les **sept positions** dont la note naturelle supérieure est déjà dans la zone : Mi grave case 2, Mi aigu case 2, La case 1, Ré case 1, Sol cases 1 et 3, Si case 2. Les cinq altérations de case 4 sont reliées à leur graphie bémol dans ML18 ; on ne demande pas de chercher une note en case 5.
- Les applications de ML06 et ML09 emploient uniquement des notes connues. Une pulsation simple ou un tempo libre suffit ; ni nouveau doigté rigide, ni accord, ni lecture rythmique n’est imposé.
- Sans guitare, la version écran de l’application musicale permet de continuer. Les tâches physiques restent à faire ultérieurement.
- La phrase de bilan ML23 n’est pas la phrase d’entraînement ML19. Son modèle apparaît après la première tentative ; ses notes et son rythme auront déjà été rencontrés séparément.

### Exemples musicaux retenus

| Usage | Noms | Emplacements | Limite pédagogique |
| --- | --- | --- | --- |
| Premier motif | E–F–G–F–E | Mi grave 0–1–3–1–0, ou même trajet sur Mi aigu | Une corde à la fois ; pas de saut imposé entre grave et aigu |
| Ligne de basses | E–A–B–A | Mi grave 0 ; La 0–2–0 | Ordre des notes avant régularité du tempo |
| Phrase avec altération | E–F♯–G–F♯–E | Mi grave 0–2–3–2–0 | Emplacements déjà appris ; correction après essai |
| Fondamentales | E de Em ; A de Am ; B de Bm ; C de C | Mi grave 0 ; La 0, 2, 3 | Jouer la fondamentale seulement suffit ; connaître l’accord n’est pas requis |

Ces exemples sont originaux et génériques. Aucun enregistrement, morceau protégé ou support externe n’est repris. La production des médias du pilote n’est pas commencée.

## ADH-05 — Correspondance de toutes les anciennes fiches

L’inventaire porte sur les identifiants **qualifiés par instrument** : 35 sur guitare6 et 41 sur guitare7. Le même `s0-first` n’a pas le même départ sur les deux instruments.

La correspondance complète se trouve dans `correspondance-76-fiches.csv`. Chaque fiche possède une décision, une destination, les compétences futures visées, le sort de l’exercice, le sort de son texte et les consignes à déplacer. Aucune ancienne fiche n’est abandonnée sans destination explicite.

| Contenu ancien | Décision | Réemploi |
| --- | --- | --- |
| Notes, accordages, hauteurs, calcul des cases | Conserver | Source musicale vérifiée, sans la réécrire manuellement dans le moteur |
| Fiches `first`, `grow`, `four`, `whole` | Fusionner | Ancrages naturels, concepts utiles et étape d’altérations ; retirer les introductions sans apport |
| Exercice `find` | Conserver et avancer dans le parcours | Nom → position dès les premiers ancrages, avec retrait progressif du guidage |
| Présentation de fiche `mix` | Remplacer | Rappel cumulatif par groupe de positions/compétences, pas fusion des scores |
| Générateur des questions `mix` | Conserver et adapter | Alternance des deux sens ; données et résultats séparés |
| Toucher le manche, glisser, ouvrir les boutons | Déplacer vers l’aide d’interface | Consigne au premier usage, puis rappel contextuel ; ne plus en faire le contenu conceptuel de la leçon |
| Badges et historique de tentatives | Conserver comme historique | Aucune preuve instrumentale ou consolidation autonome déduite automatiquement |

La catégorie est attribuée au contenu : une fiche fusionnée peut contenir un exercice conservé et une consigne déplacée. Cette granularité évite de jeter un outil utile parce que son texte est répétitif.

### Cas 7 cordes

Le parcours de référence 6 cordes correspond aux six cordes communes de BEADGBE **par hauteur de départ et numéro physique**, et non par indice de tableau. Exemple : l’ancien `guitar7/s1-first` correspond au Mi grave, soit `guitar6/s0-first`.

Les cinq anciennes fiches du Si grave ont une destination de conception `EXT7`. Les six fiches mixtes qui incluent cette corde sont marquées comme rappel cumulatif à adapter, avec une référence `EXT7`. Cette réserve est une décision de reclassement, pas l’implémentation de l’extension de la phase 6 ni une promesse de transfert validé. Le futur diagnostic reconnaîtra les acquis communs tout en vérifiant leur usage sur une vue à sept cordes.

Aucune préférence n’est écrasée, aucune donnée n’est migrée et le parcours 7 cordes actuel reste inchangé. Les accordages personnalisés et les basses restent hors de cette reconstruction de référence ; leurs données existantes ne sont pas modifiées.

## Couverture des positions

La guitare 6 cordes offre **30 positions**, dont **18 naturelles et 12 altérées**, dans la zone 0–4. Les douze classes de hauteur sont présentes ; le nombre de positions ne se confond donc pas avec le nombre de noms différents.

`couverture-30-positions.csv` donne pour chacune : corde, case, nom, hauteur réelle, première découverte, leçon d’ancrage et vérifications dans les deux sens. Les positions à vide sont vues en découverte guidée ML03, puis réellement travaillées avec leur groupe d’ancrage. Les mêmes positions sont revérifiées en ML22 et ML24 ; un examen réparti sur plusieurs séances doit achever sa couverture avant toute validation globale.

| Corde | Cases 0, 1, 2, 3, 4 | Ancrages naturels | Positions altérées |
| --- | --- | --- | --- |
| 6, Mi grave | E2, F2, F♯2, G2, G♯2 | ML04 : 0, 1, 3 | ML16/18 : 2, 4 |
| 5, La | A2, A♯2, B2, C3, C♯3 | ML07 : 0, 2, 3 | ML16/18 : 1, 4 |
| 4, Ré | D3, D♯3, E3, F3, F♯3 | ML10 : 0, 2, 3 | ML16/18 : 1, 4 |
| 3, Sol | G3, G♯3, A3, A♯3, B3 | ML11 : 0, 2, 4 | ML16/18 : 1, 3 |
| 2, Si | B3, C4, C♯4, D4, D♯4 | ML13 : 0, 1, 3 | ML16/18 : 2, 4 |
| 1, Mi aigu | E4, F4, F♯4, G4, G♯4 | ML05 : 0, 1, 3 | ML16/18 : 2, 4 |

Le Si grave de la 7 cordes ajoute B1, C2, C♯2, D2, D♯2 ; ses 35 positions sont toutes identifiées dans l’inventaire ancien. Leur nouvelle production détaillée est réservée à la phase 6.

## ADH-06 — Réécriture des concepts

Les 24 propositions de textes figurent dans `contenus-24-micro-lecons.md` et dans le JSON de parcours. Elles expliquent des relations ; elles ne sont pas encore des écrans ou des activités du pilote. Leur longueur et leur découpage pourront évoluer après essais. Ce travail ne réécrit pas les 76 anciennes cartes mot pour mot et ne produit aucun média final.

### Décisions musicales à respecter

1. **Case / emplacement / corde à vide** : la case est un espace ; l’emplacement combine une corde et une case ; 0 est la convention pour la corde à vide, pas un nouvel espace fretté.
2. **Noms français/internationaux** : Do–C, Ré–D, Mi–E, Fa–F, Sol–G, La–A, Si–B. Traduction retirée pendant son test.
3. **Tons et demi-tons naturels** : E–F et B–C = un demi-ton ; les autres voisins naturels = un ton. Une case = un demi-ton sur une même corde ; deux cases = un ton.
4. **Deux cordes de Mi** : mêmes noms aux mêmes cases, mais **deux octaves**, 24 demi-tons, fréquence ×4. Ne pas présenter cette comparaison comme un unisson ou une octave simple.
5. **Octave simple** : E2 en corde 6 case 0 → E3 en corde 4 case 2 ; A2 en corde 5 case 0 → A3 en corde 3 case 2. Fréquence ×2. Ne pas généraliser leur forme à toutes les cordes : l’écart Sol–Si change la géométrie.
6. **Unisson réel dans 0–4** : B3 en corde 3 case 4 = B3 en corde 2 à vide. C’est la seule paire d’emplacements de même hauteur dans cette zone sur six cordes standard. Un timbre différent sur l’instrument ne change pas cette hauteur.
7. **Dièse et bémol** : modification de la hauteur de ±1 demi-ton, pas simple lettre suivante/précédente. Les premiers exemples ne franchissent pas les limites de la zone.
8. **Enharmonie** : dans le tempérament égal du jeu, C♯/D♭, D♯/E♭, F♯/G♭, G♯/A♭, A♯/B♭ partagent leurs hauteurs. E♯=F et B♯=C sont possibles ; ne pas écrire que E et B n’ont pas de dièse. La graphie attendue dépend du contrat de tâche.
9. **Graphie vs hauteur** : une tâche pure de position accepte les écritures enharmoniques de la hauteur demandée ; une conversion de graphie demande l’écriture précisée et peut signaler « hauteur juste, nom à revoir ». Une erreur de graphie ne devient pas une erreur physique de hauteur.
10. **Fondamentale** : note qui donne son nom à l’accord, sans exiger la maîtrise du doigté de cet accord.

### Comparaisons sonores prévues, non produites

| Relation à vérifier | Couple de référence | Ce que le support doit démontrer |
| --- | --- | --- |
| Même nom, deux octaves | E2 / E4 | Même lettre, hauteur différente, rapport ×4 |
| Octave simple | E2 / E3 | Même lettre, hauteur différente, rapport ×2 |
| Unisson | B3 Sol case 4 / B3 Si à vide | Même hauteur à deux emplacements ; le modèle synthétique peut avoir le même timbre |
| Enharmonie | F♯2 / G♭2 sur la même position | Même hauteur, deux écritures ; ne pas jouer deux hauteurs différentes |
| Voisinage | F2 / F♯2 / G2 | Deux demi-tons successifs, l’altération entre deux ancrages |

Une tâche de comparaison peut donner les noms et demander la relation ; elle ne suppose pas l’oreille absolue. Son résultat auditif reste distinct du rappel visuel. En l’absence de son, les tâches visuelles restent disponibles et cette tâche sonore est reportée explicitement.

## Critères de sortie de phase 2

24 objectifs associés à des prérequis antérieurs ; Mi aigu relié dès la deuxième étape ; deux applications avant la carte complète ; 30 positions couvertes dans les deux sens ; 76 anciennes fiches reclassées ; unissons, octaves et exemples de notes vérifiés ; textes conceptuels proposés. **Les contrôles de conception sont satisfaits. Aucun essai d’élève ou critère de produit final n’est présenté comme déjà validé.**


---

# ADH-06 — Les 24 propositions conceptuelles

Version de conception pour validation. Il s’agit des textes de base, pas d’écrans finalisés : essais, corrections et supports audio seront construits au pilote. Les références de positions concernent une six cordes standard ; le travail instrumental reste déclaratif.

## ML01 — Lire le diagramme

**Étape 1 · compétence principale C01 · prérequis : aucun.**

### Texte proposé

Le diagramme montre le manche vu de face : le sillet est à gauche et la grosse corde en bas, même en portrait. Une case est l’espace entre deux frettes, les petites barres métalliques. Un emplacement combine une corde et une case. Le nombre 0 désigne la corde à vide : vous ne posez pas de doigt sur le manche.

### Vérification et visuel prévus

- Action observable : Distinguer corde à vide, case et emplacement ; pointer une coordonnée donnée.
- Visuel : Manche réel et diagramme côte à côte, sillet et grosse corde soulignés.
- Application : Pointer 0 puis 1 sur écran / retrouver ces deux repères sur sa guitare.
- Sens / relation : coordonnée → emplacement
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML02 — Deux noms pour une note

**Étape 1 · compétence principale C02 · prérequis : ML01.**

### Texte proposé

Do, Ré, Mi, Fa, Sol, La, Si correspondent à C, D, E, F, G, A, B. Ce sont deux façons de nommer les mêmes notes. Choisissez votre langue habituelle ; apprendre l’autre reste facultatif. Pendant le petit test de traduction, la correspondance disparaît pour vous laisser la retrouver.

### Vérification et visuel prévus

- Action observable : Convertir les sept noms naturels dans les deux sens, sans traduction visible pendant la vérification.
- Visuel : Sept paires Do–C à Si–B, puis une paire masquée à compléter.
- Application : Mini-jeu de traduction ; facultatif pour la progression principale.
- Sens / relation : français ↔ international
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML03 — Les départs à vide

**Étape 1 · compétence principale C01 · prérequis : ML01.**

### Texte proposé

L’accordage donne le son de départ de chaque corde à vide. En standard, du grave vers l’aigu : E, A, D, G, B, E. Nous commençons par la grosse corde de Mi, puis La. Les numéros se comptent dans l’autre sens : la corde la plus fine est la 1, la plus grosse la 6 sur cette guitare.

### Vérification et visuel prévus

- Action observable : Pointer une corde indiquée et nommer ses notes à vide avec puis sans légende sur le petit groupe choisi.
- Visuel : Six cordes, case 0 ; Mi grave puis La mises en avant avant la vue complète.
- Application : Toucher et écouter chaque départ / faire sonner à vide les seules cordes demandées.
- Sens / relation : coordonnée → emplacement
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML04 — E, F, G sur Mi grave

**Étape 2 · compétence principale C03 · prérequis : ML03.**

### Texte proposé

Sur Mi grave : E à vide, F en case 1 et G en case 3. Une case de déplacement change la hauteur d’un demi-ton ; deux cases font un ton. E–F occupe une case, F–G en occupe deux. Vous pouvez garder ces trois repères et laisser la case intermédiaire pour plus tard.

### Vérification et visuel prévus

- Action observable : Nommer puis retrouver E, F et G sur la corde 6 ; repérer le trou entre F et G sans encore le mémoriser.
- Visuel : E en 0, F en 1, G en 3 ; case 2 non nommée.
- Application : Retrouver une position demandée sur écran / retrouver les trois notes sans phrase rapide.
- Sens / relation : position → nom ; nom → position
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML05 — La même carte sur Mi aigu

**Étape 2 · compétence principale C06 · prérequis : ML04.**

### Texte proposé

Les deux cordes de Mi ont les mêmes noms aux mêmes cases : E en 0, F en 1, G en 3. Elles ne donnent pas la même hauteur. Le Mi aigu est deux octaves au-dessus du Mi grave : sa fréquence est quatre fois plus élevée. Le numéro de corde permet de choisir le registre demandé.

### Vérification et visuel prévus

- Action observable : Transférer 0, 1, 3 à la corde 1 et distinguer même nom et son plus haut.
- Visuel : Deux cordes de Mi seules mises en valeur, positions alignées et comparaison E2/E4.
- Application : Choisir un des deux Mi demandés / comparer les deux cordes sans saut moteur chronométré.
- Sens / relation : relation entre deux emplacements
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML06 — Une première phrase E–F–G

**Étape 2 · compétence principale C07 · prérequis : ML04, ML05.**

### Texte proposé

E–F–G–F–E devient une petite phrase quand vous jouez les notes l’une après l’autre. Prenez une seule corde de Mi ; chaque nom vous ramène à son emplacement. Commencez lentement, sans compter les cases depuis le début si le repère vous revient déjà. La continuité se travaille après les bonnes notes.

### Vérification et visuel prévus

- Action observable : Exécuter E–F–G–F–E sur une corde de Mi au choix depuis les noms.
- Visuel : Cinq noms, un curseur et une pulsation lente ; diagramme de correction révélé après essai.
- Application : Toucher la suite de positions / jouer la suite sur une seule corde, sans contrainte de doigté.
- Sens / relation : noms → suite de positions ; guitare en déclaration séparée
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML07 — A, B, C sur La

**Étape 3 · compétence principale C03 · prérequis : ML06.**

### Texte proposé

Sur La : A à vide, B en case 2 et C en case 3. A–B est un ton, B–C un demi-ton. Les noms naturels suivent C, D, E, F, G, A, B, puis recommencent ; E–F et B–C sont séparés d’un demi-ton, les autres voisins d’un ton. Les lettres seules ne donnent donc pas une case chacune.

### Vérification et visuel prévus

- Action observable : Nommer et retrouver A, B et C sur la corde 5 ; distinguer le ton A–B du demi-ton B–C.
- Visuel : A en 0, B en 2, C en 3 ; espace de deux cases entre A et B.
- Application : Recherche sur écran / notes isolées sur La.
- Sens / relation : position → nom ; nom → position
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML08 — Choisir entre Mi et La

**Étape 3 · compétence principale C04 · prérequis : ML05, ML07.**

### Texte proposé

Un même nom peut revenir sur plusieurs cordes. Si la consigne dit « trouvez un E », une position de E dans le groupe étudié suffit. Si elle précise une corde, cherchez sur cette corde. La consigne choisit la contrainte : ce n’est pas à vous de deviner quel emplacement le jeu attend.

### Vérification et visuel prévus

- Action observable : Trouver une seule occurrence admissible sur les trois cordes étudiées, puis une corde imposée.
- Visuel : Mi grave, Mi aigu et La ; noms cachés pendant les essais.
- Application : Une note et un toucher / trouver la même consigne sur sa guitare.
- Sens / relation : position → nom ; nom → position
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML09 — Une ligne de basses E–A–B–A

**Étape 3 · compétence principale C07 · prérequis : ML07, ML08.**

### Texte proposé

Une ligne de basses emploie des sons graves pour donner un appui musical. Ici, E se joue à vide sur Mi grave, puis A, B, A sur La. Vous connaissez déjà tous les emplacements de cette suite. Gardez d’abord leur ordre ; une pulsation régulière viendra ensuite, sans devoir apprendre un accord.

### Vérification et visuel prévus

- Action observable : Enchaîner une suite courte sur les cordes graves à partir de noms et de la corde annoncée.
- Visuel : E2 puis A2–B2–A2, une pulsation lente régulière, sans grille d’accord imposée.
- Application : Jouer la ligne sur écran / jouer la ligne à tempo libre puis avec référence.
- Sens / relation : noms → suite de positions ; guitare en déclaration séparée
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML10 — D, E, F sur Ré

**Étape 4 · compétence principale C03 · prérequis : ML08.**

### Texte proposé

La corde de Ré commence sur D. Ses repères naturels sont D en 0, E en 2 et F en 3. Comparez ce trajet à La : deux cases, puis une case. La relation entre les noms explique les distances ; la nouvelle corde change le son de départ, pas la taille du demi-ton.

### Vérification et visuel prévus

- Action observable : Nommer et retrouver les notes naturelles de la corde 4.
- Visuel : D en 0, E en 2, F en 3 ; comparaison ton puis demi-ton.
- Application : Trois repères isolés / mêmes repères sur la corde Ré.
- Sens / relation : position → nom ; nom → position
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML11 — G, A, B sur Sol

**Étape 4 · compétence principale C03 · prérequis : ML10.**

### Texte proposé

Sur Sol : G à vide, A en case 2 et B en case 4. G–A et A–B sont deux tons successifs : avancez de deux cases chaque fois. La case 4 appartient à notre zone ; la corde à vide compte comme position 0. Vous disposez maintenant de trois ancrages sur cette ligne.

### Vérification et visuel prévus

- Action observable : Nommer et retrouver G, A, B sur la corde 3, sans importer par erreur les positions de Ré.
- Visuel : G en 0, A en 2, B en 4 ; deux déplacements de deux cases.
- Application : Recherche sur la nouvelle corde / petite suite G–A–B–A.
- Sens / relation : position → nom ; nom → position
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML12 — Retrouver une octave

**Étape 4 · compétence principale C06 · prérequis : ML10, ML11, ML05.**

### Texte proposé

Deux notes à une octave d’écart partagent leur nom, mais la plus aiguë a une fréquence deux fois plus élevée. E sur Mi grave à vide et E sur Ré case 2 forment une octave. A sur La à vide et A sur Sol case 2 aussi. Ces deux couples sont des repères précis ; ne prolongez pas automatiquement leur forme à toutes les cordes.

### Vérification et visuel prévus

- Action observable : Relier E2 à E3 et A2 à A3 : même nom, hauteur multipliée par deux.
- Visuel : Deux couples de positions avec flèches séparées, exemple sonore avant/après.
- Application : Pointer le partenaire dans une paire annoncée / comparer E2–E3, puis A2–A3.
- Sens / relation : relation entre deux emplacements
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML13 — B, C, D sur Si

**Étape 5 · compétence principale C03 · prérequis : ML12.**

### Texte proposé

Sur Si : B en 0, C en 1 et D en 3. B–C est déjà un demi-ton, comme E–F ; C–D est un ton. Cette corde commence donc par une case, puis deux. Pour retrouver une note, gardez son emplacement propre au lieu de recopier les cases de la corde précédente.

### Vérification et visuel prévus

- Action observable : Nommer et retrouver B, C, D sur la corde 2 ; repérer le demi-ton B–C.
- Visuel : B en 0, C en 1, D en 3 ; première case contre deux cases ensuite.
- Application : Recherche sur écran / notes isolées sur Si.
- Sens / relation : position → nom ; nom → position
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML14 — La même hauteur à deux endroits

**Étape 5 · compétence principale C06 · prérequis : ML11, ML13, ML12.**

### Texte proposé

Sol case 4 et Si à vide donnent tous deux B3 : le même nom et la même hauteur. C’est un unisson. Une octave, elle, garde le nom et change la hauteur. Sur une vraie guitare, le timbre, la couleur du son, peut varier entre ces deux cordes sans changer la note produite.

### Vérification et visuel prévus

- Action observable : Identifier l’unisson B3 de Sol case 4 et Si à vide, et le distinguer d’une octave.
- Visuel : Deux points B3, comparaison sonore de même hauteur puis B2/B3.
- Application : Associer les deux positions / jouer les deux B3 puis comparer leur timbre.
- Sens / relation : relation entre deux emplacements
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML15 — Une note, plusieurs positions

**Étape 5 · compétence principale C04 · prérequis : ML13, ML14.**

### Texte proposé

Le nom indique une famille de notes ; la corde et la case indiquent un emplacement ; la hauteur précise son registre. Un E grave et un E aigu ont le même nom, pas le même son. Quand le jeu ne fixe ni corde ni registre, choisissez une seule position admissible. Une contrainte ajoutée sera annoncée explicitement.

### Vérification et visuel prévus

- Action observable : Trouver une seule occurrence d’un nom dans la zone naturelle ; ajouter une corde ou une hauteur imposée dans un bloc séparé.
- Visuel : Trois modes de consigne distincts : un E, E sur Ré, E plus haut dans la paire étudiée.
- Application : Une seule réponse par essai ; la recherche de toutes les occurrences reste une option avancée ultérieure.
- Sens / relation : position → nom ; nom → position
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML16 — Déduire un dièse

**Étape 6 · compétence principale C05 · prérequis : ML15, ML04.**

### Texte proposé

Le signe ♯, dièse, augmente une note d’un demi-ton. Sur Mi grave, F en case 1 devient F♯ en case 2 ; G est en case 3. Vous pouvez déduire une note manquante en avançant d’une case depuis un ancrage connu. Les autres positions intermédiaires viendront par petits groupes, avant de les rappeler directement.

### Vérification et visuel prévus

- Action observable : Retrouver une position intermédiaire par demi-ton puis retirer la démonstration pour le rappel.
- Visuel : F–F♯–G sur Mi grave, puis famille par famille sur les autres cordes.
- Application : Déduire puis rappeler les 12 positions altérées ; application sonore sur trois notes locales.
- Sens / relation : position → nom ; nom → position
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML17 — Déduire un bémol

**Étape 6 · compétence principale C05 · prérequis : ML16.**

### Texte proposé

Le signe ♭, bémol, diminue une note d’un demi-ton. Depuis G en case 3 sur Mi grave, reculez d’une case : vous trouvez G♭. Deux noms naturels ne sont pas toujours voisins d’une case ; appliquez le déplacement d’un demi-ton, pas un recul d’une lettre. Les premiers exemples restent dans les cases 0 à 4.

### Vérification et visuel prévus

- Action observable : Descendre d’un demi-ton depuis une note nommée et distinguer sens du déplacement et nom écrit.
- Visuel : G–G♭–F puis C–B, avec exemples hors limite explicitement exclus.
- Application : Répondre à une consigne en bémol / retrouver la position avant de la jouer.
- Sens / relation : position → nom ; nom → position
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML18 — Deux écritures pour la même hauteur

**Étape 6 · compétence principale C06 · prérequis : ML16, ML17.**

### Texte proposé

Dans le système tempéré utilisé par le jeu, F♯ et G♭ désignent la même hauteur : ce sont des noms enharmoniques. La case 2 sur Mi grave peut porter les deux noms sans déplacer le doigt. E♯ correspond à F et B♯ à C : E et B peuvent bien recevoir un dièse. L’écriture dépend du contexte musical ; une tâche de graphie précisera le nom attendu.

### Vérification et visuel prévus

- Action observable : Associer F♯/G♭, C♯/D♭, D♯/E♭, G♯/A♭ et A♯/B♭ sans déplacer le doigt.
- Visuel : Un point partagé par deux étiquettes ; même hauteur avant/après changement du nom.
- Application : Associer les écritures puis rappeler la graphie demandée, distincte de la seule hauteur.
- Sens / relation : relation entre deux emplacements
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML19 — Lire une suite de noms

**Étape 7 · compétence principale C07 · prérequis : ML18.**

### Texte proposé

Les noms peuvent guider une phrase sans partition. Sur Mi grave, E–F♯–G–F♯–E utilise les cases 0–2–3–2–0. Essayez d’abord depuis les noms ; le diagramme de correction apparaît ensuite. Le but est de choisir volontairement les notes, pas de retenir seulement une forme ou un numéro de case.

### Vérification et visuel prévus

- Action observable : Exécuter une courte suite nouvelle à partir des noms et de la corde donnée.
- Visuel : Motif E–F♯–G–F♯–E sur Mi grave ; correction montrée après essai.
- Application : Toucher les positions / jouer une phrase locale sans partition.
- Sens / relation : noms → suite de positions ; guitare en déclaration séparée
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML20 — Comparer avec une référence sonore

**Étape 7 · compétence principale C07 · prérequis : ML19.**

### Texte proposé

Écoutez la suite de référence, puis comparez votre essai : les notes sont-elles dans le même ordre, aux hauteurs prévues, sans arrêt involontaire ? Les noms restent disponibles : il ne s’agit pas de reconnaître une note à l’oreille seule. Sans guitare, vous pouvez comparer les sons déclenchés à l’écran ; avec guitare, votre bilan reste une autoévaluation.

### Vérification et visuel prévus

- Action observable : Comparer sa suite au modèle après essai : ordre, hauteurs et continuité.
- Visuel : Commandes Écouter/Rejouer avec noms disponibles ; pas de devinette auditive pure.
- Application : Comparer la suite déclenchée à l’écran / comparer sa guitare et le modèle ; déclaration distincte.
- Sens / relation : noms → suite de positions ; guitare en déclaration séparée
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML21 — Trouver la fondamentale

**Étape 7 · compétence principale C07 · prérequis : ML19, ML13.**

### Texte proposé

La fondamentale est la note qui donne son nom à l’accord. Em, Mi mineur, a E pour fondamentale ; Am a A ; Bm a B ; C a C. Pour cette activité, trouvez et jouez seulement cette note dans la zone connue. Vous pouvez ensuite essayer un accord déjà familier, mais aucun doigté d’accord n’est nécessaire pour répondre.

### Vérification et visuel prévus

- Action observable : Trouver une occurrence de la note qui nomme Em, Am, Bm ou C ; expliquer ce lien après un exemple.
- Visuel : Carte Em → fondamentale E ; mini-voicing fourni mais non exigé.
- Application : Trouver le nom sur écran / jouer uniquement la fondamentale ; jouer l’accord est facultatif.
- Sens / relation : noms → suite de positions ; guitare en déclaration séparée
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML22 — Le rappel sans repère de réponse

**Étape 8 · compétence principale C03+C04 · prérequis : ML18, ML15.**

### Texte proposé

Une position vous demande son nom ; un nom vous demande une position. Nous vérifions ces deux trajets séparément, sans étiquette de réponse ni corde éclairée qui donnerait la solution. Les indices réapparaissent dans l’entraînement si vous les demandez, mais cet essai n’est alors plus un rappel autonome. La vitesse n’empêche pas de continuer à apprendre.

### Vérification et visuel prévus

- Action observable : Vérifier les deux sens séparément, toutes les positions sans indices de réponse.
- Visuel : Diagramme neutre et clavier chromatique complet ; noms/corde éclairée retirés selon le contrat de tâche.
- Application : Cycle de 60 items, découpable en plusieurs séances ; aucune obligation de finir en 5 minutes.
- Sens / relation : position → nom ; nom → position
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML23 — Une phrase que vous n’avez pas répétée

**Étape 8 · compétence principale C07 · prérequis : ML19, ML20, ML21, ML22.**

### Texte proposé

Une phrase nouvelle permet de vérifier si vos repères servent ailleurs que dans l’exemple répété. Lisez ses noms, choisissez les positions puis essayez la suite sans modèle préalable. Le modèle vient après la première tentative. Sur guitare, distinguez une note cherchée, une note mal jouée et une hésitation de geste ; ces difficultés ne prouvent pas la même chose.

### Vérification et visuel prévus

- Action observable : Exécuter une phrase nouvelle utilisant les acquis ; distinguer recherche de note et aisance motrice.
- Visuel : Phrase de bilan E–G–F♯–F–E : noms donnés, aucun diagramme de solution ni modèle sonore avant le premier essai.
- Application : Suite écran mesurée / même phrase sur une corde de guitare, résultat déclaré. Variante : G–F♯–E–F–G.
- Sens / relation : noms → suite de positions ; guitare en déclaration séparée
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois

## ML24 — Ce qui reste après un délai

**Étape 8 · compétence principale C08 · prérequis : ML22, ML23.**

### Texte proposé

Revenir après un délai aide à distinguer une réussite immédiate d’un acquis qui reste disponible. Les positions sont revérifiées sans revoir d’abord leur fiche, dans les deux sens et par petits lots. Le bilan du jeu et les tâches déclarées sur guitare restent séparés. Une hésitation indique quoi retravailler ; elle n’efface pas tout votre parcours.

### Vérification et visuel prévus

- Action observable : Confirmer le rappel au moins 24 h après la dernière pratique de l’élément, sans fiche préalable.
- Visuel : Bilan en deux panneaux : rappel mesuré et instrument déclaré ; détail local disponible.
- Application : Même couverture dans une présentation ou un ordre différent ; confirmation fractionnée par lots.
- Sens / relation : position → nom ; nom → position après délai
- Aides : A3 découverte → A2 guidage → A1 rappel contextualisé → A0 vérification ; une difficulté retirée à la fois
