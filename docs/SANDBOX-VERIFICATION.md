# Vérification du système bac à sable / live

27 octobre 2026 — avant le premier déploiement sandbox.

- 36 fichiers de tests JavaScript réussis sur le catalogue complet.
- 8 tests Python : archive déterministe, séparation des canaux, conservation immuable des essais, interdiction de retour à un essai ancien sur le sandbox courant, confirmation précise de promotion, refus d’un candidat devenu obsolète, code repris depuis l’archive et journal regroupé, contrôle des chemins et empreintes, absence de déclencheur push du workflow live.
- 9 contrôles Chromium : séparation des préférences et progrès sur une même origine, aucune migration des anciennes données live dans le sandbox, 25 périmètres accessibles sans URL spéciale, historique uniquement live, filtres par type, commandes de dépliage/repliage, rendu mobile/PC, rejet d’un manifeste de mise à jour live par le sandbox, fonctionnement hors ligne avec cache live conservé.
- Mise à jour réelle entre deux itérations sandbox (0.0.101 → 0.0.102), sans changement du numéro candidat : refus, retour de la proposition au lancement suivant, acceptation, progression conservée, clés live intactes, aucun manifeste parent recherché.
- Promotion locale simulée de l’archive complète et contrôle de ses 133 ressources et 50 modules. Aucun transfert live de cette simulation.

La vérification ne constitue pas une recette sur téléphone physique. La copie sandbox fonctionne avec les données statiques et le son synthétisé de l’application actuelle ; les API PHP demeurent exclues des transferts automatiques.

## Numérotation release / essai — 27 octobre 2026

Les libellés publics utilisent v0.x ; les essais utilisent v0.x.y. Le numéro d’essai est réservé par release, puis réutilisé lors d’une relance du même build ; il ne dépend pas du compteur global GitHub. Les copies interrompues ne peuvent pas réutiliser le numéro d’un autre essai. L’ancien premier essai reçoit le libellé v0.38.1 dans l’historique, sans modifier son archive.

14 tests Python vérifient désormais notamment le cas v0.45 → v0.46.10 → v0.46, la remise à 1 pour v0.47, les relances et réservations, ainsi que les garde-fous de promotion. Le rendu du journal après une promotion locale est vérifié : v0.38 visible, 0.38.0 conservé dans les métadonnées techniques. La mise à jour depuis la numérotation initiale 0.0.N vers 0.38.y conserve les données sandbox et laisse le live intact.
