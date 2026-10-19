# v0.25 — Parcours simplifiés, acquis durables et audio préparé

Daily Fretboard Trainer — 19 octobre 2026.

Cette version corrige les dix constats de l’[audit v0.24](AUDIT-v0.24.md) et applique les nouvelles demandes sur les branches, la carte du manche et le son. Elle conserve le catalogue pédagogique bêta ; afficher les cases 0–24 dans les statistiques ne crée pas de nouveaux exercices au-delà de la case 12.

## Ce que voit le joueur

### Trois branches, puis le parcours choisi

L’entrée « Mon parcours » présente seulement trois grandes tuiles, disposées verticalement :

1. **Grand Débutant : commencez ici !** → Les bases du manche.
2. **Progression Guidée** → Niveau 1 : Débutant.
3. **Pratique ciblée** → les trois zones et les trois premières cordes physiques.

Les parcours ne sont plus dispersés sur l’accueil. Chaque niveau possède un retour clair et une action principale. Une page de chapitre met la prochaine activité en avant ; les autres restent accessibles sous « Choisir une activité ». Les étapes guidées se replient pour éviter une longue liste de 42 chapitres ouverte en permanence.

La règle d’architecture est explicite dans `navigation-rules.js` : **Branche → Parcours → Chapitre → Activité, une prochaine action visible, aucun verrou pédagogique**. Les branches et l’activité à reprendre sont conservées dans le profil. Les résultats restent partagés entre les accès guidé et ciblé.

### Reprise et bilan

- Après interruption ou rechargement, l’action principale du chapitre reprend la séance existante : même identifiant, même question, mêmes réponses et aides.
- La page de parcours propose aussi cette reprise en priorité. Choisir manuellement une autre activité reste possible.
- Le Niveau 1 dispose d’un bilan des trois périmètres : Zone I, première corde et deuxième corde. Chaque ligne distingue positions vérifiées dans les deux sens et chapitres validés.
- Une reprise peut être conseillée après 24 heures sans exercice dans ce parcours, ou pour les erreurs de la dernière activité. Le délai est une règle de recommandation configurable, pas une preuve scientifique de mémorisation ni un verrou. Une reprise ciblée réussie ne doit pas être proposée indéfiniment comme si elle n’avait pas eu lieu.

### Une seule carte des progrès, à vide jusqu’à 24

Les boutons `data-pilot-action="beta-stats"` sont supprimés.

Toutes les cordes sont affichées ensemble, corde 1 en haut. Les 25 emplacements par corde conservent des cibles larges ; le tableau défile horizontalement dans son propre cadre. Une colonne de numéros reste visible à gauche.

Le bord droit comporte un fondu qui disparaît en fin de manche. Une barre de défilement explicite reste visible même sur les systèmes qui cachent leur barre native : on peut la déplacer au doigt, à la souris ou au clavier. Le défilement naturel du tableau fonctionne également.

Le détail de la note choisie apparaît sous la carte, en dehors de la zone défilante : il ne peut plus être tronqué dans une petite fenêtre flottante.

## Corrections de l’audit

| Référence | Correction | Vérification |
|---|---|---|
| A01 — reprise incorrecte | Le chapitre et le parcours privilégient la séance sauvegardée ; reprise avec le mode approprié. | Après trois réponses puis rechargement, reprise à la quatrième question avec le même identifiant. |
| A02 — solution déjà montrée | Les exemples des formats Nommer/Retrouver utilisent une autre cible que la première question évaluée. L’ordre et le quota de la file restent intacts. Les illustrations d’introduction au mélange évitent également la cible évaluée. | Comparaison de la réponse illustrée et de la première réponse attendue ; file non modifiée. Si aucune alternative n’existe, l’essai est marqué guidé. |
| A03 — correction sur figure identique | Les vérifications de vocabulaire changent déjà de figure par rapport à l’explication. Après une erreur, la figure ou sa présentation varie ; les coordonnées de recherche restent atteignables dans le périmètre. | Mauvaise réponse, changement effectif de figure, bouton Suivant encore désactivé avant réussite. |
| A04 — GD-04 incomplet | Ajout d’un exemple d’action, d’une nomination de point et d’une recherche de hauteur sur corde demandée. Ces deux vérifications restent présentes sans unisson disponible. | Standard et accordage personnalisé sans doublon de hauteur. |
| A05 — carte trop étroite | Carte complète 0–24 avec défilement et cellules d’au moins 48 px de largeur. | Mesure des cibles, sélection de la case 24 et lecture du détail hors cadre. |
| A06 — bilan du Niveau 1 | Synthèse des trois périmètres, couverture, état de validation et accès pour continuer/consolider. | Trois lignes de bilan, calculées avec les mêmes preuves que les chapitres. |
| A07 — acquis dépendant du journal | Preuves cumulées, statistiques par emplacement et meilleurs records séparés du journal détaillé. | Plus de 1 000 nouvelles tentatives et relecture de sauvegarde : les validations restent présentes, sans double comptage. |
| A08 — instrument/diagramme | Vue vectorielle de l’instrument et gros plan utilisent les mêmes couleurs et le même ordre physique ; la corde est signalée dans les deux vues. Les éléments de vocabulaire sont mis en évidence sur l’instrument et le détail. | Inspection des figures, y compris le changement d’exemple. |
| A09 — reprises statiques | Recommandation à partir du dernier résultat et d’un délai réel ; reprise ciblée après erreur. | Cas récents, retour après délai et exercice raté. |
| A10 — cours denses | Les boutons de coordonnées sont une alternative dépliable. Leur apparence réutilise le pavé de cases du jeu ; l’ouverture reste conservée pendant les cours. | Neuf cours parcourus avec les commandes réelles dans le navigateur. |

