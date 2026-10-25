# DFT v0.31 — Boutons horizontaux et journal intégré

## ⚙️ Boutons conformes aux captures

Les boutons principaux passent à un dégradé horizontal : orange à gauche, rouge à droite ; au survol, bleu clair à gauche et indigo à droite. Les couleurs jour précédemment fournies sont conservées, avec leur nouvel ordre. Les boutons secondaires prennent un dégradé gris vers bleu ardoise. Les formes restent en pilule.

## 🐛 Ombres et contours

Le texte n’a plus aucune ombre. Les boutons principaux et secondaires n’ont ni bordure ni ombre de boîte. L’indicateur de focus clavier reste disponible. Les boutons désactivés restent grisés et les thèmes Papier / Inclusif-contrasté conservent leur traitement uni.

## ⭐️ Journal des modifications

Les Paramètres comportent un lien vers une page de l’application. Les versions sont classées de la plus récente à la plus ancienne, avec la dernière version ouverte et les précédentes dépliables. La légende emploie les quatre catégories demandées : ⭐️ nouveautés, ⚙️ améliorations, 🐛 corrections, 🎉 événements. Un bouton ramène aux Paramètres.

L’historique, de v0.2 à v0.31, est rédigé depuis les rapports de livraison du dépôt ; il ne décrit pas des projets futurs comme des fonctionnalités disponibles. Aucun rapport v0.1 n’étant disponible, une entrée détaillée n’est pas inventée. Les anciens choix pédagogiques mentionnés décrivent leur version historique. Les jalons de changement de nom et d’arrivée des Premiers Parcours constituent les événements spéciaux.

Les données et l’affichage du journal ont une source commune dans `changelog.js`, embarquée dans le cache PWA et les deux paquets : la lecture fonctionne hors ligne. Les emoji ont des libellés accessibles et les listes sont à puces.

## Référence et limite

La page https://lecompositeur.com/adh-ddl n’a pas pu être consultée : l’outil web la déclare inaccessible et la requête réseau est refusée par le proxy (403). La structure livrée suit donc les catégories explicites et un historique par version ; elle n’est pas présentée comme une reproduction vérifiée de cette page. Les captures des boutons fournies ont servi de référence visuelle.

## Livraison

Les progrès et réglages restent sur leurs clés stables. Les archives sont générées par la chaîne de livraison, avec vérification des ressources et imports, tests et empreintes SHA-256. Le paquet production conserve son exclusion des outils de simulation. Aucun déploiement FTP effectué.

## Vérification de cette livraison

31 fichiers de tests Node passent. La recette Chromium confirme les dégradés horizontaux dans le bon sens, l’absence de texte ombré / ombre de boîte / bordure inférieure, le bouton de retour vers les Paramètres, l’ouverture des versions et l’absence de débordement horizontal sur quatre formats (320, 390, 844 et 1440 px). Le ZIP de production est extrait puis chargé à une URL imbriquée : son journal reste accessible après rechargement hors ligne et aucun bouton de simulation n’est présent. Rapports et captures dans `docs/v0.31/`.

Le journal Markdown `docs/JOURNAL-DFT.md` est généré depuis la même source que la page de l’application, via `tools/write-changelog.mjs`, également appelé par la commande de livraison.
