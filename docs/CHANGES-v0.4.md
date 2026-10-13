# v0.4 — décompte, manche clair et nouvelle disposition

- Chaque début ou reprise d’exercice lance automatiquement un décompte visuel de 3 secondes après le bouton de départ. La première question et son repère sont masqués jusqu’au départ ; le décompte ne compte pas dans le chrono. La pause suspend également le décompte et quitter l’exercice annule ses callbacks.
- Audio : activation du contexte pendant le geste de départ et attente de sa reprise avant la première note. La note demandée est jouée au départ ; dans « Quelle est cette note ? », toucher le repère ou l’activer au clavier permet de la réécouter sans répondre et sans remettre le chrono à zéro. Le mode muet reste respecté.
- Manche horizontal dans les deux orientations : grosse corde en bas. Suppression de la rotation à −90°. Le swipe horizontal et les boutons de déplacement restent disponibles quand le manche dépasse la vue.
- Disposition paysage : manche et questions/réponses en deux colonnes de même hauteur. Portrait : les deux blocs sont empilés, avec les questions sous le manche. Les proportions géométriques du manche sont conservées ; les écrans courts peuvent défiler verticalement pour préserver les cibles tactiles.
- Palette : fond blanc dans le thème clair, manche bois clair, frettes grises et fond gris clair autour du manche. Carte d’accueil grise claire. Les boutons à dégradé portent du texte blanc ; le dégradé orange est assez sombre pour garder un contraste lisible. Le thème sombre reste disponible dans les paramètres, avec un manche clair.
- Chaque micro-leçon dispose d’un exemple vectoriel montrant ses propres cordes et positions, adapté à l’instrument et à l’accordage. Le texte sur l’orientation a été corrigé ; la réécriture pédagogique est laissée pour la relecture ultérieure.
- Cinq étoiles : 100 % de bonnes premières réponses et médiane ≤ 1 seconde. Règles, calcul et prochain palier utilisent ce seuil. Les étoiles déjà obtenues sont conservées ; les nouvelles tentatives suivent la nouvelle règle.
- Bande de résultats : réponses correctes en bleu-gris #44516b ; erreurs en gris clair avec bordure, pour conserver la distinction.

## Livrer par FileZilla

Décompresser `downloads/adh-pwa-v0.4.zip`. Copier **le contenu** dans `adh-pwa/v0.4/` sur le même sous-domaine, puis ouvrir :

https://media.lecompositeur.com/adh-pwa/v0.4/

Les progrès locaux restent accessibles sur le même sous-domaine et le même navigateur. Exporter une sauvegarde dans les paramètres avant la mise à jour est recommandé. Le cache est isolé par version et chemin ; ne pas effacer les données du site pour actualiser.

Lors d’un remplacement dans un dossier existant, fermer tous les onglets de l’ancienne application puis rouvrir pour permettre l’activation du service worker.

## Vérification

16 tests unitaires : règles musicales, progression, chrono actif, synthèse de corde, cache PWA, seuil à 1000/1001 ms et diagrammes de toutes les configurations.

Chromium : décompte automatique et pause/reprise, première source audio active avec buffer non silencieux, exclusion du décompte dans le temps mesuré, toucher sonore sans réponse, mode muet, absence de rotation, colonnes de même hauteur, portrait empilé, cibles tactiles, séance complète, bande de résultat, reprise hors ligne. Vérifications sur 320/375/768/844/1280 px et variantes guitare 7/8 cordes et basse. Le son est vérifié au niveau Web Audio ; un essai sur téléphone reste utile pour juger le rendu sonore réel.

Les documents de relecture précédents sont des instantanés de la v0.3 ; ils ne sont pas régénérés dans cette livraison.