Les cours restent non chronométrés. Réussir un cours ne génère pas une tentative de reconnaissance des notes ni une preuve de rétention à long terme.

## Conservation des données

Les clés de stockage et la version principale de sauvegarde restent stables.

`learning-evidence.js` conserve séparément :

- les activités réussies et leur contrat précis de tâche ;
- les positions reconnues sans aide, par sens de question ;
- les nombres cumulés de réponses justes et de tentatives par emplacement ;
- les meilleurs résultats, uniquement dans leur contexte d’exercice et de contrat.

Le journal détaillé conserve désormais les 250 dernières tentatives du profil. **La synthèse est construite avant cette réduction**, avec les tentatives encore disponibles de l’ancienne version. Réduire le journal ne supprime ni les preuves de chapitre, ni les statistiques cumulées, ni les records. Les succès déjà obtenus et leurs dates restent conservés.

Des réponses déjà effacées par une ancienne version ne peuvent pas être reconstituées sans une sauvegarde qui les contient.

Les réponses déjà correctes des anciens cours ne sont pas effacées. Si GD-04 avait été déclaré terminé sans les vérifications désormais requises, il reprend au premier nouvel élément manquant. Le joueur n’est pas renvoyé à la fin d’un cours impossible à compléter.

## Audio

### Première note et retour après silence

- Contexte Web Audio demandé avec `latencyHint: 'interactive'`.
- Un unique moteur et son cache sont conservés.
- Les notes du profil, de l’à-vide à la case 12, sont préparées progressivement sans longue boucle bloquante.
- La synthèse électrique remplace les calculs trigonométriques et exponentiels par échantillon par des récurrences d’oscillateur.
- La première note après création/reprise du contexte reçoit une courte marge de programmation ; elle n’est pas programmée dans le passé pendant sa préparation.
- Un signal sous le seuil audible maintient le graphe prêt pendant les silences lorsque l’application est visible et le son activé. Il est arrêté en arrière-plan, au mute et à la fermeture du moteur ; les notes déjà en train de résonner ne sont pas coupées par ce mécanisme.

Ces changements traitent les causes logicielles observables. **Ils ne certifient pas la disparition du problème sur le pilote audio Windows du testeur.** Il faut vérifier le premier son et celui joué après plusieurs dizaines de secondes de silence sur cette machine.

### Basse et équilibre

La basse contient davantage d’énergie dans ses harmoniques et son filtre est plus ouvert, pour qu’elle reste perceptible sur des enceintes reproduisant peu le grave.

Les quatre timbres passent par une calibration commune de la puissance pondérée de l’attaque et du corps de la note, en tenant compte du filtre de lecture. Une limitation douce contrôle les crêtes. Les vélocités et nuances des arrangements sont conservées.

Ce n’est pas une certification LUFS ni une égalité perceptive garantie sur toutes les enceintes. Les tests contrôlent la proximité de niveau selon cette mesure, l’absence d’écrêtage numérique brutal et la stabilité des buffers.

## Recette

- `npm run check` et **25 fichiers de tests Node** passent, dont douze scénarios dédiés à cette livraison.
- **41 scénarios de régression navigateur** : dispositions, parties complètes et neuf cours.
- **23 contrôles complémentaires** : reprise, démonstration indépendante, branches, carte, variantes, bilan, quatre thèmes sur quatre formats et contexte audio Chromium réel.
- Hors ligne : rechargement depuis le dossier FTP, nouveaux modules en cache, cours, correction, stabilité du manche et retour au chapitre.
- Archive ZIP : contrôle d’intégrité, empreinte SHA-256 et égalité avec les sources applicatives.

Rapports et captures : [dossier v0.25](v0.25/).

Les durées de préparation audio relevées par le navigateur mesurent le travail logiciel. Elles ne mesurent pas le délai entre le geste et le son sortant de l’enceinte.

## Livraison et vérification sur appareils

Télécharger [le ZIP v0.25](../downloads/daily-fretboard-trainer-v0.25.zip), puis déposer **son contenu**, dossier `api/` compris, sur l’hébergement HTTPS. Exporter une sauvegarde avant le transfert. Ne pas supprimer les données du navigateur.

Pour un dossier versionné : `adh-pwa/v0.25/`. Placer [latest.json](../downloads/latest.json) dans `adh-pwa/` si ce mécanisme de mise à jour y est utilisé. Une URL stable reste préférable pour les prochaines versions.

Aucun transfert FTP ni email réel n’a été effectué. Restent à vérifier sur appareils : réveil audio Windows après silence, équilibre des timbres à l’oreille sur petites enceintes, audio/rotation/Safari et installation PWA sur iPhone réel. La fidélité musicale des transcriptions existantes n’est pas certifiée par cette recette logicielle.
