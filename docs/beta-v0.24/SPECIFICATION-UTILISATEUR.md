# Daily Fretboard Trainer — Cartographie des Premiers Parcours

**Document de conception pour la bêta — 18 octobre 2026**

Statut : proposition détaillée à relire avant implémentation. Le document couvre **toute la section « Premiers Parcours »**, pas l’ensemble de la projection des parcours futurs. Aucun code de l’application n’est modifié.

## 1. Périmètre et organisation

| Branche | Parcours inclus dans cette bêta | Résultat visé |
|---|---|---|
| **Grand Débutant** | Vocabulaire, diagramme, noms des notes, nom/hauteur/octave. | Comprendre une consigne et utiliser le jeu sans explication extérieure. |
| **Pratique ciblée → Zones** | Zone I : **0–4** ; Zone II : **4–8** ; Zone III : **8–12**. | Nommer et retrouver toutes les positions de chaque zone, naturelles puis altérées. |
| **Pratique ciblée → Cordes** | Les trois premières cordes retenues, chacune **de 0 à 12**. | Retrouver les notes longitudinalement, au-delà d’une seule position de main. |
| **Progression guidée** | **Niveau 1 : Débutant**, sélection de chapitres de Zone I et des deux premières cordes. | Réactiver les mêmes acquis dans plusieurs contextes au cours d’une progression spiralaire. |

### Hiérarchie retenue

**Branche → parcours → chapitre → cours visuel → activités distinctes.**

Exemple : Pratique ciblée → Zone I → La note E → Découvrir ses positions → Nommer les positions / Retrouver les positions / Nommer en mélange / Retrouver en mélange.

Un chapitre regroupe un **sujet d’étude**, pas un nouveau mode de réponse. Les titres désignent le sujet ; les sous-titres indiquent l’action. Les deux sens de question restent dans des activités séparées.

### Hypothèses explicites

1. **Étendue des cordes bêta : 0–12.** Ta projection mentionne 0–12 et 0–24 sans trancher l’étendue des premières cordes. La proposition retient 0–12 : un cycle chromatique complet et le retour du même nom à l’octave, sans doubler immédiatement la longueur étudiée. Le travail 0–24 reste une extension.
2. **Les trois cordes sont calculées sur le profil.** Dans un accordage usuel, il s’agit des cordes `n`, `n−1`, `n−2`. Si l’accordage réentrant change l’ordre réel des hauteurs (exemple : ukulele), on explique simplement cette particularité et on évite d’appeler systématiquement la dernière corde « la plus grave ». Ne pas renuméroter l’instrument.
3. **Les zones se recouvrent aux cases 4 et 8.** Une position frontière est la même position physique dans deux contextes ; elle n’est jamais comptée comme deux notes apprises.
4. **Les prérequis sont des recommandations.** Aucun parcours ni chapitre n’est verrouillé par les résultats. On peut commencer directement par une spécialité et consulter l’explication utile.
5. Les seuils chiffrés ci-dessous reprennent les règles du projet. Ils constituent des critères de fonctionnement pour la bêta, pas une preuve d’efficacité pédagogique générale.

## 2. Contrat commun aux chapitres d’apprentissage des notes

Les identifiants de cette section servent au document et à la préparation des contenus ; ils ne sont pas affichés aux joueurs.

### 2.1 Ordre d’apprentissage réutilisable

Pour chaque ensemble de positions étudié :

1. Présenter le cadre : cordes, cases et accordage réellement choisis.
2. Apprendre ou rappeler les cordes à vide lorsque le parcours les contient.
3. Apprendre les **familles naturelles présentes**, en commençant par les noms de l’accordage, sans doublonner les noms répétés.
4. Pour chaque famille : découverte de ses positions, travail isolé lorsque pertinent, puis mélange avec les positions déjà rencontrées dans ce parcours.
5. Une fois les naturelles apprises, travailler leurs correspondances : même nom, octaves, et même hauteur à plusieurs endroits si cela existe.
6. Étudier les **familles altérées présentes**. Celles déjà dans l’accordage passent après les naturelles, avant les autres altérations.
7. Terminer par un mélange complet du périmètre.

En six cordes standard, l’ordre de référence des familles est **E → A → D → G → B → F → C**, puis **F♯ → C♯ → G♯ → D♯ → A♯**. Cette liste sert d’exemple ; les familles absentes du périmètre ne génèrent pas de chapitre. Un accordage personnalisé garde ses cordes réelles : un bref préambule peut nommer une corde altérée sans lancer prématurément l’apprentissage de toute sa famille.

Pour les autres profils, prendre les naturelles de l’accordage dans l’ordre des cordes retenu pour sa présentation, puis les naturelles manquantes. Dans un parcours de zone, cela concerne toutes les cordes du profil ; dans un parcours d’une seule corde, uniquement cette corde (voir 5.1). Pour ordonner ces dernières de façon explicable, parcourir le cycle des noms à partir de la première note naturelle de la corde la plus grave — à vide ou en case 1 si nécessaire — en sautant les familles déjà présentes. Les altérations restantes gardent l’ordre stable ci-dessus après les éventuelles familles altérées de l’accordage. Ce choix d’ordre devra être appliqué à la source commune du parcours lors de l’implémentation ; les tableaux n’imposent pas le standard six cordes aux autres instruments.

**Accordage avec des cordes altérées à vide :** leurs noms réels peuvent être appris dans le préambule d’accordage, mais leurs positions sont écartées des mélanges consacrés aux naturelles. Elles réintègrent les mélanges au chapitre de leur famille, après les naturelles. Ainsi, « Toutes les notes naturelles » reste exact et sa roue demeure diatonique.

### 2.2 Activités et critères partagés

| Code   | Activité             | Objectif et critère observable                                                                                                                                                                                                                                                                   |
| ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **D**  | Découvrir            | Voir le diagramme, écouter si souhaité, chercher toutes les positions de la famille. Les positions trouvées deviennent visibles ; les essais guidés ne sont pas comptés comme un rappel autonome.                                                                                                |
| **N**  | Nommer               | Identifier une position montrée. Au moins **90 % de premières réponses correctes** sur une séance complète, sans aide révélant la réponse. Dans les familles à plusieurs hauteurs, distinguer les noms avec octave.                                                                              |
| **R**  | Retrouver            | Toucher une position conforme au nom avec octave, à la corde et au périmètre demandés. Même seuil de 90 %, avec les mêmes règles d’aide. Ne jamais préafficher la réponse.                                                                                                                       |
| **MN** | Nommer en mélange    | Reconnaître la nouvelle famille parmi les positions déjà rencontrées dans ce parcours. Séance complète à 90 % ou plus. La nouvelle famille représente au moins **30 % des questions**, à des moments aléatoires.                                                                                 |
| **MR** | Retrouver en mélange | Retrouver ces mêmes familles dans une activité distincte de MN, avec les mêmes seuils et la même part minimale de nouvelles positions.                                                                                                                                                           |
| **CO** | Correspondances      | Relier les positions naturelles de même nom ; distinguer mêmes hauteurs et différentes octaves. Chaque relation réellement disponible doit faire l’objet d’une vérification réussie, pas d’une seule illustration consultée. Les demandes de plusieurs occurrences sont annoncées explicitement. |
| **BN** | Bilan naturel        | Réutiliser le dernier mélange naturel, en nommant et en retrouvant. Vérifier la couverture des positions naturelles dans les deux sens ; aucun nouveau chapitre cloné n’est nécessaire pour une épreuve identique.                                                                               |
| **BT** | Bilan toutes notes   | Réutiliser le dernier mélange complet, en nommant et en retrouvant. Vérifier la couverture de toutes les positions, naturelles et altérées, dans les deux sens.                                                                                                                                  |

**Une séance évaluée comporte 20 à 24 questions ; maximum absolu 30.** Découper une vérification plus large en plusieurs séances. Les cours, démonstrations et manipulations de découverte sont courts et ne sont pas artificiellement portés à vingt questions.

**Cas important : famille sans discrimination possible.** Une famille peut ne contenir qu’une seule position ou une seule hauteur, notamment sur une corde. Une roue à une seule réponse ne mesure rien. Dans ce cas, garder la découverte isolée et le travail de localisation pertinent ; déplacer la vérification de nomination vers MN, avec des notes déjà rencontrées. Ne pas ajouter de fausses positions ou d’octaves inexistantes pour fabriquer une difficulté. Au premier contact, quelques noms de comparaison peuvent être expliqués visuellement ; ils ne deviennent pas pour autant des positions acquises.

### 2.3 Séance réussie, chapitre validé et fluidité

