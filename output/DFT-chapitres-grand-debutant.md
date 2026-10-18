# Daily Fretboard Trainer — Chapitres du parcours Grand Débutant

**Document de conception pour la bêta — 18 octobre 2026**  
**Parcours : « Grand Débutant : commencez ici ! » — facultatif.**  
Statut : proposition à relire avant implémentation. Aucun changement de l’application n’est effectué par ce document.

## 1. Promesse et périmètre

À la sortie, l’utilisateur peut **comprendre une consigne de jeu et répondre sur le diagramme**, sans connaître auparavant les notes de son manche. Il sait désigner les éléments utiles, lire une coordonnée, reconnaître la notation choisie et distinguer nom de note, hauteur et octave.

Ce parcours ne demande pas encore de mémoriser l’accordage, les positions des notes ou des intervalles. L’apprentissage de l’accordage commence ensuite dans la Zone I.

Il comprend **les quatre chapitres de ta proposition**, subdivisés en petites étapes visuelles. Prévoir environ **5 à 8 minutes**, fractionnables ; cette durée reste une estimation à vérifier en bêta.

**Entrée proposée :** après la configuration, une carte « Vous débutez ? Commencez ici ». Le parcours reste accessible depuis le recueil et l’aide. Tous les autres parcours restent disponibles s’il est ignoré.

## 2. Tableau des chapitres

Les prérequis décrivent l’ordre conseillé des notions ; ils ne verrouillent pas l’accès.

| ID | Chapitre : sujet / sous-titre | Objectif observable | Prérequis | Critère de réussite |
|---|---|---|---|---|
| GD-01 | **Votre instrument** / Reconnaître ses éléments | Montrer le manche, une corde, une case, une frette et le sillet ; distinguer une corde à vide d’une note appuyée. | Aucun savoir musical. Instrument et nombre de cordes sélectionnés dans la configuration. | Identifier les cinq éléments sans leurs étiquettes, dont l’espace d’une case et la barre d’une frette ; distinguer « à vide » de la case 1. Chaque repère doit avoir une réponse correcte autonome. Reproposer seulement les repères ratés, sur un nouvel exemple. |
| GD-02 | **Le diagramme du manche** / Lire les cordes et les cases | Relier une corde réelle à sa ligne, lire une coordonnée, distinguer inlay et pastille, comprendre le sens vers l’aigu sur une même corde. | GD-01 : corde, case, frette, sillet et à vide. | Retrouver trois coordonnées variées : une à vide, une sur la corde 1 et une sur une autre corde. Distinguer un repère fixe d’une pastille de jeu. Désigner le sens vers l’aigu sur une même corde. |
| GD-03 | **Les noms des notes** / Reconnaître votre notation | Reconnaître les sept noms naturels et leur ordre cyclique dans la notation choisie. Comprendre que Do–Ré–Mi et C–D–E nomment les mêmes notes. | Aucun prérequis de position sur le manche. Choix de notation rappelé. | Compléter le cycle des sept noms dans la notation active, chaque nom étant demandé au moins une fois, sans traduction visible. Apprendre les sept traductions n’est pas exigé. Si l’accordage comporte une altération, lire un nom réel de corde avec son signe. |
| GD-04 | **Nom, hauteur et octave** / Comprendre la note demandée | Distinguer un nom seul, une hauteur précise et une position ; comprendre les actions « nommer » et « retrouver ». | GD-02 pour les coordonnées ; GD-03 pour les noms dans la notation active. | Distinguer un même nom à deux hauteurs et reconnaître l’octave demandée. Réussir deux essais séparés : nommer un point, puis retrouver une note sur la corde annoncée. Les noms employés ont été présentés auparavant. |

**Justification des critères :** chaque vérification vise une confusion qui peut empêcher de jouer. Un pourcentage global pourrait masquer une confusion persistante entre case et frette. On vérifie chaque repère indispensable, sans seuil de vitesse arbitraire.

Une bonne réponse immédiatement après affichage de la solution permet de continuer à s’entraîner. Pour constater un repérage autonome, proposer une nouvelle demande, solution masquée et exemple différent.

## 3. Cours et activités dans l’application

Les textes ci-dessous sont des **propositions de contenus d’écran**. Les explications de conception ne sont pas destinées à être affichées au joueur.

