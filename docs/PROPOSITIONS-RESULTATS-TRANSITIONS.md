# Propositions — résultats et transitions

Document de discussion du 16 octobre 2026, validé ensuite par le porteur du projet. Les résultats et transitions sont implémentés en v0.12, sauf le déplacement du repère de la suite musicale explicitement exclu. Le lancement est remplacé par la préparation plein écran de 1,5 seconde demandée. Les records sont strictement propres au même exercice. Les points et bonus restent une idée pour le futur mode Arcade.

## Une fiche de résultat inspirée de la capture

Conserver la hiérarchie demandée pour Daily Fretboard Trainer : le score est plus visible que les étoiles. Garder le fond blanc et la charte actuelle.

| Élément | Proposition | Utilité |
|---|---|---|
| Résultat principal | `19 / 20`, très lisible ; titre bref « Presque parfait ! » | Comprendre immédiatement la réussite |
| Étoiles | Petites, sous le score | Donner un défi facultatif sans dominer la fiche |
| Précision | `95 % de bonnes réponses` | Rendre le résultat compréhensible entre séries de longueurs différentes |
| Fluidité | `Temps médian : 1,2 s` sur les premières réponses correctes | Montrer l’automatisme plutôt que la rapidité de clic après correction |
| Record personnel | Petit trophée « Nouveau record de précision » ou « Plus fluide à précision égale » | Encourager une amélioration concrète |
| Détails | Bouton explicite « Voir mes erreurs » | Ouvrir les notes confondues, leurs hauteurs et leur emplacement sur le manche |
| Action ciblée | Depuis les détails : « Revoir ces notes » | Lancer une révision courte d’un seul type, avec la limite de 20–30 questions |
| Navigation | Exercice suivant en premier après réussite ; sinon Réessayer. Refaire et Parcours en secondaire | Garder les commandes visibles et prévisibles |
| Partage facultatif | Carte du résultat, sur action explicite de l’utilisateur | Partager une réussite sans publier de données personnelles |

Le bouton de détails est plus facile à comprendre que « tapez n’importe où sur l’écran ». Les informations secondaires peuvent être dans un panneau distinct : la fiche principale reste contenue dans l’écran.

### Records comparables

Comparer uniquement le même instrument, le même accordage, la même zone, la même activité, le même type de question et un ensemble de positions équivalent. Ne pas comparer une découverte guidée avec un bilan. Ne jamais remplacer la première erreur par sa correction.

Pour les temps, ne comparer que des résultats où les conditions de chronométrage sont équivalentes. Sans réponse correcte, afficher un tiret. Une seule séance ne suffit pas à déclarer une note durablement acquise.

### Points et bonus de temps

La capture comporte des points et un bonus de temps. Je recommande de garder d’abord le score pédagogique `19 / 20`. Un score de points deviendrait particulièrement pertinent pour le futur mode Arcade, où le temps et les vies appartiennent aux règles du jeu. Dans le mode Apprentissage, la rapidité reste un défi facultatif et ne doit pas encourager à répondre au hasard.

Priorité proposée : précision + temps médian, puis record comparable, puis détails et révision ciblée. Le partage et les points peuvent attendre.

## Transitions qui amélioreraient le parcours

| Passage | Mouvement proposé | Durée indicative |
|---|---|---|
| Première vers deuxième étape de configuration | Fondu et déplacement horizontal de 8 px, sens inversé au retour | 150–180 ms |
| Micro-leçon vers préparation | Fondu de la consigne ; manche conservé au même emplacement quand le format le permet | 120–160 ms |
| Question suivante | Fondu bref du texte et des nouveaux marqueurs | 80–120 ms |
| Réponse juste | Légère impulsion du marqueur vert, roue immobile | 100–140 ms |
| Réponse fausse | Rouge/vert immédiatement, sans secousse de tout l’écran | 80–120 ms |
| Suite musicale | Déplacer doucement le repère de lecture vers la prochaine note | 100–140 ms |
| Fin d’exercice | Apparition du résultat avec déplacement vertical de 6 px ; boutons visibles immédiatement | 140–180 ms |
| Résultat vers détails | Petit panneau qui apparaît, puis revient au résultat | 150–180 ms |
| Changement d’instrument | Fondu de l’image et du résumé concernés uniquement | 120–160 ms |
| Réglage CDE / Do–Ré–Mi | Remplacement direct du texte, image conservée | Immédiat |

### Règles de mise en œuvre

- Animer principalement `opacity` et `transform`, sur quelques éléments. Éviter les animations de hauteur, largeur et flou.
- Ne pas déplacer la roue des réponses ni les zones tactiles au moment de répondre.
- Ne pas prolonger les attentes actuelles de 500 ms / 1 seconde : les effets s’y inscrivent.
- Démarrer le chronométrage lorsque la question est visible et utilisable ; une transition ne doit pas dégrader le temps de réponse mesuré.
- Avec « réduire les animations » activé sur l’appareil, supprimer les déplacements et garder les changements de couleur indispensables à la correction.
- Ne pas relancer l’animation d’entrée de toute la page à chaque changement de question. Des mises à jour ciblées de l’interface faciliteront ce comportement.
- En pause, conserver le flou statique demandé et l’accès aux commandes. Éviter d’animer continuellement le filtre.

L’indicateur tactile élargi demandé est déjà implémenté séparément en v0.11. Ce document concerne les transitions supplémentaires à choisir.