| Indicateur | Règle proposée |
|---|---|
| **Séance réussie** | Au moins 90 % de premières réponses correctes sur la séance complète. Conserver séparément les réponses avec aide. |
| **Chapitre de famille validé** | D effectué ; activités pertinentes N/R et MN/MR réussies ; chaque position de la famille retrouvée au moins une fois correctement en première réponse, sans aide, dans les deux sens. La nomination peut être constatée en mélange dans le cas non discriminant décrit plus haut. |
| **Bilan de parcours validé** | Chaque chapitre requis validé ; chaque position du périmètre couverte sans aide dans les deux sens ; bilans naturels et complets réussis. La couverture peut provenir de plusieurs séances. |
| **Fluidité** | Temps moyen et étoiles supplémentaires, sans condition de vitesse pour poursuivre. Le défi cinq étoiles reste 100 % de précision et un temps moyen ≤ 1 s selon les règles du jeu. |
| **Révision après délai** | Recommander une nouvelle séance après une pause ou lors d’un retour. Ne pas imposer d’attendre le lendemain pour accéder à la suite ; ne pas déclarer une mémorisation durable sur la base d’une seule réussite. |

La couverture des positions et le pourcentage ne se remplacent pas : réussir 22 questions sur 24 ne prouve pas qu’on a rencontré toutes les positions d’une zone de quarante emplacements. Le générateur doit faire circuler les positions encore peu testées entre les séances, tout en respectant les 30 % de la nouvelle famille. Une correction immédiatement répétée ne remplace pas une première réponse autonome sur un essai ultérieur.

La carte des progrès peut conserver son indicateur « Travaillée / À revoir » à 85 % selon les règles retenues : cet indicateur local n’est pas le seuil de réussite de 90 % d’une séance.

## 3. Grand Débutant : commencez ici ! — facultatif

Les prérequis décrivent l’ordre conseillé des notions ; ils ne verrouillent pas l’accès.

| ID | Chapitre : sujet / sous-titre | Objectif observable | Prérequis | Critère de réussite |
|---|---|---|---|---|
| GD-01 | **Votre instrument** / Reconnaître ses éléments | Montrer le manche, une corde, une case, une frette et le sillet ; distinguer une corde à vide d’une note appuyée. | Aucun savoir musical. Instrument et nombre de cordes sélectionnés dans la configuration. | Identifier les cinq éléments sans leurs étiquettes, dont l’espace d’une case et la barre d’une frette ; distinguer « à vide » de la case 1. Chaque repère doit avoir une réponse correcte autonome. Reproposer seulement les repères ratés, sur un nouvel exemple. |
| GD-02 | **Le diagramme du manche** / Lire les cordes et les cases | Relier une corde réelle à sa ligne, lire une coordonnée, distinguer inlay et pastille, comprendre le sens vers l’aigu sur une même corde. | GD-01 : corde, case, frette, sillet et à vide. | Retrouver trois coordonnées variées : une à vide, une sur la corde 1 et une sur une autre corde. Distinguer un repère fixe d’une pastille de jeu. Désigner le sens vers l’aigu sur une même corde. |
| GD-03 | **Les noms des notes** / Reconnaître votre notation | Reconnaître les sept noms naturels et leur ordre cyclique dans la notation choisie. Comprendre que Do–Ré–Mi et C–D–E nomment les mêmes notes. | Aucun prérequis de position sur le manche. Choix de notation rappelé. | Compléter le cycle des sept noms dans la notation active, chaque nom étant demandé au moins une fois, sans traduction visible. Apprendre les sept traductions n’est pas exigé. Si l’accordage comporte une altération, lire un nom réel de corde avec son signe. |
| GD-04 | **Nom, hauteur et octave** / Comprendre la note demandée | Distinguer un nom seul, une hauteur précise et une position ; comprendre les actions « nommer » et « retrouver ». | GD-02 pour les coordonnées ; GD-03 pour les noms dans la notation active. | Distinguer un même nom à deux hauteurs et reconnaître l’octave demandée. Réussir deux essais séparés : nommer un point, puis retrouver une note sur la corde annoncée. Les noms employés ont été présentés auparavant. |

**Justification des critères :** chaque vérification vise une confusion qui peut empêcher de jouer. Un pourcentage global pourrait masquer une confusion persistante entre case et frette. On vérifie chaque repère indispensable, sans seuil de vitesse arbitraire.

Une bonne réponse immédiatement après affichage de la solution permet de continuer à s’entraîner. Pour constater un repérage autonome, proposer une nouvelle demande, solution masquée et exemple différent.

### Cours à intégrer pour le Grand Débutant

Les textes ci-dessous sont des **propositions de contenus d’écran**. Les explications de conception ne sont pas destinées à être affichées au joueur.

| Cours                  | Titre / sous-titre                                                                                 | Visuel et geste                                                                                                                                           | Texte court proposé                                                                                                                                                                                     | Vérification                                                                                                                                                                                  |     |
| ---------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| GD-01.1                | **Votre instrument** / Reconnaître ses éléments                                                    | Illustration du profil choisi ; une seule zone et son mot apparaissent à la fois. Zoom pour case, frette et sillet.                                       | « Voici le manche. » Puis une carte par élément : « Une corde. » / « Une case : l’espace entre deux frettes. » / « Une frette : la barre métallique. » / « Le sillet : la barre au départ des cordes. » | Retrouver séparément les cinq éléments sans étiquette. Vérifier particulièrement case ≠ frette. Ne pas ajouter de vocabulaire concernant le corps ou les accessoires.                         |     |
| GD-01.2                | **Les cordes à vide** / Distinguer deux façons de jouer                                            | Deux schémas : corde libre au départ ; doigt dans la case 1, près de la frette. Écoute facultative.                                                       | « À vide : sans appuyer. » / « Note appuyée : un doigt dans une case. »                                                                                                                                 | Choisir le schéma « à vide », puis refaire une comparaison avec les schémas inversés. Expliquer que 0 signifie « à vide », pas une case frettée supplémentaire.                               |     |
| GD-02.1                | **Votre manche en dessin** / Relier les deux vues                                                  | Instrument et diagramme ; une même corde est mise en évidence dans les deux représentations.                                                              | « Une ligne = une corde. » / « Voici la même corde. »                                                                                                                                                   | Retrouver sur le diagramme la corde montrée sur l’instrument. Son nom musical n’est pas demandé.                                                                                              |     |
| GD-02.2                | **Cordes et cases** / Trouver une adresse                                                          | Numéros de cordes à gauche, de cases sous le manche. Exemple résolu, puis trois demandes.                                                                 | « Corde 1. Case 2. Touchez leur croisement. »                                                                                                                                                           | Coordonnées variées, dont une à vide. Aucune pastille ne révèle déjà la bonne position. Les boutons de réponse sont proposés en alternative.                                                  |     |
| GD-02.3                | **Les repères du manche** / Distinguer repère et note                                              | Inlay fixe entre les cordes ; pastille plus grande sur une corde. Une animation déplace seulement la pastille.                                            | « Repère fixe : aide à compter les cases. » / « Pastille de jeu : montre une note. »                                                                                                                    | Montrer lequel indique la note à travailler. Ne pas demander d’apprendre la liste des cases portant un inlay.                                                                                 |     |
| GD-02.4                | **Grave et aigu** / Suivre une même corde                                                          | Flèche du sillet vers les numéros croissants ; deux positions peuvent être écoutées.                                                                      | « Sur la même corde : vers les grandes cases = plus aigu. »                                                                                                                                             | Désigner ce sens sur une autre corde. Vérifier la lecture du diagramme ; aucun test d’oreille obligatoire.                                                                                    |     |
| GD-03.1                | **Deux écritures, les mêmes notes** / Présenter les sept noms puis Passer de l’une à l’autre       | Cycle de sept étiquettes dans la notation active ; exemple complet. Paires Do↔C, Ré↔D, Mi↔E, Fa↔F, Sol↔G, La↔A, Si↔B. Écoute d’une même hauteur possible. | « Do et C : deux noms pour la même note. »                                                                                                                                                              | Quelques associations mnémotechniques si le joueur veut apprendre l’autre notation (A=La ; G=Sol (ground) ; Do=C). Leur réussite ne conditionne pas la suite.                                 |     |
| GD-03.2 — conditionnel | **Votre accordage** / Présenter l'accordage ; et (conditionnellement) Lire l'altération rencontrée | L'accordage au complet de bas en haut ; Si une note altérée est réellement présente à vide, la mettre en valeur avec son signe agrandi.                   | Conditionnel = Exemple : « F♯ se lit “Fa dièse”. Ce nom fait partie de votre accordage. » Ou l’équivalent en bémol.                                                                                     | Reconnaître le nom complet. Cette étape explique l’accordage ; elle n’anticipe pas l’apprentissage chromatique. Absente si l’accordage ne la nécessite pas.                                   |     |
| GD-04.1                | **Un nom, plusieurs hauteurs** / Comprendre l’octave                                               | Deux cartes de même nom, chiffres différents ; petit escalier visuel, écoute facultative.                                                                 | « Même nom : E. Deux hauteurs : E2 et E3. » / « Le chiffre repère l’octave. E3 est plus aigu que E2. »                                                                                                  | Regrouper les deux mêmes noms, puis choisir la hauteur exacte annoncée. Utiliser un couple calculé : E2/E3 représente une octave ; E2/E4 en représente deux.                                  |     |
| GD-04.2 — conditionnel | **Une hauteur, plusieurs places** / Lire aussi la corde                                            | Deux positions réellement de même hauteur. En standard six cordes : B3, corde 2 à vide et corde 3 case 4.                                                 | « B3 peut se jouer ici et ici. Regardez la corde demandée. »                                                                                                                                            | Retrouver celle imposée par la consigne, avec numéro de corde clairement mis en valeur. Si ce cas n’existe pas dans le profil et la zone, reporter l’exemple à sa première occurrence réelle. |     |