| Cours | Titre / sous-titre | Visuel et geste | Texte court proposé | Vérification |
|---|---|---|---|---|
| GD-01.1 | **Votre instrument** / Reconnaître ses éléments | Illustration du profil choisi ; une seule zone et son mot apparaissent à la fois. Zoom pour case, frette et sillet. | « Voici le manche. » Puis une carte par élément : « Une corde. » / « Une case : l’espace entre deux frettes. » / « Une frette : la barre métallique. » / « Le sillet : la barre au départ des cordes. » | Retrouver séparément les cinq éléments sans étiquette. Vérifier particulièrement case ≠ frette. Ne pas ajouter de vocabulaire concernant le corps ou les accessoires. |
| GD-01.2 | **Les cordes à vide** / Distinguer deux façons de jouer | Deux schémas : corde libre au départ ; doigt dans la case 1, près de la frette. Écoute facultative. | « À vide : sans appuyer. » / « Note appuyée : un doigt dans une case. » | Choisir le schéma « à vide », puis refaire une comparaison avec les schémas inversés. Expliquer que 0 signifie « à vide », pas une case frettée supplémentaire. |
| GD-02.1 | **Votre manche en dessin** / Relier les deux vues | Instrument et diagramme ; une même corde est mise en évidence dans les deux représentations. | « Une ligne = une corde. » / « Voici la même corde. » | Retrouver sur le diagramme la corde montrée sur l’instrument. Son nom musical n’est pas demandé. |
| GD-02.2 | **Cordes et cases** / Trouver une adresse | Numéros de cordes à gauche, de cases sous le manche. Exemple résolu, puis trois demandes. | « Corde 1. Case 2. Touchez leur croisement. » | Coordonnées variées, dont une à vide. Aucune pastille ne révèle déjà la bonne position. Les boutons de réponse sont proposés en alternative. |
| GD-02.3 | **Les repères du manche** / Distinguer repère et note | Inlay fixe entre les cordes ; pastille plus grande sur une corde. Une animation déplace seulement la pastille. | « Repère fixe : aide à compter les cases. » / « Pastille de jeu : montre une note. » | Montrer lequel indique la note à travailler. Ne pas demander d’apprendre la liste des cases portant un inlay. |
| GD-02.4 | **Grave et aigu** / Suivre une même corde | Flèche du sillet vers les numéros croissants ; deux positions peuvent être écoutées. | « Sur la même corde : vers les grandes cases = plus aigu. » | Désigner ce sens sur une autre corde. Vérifier la lecture du diagramme ; aucun test d’oreille obligatoire. |
| GD-03.1 | **Les noms des notes** / Reconnaître vos sept noms | Cycle de sept étiquettes dans la notation active ; exemple complet, puis une étiquette masquée à retrouver. | « Vos sept noms : Do, Ré, Mi, Fa, Sol, La, Si. » **ou** « C, D, E, F, G, A, B. » | « Quel nom manque ? » : masquer successivement chacun des sept noms, dans un ordre varié. Faire aussi franchir Si→Do ou B→C. La boucle ne décrit pas les distances entre notes ; aucun emplacement du manche n’est demandé. |
| GD-03.2 — facultatif | **Deux écritures, les mêmes notes** / Passer de l’une à l’autre | Paires Do↔C, Ré↔D, Mi↔E, Fa↔F, Sol↔G, La↔A, Si↔B. Écoute d’une même hauteur possible. | « Do et C : deux noms pour la même note. » | Quelques associations si le joueur veut apprendre l’autre notation. Leur réussite ne conditionne pas la suite. |
| GD-03.3 — conditionnel | **Votre accordage** / Lire le signe rencontré | Une note altérée réellement présente à vide, avec son signe agrandi. | Exemple : « F♯ se lit “Fa dièse”. Ce nom fait partie de votre accordage. » Ou l’équivalent en bémol. | Reconnaître le nom complet. Cette étape explique l’accordage ; elle n’anticipe pas l’apprentissage chromatique. Absente si l’accordage ne la nécessite pas. |
| GD-04.1 | **Un nom, plusieurs hauteurs** / Comprendre l’octave | Deux cartes de même nom, chiffres différents ; petit escalier visuel, écoute facultative. | « Même nom : E. Deux hauteurs : E2 et E3. » / « Le chiffre repère l’octave. E3 est plus aigu que E2. » | Regrouper les deux mêmes noms, puis choisir la hauteur exacte annoncée. Utiliser un couple calculé : E2/E3 représente une octave ; E2/E4 en représente deux. |
| GD-04.2 — conditionnel | **Une hauteur, plusieurs places** / Lire aussi la corde | Deux positions réellement de même hauteur. En standard six cordes : B3, corde 2 à vide et corde 3 case 4. | « B3 peut se jouer ici et ici. Regardez la corde demandée. » | Retrouver celle imposée par la consigne, avec numéro de corde clairement mis en valeur. Si ce cas n’existe pas dans le profil et la zone, reporter l’exemple à sa première occurrence réelle. |
| GD-04.3 | **Une pastille, un nom** / Nommer la note | Exemple résolu : pastille → réponse dans la roue. Puis un essai avec un nom déjà présenté. | « Regardez le point. Touchez son nom. » | Un essai correct démontre la compréhension de l’action. Roue avec octave uniquement si une hauteur précise est demandée. Ce test ne démontre pas la mémorisation du manche. |
| GD-04.4 | **Une note, une place** / Retrouver la note | Exemple résolu : nom avec octave + corde → position. Puis un essai distinct, sans pastille préaffichée. | « Lisez la note et la corde. Touchez sa place. » | Réponse conforme à la hauteur et à la corde. Alternative par boutons équivalente. Fin : « Prêt à découvrir vos cordes ? » → **Découvrir mes cordes à vide**. |

