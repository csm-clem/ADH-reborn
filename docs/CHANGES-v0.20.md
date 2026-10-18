# v0.20 — Manche, contrastes et collection

Livraison du 18 octobre 2026. La zone jouable reste 0–4. Cette recette corrige la v0 et ne réalise pas encore l’extension du parcours complet, le paiement ou l’essai de sept jours prévus pour V1.

## Manche et réponses

- L’espace réservé aux cordes à vide est réduit d’un tiers **uniquement dans les schémas « Nouvel exercice ! »** : largeur 38 → 25⅓ unités. Les numéros et les noms restent séparés. Les autres manches conservent leur géométrie.
- Les états neutre, correct et incorrect utilisent des couleurs explicites du thème. Les retours colorés sont dessinés **au-dessus** des nouvelles pastilles, pour rester visibles lorsqu’une question réutilise immédiatement la même position. Le neutre reprend le sillet ; Papier reste volontairement monochrome.
- Après une erreur, **sur le manche**, seule la note demandée est dessinée en rouge, avec son vrai nom. Le mauvais emplacement choisi n’est pas dessiné. Le maintien de 500 ms puis la disparition progressive sont conservés. Dans la roue, la mauvaise proposition et la bonne réponse retrouvent leur distinction indépendante.
- Cordes graves légèrement épaissies ; sillet 2,8 → 3,1 unités. Source graphique partagée entre schémas et gameplay.
- Le tableau de réponse perd son titre « Corde », sa légende et les fonds des numéros de corde. Les noms restent masqués, sauf quand le joueur active l’indice. Le repère de départ devient « Afficher les noms des cordes à vide » pour la zone 0, ou « … de la case 4 » pour une zone commençant à 4.
- Les mentions pertinentes « case 0 » deviennent « à vide », y compris dans les libellés accessibles, les erreurs et les progrès. Le chiffre 0 reste un repère conventionnel sur les axes du manche.
- La mention « Position 0–4 » est retirée du gameplay.

## Accueil, parcours et réglages

- Titre, description et illustration d’accueil partagent la même colonne. La rotation de l’illustration est calculée **à l’intérieur du SVG**, dans une boîte de hauteur fixe : elle ne tronque plus le manche et ne déplace pas les autres éléments.
- Les derniers mélanges naturels s’appellent « Toutes les notes naturelles » ; les derniers mélanges complets « Toutes les notes naturelles et altérées ». Le choix dépend de l’ordre réel des familles de l’accordage, et non d’un C codé en dur.
- Les blocs « Ce que ce pilote vérifie » et « Pour les élèves déjà à l’aise » sont retirés du parcours. Le moteur de diagnostic reste disponible dans le code historique ; il n’est plus proposé dans ces panneaux.
- **Signaler un bug**, dans les paramètres : description libre puis préparation d’un brouillon GitHub. Le joueur vérifie et publie lui-même avec son compte. Le brouillon contient la version, l’instrument, l’accordage MIDI, le thème et les dimensions d’écran ; aucune tentative ni sauvegarde n’est jointe. Aucun message n’est envoyé automatiquement.

## Succès et thèmes

- Cartes de collection avec une illustration encadrée, un titre prioritaire et une coche d’acquisition contrastée. Les mentions de statut « Obtenu » / « À découvrir » disparaissent de la surface des cartes ; les filtres de collection gardent leur fonction.
- La date devient un petit sceau en bas de carte. Les preuves détaillées restent consultables dans « Critère et détails ».
- Inclusif-contrasté : bleu de validation **#005A9C** à la place des anciens verts peu lisibles, symboles ✓/×, contour de pastille de **1 pt** constant à l’écran, coche de leçon blanche sur bleu, piste de progression claire. Illustration acquise bleu profond / illustration non acquise blanche : la coche fournit un second indice indépendant de la couleur.
- Studio nuit : encart de zone sombre, frettes et cordes gris métallique, zone du manche presque noire. Les étiquettes des notes utilisent le fond du thème, ce qui évite le texte clair sur un cartouche blanc.
- Les couleurs restent définies dans les tokens ; la bordure et les états des pastilles sont centralisés dans `neck.css`. Les anciens styles contradictoires ont été retirés.

## Musique : correction et limites explicites

L’[audit musical](v0.20/audit-musical.md) reprend les 25 passages actifs de la v0.19. **18 sont retenus ; 7 passent en révision et ne sont plus attribués ni joués comme récompenses.** Les activités correspondantes restent jouables, avec une suite d’entraînement nommée comme telle. Il s’agit d’une mesure temporaire de qualité, pas d’un abandon des références funk/électro ni d’une affirmation que les morceaux en octaves seraient rares.

Corrections notamment : rythme de My Sharona, attaques et shuffle de Higher Ground, remontée manquante d’Around the World, silences de Smoke on the Water et Seven Nation Army, rythme de Come As You Are et Iron Man, durée des notes de The Entertainer, croches de Frère Jacques. La préécoute utilise désormais le **même tempo que la phrase récompense**. Chaque préfixe d’exercice est comparé automatiquement au début réellement joué par sa récompense : hauteurs, durées et silences.

Les transpositions d’exercice sont conservées et annoncées ; l’accompagnement reste une harmonisation pédagogique. Ce ne sont ni des masters audio ni des reproductions des orchestrations originales. Les nouvelles preuves musicales portent la version d’arrangement 2.

## Livraison

[ZIP FTP v0.20](../downloads/daily-fretboard-trainer-v0.20.zip) : décompresser puis copier son **contenu** dans `adh-pwa/v0.20/`. URL prévue : `https://media.lecompositeur.com/adh-pwa/v0.20/`. Le serveur public n’a pas été modifié automatiquement.

Le cache hors ligne et la progression de test portent la version 0.20.0. Conformément à la règle v0, la nouvelle version repart sans l’historique précédent, en conservant instrument et préférences. La même v0.20 conserve les séances entre réouvertures. La sauvegarde stable sans remise à zéro reste un objectif V1.

[Recette technique](v0.20/validation.md).