#### Ce que vérifie le chapitre des noms

Compléter le cycle permet de vérifier que les sept noms et leur succession sont repérés. Cela ne prouve ni la lecture de partition, ni l’identification à l’oreille. C’est la base utile ici pour comprendre les consignes et utiliser la roue. L’association **nom ↔ position** sera réellement entraînée dans la Zone I. Éviter une longue épreuve de traduction avant de pouvoir jouer.

### Sortie du micro-parcours

Le Grand Débutant reste facultatif et court : quelques vérifications ciblées, sans série de vingt questions, sans chronomètre de performance ni étoiles. **Ignorer** donne accès au jeu ; cela n’attribue pas une validation fictive. Les explications ignorées restent consultables à leur première utilisation dans une activité.

## 3Bis : On-boarding et micro-tutoriels
==SECTION A COMPLETER, AMELIORER, ET SOUMETTRE A REVISION== 
### 3B.1 On-boarding
### 3B.2 Micro-tutoriels
Ces micro-tutoriels sont distillées JUSTE AVANT que le joueur en aura directement besoin. Avant tout premier exercice d'un nouveau type, par exemple.

| Code  | Sujet du micro-tuto                         | Explications visuelle                                | Explications textuelle                           |
| ----- | ------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------ |
| N     | **Une pastille, un nom** / Nommer la note   | Exemple résolu : pastille → réponse dans la roue.    | « Regardez le point. Touchez son nom. »          |
| **R** | **Une note, une place** / Retrouver la note | Exemple résolu : nom avec octave + corde → position. | « Lisez la note et la corde. Touchez sa place. » |
|       | ?                                           |                                                      |                                                  |

## 4. Pratique ciblée — les trois zones

### 4.1 Lecture des tableaux

Les trois tableaux suivants détaillent le cas **guitare six cordes standard**, pour rendre le parcours vérifiable. Chaque ligne de famille décrit un chapitre complet : découverte, activités isolées pertinentes, puis activités cumulatives distinctes. Le moteur de conception doit ensuite calculer les mêmes chapitres pour l’instrument choisi, selon la règle de la section 2.1.

- **Fxx** identifie la famille par sa classe de hauteur, avec C = 00, C♯ = 01, …, B = 11. L’identité ne change pas en choisissant Do–Ré–Mi ou des bémols.
- **Acquis cumulés** signifie les positions déjà présentées **dans ce parcours**, plus la famille nouvelle. Connaître E dans une autre zone ne signifie pas connaître ses nouveaux emplacements.
- **Critère famille** renvoie au contrat complet de la section 2.3 ; **MN/MR** restent deux activités différentes. Chaque activité évaluée conserve la limite de 20 à 30 questions.
- **BN** et **BT** désignent les bilans portés par les derniers mélanges ; les lignes correspondantes ne créent pas une deuxième copie de ces activités.
- L’étape **CO** vient après les naturelles, avant les altérations. Elle ne demande que des relations réellement présentes sur le diagramme.

### 4.2 Zone I — à vide jusqu’à la case 4

**Promesse :** nommer et retrouver les notes de la première zone sur toutes les cordes du profil choisi. Cette zone donne d’abord des repères très proches du sillet, puis relie les emplacements de même nom.

| ID     | Chapitre : sujet / sous-titre                                                                                              | Objectif                                                                                              | Prérequis conseillés                                                               | Critère de réussite                                                                                                                                                                            |
| ------ | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Z1-OUV | **Les cordes à vide** / Nommer les cordes · Retrouver les cordes                                                           | Associer chaque corde à sa hauteur réelle ; identifier les noms répétés sans confondre leurs octaves. | Lire le diagramme et la notation active ; rappel intégré si Grand Débutant ignoré. | Découverte de toutes les cordes ; N et R réussis ; chaque corde identifiée dans les deux sens, avec octave et corde explicites. Un nom altéré à vide est expliqué comme partie de l’accordage. |
| Z1-F04 | **La note E** / Nommer les positions · Retrouver les positions                                                             | Apprendre tous les E de la zone, puis les mêler aux cordes à vide.                                    | Z1-OUV ; nom E connu ou présenté dans le cours.                                    | Critère famille : toutes les positions de E couvertes ; MN/MR avec l’accordage, au moins 30 % de E.                                                                                            |
| Z1-F09 | **La note A** / Nommer les positions · Retrouver les positions                                                             | Ajouter tous les A aux repères précédents.                                                            | Cordes à vide et famille E rencontrées.                                            | Critère famille ; mélanges des acquis cumulés incluant au moins 30 % de A.                                                                                                                     |
| Z1-F02 | **La note D** / Nommer les positions · Retrouver les positions                                                             | Ajouter les D en distinguant leur hauteur et leur corde.                                              | Familles précédentes rencontrées.                                                  | Critère famille ; MN/MR cumulatifs avec au moins 30 % de D.                                                                                                                                    |
| Z1-F07 | **La note G** / Nommer les positions · Retrouver les positions                                                             | Mémoriser les positions de G sans dépendre d’une seule corde.                                         | Familles précédentes rencontrées.                                                  | Critère famille ; MN/MR cumulatifs avec au moins 30 % de G.                                                                                                                                    |
| Z1-F11 | **La note B** / Nommer les positions · Retrouver les positions                                                             | Situer les B et reconnaître les emplacements d’une même hauteur lorsqu’ils existent.                  | Familles précédentes rencontrées.                                                  | Critère famille ; MN/MR cumulatifs avec au moins 30 % de B. La consigne désigne la corde attendue.                                                                                             |
| Z1-F05 | **La note F** / Nommer les positions · Retrouver les positions                                                             | Ajouter une famille naturelle absente des cordes à vide du standard.                                  | Familles précédentes rencontrées.                                                  | Critère famille ; MN/MR cumulatifs avec au moins 30 % de F.                                                                                                                                    |
| Z1-F00 | **La note C** / Nommer les positions · Retrouver les positions ; puis **Toutes les notes naturelles** / Nommer · Retrouver | Compléter les familles naturelles et vérifier leur mélange, avec une couverture de toute la zone.     | Les autres familles naturelles rencontrées.                                        | Critère famille, puis BN : chaque position naturelle testée dans les deux sens ; derniers mélanges N/R réussis à 90 % ou plus.                                                                 |
| Z1-CO  | **Un même nom, plusieurs places** / Relier les notes naturelles                                                            | Comparer les mêmes noms, leurs octaves et les hauteurs identiques sur plusieurs cordes.               | Familles naturelles de la zone rencontrées ; distinction nom/hauteur rappelée.     | Réussir chaque relation proposée selon CO. Une demande de « tous les E » doit expliciter si toutes les octaves sont attendues.                                                                 |
| Z1-F06 | **La note F♯** / Nommer les positions · Retrouver les positions                                                            | Ajouter les emplacements de la première famille altérée.                                              | Naturelles et correspondances rencontrées ; lecture de ♯ ou ♭ expliquée ici.       | Critère famille ; MN/MR des naturelles et de F♯ avec au moins 30 % de F♯.                                                                                                                      |
| Z1-F01 | **La note C♯** / Nommer les positions · Retrouver les positions                                                            | Étendre les repères altérés sans perdre les naturelles.                                               | Acquis précédents rencontrés.                                                      | Critère famille ; MN/MR cumulatifs, au moins 30 % de C♯.                                                                                                                                       |
| Z1-F08 | **La note G♯** / Nommer les positions · Retrouver les positions                                                            | Ajouter tous les G♯ de la zone.                                                                       | Acquis précédents rencontrés.                                                      | Critère famille ; MN/MR cumulatifs, au moins 30 % de G♯.                                                                                                                                       |
| Z1-F03 | **La note D♯** / Nommer les positions · Retrouver les positions                                                            | Distinguer les D♯ des repères voisins déjà étudiés.                                                   | Acquis précédents rencontrés.                                                      | Critère famille ; MN/MR cumulatifs, au moins 30 % de D♯.                                                                                                                                       |
| Z1-F10 | **La note A♯** / Nommer les positions · Retrouver les positions ; puis **Toutes les notes** / Nommer · Retrouver           | Compléter la zone, naturelles et altérées réunies.                                                    | Toutes les autres familles présentes rencontrées.                                  | Critère famille, puis BT : tous les emplacements du périmètre couverts dans les deux sens et mélanges complets réussis.                                                                        |

