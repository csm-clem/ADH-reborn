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
