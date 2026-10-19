# Audit contradictoire — Daily Fretboard Trainer v0.24

19 octobre 2026. Version examinée : commit `8a301d4`, archive `daily-fretboard-trainer-v0.24.zip`.

## Avis

**La base de la bêta est effectivement construite, mais la livraison n’est pas entièrement conforme à la spécification.** Deux défauts doivent être corrigés avant d’élargir les tests : la reprise d’une séance interrompue et la comptabilisation autonome d’une réponse déjà révélée dans la démonstration. D’autres lacunes concernent les vérifications Grand Débutant et le bilan de progression.

Le bilan précédent qualifiait trop vite la bêta d’entièrement implémentée. Les tests passants établissent que les scénarios choisis fonctionnent ; ils ne suffisent pas à démontrer toutes les exigences pédagogiques et ergonomiques.

Cet audit ne modifie aucun fichier de l’application ni son ZIP. Les captures présentent des profils de test, avec réponses automatisées ou simulation explicitement activée ; ce ne sont pas des résultats de vrais élèves.

## Périmètre et méthode

Référence : [document utilisateur révisé](beta-v0.24/SPECIFICATION-UTILISATEUR.md), avec les décisions ultérieures de la conversation : manche continu, paysage conseillé sans contrainte, portrait jouable, et **bilans courts avec couverture vérifiée sur le parcours**. Les contradictions internes du document sur les fragments et le bilan exhaustif ne sont donc pas retenues comme obligations.

Vérifications effectuées :

- Lecture des changements depuis le commit précédent `c171e5b`, du document, du catalogue, des cours, des interfaces et de la conservation des résultats.
- Nouvelle exécution de `npm run check` et `npm test` : **24 fichiers de tests passent**.
- Nouvelle exécution de la recette bêta : **41 scénarios Chromium passent**, sans erreur JavaScript signalée. Ils couvrent 25 dispositions, sept parties complètes et neuf cours.
- Scénarios contradictoires supplémentaires dans le navigateur : séance interrompue, démonstration suivie du même item évalué, mesure réelle des cibles de la carte des progrès.
- Simulation du moteur sur les six instruments : toutes les activités exécutées avec des réponses correctes, couverture et validation finales cohérentes, sauvegardes relues avec succès. Cette simulation vérifie le calcul ; elle ne constitue pas une preuve d’efficacité pédagogique.
- Production de 46 captures supplémentaires et inspection de six planches regroupant 30 vues : configuration, catalogue, chapitres, cours, exercices, pause, résultats, détails et quatre thèmes. Un affichage sans débordement ne vaut pas, à lui seul, validation visuelle.
- Vérification du ZIP : intégrité, empreinte SHA-256 et égalité des fichiers applicatifs avec les sources publiées.

Les formats de la recette vont de 320×568 à 1440×900, dont deux paysages mobiles. Les captures complémentaires montrent principalement 390×844 et le paysage 844×390. Toutes les combinaisons possibles cours × instrument × thème × format n’ont pas été examinées visuellement.

## Anomalies prioritaires

P1 : à corriger avant diffusion plus large. P2 : à corriger pour revendiquer la conformité de la bêta. P3 : amélioration ou finition.

### A01 — P1 — « Continuer » peut effacer la reprise d’une séance

**Reproduction réelle :** démarrer « Nommer les cordes », répondre à trois questions, recharger la page. La page du chapitre est restaurée. Aucun bouton « Reprendre ma séance » n’y est proposé. Cliquer « Continuer » crée un nouvel identifiant de séance et revient à l’index 0, au lieu de reprendre à l’index 3.

La séance interrompue était bien dans le stockage avant le clic. Le problème est le branchement du bouton ; il ne s’agit pas d’une perte générale de toutes les anciennes tentatives. Une reprise reste accessible en revenant au catalogue, mais ce détour n’est ni visible ni expliqué.