**Cas d’un autre accordage :** Z1-OUV montre toujours les cordes réelles, y compris une corde à vide altérée. Après ce préambule, les chapitres de familles restent naturels d’abord. Le jeu ne transforme jamais une corde F♯ en corde F pour simplifier le cours. L’apprentissage de toutes les positions de F♯ intervient après les naturelles, comme convenu.

### 4.3 Zone II — cases 4 à 8

**Promesse :** reconnaître une nouvelle zone sans dépendre du sillet ni repartir de zéro sur les noms déjà connus. La case 4 sert de raccord avec la Zone I, sans être appelée « à vide ».

| ID | Chapitre : sujet / sous-titre | Objectif | Prérequis conseillés | Critère de réussite |
|---|---|---|---|---|
| Z2-ENT | **La zone 4–8** / Lire votre nouvelle position | Repérer les bornes et les numéros ; reconnaître que la case 4 reste la même position dans les deux zones. | Lecture du diagramme. Zone I utile, mais non obligatoire. | Repérer deux coordonnées de cette zone et son départ en case 4 ; comparaison visuelle résolue avec la Zone I. Si l’entrée est directe, présenter les noms nécessaires. |
| Z2-F04 | **La note E** / Nommer les positions · Retrouver les positions | Apprendre les E dans cette zone et identifier les repères déjà présents en bordure. | Z2-ENT ; nom E présenté. | Critère famille. Première famille seule : découverte/localisation ; nomination en mélange dès qu’il existe des choix déjà expliqués. |
| Z2-F09 | **La note A** / Nommer les positions · Retrouver les positions | Ajouter les A de la nouvelle zone. | E rencontré dans la zone. | Critère famille ; MN/MR E+A, au moins 30 % de A. |
| Z2-F02 | **La note D** / Nommer les positions · Retrouver les positions | Situer les D sans revenir mentalement à la première position. | Familles précédentes rencontrées dans la zone. | Critère famille ; MN/MR cumulatifs, au moins 30 % de D. |
| Z2-F07 | **La note G** / Nommer les positions · Retrouver les positions | Ajouter les G et leurs hauteurs disponibles. | Familles précédentes rencontrées dans la zone. | Critère famille ; MN/MR cumulatifs, au moins 30 % de G. |
| Z2-F11 | **La note B** / Nommer les positions · Retrouver les positions | Reconnaître les B sur plusieurs cordes lorsque le profil le permet. | Familles précédentes rencontrées dans la zone. | Critère famille ; MN/MR cumulatifs, au moins 30 % de B. |
| Z2-F05 | **La note F** / Nommer les positions · Retrouver les positions | Compléter les repères avec les positions de F. | Familles précédentes rencontrées dans la zone. | Critère famille ; MN/MR cumulatifs, au moins 30 % de F. |
| Z2-F00 | **La note C** / Nommer les positions · Retrouver les positions ; puis **Toutes les notes naturelles** / Nommer · Retrouver | Terminer les naturelles de la Zone II. | Autres familles naturelles rencontrées dans la zone. | Critère famille + BN, avec couverture naturelle propre à la Zone II. |
| Z2-CO | **Les notes naturelles de la zone** / Relier leurs positions | Comparer les mêmes noms dans cette zone ; revoir les positions communes en case 4. | Naturelles de la Zone II rencontrées. | CO réussi ; reconnaître une position frontière présentée dans les deux cadres. Aucune question ne nécessite d’afficher tout le manche 0–8. |
| Z2-F06 | **La note F♯** / Nommer les positions · Retrouver les positions | Introduire les F♯ de cette position de main. | Naturelles et correspondances rencontrées. | Critère famille ; MN/MR naturels + F♯, au moins 30 % de F♯. |
| Z2-F01 | **La note C♯** / Nommer les positions · Retrouver les positions | Ajouter les C♯ de la Zone II. | Acquis précédents de cette zone rencontrés. | Critère famille ; MN/MR cumulatifs, au moins 30 % de C♯. |
| Z2-F08 | **La note G♯** / Nommer les positions · Retrouver les positions | Ajouter les G♯ de la Zone II. | Acquis précédents de cette zone rencontrés. | Critère famille ; MN/MR cumulatifs, au moins 30 % de G♯. |
| Z2-F03 | **La note D♯** / Nommer les positions · Retrouver les positions | Ajouter les D♯ de la Zone II. | Acquis précédents de cette zone rencontrés. | Critère famille ; MN/MR cumulatifs, au moins 30 % de D♯. |
| Z2-F10 | **La note A♯** / Nommer les positions · Retrouver les positions ; puis **Toutes les notes** / Nommer · Retrouver | Compléter la nouvelle zone et ses mélanges. | Toutes les autres familles présentes rencontrées. | Critère famille + BT, avec couverture totale propre à la Zone II. |

### 4.4 Zone III — cases 8 à 12

**Promesse :** apprendre les emplacements vers la douzième case, retrouver la continuité avec la Zone II et comprendre le retour du nom des cordes à vide à la case 12.

| ID | Chapitre : sujet / sous-titre | Objectif | Prérequis conseillés | Critère de réussite |
|---|---|---|---|---|
| Z3-ENT | **La zone 8–12** / Repérer la douzième case | Situer les bornes et le repère visuel de la case 12 ; montrer la case 8 commune à la Zone II. | Lecture du diagramme. Zone II recommandée, sans verrouillage. | Repérer la case 12 et deux coordonnées de cette zone. Distinguer le repère fixe d’une pastille de question. |
| Z3-F04 | **La note E** / Nommer les positions · Retrouver les positions | Repérer les E de cette zone, avec leurs octaves réelles. | Z3-ENT ; nom E expliqué. | Critère famille ; évaluation de nomination en mélange si la phase isolée n’offre pas de choix significatif. |
| Z3-F09 | **La note A** / Nommer les positions · Retrouver les positions | Ajouter les A sans confondre nom et hauteur. | E rencontré dans cette zone. | Critère famille ; MN/MR E+A avec au moins 30 % de A. |
| Z3-F02 | **La note D** / Nommer les positions · Retrouver les positions | Ajouter les D de la Zone III. | Familles précédentes de cette zone rencontrées. | Critère famille ; MN/MR cumulatifs, au moins 30 % de D. |
| Z3-F07 | **La note G** / Nommer les positions · Retrouver les positions | Ajouter les G de la Zone III. | Familles précédentes de cette zone rencontrées. | Critère famille ; MN/MR cumulatifs, au moins 30 % de G. |
| Z3-F11 | **La note B** / Nommer les positions · Retrouver les positions | Ajouter les B de la Zone III. | Familles précédentes de cette zone rencontrées. | Critère famille ; MN/MR cumulatifs, au moins 30 % de B. |
| Z3-F05 | **La note F** / Nommer les positions · Retrouver les positions | Ajouter les F de la Zone III. | Familles précédentes de cette zone rencontrées. | Critère famille ; MN/MR cumulatifs, au moins 30 % de F. |
| Z3-F00 | **La note C** / Nommer les positions · Retrouver les positions ; puis **Toutes les notes naturelles** / Nommer · Retrouver | Compléter les naturelles de la Zone III. | Autres familles naturelles de cette zone rencontrées. | Critère famille + BN : couverture de toutes les positions naturelles de cette zone. |
| Z3-CO | **La douzième case** / Relier les mêmes noms | Comparer les correspondances internes et, sur chaque corde naturelle à vide, le nom à vide et en case 12, une octave plus haut. | Naturelles de cette zone rencontrées ; rappel visuel du sens d’octave. | CO réussi ; associer chaque paire réelle à vide/case 12 avec son octave. Reporter les paires de cordes altérées au chapitre de leur famille. La case 8 sert aussi de raccord avec la Zone II. |
| Z3-F06 | **La note F♯** / Nommer les positions · Retrouver les positions | Ajouter les F♯ et, si concerné, leur lien avec une corde à vide altérée. | Naturelles et correspondances rencontrées. | Critère famille ; MN/MR cumulatifs, au moins 30 % de F♯. |
| Z3-F01 | **La note C♯** / Nommer les positions · Retrouver les positions | Ajouter les C♯ de la Zone III. | Acquis précédents de cette zone rencontrés. | Critère famille ; MN/MR cumulatifs, au moins 30 % de C♯. |
| Z3-F08 | **La note G♯** / Nommer les positions · Retrouver les positions | Ajouter les G♯ de la Zone III. | Acquis précédents de cette zone rencontrés. | Critère famille ; MN/MR cumulatifs, au moins 30 % de G♯. |
| Z3-F03 | **La note D♯** / Nommer les positions · Retrouver les positions | Ajouter les D♯ de la Zone III. | Acquis précédents de cette zone rencontrés. | Critère famille ; MN/MR cumulatifs, au moins 30 % de D♯. |
| Z3-F10 | **La note A♯** / Nommer les positions · Retrouver les positions ; puis **Toutes les notes** / Nommer · Retrouver | Compléter la Zone III et retrouver les notes sans dépendre de leur ordre de présentation. | Toutes les autres familles présentes rencontrées. | Critère famille + BT. Pour une corde altérée à vide, sa correspondance avec la case 12 a également été montrée et vérifiée. |

