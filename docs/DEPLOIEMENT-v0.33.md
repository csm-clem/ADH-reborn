# Publication v0.33

## Périmètre et autorisation

Publication explicitement autorisée par l’utilisateur à la suite de la livraison v0.33. Cible permanente : https://media.lecompositeur.com/DFT/.

Le tableau de bord annoncé dans le même message n’a pas été joint ni lié. Ce journal conserve les preuves d’exécution ; il ne remplace pas ce tableau de bord. Ses lignes pourront y être reportées dès réception du document.

## État

- Réconciliation avec `main` : ZIP v0.32 ajouté par l’autre discussion conservé ; aucun écrasement de cette modification.
- Livraison : archive bêta v0.33, SHA-256 vérifié avant transfert. La simulation débug reste disponible comme dans les versions bêta précédentes.
- Vérification complète réussie : https://github.com/csm-clem/ADH-reborn/actions/runs/40246294273.
- Migration depuis une archive réelle : https://github.com/csm-clem/ADH-reborn/blob/deploy/dft-v0.33/tools/qa/update-current.py ; résultat local [migration](v0.33/verification-migration.json).
- Transfert FTPS et contrôles après publication réussis : https://github.com/csm-clem/ADH-reborn/actions/runs/40246294228.
- 135 fichiers statiques transférés ; aucune suppression ; validation TLS stricte conservée.
- HTTPS, accueil, descripteur de version, journal et trois textures accessibles.
- Fin des contrôles publics : `2026-10-25T23:51:32Z` (26 octobre à 00 h 51, heure de Paris).

## Restrictions conservées

Compte dédié à la racine DFT, secrets dans GitHub Actions, validation TLS et du nom d’hôte, canal de données chiffré. Fichiers statiques seulement, aucune suppression ; `api/` et PHP exclus. Les clés de sauvegarde restent stables. Aucune intervention dans WordPress ou le LMS.

Le formulaire de signalement reste dépendant de l’installation séparée de son API PHP ; ce déploiement ne prétend pas l’activer.

## Restant à traiter

- Recevoir le tableau de bord de référence, lire ses tâches et y reporter les statuts.
- Vérifier la ligne complète d’Around the World et le chant d’introduction d’Immigrant Song avant d’annoncer ces corrections musicales comme terminées.
