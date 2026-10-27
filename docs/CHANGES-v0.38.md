# Candidat 0.38.0 — Tous les parcours et un journal plus pratique

**Travail en bac à sable, non publié en live.** La version live reste 0.37.0 tant que Clément n’a pas approuvé un essai précis.

Le catalogue du candidat inclut toutes les zones jusqu’à la case 24, chaque corde à vide–12 et à vide–24, chaque duo voisin à vide–12 et toutes les cordes mélangées à vide–12 et à vide–24. Aucun paramètre de prévisualisation ne conditionne leur visibilité. Les identifiants et résultats existants sont conservés ; les nouveaux contenus restent à travailler. La progression guidée reste le niveau 1 effectivement implémenté.

Le journal affiche uniquement les versions live. Un bouton permet de filtrer Nouveautés, Améliorations, Corrections et Événements ; deux commandes déplient ou replient toutes les versions. Les modifications intermédiaires sont conservées dans `pending-changes.json` et regroupées lors de la future promotion.

## Environnements

- Bac à sable courant sous `/DFT/lab/`, avec un historique des essais dans ses Paramètres.
- Une copie complète de chaque essai publié sous `/DFT/lab/builds/<identifiant>/`, archive et SHA-256 incluses.
- Préférences, progression, migrations, mises à jour et identités PWA distinctes du live.
- Publication live uniquement par le workflow manuel, à partir de l’archive approuvée et sans reconstruire le code courant.
- Aucune extension des accès FTP : le compte dédié reste limité à DFT. Transferts statiques uniquement, TLS strict et aucune suppression.

La recette pédagogique continue sur les contenus visibles du bac à sable. L’ouverture de ces parcours n’est pas une validation pédagogique finale ni une ouverture commerciale de la V1.