### 4.5 Cours visuels propres aux zones

Les exemples de texte illustrent le format, sans constituer une rédaction figée de chaque écran. Chaque famille devra avoir un exemple réellement calculé et une formulation adaptée, sans recopier une phrase à l’identique d’un cours à l’autre.

| Moment                        | Contenu visuel                                                                                                                    | Texte d’écran proposé                                                                      | Geste et retour attendu                                                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Première entrée Zone I        | Sillet, numéros de cordes et accordage sélectionné ; hauteur de chaque corde.                                                     | **Vos cordes à vide** — « Voici votre accordage. »                                         | Toucher une corde pour écouter ; voir son nom et son octave. Pas de premier son imposé au lancement d’une question.                              |
| Première entrée Zone II       | Deux diagrammes compacts 0–4 puis 4–8 ; seule la case 4 commune est mise en relation.                                             | **Une nouvelle zone** — « La case 4 reste votre repère. »                                  | Reconnaître le même emplacement dans les deux cadres ; pas de défilement obligatoire.                                                            |
| Première entrée Zone III      | Cadre 8–12, repère fixe de douzième case distinct des pastilles ; comparaison avec 4–8.                                           | **Plus loin sur le manche** — « Ici, les cases 8 à 12. »                                   | Montrer la case 12, puis la case 8 commune.                                                                                                      |
| Nouvelle famille naturelle    | Tous les emplacements réels de la famille avec noms et octaves ; recherche guidée avant le travail sans noms.                     | Exemple : **La note A** — « A2, A3 : le même nom, plus grave ou plus aigu. »               | Chercher tous les emplacements. Une erreur peut donner un indice de direction ; aucune mauvaise hauteur n’est validée par simple égalité de nom. |
| Nouvel exercice « Nommer »    | Une question entièrement résolue : point sur le manche → réponse correcte affichée dans la roue.                                  | **Nouvel exercice !** / **Nommer les positions** — « Regardez le point. Touchez son nom. » | Un essai guidé, puis « À moi d’essayer ». Le nom avec octave est utilisé quand la hauteur est l’objet de la question.                            |
| Nouvel exercice « Retrouver » | Nom et octave, corde mise en évidence, puis position révélée uniquement dans l’exemple résolu.                                    | **Nouvel exercice !** / **Retrouver les positions** — « Lisez la note. Touchez sa place. » | Essai distinct. En question évaluée, aucune case cible n’est déjà colorée.                                                                       |
| Mélange cumulatif             | Petite carte « déjà rencontrées » et nouvelle famille ajoutée ; ne pas révéler les réponses de la série.                          | **Vos repères se mélangent** — « Retrouvez aussi les notes d’avant. »    30 %              | La nouvelle famille conserve au moins 30 % des questions ; pas d’alternance forcée N/R dans une séance.                                          |
| Correspondances naturelles    | Deux places portant le même nom ; chiffre d’octave mis en évidence. Autre exemple seulement si même hauteur sur plusieurs cordes. | **Un nom, plusieurs places** — « Même nom. Regardez aussi le chiffre. »                    | Relier les positions réellement comparables. Ne pas introduire ici de cours de quinte, tierce ou demi-ton.                                       |
| Première famille altérée      | Son nom complet ; roue naturelle extérieure, cinq emplacements intérieurs possibles, sans case entre B/C ou E/F.                  | Exemple : **La note F♯** — « Voici F♯. Repérez ses places. »                               | Lire le signe, puis trouver ses positions ; le choix dièses/bémols change l’écriture, pas la note ni les résultats.                              |
| À vide et douzième case       | Deux gros plans alignés de la même corde, étiquettes telles que E2 → E3.                                                          | **Le même nom revient** — « À la case 12 : E, plus aigu. »                                 | Associer les paires réelles. Pas de mélange d’octaves ni de raccourci « toutes les notes sont identiques ».                                      |

**Découverte et démonstration :** noms visibles avant l’essai sans noms ; réponse résolue montrée dans l’exemple explicatif ; dans la recherche active, essais libres et bonnes positions conservées. Ces écrans ne sont pas précédés de « À vous de jouer ! ». La transition de jeu intervient seulement avant la première question évaluée, puis le chronométrage commence.

## 5. Pratique ciblée — les trois premières cordes

### 5.1 Sélection et étendue

Les trois parcours sont définis par les **cordes du profil**, pas par trois numéros codés pour la guitare. Chaque parcours couvre ici **à vide jusqu’à la case 12**, proposition de périmètre bêta.

| Profil d’exemple | Parcours CS1 : corde la plus grave | Parcours CS2 : corde suivante | Parcours CS3 : troisième corde |
|---|---|---|---|
| Guitare 6 cordes standard | Corde 6 — E2 | Corde 5 — A2 | Corde 4 — D3 |
| Guitare 7 cordes standard | Corde 7 — B1 | Corde 6 — E2 | Corde 5 — A2 |
| Basse 4 cordes standard | Corde 4 — E1 | Corde 3 — A1 | Corde 2 — D2 |
| Basse 5 cordes standard | Corde 5 — B0 | Corde 4 — E1 | Corde 3 — A1 |

Dans un accordage réentrant, afficher explicitement la corde physique sélectionnée : « Corde 3 — la plus grave », par exemple. L’ordre par hauteur est une proposition pour donner un sens musical à « les trois plus graves » ; il ne doit jamais déplacer les lignes du diagramme de l’instrument. Si deux cordes ont exactement la même hauteur à vide, conserver leur ordre physique pour départager le classement.

**Ordre des familles sur une corde :** le périmètre ne contient qu’une corde à vide. Sa famille naturelle passe donc en premier, puis les naturelles manquantes dans l’ordre cyclique décrit en 2.1. En standard six cordes :

- CS1, corde 6 : **E → F → G → A → B → C → D**.
- CS2, corde 5 : **A → B → C → D → E → F → G**.
- CS3, corde 4 : **D → E → F → G → A → B → C**.

Ce changement d’ordre applique la même règle à un autre périmètre : partir de la corde étudiée, puis compléter ses notes. Sur une corde altérée à vide, le préambule nomme sa hauteur réelle ; les familles commencent par la première naturelle en case 1 et poursuivent le cycle. La famille altérée de la corde à vide arrive après les naturelles, avant les autres altérations.

### 5.2 Chapitres d’entrée et de correspondances

| ID | Chapitre : sujet / sous-titre | Objectif | Prérequis conseillés | Critère de réussite |
|---|---|---|---|---|
| CS1-ENT | **Votre corde la plus grave** / Lire la corde entière | Identifier la corde physique, son nom à vide et les bornes jusqu’à 12 ; retrouver une coordonnée dans la nouvelle vue. | Lire corde/case ; rappel intégré si nécessaire. Zone I utile, non obligatoire. | Identifier cette corde, son départ à vide et sa case 12 ; réussir un essai de lecture dans chacun des trois fragments affichés. |
| CS1-CO | **Les notes de cette corde** / Relier les mêmes noms | Consolider les naturelles ; comparer à vide et case 12 si la corde est naturelle. | Familles naturelles de CS1 rencontrées. | CO réussi ; distinguer les deux hauteurs du nom répété. Si corde altérée à vide, sa paire est étudiée avec sa famille après les naturelles. |
| CS2-ENT | **Votre deuxième corde grave** / Changer de corde | Identifier la nouvelle corde et retrouver la vue longitudinale sans transférer les positions de CS1 comme si l’accordage était identique. | Lecture du diagramme ; CS1 recommandé, mais consultation directe autorisée. | Désigner cette corde physique et sa note à vide ; lire une coordonnée dans chaque fragment. |
| CS2-CO | **Les notes de cette deuxième corde** / Comparer leurs hauteurs | Consolider les naturelles de CS2 et le retour du nom à la case 12 lorsque pertinent. | Familles naturelles de CS2 rencontrées. | CO réussi dans CS2 ; les résultats de CS1 ne remplacent pas cette vérification. |
| CS3-ENT | **Votre troisième corde grave** / Explorer une autre corde | Situer la troisième corde retenue et ses propres repères. | Lecture du diagramme ; CS1/CS2 utiles, sans verrouillage. | Identifier la corde, son nom à vide et les coordonnées des trois fragments. |
| CS3-CO | **Les notes de cette troisième corde** / Relier les positions | Consolider les naturelles de CS3 et la correspondance à vide/case 12 lorsque pertinente. | Familles naturelles de CS3 rencontrées. | CO réussi sur cette corde ; correspondance altérée reportée si nécessaire. |

### 5.3 Tableau de tous les chapitres de familles des trois cordes

Chaque ligne fournit **trois chapitres distincts**, un par corde, avec le même contrat mais des positions et des octaves différentes. Leur **ordre de présentation** suit 5.1, et non l’ordre d’impression de cette table. Les douze familles sont présentes sur une corde chromatique à frettes couvrant 0–12.