### Ce que vérifie le chapitre des noms

Compléter le cycle permet de vérifier que les sept noms et leur succession sont repérés. Cela ne prouve ni la lecture de partition, ni l’identification à l’oreille. C’est la base utile ici pour comprendre les consignes et utiliser la roue. L’association **nom ↔ position** sera réellement entraînée dans la Zone I. Éviter une longue épreuve de traduction avant de pouvoir jouer.

## 4. Progression, vérifications et retours

### Boucle de chaque cours

**Voir un exemple → essayer avec aide → retrouver sans la solution → continuer.**

Une idée principale, un visuel dominant et une action par écran. Un nouveau type de question reçoit un exemple résolu. Les activités « nommer » et « retrouver » restent séparées ; on n’alterne pas leurs questions dans une même série.

### États proposés

| État | Signification et comportement |
|---|---|
| **Consulté** | Contenu parcouru ; aucune compétence n’est déduite de cette seule consultation. |
| **Repéré** | Vérifications du chapitre réussies sans solution visible au moment de répondre. |
| **À revoir** | Un repère reste difficile ; proposer son cours directement, sans refaire tout le chapitre. |
| **Ignoré** | Le joueur a passé le contenu ; ne pas enregistrer une réussite. |

Aucune autoévaluation n’est demandée. Les états viennent des interactions. **Suivant** et l’accès aux autres parcours restent disponibles. En fin de parcours, proposer la Zone I et, si nécessaire, un retour ciblé sur les repères manquants.

Les critères constatent une compréhension immédiate. Ils ne prouvent pas une mémorisation durable ; les premières activités de notes permettront de revoir ces notions en contexte.

### Quantité et rythme

Ce micro-parcours d’orientation n’applique pas mécaniquement les **20–30 questions des exercices de notes** : vingt demandes pour distinguer case et frette ajouteraient une friction sans couvrir de nouvelle difficulté. Les vérifications du tableau couvrent les repères utiles ; seuls les repères ratés déclenchent un nouvel essai ciblé.

Pas de chrono, de compte à rebours ni d’étoiles à gagner. Une coche discrète suffit pour un chapitre repéré. Aucun nouveau système de succès n’est nécessaire.

Dans le cours, la correction montre la différence utile : espace/barre, repère/pastille, E2/E3. Elle reste lisible jusqu’à l’action du joueur. Un nouvel exemple est proposé pour vérifier sans aide. Les exercices de jeu conservent, eux, leurs réponses rapides et leurs animations déjà définies.

La transition **« À vous de jouer ! »** vient après l’explication et avant les questions chronométrées du jeu ; elle ne précède pas chaque carte du cours.

## 5. Adaptation et accessibilité

