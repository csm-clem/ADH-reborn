# Références visuelles des composants

Ces 32 images sont les références initiales générées avec Chromium, polices du projet, échelle 1 et mouvement réduit. Elles couvrent le HUD et les résultats des deux modes, le manche et les actions/formulaires, en clair/sombre, sur smartphone portrait/paysage et bureau.

Comparer : `npm run qa:ui` après lancement du serveur. Les images courantes et le rapport vont dans `work/ui-consistency/`. Régénérer explicitement : `npm run qa:ui:update`. Examiner les changements avant de les retenir. Les références initiales ont une validation technique, sans se substituer à la validation humaine du design ou des appareils physiques.

La comparaison accepte les petites différences d’anticrénelage. Un écart supérieur à 45 sur plus de 2,5 % des pixels ou un changement de dimensions échoue. Les HUD sont cadrés sur leur composant pour ne pas diluer une divergence dans le fond de page.

Compatibilité de rendu : la comparaison conserve les dimensions et le seuil de 2,5 %, mais applique un flou de 0,7 pixel avant mesure pour atténuer les différences d’anticrénelage entre versions de Chromium. Le rapport conserve aussi le taux brut. Le scénario de régression injectée reste obligatoire. Un job visuel indépendant fournit les 32 captures et les deux mesures dans un petit artefact, avant la recette longue.