| IDs : CS1 / CS2 / CS3 | Chapitre : sujet / sous-titre | Objectif sur la corde sélectionnée | Prérequis conseillés | Critère de réussite |
|---|---|---|---|---|
| CS1-F04 / CS2-F04 / CS3-F04 | **La note E** / Nommer · Retrouver | Reconnaître et localiser les E de cette corde, avec leurs octaves réelles. | Entrée de la corde ; familles antérieures dans l’ordre propre à ce parcours. | Critère famille ; évaluation de nomination en mélange si la famille isolée n’offre qu’une réponse. MN/MR avec au moins 30 % de E. |
| CS1-F09 / CS2-F09 / CS3-F09 | **La note A** / Nommer · Retrouver | Reconnaître et localiser les A de cette corde. | Entrée et familles antérieures de ce parcours. | Critère famille ; N en mélange si nécessaire ; MN/MR avec au moins 30 % de A. |
| CS1-F02 / CS2-F02 / CS3-F02 | **La note D** / Nommer · Retrouver | Reconnaître et localiser les D de cette corde. | Entrée et familles antérieures de ce parcours. | Critère famille ; N en mélange si nécessaire ; MN/MR avec au moins 30 % de D. |
| CS1-F07 / CS2-F07 / CS3-F07 | **La note G** / Nommer · Retrouver | Reconnaître et localiser les G de cette corde. | Entrée et familles antérieures de ce parcours. | Critère famille ; N en mélange si nécessaire ; MN/MR avec au moins 30 % de G. |
| CS1-F11 / CS2-F11 / CS3-F11 | **La note B** / Nommer · Retrouver | Reconnaître et localiser les B de cette corde. | Entrée et familles antérieures de ce parcours. | Critère famille ; N en mélange si nécessaire ; MN/MR avec au moins 30 % de B. |
| CS1-F05 / CS2-F05 / CS3-F05 | **La note F** / Nommer · Retrouver | Reconnaître et localiser les F de cette corde. | Entrée et familles antérieures de ce parcours. | Critère famille ; N en mélange si nécessaire ; MN/MR avec au moins 30 % de F. |
| CS1-F00 / CS2-F00 / CS3-F00 | **La note C** / Nommer · Retrouver | Reconnaître et localiser les C de cette corde. | Entrée et familles antérieures de ce parcours. | Critère famille ; N en mélange si nécessaire ; MN/MR avec au moins 30 % de C. |
| CS1-F06 / CS2-F06 / CS3-F06 | **La note F♯** / Nommer · Retrouver | Ajouter les F♯ à la carte de cette corde. | Naturelles et correspondances rencontrées ; altérations antérieures éventuelles. | Critère famille ; MN/MR avec au moins 30 % de F♯ ; octave réellement disponible. |
| CS1-F01 / CS2-F01 / CS3-F01 | **La note C♯** / Nommer · Retrouver | Ajouter les C♯ de cette corde. | Naturelles puis familles altérées précédentes de ce parcours. | Critère famille ; MN/MR avec au moins 30 % de C♯. |
| CS1-F08 / CS2-F08 / CS3-F08 | **La note G♯** / Nommer · Retrouver | Ajouter les G♯ de cette corde. | Naturelles puis familles altérées précédentes de ce parcours. | Critère famille ; MN/MR avec au moins 30 % de G♯. |
| CS1-F03 / CS2-F03 / CS3-F03 | **La note D♯** / Nommer · Retrouver | Ajouter les D♯ de cette corde. | Naturelles puis familles altérées précédentes de ce parcours. | Critère famille ; MN/MR avec au moins 30 % de D♯. |
| CS1-F10 / CS2-F10 / CS3-F10 | **La note A♯** / Nommer · Retrouver | Compléter les positions altérées de cette corde. | Naturelles puis familles altérées précédentes de ce parcours. | Critère famille ; MN/MR avec au moins 30 % de A♯. |

**Placement des bilans :** le mélange du dernier chapitre naturel est présenté sous **Toutes les notes naturelles / Nommer** puis **Retrouver**, et porte BN. Après lui vient CSx-CO. Le mélange du dernier chapitre altéré porte **Toutes les notes / Nommer** puis **Retrouver**, et BT. Les noms F♯/G♭, par exemple, restent une seule famille : pas de deuxième chapitre pour le changement d’écriture.

### 5.4 Cours et affichage particuliers aux cordes

| Moment | Objectif du cours | Visuel et texte bref | Vérification |
|---|---|---|---|
| Entrée de chaque corde | Identifier le support étudié avant d’apprendre ses positions. | Petit instrument : corde sélectionnée épaissie. Puis gros plan de **cette même corde**. Exemple : « Corde 5 : A2 à vide. » | Toucher la corde demandée, puis lire une coordonnée. |
| Première vue 0–12 | Comprendre les fragments sans les prendre pour plusieurs cordes. | Sur téléphone, trois bandes clairement titrées **Même corde — à vide à 4**, **Même corde — 4 à 8**, **Même corde — 8 à 12**. Numéro physique identique sur chaque bande. | Montrer la même case 4 dans les deux bandes voisines. Les deux représentations désignent une seule position. |
| Nouvelle naturelle | Relier un nom à un emplacement, plutôt que réciter l’ordre complet des cases. | Zoom de la position réelle avec nom et octave ; comparaison seulement avec une position déjà enseignée. | Recherche guidée, puis localisation sans noms. La nomination significative est évaluée dans le mélange si nécessaire. |
| Retour à la case 12 | Comprendre le nom répété à une autre hauteur. | Deux points sur la même corde : par exemple A2 à vide et A3 case 12. | Choisir la hauteur exacte ; ne pas accepter simplement « A » si le chiffre est demandé. |
| Nouvelle altération | Compléter les endroits encore non étudiés. | Une nouvelle position, son nom et son signe, puis intégration à la roue intérieure. | Même règle de découverte et de cumul ; aucune série de théorie des intervalles n’est nécessaire. |

**Contrainte tactile :** ne pas miniaturiser treize positions au point de rendre l’appui imprécis. Sur écran large, une seule bande est possible si les cibles restent confortables. Sur téléphone, les trois fragments montrent simultanément les positions possibles ; les cases frontières dupliquées partagent leur état et acceptent le même geste. Ce découpage est une proposition d’interface à prototyper, pas une demande de modifier le manche actuel dans ce livrable. Il doit permettre de jouer sans défilement horizontal, sans faire pivoter le manche, et sans révéler involontairement la réponse par un cadrage automatique.



## 6. Progression guidée — Niveau 1 : Débutant

### 6.1 Promesse et principe

**Promesse :** nommer et retrouver les notes de la Zone I, puis prolonger ces repères sur les deux cordes les plus graves jusqu’à la case 12, en revenant régulièrement sur les acquis précédents.

Le Niveau 1 est une **vue organisée des chapitres ciblés**, pas un catalogue supplémentaire. L’ordre spiralaire alterne des contextes d’utilisation à l’échelle des étapes ; il ne mélange pas intempestivement les types de question dans une séance. Le Grand Débutant peut précéder ce niveau, sans en être un verrou.

### 6.2 Tableau des étapes du Niveau 1

Les identifiants G1 sont des étapes de navigation, non des copies de chapitres. « Reprise » signifie relancer une activité existante avec de nouvelles questions conformes à son périmètre.

| Étape | Chapitres réutilisés | Objectif | Prérequis conseillés | Critère de réussite et suite |
|---|---|---|---|---|
| G1-A — **Vos premiers repères** | Z1-OUV, puis familles naturelles de Z1 jusqu’à BN, puis Z1-CO. | Reconnaître l’accordage et toutes les positions naturelles de la première zone. | Lecture de base du diagramme ; explication juste avant usage si nécessaire. | Chapitres naturels de Z1 et CO validés. Recommander G1-B ; autoriser tout autre choix. |
| G1-B — **Les notes le long de votre corde grave** | CS1-ENT, familles naturelles de CS1, BN puis CS1-CO ; reprise du BN de Z1. | Prolonger les mêmes noms dans la longueur, puis les retrouver dans le contexte initial. | Naturelles de Z1 conseillées. | Partie naturelle de CS1 validée. Une reprise de Z1 permet d’identifier les repères à retravailler ; elle ne remet pas à zéro la réussite antérieure. |
| G1-C — **Une deuxième corde, les mêmes noms** | CS2-ENT, familles naturelles de CS2, BN puis CS2-CO ; reprise du BN de CS1. | Appliquer les noms connus à une autre corde, puis entretenir la précédente. | Partie naturelle de CS1 conseillée. | Partie naturelle de CS2 validée ; retour ciblé proposé selon les erreurs de la reprise CS1. |
| G1-D — **Compléter votre première zone** | Familles altérées de Z1 et BT ; court retour proposé au BN de CS2. | Ajouter les positions manquantes de la première zone sans abandonner les naturelles. | Naturelles et correspondances de Z1 rencontrées. | Z1 validée complètement. Le mélange inclut les naturelles et les altérations déjà étudiées. |
| G1-E — **Toutes les notes de votre corde grave** | Familles altérées de CS1, correspondance à vide/12 si encore nécessaire, BT ; reprise du BT de Z1. | Compléter la première corde entière et réactiver le contexte en zone. | Partie naturelle de CS1 rencontrée. | CS1 validée complètement ; la reprise de Zone I éclaire la prochaine recommandation. |
| G1-F — **Toutes les notes de votre deuxième corde** | Familles altérées de CS2, correspondance à vide/12 si nécessaire, BT. | Compléter le second trajet longitudinal. | Partie naturelle de CS2 rencontrée. | CS2 validée complètement. Les résultats sont aussi visibles dans Pratique ciblée. |
| G1-BILAN — **Vos repères du Niveau 1** | Synthèse des trois périmètres Z1, CS1 et CS2 ; accès à leurs derniers mélanges. | Voir ce qui est démontré et choisir le prochain travail utile. | Consultation possible à tout moment. | Niveau validé lorsque Z1, CS1 et CS2 satisfont leurs critères complets. Pas de quatrième examen identique ; proposer de rejouer un bilan si un contexte reste fragile. |

