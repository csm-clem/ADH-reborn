# Recette v0.20

Contrôles du 18 octobre 2026, Chromium sous Linux et Playwright. Application servie localement puis paquet statique testé dans `/dist/`. Les historiques et succès de recette sont fictifs ; ils ne démontrent pas une efficacité pédagogique ni une comparaison acoustique au disque original.

| Contrôle | Résultat |
|---|---|
| Syntaxe de tous les modules exécutables | `npm run check` réussi |
| Tests Node | **102 réussis, aucun échec** |
| Onboarding | Six instruments × huit formats, de 240 × 320 à 1280 × 720 ; pas de boutons cachés ni de défilement obligatoire ; réglage et écoute de chaque corde, sauvegarde et noms de notes |
| Manche et réponses | Six instruments × cinq formats ; cibles, axes et panneaux dans l’écran, cordes aiguës en haut |
| « Nouvel exercice » | Vingt mises en page vérifiées ; numéros et noms des cordes à vide sans chevauchement, boutons accessibles |
| Introductions musicales | Quinze mises en page vérifiées avec les passages désormais sélectionnés |
| Corrections et collection | Roue des hauteurs, unique pastille demandée en rouge sur le manche, lecture de la correction, indice partagé, persistance des succès, filtres et thèmes : réussis |
| Thèmes et détails | Couleurs calculées dans les quatre thèmes ; retour au-dessus des nouvelles pastilles ; bordure accessible de 1 pt ; cartouches lisibles ; encart de zone nocturne avec contraste texte/fond supérieur à 7:1 |
| Accueil | Titre, description et illustration alignés ; illustration entièrement dans sa boîte fixe en portrait et sur ordinateur |
| Signalement | Description encodée dans un brouillon GitHub ; aucune progression jointe ; aucune publication ni requête externe effectuée par le test |
| Finales musicales | **18 passages distincts rejoués jusqu’au bout**, succès correspondants enregistrés ; chaîne remise à zéro après une erreur, lecture automatique après succès et arrêt du son vérifiés |
| Résultat | Dernière note conservée pendant 300 ms avant la fiche ; boutons dans l’écran sur six formats, dont 240 × 320 |
| Parcours complet | **50 activités terminées**, ≥20 questions par activité, réussite et navigation suivante, aucune tentative dupliquée et aucune erreur JavaScript |
| Paquet FTP | Démarrage sous une URL imbriquée ; six images d’instruments et nouveaux modules présents dans le cache ; configuration et parcours accessibles hors ligne |

Le compte rendu machine est fourni dans [validation.json](validation.json).

## Captures

- [Accueil mobile](accueil-mobile.png) et [ordinateur](accueil-ordinateur.png).
- Gameplay : [Atelier](jeu-light.png), [Studio nuit](jeu-dark.png), [Inclusif-contrasté](jeu-accessible.png), [Papier](jeu-paper.png).
- [Collection](collection.png) et [parcours nocturne](parcours-nuit.png).

## Limites

La recette automatisée ne remplace pas les essais sur un téléphone physique, notamment pour le confort du toucher, la luminosité en extérieur et le rendu sonore de son haut-parleur. L’audit musical distingue les passages retenus des sept arrangements encore incertains : voir [audit-musical.md](audit-musical.md).

Le dépôt et le ZIP sont prêts pour FTP ; aucun accès au serveur o2switch n’a été utilisé pour déployer. La v0.20 ne met pas encore en place le paiement, la limite d’essai ou le parcours de toutes les zones de la V1.