| Élément | Règle à respecter |
|---|---|
| Instrument | Illustration et nom du profil choisi. Employer « votre instrument » dans les cours communs aux guitares et aux basses. Ne pas revenir à une six cordes standard. |
| Numérotation | Corde 1 en haut du diagramme, dernière corde en bas. Tous les nombres suivent le profil, y compris les boutons accessibles. |
| Grave/aigu entre cordes | Dans un accordage habituel, illustrer épaisseur, position physique et registre. Avec un accordage réentrant, ne pas affirmer que monter d’une ligne rend toujours le son plus aigu. Utiliser les hauteurs réelles, sans renuméroter les cordes physiques. |
| Accordage | Calculer les notes à partir de la corde et de la case. E2/E3 et B3 sont des exemples du standard six cordes, pas des valeurs à recopier partout. Rappeler l’accordage choisi avant de commencer à l’enseigner. |
| Octave | Utiliser un couple disponible dans le profil et la représentation. Sinon, présenter deux cartes sonores comme exemple ; ne pas inventer deux positions sur ce manche. |
| À vide | Employer « à vide » dans les consignes. Expliquer une fois que le diagramme peut l’écrire 0. |
| Repères et thèmes | Réutiliser le composant de manche commun. Distinguer inlay et pastille par taille, position et légende, pas uniquement par couleur. Respecter les thèmes et la réduction des animations. |
| Son et gestes | Écoutes facultatives respectant Mute ; cours compréhensible sans son. Alternative accessible à tout toucher du manche. Aucun glisser-déposer imposé. |
| Mise en page | Précédent / Suivant / Ignorer visibles en portrait et paysage. Fractionner une explication plutôt que réduire excessivement sa police. |

## 6. Raccord avec la cartographie bêta

Le bouton final ouvre **Pratique ciblée → Zones → Zone I → Les cordes à vide**. **Progression guidée → Niveau 1 → Zone I** référence le même chapitre et les mêmes résultats. Le niveau guidé organise des contenus existants ; il ne les duplique pas.

| Ensemble | Décision pour la conception suivante |
|---|---|
| Zones | **I : 0–4 ; II : 4–8 ; III : 8–12.** Ce dernier découpage remplace l’ancienne proposition 7–11 pour ces trois premières zones. Le code n’est pas modifié par ce document. |
| Cordes ciblées | Étudier la dernière corde physique, l’avant-dernière puis la précédente, selon l’instrument. Avec un accordage réentrant, préciser séparément la corde réellement la plus grave. L’étendue bêta 0–12 ou 0–24 reste à fixer avant leur tableau détaillé. |
| Niveau 1 | Référencer Zone I et les deux premières cordes retenues, avec résultats partagés. L’ordre détaillé et les révisions restent à concevoir. |
| Extensions | Intervalles, gammes, accords, arpèges et harmoniques restent hors de ce micro-parcours. Dans les futurs titres, distinguer un arpège — notes d’un accord successives — d’une progression d’accords. |

### Informations à préparer pour l’implémentation

Chaque cours aura un identifiant stable, un objectif, son contenu visuel, l’action attendue, les réponses admissibles, les aides utilisées, les critères observés et la prochaine activité recommandée. Séparer les textes, les visuels et les vérifications pour faciliter tes futures corrections.

Distinguer les résultats de repérage des scores d’exercices de notes. Conserver les notions communes lors d’un changement de profil ; reproposer seulement les exemples devenus différents. Ne remettre à zéro ni les préférences, ni les progrès existants.

Le tutoriel v0.23 fournit des visuels réutilisables. Son indicateur « vu/ignoré » ne suffit cependant pas à enregistrer ces critères : distinguer consultation, réponse guidée et réponse autonome.

### Recette avant diffusion

- Les quatre chapitres possèdent leurs visuels et leurs vérifications.
- Les coordonnées, hauteurs et noms sont exacts pour les profils proposés.
- Ignorer un contenu ne crée ni blocage ni fausse validation.
- Les commandes restent lisibles et accessibles sur les formats ciblés, avec et sans son.
- Un très grand débutant peut terminer le premier exercice de Zone I sans explication orale du créateur. Sinon, noter la consigne et l’action problématiques, puis corriger le cours correspondant.

Cette observation est un critère de recette UX ; elle ne démontre pas à elle seule une efficacité pédagogique générale.

## Références et limites du livrable

Références utilisées : ta dernière cartographie, prioritaire ; le dossier de conception phases 1 et 2 pour les compétences observables et la distinction aide/rappel ; le tutoriel et le rapport v0.23 pour les visuels et le fonctionnement actuel.

Les anciennes propositions de 24 leçons, de saisie manuelle et d’autoévaluation ne sont pas reprises.

**Livrable détaillé : le premier parcours Grand Débutant.** Les raccords avec la bêta sont identifiés ; les tableaux complets des Zones II/III, des trois cordes et du Niveau 1 ne sont pas présentés comme déjà conçus ou implémentés.