**Pourquoi cette progression :** elle commence par un cadre restreint mais polycorde, retrouve les mêmes noms sur une corde entière, les transpose à une deuxième, puis revient à ces contextes avec les altérations. Les reprises donnent une occasion de rappeler les notes après d’autres activités ; elles ne prétendent pas garantir la mémorisation à long terme. Aucune durée quotidienne, aucun calendrier ni auto-évaluation n’est imposé.

**Ce qui n’est pas dans le Niveau 1 :** la troisième corde ciblée, les Zones II et III, et les modes avancés. Ils sont disponibles ailleurs dans les Premiers Parcours. Terminer le Niveau 1 ne signifie donc pas maîtriser tout le manche 0–12 sur toutes les cordes.

## 7. Couverture et preuve de réussite

### 7.1 Vérification sur la guitare six cordes standard

Une **position** correspond à une corde et une case. Un même nom, ou même une même hauteur sur deux cordes, peut correspondre à plusieurs positions. Les décomptes ci-dessous servent à vérifier la conception, pas à promettre autant de questions dans une seule séance.

| Périmètre | Positions distinctes | Naturelles | Altérées | Sens à vérifier |
|---|---|---|---|---|
| Zone I, 0–4 | 30 | 18 | 12 | Nommer et retrouver. |
| Zone II, 4–8 | 30 | 17 | 13 | Nommer et retrouver. |
| Zone III, 8–12 | 30 | 18 | 12 | Nommer et retrouver. |
| Une corde naturelle à vide, 0–12 | 13 | 8 | 5 | Nommer et retrouver ; octave différenciée au retour en case 12. |
| Les trois zones réunies, 0–12 | **78** | **48** | **30** | Les frontières 4 et 8 ne sont comptées qu’une fois. |
| Niveau 1 : Zone I + cordes 6 et 5, 0–12 | **46** | À calculer selon le profil | À calculer selon le profil | Trente positions de zone, plus huit positions nouvelles sur chacune des deux cordes. |

Les trois cordes ciblées couvrent chacune treize positions. Sur une corde altérée à vide, le partage devient sept positions naturelles et six altérées. Recalculer tous les nombres pour l’accordage réel : ne pas conserver les chiffres du standard dans l’interface.

### 7.2 Ce que valide un résultat

| Résultat observé | Interprétation correcte | Ce qu’il ne démontre pas |
|---|---|---|
| Cours regardé | Contenu présenté. | Compréhension ou rappel autonome. |
| Positions trouvées avec les noms visibles | Découverte active du périmètre. | Connaissance sans aide. |
| Séance N réussie | Reconnaissance visuelle des notes demandées, dans le format de réponse annoncé. | Capacité à produire leur nom sans propositions, à les chanter ou à les jouer sur une vraie guitare. |
| Séance R réussie | Association nom/hauteur → position dans le périmètre annoncé. | Maîtrise de tous les emplacements encore non testés. |
| Chapitre validé | Activités pertinentes réussies et positions cibles couvertes dans les deux sens. | Stabilité à long terme après une seule séance. |
| Bilan de parcours validé | Couverture et résultats attendus pour ce périmètre. | Maîtrise d’autres cordes, d’autres zones ou d’un autre accordage. |
| Reprise réussie après un délai réel | Indice supplémentaire de rétention dans le contexte testé. | Automatisme instrumental et improvisation fluide automatiquement mesurés. |

Pour un seuil de 90 %, arrondir le nombre requis **au supérieur** : 18/20, 22/24, 27/30. Le temps moyen commence une fois la question utilisable, après la transition initiale. Les demandes d’aide sont enregistrées ; le numéro de corde explicitement prévu par la consigne fait partie de la tâche, pas d’une aide ajoutée après coup.

### 7.3 Mélanges et charge de travail

- Dans une séance de 24 questions, la nouvelle famille reçoit **au moins sept questions**, réparties aléatoirement. Choisir ses positions en variant les cordes et les octaves disponibles.
- Le reste réactive les familles précédemment présentées dans le même parcours. Faire varier les positions, pas seulement les noms ; éviter qu’un seul emplacement connu représente toute une famille.
- Toutes les notes sont mélangées de manière aléatoire mais une même note ne peux pas s'enchaîner plus de deux fois d'affilée.
- La couverture incomplète est annoncée simplement : « Encore quelques positions à vérifier », avec une prochaine activité pertinente. Une bonne moyenne ne masque pas les positions jamais testées.
- En cas d’erreurs, proposer une courte reprise guidée de la difficulté, puis une nouvelle séance de vérification. La correction ne change pas la première réponse enregistrée.
- Les bilans BN/BT ne peuvent pas s'étaler sur plusieurs séances. Le nombre de questions peut augmenter légèrement pour faire rentrer tout le programme dans une longue épreuve.
- Une suite musicale peut conserver son rôle d’application et de récompense. Sa réussite est suivie séparément ; elle ne remplace pas le rappel des positions. Ne lui attribuer un morceau connu que si notes, hauteur, rythme et référence ont été vérifiés. Le catalogue musical n’est pas réécrit par ce document.

## 8. Organisation des cours et des données pour l’implémentation future

### 8.1 Une règle commune, plusieurs contextes

Le principe commun porte sur l’ordre des familles, les activités et les critères. Les données musicales sont calculées à partir du profil et du périmètre. Cela évite de recopier un parcours six cordes puis de corriger ses notes à la main pour chaque instrument.

| Élément à définir | Contenu nécessaire | Règle de cohérence |
|---|---|---|
| **Profil** | Instrument, cordes physiques, hauteurs à vide, accordage réel. | Ne pas déduire l’accordage uniquement du nom de l’instrument. |
| **Périmètre** | Zone ou corde ; cases incluses ; cordes retenues. | La première case d’une zone non nulle n’est pas une corde à vide. |
| **Chapitre** | Identifiant stable, famille ou concept, objectif, cours, prérequis conseillés, critères. | La famille reste identique lors d’un changement de notation ou d’orthographe enharmonique. |
| **Activité** | Sens N/R ou manipulation CO, ensemble de positions, pool cumulatif, aides, format et longueur. | Aucun mélange caché de types de question dans une séance. |
| **Position** | Identité du profil, numéro de corde physique, case ; hauteur calculée. | Deux graphismes de la même case frontière renvoient à une seule position. |
| **Tentative** | Activité et contexte, position demandée, réponse, première réponse correcte ou non, aide, temps, date. | Ne pas confondre correction, découverte et rappel autonome. |
| **Placement guidé** | Référence à un chapitre ou à une activité ciblée existante. | Changer de chemin d’accès ne duplique ni exercice ni résultat. |
| **Progression** | Présentation du cours, activités réussies, couverture par sens, révisions proposées. | Les statistiques globales dédoublonnent les positions ; les performances gardent le contexte de l’activité. |

Une réponse en case 4 peut contribuer au suivi de cette position physique, mais ne valide pas à elle seule la Zone II. De même, une réussite de Zone I ne valide pas les cases 5–12 d’une corde. **La couverture d’une position peut être partagée ; les exigences de couverture et de mélange de chaque parcours restent propres à ce parcours.**

Exemple inverse important : finir une activité CS1 depuis le Niveau 1 doit immédiatement être visible dans le parcours ciblé CS1, puisqu’il s’agit exactement de la même activité, avec le même périmètre et les mêmes critères.

### 8.2 Principes d’interface pédagogique