**Cause :** `startChapter()` lance `c.start(next.id)` sans le mode reprise. Le bouton de reprise n’existe que dans la branche catalogue de `betaHome()`.

**Correction attendue :** proposer la reprise à l’endroit où l’élève revient. Si la séance sauvegardée correspond à l’activité recommandée, la reprendre sans écraser sa file, ses réponses et ses aides. « Recommencer » doit rester une action distincte.

**Recette :** après rechargement et clic sur l’action principale, conserver identifiant, index, réponses et question ; vérifier aussi le retour après avoir consulté les paramètres.

Sources : [`beta-home.js:107`](../beta-home.js#L107), [`beta-home.js:243`](../beta-home.js#L243), [`pilot-ui.js:76`](../pilot-ui.js#L76). [Preuve navigateur](audits/v0.24/reproductions-navigateur.json), [capture](audits/v0.24/resume-after-reload.png).

### A02 — P1 — La démonstration fournit la réponse à la première question notée

**Reproduction réelle :** avec les instructions non encore vues, ouvrir « Nommer les cordes ». L’exemple résolu montre la cible et son nom avec octave. Après « À moi d’essayer », la première question conserve exactement le même identifiant et la même cible. Une réponse juste est enregistrée avec `aids: []`.

La démonstration n’est pas fautive en elle-même : elle doit montrer une réponse résolue. **C’est sa réutilisation immédiate comme preuve autonome qui est incorrecte.** Cela peut favoriser score, couverture et comparaison de fluidité pour le premier item.

**Cause :** `renderIntroduction()` et `helpGraphic()` utilisent la question courante ; `help-next` ne remplace pas cette question et ne marque pas l’aide. Le contrat exige pourtant un nouvel exemple pour constater le rappel autonome après une solution montrée.

**Correction attendue :** séparer l’item de démonstration de la file évaluée. Le premier item autonome doit porter sur une autre position. Si aucune autre demande pertinente n’existe, conserver l’essai comme guidé et reporter la preuve autonome dans un mélange.

**Recette :** la cible illustrée ne devient pas immédiatement une réponse autonome ; aucune couverture ni record autonome n’est attribué à un essai déjà résolu.

Sources : [`pilot-ui.js:239`](../pilot-ui.js#L239), [`learning-help.js:27`](../learning-help.js#L27), [`pilot-ui.js:192`](../pilot-ui.js#L192). [Preuve navigateur](audits/v0.24/reproductions-navigateur.json), [démonstration](audits/v0.24/solved-demo.png).

### A03 — P2 — Grand Débutant confond correction et vérification sur un nouvel exemple

Le cours GD-01 repropose les mêmes figures après une erreur. Une mauvaise réponse suivie de la bonne sur le même quiz ajoute simplement l’identifiant à `record.correct`. Aucun état ne distingue une correction d’un nouveau repérage autonome. Le chapitre peut ensuite être validé.

Le document demande de reproposer les repères ratés **sur un nouvel exemple**. Le résultat actuel montre que l’élève a fini par sélectionner l’étiquette attendue ; il ne démontre pas ce repérage sur une variante.

**Correction attendue :** maintenir des essais libres pour apprendre, puis demander une variante courte pour les notions ratées. Pour case/frette, déplacer notamment la zone mise en évidence. Garder le cours non chronométré et sans série artificielle de vingt questions.

Sources : [`course-ui.js:126`](../course-ui.js#L126), [`beta-courses.js:32`](../beta-courses.js#L32). [Reproduction conceptuelle](audits/v0.24/verification-conceptuelle.json).

### A04 — P2 — GD-04 ne vérifie pas toutes les actions promises

En standard six cordes, GD-04 comprend deux choix sur le nom et la hauteur, puis une recherche de position si une même hauteur existe sur deux cordes. **Il ne comporte pas l’essai séparé de nomination d’un point demandé par le critère GD-04.**

Avec un profil personnalisé `C1 C2 C3 C4 C5 C6`, aucun doublon de hauteur n’existe dans la Zone I : la partie conditionnelle disparaît. GD-04 peut alors être validé sans aucune recherche sur le manche. Le caractère conditionnel de l’exemple d’unisson ne doit pas supprimer la vérification générale de l’action « retrouver ».

**Correction attendue :** toujours prévoir un essai « nommer ce point », puis un essai « retrouver cette hauteur sur cette corde ». Réserver le cas conditionnel au doublon de hauteur. Les noms employés doivent avoir été présentés auparavant.

Source : [`beta-courses.js:255`](../beta-courses.js#L255). [Liste réelle des vérifications standard](audits/v0.24/verification-conceptuelle.json).

### A05 — P2 — La carte des progrès miniaturise treize cibles tactiles

Sur téléphone 390×844, la vue « Corde 6 » affiche treize cellules sur une ligne. Leurs surfaces cliquables mesurent environ **18,2 × 52 px**. Une absence de débordement horizontal ne les rend pas confortables à sélectionner.

Ce défaut concerne **Mes progrès**, pas le gameplay : les grands boutons de cases du jeu remplissent correctement leur rôle.

**Correction attendue :** garder le manche continu comme aperçu, puis proposer une sélection de case confortable ou un panneau de détails adapté. Le défilement éventuel d’une page de statistiques est un arbitrage distinct de l’interdiction de défiler pour répondre dans le jeu. Viser 44 px de largeur pour la commande tactile ; ne pas prétendre à une conformité d’accessibilité complète sans audit dédié.

Source : [`progress.js:10`](../progress.js#L10). [Mesures](audits/v0.24/reproductions-navigateur.json), [capture](audits/v0.24/progress-full-string.png).

### A06 — P2 — Le bilan synthétique G1-BILAN n’est pas livré à l’écran

Les six étapes G1-A à G1-F existent et réutilisent bien les chapitres canoniques. La validation du Niveau 1 est calculable par `guidedComplete`. Mais le bilan prévu par le document reste limité, à l’écran, à un nombre de chapitres validés et à une liste : il manque une synthèse des trois périmètres, de leur couverture et du prochain travail utile.

**Correction attendue :** une carte de bilan du Niveau 1, avec Zone I / première corde / deuxième corde, état démontré et positions restant à vérifier. Offrir l’accès aux derniers mélanges et aux difficultés constatées. Aucun quatrième examen cloné n’est nécessaire.

Sources : [`beta-catalog.js:337`](../beta-catalog.js#L337), [`beta-home.js:232`](../beta-home.js#L232). Voir [planche 3](audits/v0.24/planche-3.png).

### A07 — P2 — Les validations peuvent reculer quand l’historique ancien est tronqué

La limite de 1 000 tentatives était déjà présente. Le nouveau suivi de chapitres et de couverture reconstruit néanmoins toutes ses preuves à partir de ce seul historique limité.

**Reproduction de contrainte :** partir d’un profil simulé entièrement achevé, ajouter 1 000 répétitions d’une même activité en appliquant la même troncature que `finish()`. Le Niveau 1 passe de validé à non validé ; la Zone I passe de 14 chapitres validés à un seul. Les cours restent présents, mais leurs preuves d’activités ont disparu.

Ce n’est pas une perte immédiate à la mise à jour ni une panne observée chez un testeur. C’est une incohérence durable de conservation des acquis, rendue importante par la nouvelle définition de validation.

**Correction attendue :** conserver des preuves cumulées compactes, séparées du journal détaillé : activités réussies avec contrat de tâche, positions autonomes par sens, records. Migrer les preuves existantes avant toute purge du journal. Ne pas simplement supprimer toute limite du stockage.

Sources : [`pilot-ui.js:176`](../pilot-ui.js#L176), [`beta-catalog.js:245`](../beta-catalog.js#L245). [Résultat reproductible](audits/v0.24/retention.json).

## Écarts visuels et pédagogiques complémentaires

### A08 — P2 — Le lien instrument réel → diagramme reste incomplet

Les images fournies sont bien réutilisées. Cependant, dans GD-02, la corde est surlignée uniquement sur le diagramme ; l’image de l’instrument reste entière et sans surlignage correspondant. GD-01 présente également une photo sans pointer le manche réel. On demande donc au grand débutant d’effectuer seul une partie de la correspondance que ce cours devait expliquer.

Prévoir un recadrage/repère lié sur l’image ou une illustration vectorielle du profil où le même élément est signalé des deux côtés. Le sillet, la frette et la case doivent se distinguer visuellement. [Planche 2](audits/v0.24/planche-2.png). Source : [`course-ui.js:183`](../course-ui.js#L183), [`beta-courses.js:103`](../beta-courses.js#L103).

### A09 — P3 — Les reprises sont proposées de façon statique

Les boutons de reprise spiralaire existent aux bonnes étapes. La recommandation ne tient toutefois pas compte d’une absence ou des erreurs d’une reprise pour choisir la suite : `betaHome()` privilégie les découvertes et activités non réussies, sans calcul de délai.

Ajouter une recommandation courte lors du retour après délai, et une reprise ciblée si les erreurs le justifient. Cela ne doit créer ni calendrier imposé, ni auto-évaluation, ni verrou de progression. Pour l’instant, parler de « reprises disponibles », pas de suivi adaptatif de la rétention.

### A10 — P3 — Les figures de cours restent denses sur téléphone

Les coordonnées GD-02 affichent par défaut le manche puis tous les boutons de toutes les cordes. Les commandes restent disponibles, mais la table domine visuellement le dessin et les libellés « Case 1 » se coupent sur deux lignes. Dans l’entrée d’une corde, les treize boutons de cours ont aussi une apparence différente du pavé de gameplay.

Réutiliser les mêmes composants de sélection de position et proposer la table complète en alternative volontaire, sans masquer l’option. Conserver la navigation fixe du cours. Cette amélioration ne demande pas de rapprocher les blocs question/réponse du gameplay, sujet réservé par l’utilisateur. [Planches 1 et 2](audits/v0.24/planche-1.png).

## Conformité du socle

| Exigence | État après vérification | Observation |
|---|---|---|
| Trois zones exactes 0–4, 4–8, 8–12 | Conforme | Pas de faux sillet ni de corde à vide en case 4/8. |
| Trois premières cordes physiques n, n−1, n−2 | Conforme | Pas de renumérotation selon la hauteur ; explication réentrante prévue. |
| Accordage et instrument pilotent les positions | Conforme dans les profils testés | Six instruments et cas personnalisés examinés ; pas de calque forcé six cordes. |
| Naturelles puis altérations | Conforme | Les cordes altérées sont nommées dans l’accordage sans contaminer les mélanges naturels. |
| Quota de nouvelle famille | Conforme | 30 % minimum ; huit questions minimum sur 24. |
| Ordre aléatoire et répétitions | Conforme dans les séries testées | Les mélanges évitent trois noms identiques successifs ; variantes par hauteur/position pour les tâches isolées. |
| Séances distinctes Nommer / Retrouver | Conforme | 20–24 questions dans le catalogue ; pas d’alternance intempestive des types. |
| Bilans courts et couverture sur le parcours | Conforme dans le moteur, synthèse UI partielle | Arbitrage utilisateur respecté ; compléter A06 et protéger les preuves A07. |
| Corde, hauteur et octave exactes | Conforme dans les tâches évaluées testées | Une recherche de E2 n’accepte pas E3 en case 12. |
| Pas de nomination isolée à choix unique | Conforme | Vérification reportée vers les mélanges pertinents. |
| Niveau 1 et pratiques ciblées partagent les preuves | Conforme | Références communes ; pas de copies des activités. |
| Accès libre à tous les chapitres | Conforme | Les prérequis ne verrouillent pas les parcours. |
| Manche continu et portrait jouable | Conforme dans les formats testés | Paysage conseillé ; pavé de cases disponible en portrait ; pas de cadrage révélant la réponse. |
| Chronomètre après transition | Conforme dans la recette | Rotation conserve la question ; SVG stable entre réponses. |
| Grand Débutant : quatre chapitres | Présents, critères partiels | Corriger A03, A04, A08. |
| Démonstration entièrement résolue | Présente, preuve autonome contaminée | Corriger A02 ; ne pas supprimer la démonstration. |
| Séance interrompue | Partiel | Donnée sauvegardée, mais action principale de reprise incorrecte : A01. |
| Progression durable | Partiel | Données v0 conservées et sauvegardes valides ; A07 à traiter. |
| Quatre thèmes | Cohérents sur les états inspectés | Pas de validation WCAG exhaustive ; vérifier notamment toutes les corrections et fenêtres sur appareil. |
| Carte des progrès 0–12 | Présente, interaction insuffisante | A05 sur téléphone. |
| ZIP FTP | Conforme aux sources auditées | Intégrité et empreinte vérifiées ; aucun transfert FTP effectué pendant cet audit. |

## Lecture visuelle

- [Planche 1 — configuration, catalogue, chapitre, cours sur une corde](audits/v0.24/planche-1.png).
- [Planche 2 — vocabulaire, correspondance instrument/diagramme, coordonnées et notation](audits/v0.24/planche-2.png).
- [Planche 3 — Zone III, huit cordes, manche continu, roue d’octaves et statistiques](audits/v0.24/planche-3.png).
- [Planche 4 — gameplay dans les quatre thèmes](audits/v0.24/planche-4.png).
- [Planche 5 — résultat, détail d’erreur et pause](audits/v0.24/planche-5.png).
- [Planche 6 — chapitre et cours dans plusieurs thèmes](audits/v0.24/planche-6.png).

L’onboarding guidé rend les choix instrument/notation/accordage explicites. Le jeu distingue les ordres de corde et les zones. Le résultat met le score avant les étoiles et conserve une action principale claire. Le manche continu avec pavé de cases est une base à conserver.

Les captures longues des pages de catalogue et de chapitres comprennent la navigation mobile fixe à sa position au moment de la capture ; elles ne signifient pas que toute la page est simultanément affichée sur le téléphone. Le défilement de ces pages de navigation n’est pas une violation de la contrainte de gameplay sans défilement.

## Limites de cet audit

- Inspection du code et du ZIP publiés, exécutés localement ; pas de vérification de ce qui est effectivement déposé sur o2switch.
- Chromium utilisé ; ni iPhone physique, ni Safari réel, ni PWA installée sur iOS testés ici.
- Aucun nouveau contrôle auditif humain des morceaux, de leur transcription ou des timbres. La v0.24 ne réécrit pas le catalogue musical ; les nouveaux périmètres restent honnêtement intitulés « Suite d’entraînement ».
- Aucun email réel envoyé et aucun paiement testé ; ce dernier ne fait pas partie du périmètre de cette bêta.
- Pas de test d’efficacité pédagogique, de rétention à long terme ou de plaisir avec un nouvel élève réel. La conformité du moteur ne remplace pas ces observations.

## Ordre de correction conseillé

1. A01 et A02 : reprise et séparation entre démonstration et évaluation.
2. A03 et A04 : compléter les vérifications Grand Débutant.
3. A07 : stabiliser les preuves acquises indépendamment de la purge du journal.
4. A05, A06 et A08 : interaction de la carte, bilan du Niveau 1 et correspondance visuelle instrument/diagramme.
5. A09 et A10 : reprises après délai et cohérence des composants de cours.
6. Rejouer les reproductions négatives, puis vérifier sur iPhone réel et avec un grand débutant.

Le projet peut continuer à servir de version de travail. La mention « bêta entière conforme au document » doit attendre la correction des écarts ci-dessus.