1. **Présenter le prochain objectif**, puis une action principale. Ne pas afficher d’emblée tous les chapitres de toutes les familles comme une longue liste obligatoire.
2. Titres : **Les cordes à vide**, **La note E**, **Toutes les notes naturelles**, **Toutes les notes**. Sous-titres : **Nommer les cordes**, **Retrouver les positions**, etc. Traduire les noms selon le réglage actif.
3. Expliquer un nouveau type d’action avec un exemple entièrement résolu, puis un essai. **Nommer** et **Retrouver** restent ensuite deux exercices séparés.
4. Pour un chapitre de famille, la roue peut différencier E2/E3/E4 si ces hauteurs existent. Pour le mélange naturel, proposer les naturelles ; utiliser les octaves dans les réponses lorsque la tâche porte réellement sur leur distinction. Ne jamais fabriquer une octave absente comme position à retrouver.
5. Le diagramme place la corde physique 1 en haut et la dernière en bas. Le classement pédagogique par hauteur ne change pas cet affichage.
6. Le son accompagne la découverte et la bonne réponse. La question évaluée ne joue pas la note cible avant l’essai. Les tâches visuelles restent utilisables sans son.
7. Garder l’alternative de boutons pour répondre au manche ; mêmes cibles et mêmes résultats que le toucher direct. Aucun glissement obligatoire ni saisie textuelle de nom.
8. Les figures de cours utilisent la même source graphique que le manche, avec une marge adaptée aux noms et numéros. Pastille de note, inlay et corde ciblée doivent rester visuellement distincts ; la couleur seule ne suffit pas.
9. **Aucun déplacement du bloc questions/réponses n’est décidé ici.** Ce sujet reste réservé à ta réflexion ; la proposition de vue par fragments concerne seulement l’étendue du parcours sur une corde.
10. Tous les chapitres restent accessibles. La validation recommande la suite et renseigne la progression ; elle ne débloque pas les contenus un par un. Les règles commerciales d’essai et de paiement ne modifient pas ces prérequis pédagogiques.

### 8.3 Contenus éditoriaux à produire à partir de cette carte

| Contenu | Source commune | Adaptation nécessaire |
|---|---|---|
| Quatre chapitres Grand Débutant | Table des cours de la section 3. | Instrument, vocabulaire utile, notation et accordage sélectionnés. |
| Entrées des trois zones | Géométrie de chaque périmètre. | Repères réels, bornes, raccords et première famille du profil. |
| Cours de familles | Ensemble calculé de positions et hauteurs. | Exemple précis, noms avec octaves, nombre d’emplacements ; texte bref différent selon l’apport réel. |
| Entrées des trois cordes | Numéro physique et hauteur à vide. | Corde sélectionnée mise en évidence ; représentation longitudinale adaptée. |
| Cours de correspondances | Relations réelles entre positions apprises. | Aucune comparaison fausse ou inaccessible ; cas absent omis. |
| Retours de bilan | Résultats et couverture du périmètre. | Prochaine action utile ; pas de promesse de maîtrise non mesurée ni d’auto-évaluation obligatoire. |

Les formules des tableaux ne sont pas toutes des phrases destinées à l’écran. L’interface montre l’essentiel ; le document conserve les précisions nécessaires à la production et à la vérification.

## 9. Ordre de réalisation proposé

| Lot | Contenu à préparer ou implémenter | Condition de fin |
|---|---|---|
| 1 — Fondations du catalogue | Identités des parcours, périmètres, familles, placements partagés et règles de preuve. | Un même chapitre garde son identité quel que soit son chemin d’accès ; aucun accordage n’est remplacé par le standard. |
| 2 — Entrée Grand Débutant | Quatre chapitres et cours visuels courts. | Un grand débutant comprend l’instrument, le diagramme et les deux gestes du jeu lors d’un test observé. |
| 3 — Zone I complète | Accordage, familles naturelles, correspondances, altérations, cumul et bilans. | Couverture des positions vérifiée, séances de longueur conforme, aucune nomination à choix unique présentée comme preuve. |
| 4 — Zones II et III | Nouveaux périmètres, nouveaux emplacements et cours de raccords. | Bornes 4–8 et 8–12 correctes ; pas de hors-zone ni de doublons dans le total appris. |
| 5 — Trois cordes | CS1, CS2, CS3 et représentation 0–12 testée sur téléphone. | Toutes les positions sont atteignables sans défilement requis et les fragments sont compris comme une seule corde. |
| 6 — Niveau 1 guidé | Références aux chapitres Z1/CS1/CS2 et reprises entre contextes. | Un résultat est partagé entre les deux entrées ; le Niveau 1 propose toujours une suite utile. |
| 7 — Recette bêta | Tests de cohérence musicale, de progression et d’utilisabilité. | Les cas ci-dessous passent et les textes sont compris sans explication du concepteur. |

Ces lots sont un ordre de réalisation technique et éditorial. Ils ne constituent pas de nouvelles « phases » pédagogiques imposées au joueur. Ce document ne déclenche leur implémentation.

## 10. Recette minimale des Premiers Parcours

| Cas à vérifier | Résultat attendu |
|---|---|
| Catalogue bêta | Les huit parcours sont présents : Grand Débutant, trois zones, trois cordes et Niveau 1. |
| Guitare six cordes standard | Ordre des familles en zone conforme à E–A–D–G–B–F–C, puis altérations ; cordes ciblées 6/5/4. |
| Guitare sept cordes et basse | Nombre de lignes, hauteurs, corde la plus grave et noms des trois parcours recalculés. Aucun E2 imposé à une basse E1 ou à une sept cordes B1. |
| Accordage contenant F♯ à vide | Préambule limité à l’accordage ; toutes les naturelles avant la famille F♯ ; aucun changement fictif de la hauteur réelle. |
| Accordage réentrant ou cordes à l’unisson | Sélection pédagogique explicite, numérotation physique conservée et ordre stable en cas d’égalité. |
| Accordage avec une famille absente d’une petite zone | Chapitre absent omis ; aucun emplacement inventé. Le bilan porte sur les positions réellement présentes. |
| Zones II et III | Aucun nom à vide en case 4 ou 8 ; 12 correctement reliée à la même corde à vide. |
| Cases frontières | Cas 4 et 8 partagés dans les deux diagrammes ; un seul emplacement dans le total de positions distinctes. |
| Nommer une famille à une seule hauteur | Pas de série artificielle avec une seule bonne option ; nomination vérifiée en mélange pertinent. |
| Même hauteur sur deux cordes | Les deux emplacements ne sont pas confondus ; consigne avec corde si une position particulière est demandée. |
| Nouvelle famille et cumul | Sur 24 questions, au moins cinq portent sur la nouvelle famille ; les autres proviennent des acquis présentés ; distribution non prévisible. |
| Fin de séance | 20 à 30 questions maximum ; progression et couverture visibles ; aucun bilan de quarante questions forcé. |
| Changement C–D–E / Do–Ré–Mi ou ♯ / ♭ | Seule l’écriture change ; parcours, positions et progression conservent leurs identités. |
| Accès par Niveau 1 puis Pratique ciblée | Même résultat et même chapitre. Pas de seconde copie à terminer. |
| Cordes 0–12 sur petit écran | Chaque position demandée peut être atteinte sans geste de défilement ; bandes clairement identifiées comme une même corde. |
| Sans audio, réglage contrasté, boutons de réponse | Les tâches visuelles restent compréhensibles et réalisables ; aucune validation fondée uniquement sur une couleur. |
| Joueur déjà engagé | Les acquis de l’ancienne version ne sont pas effacés. Les nouveaux périmètres ne sont pas déclarés validés sans preuve correspondante. |

## 11. Ce qui reste hors de cette cartographie bêta

La projection complète reste conservée : cordes 0–24, autres cordes individuelles, duos voisins, parcours spécifique toutes cordes mélangées sur 0–12, intervalles, gammes, accords, arpèges, harmoniques et Niveaux 2 à 5. Ils ne sont pas détaillés ici. Les trois zones bêta couvrent bien, ensemble, toutes les cordes sur 0–12 ; cela ne crée pas encore un mode indépendant qui mélange cette étendue complète dans une même série.

Les comptes, paiements, mises à jour, migration des données et autres chantiers produit conservent leur place dans la roadmap générale. Ils ne sont ni réalisés ni repoussés par ce document pédagogique.

## 12. Références et arbitrages conservés

- **Source prioritaire :** ta section « Premiers Parcours » et ta demande d’en inclure tous les parcours. Les bornes retenues sont bien **0–4, 4–8, 8–12**.
- **Dossier de conception phases 1 et 2 :** conservation des objectifs observables, de la distinction exposition/rappel, de la couverture par position et par sens, et de la différence entre jeu à l’écran et exécution instrumentale.
- **Instructions plus récentes :** l’ancien découpage en 24 micro-leçons, l’apprentissage par intervalles, les auto-évaluations, la saisie manuelle des noms, les anciens exercices longs et les verrous pédagogiques ne sont pas repris. Le choix d’instrument et d’accordage pilote désormais tout le catalogue.
- **Bêta existante :** cette carte définit des parcours à préparer. Elle ne doit pas être lue comme la confirmation que les Zones II/III et les trois parcours par corde sont déjà disponibles dans l’application.

**Décisions encore proposées, clairement repérées :** étendue 0–12 pour les cordes bêta, ordre par hauteur réelle pour les accordages réentrants, représentation d’une corde en trois fragments sur téléphone, et séquence spiralaire du Niveau 1. Le reste transpose les principes déjà demandés aux huit parcours du périmètre.
