# Manches, gestes, repères et résultats

Les cases jouables sont exclues des fondus. Un manche débutant après zéro inclut un fragment de la case précédente, sans cible interactive ; le fondu devient entièrement opaque à la frontière de la première case jouable. La caméra Arcade centre les frontières réelles de la zone pour que ses fondus restent également hors de ces cases. La terminaison après la case 24 occupe une demi-case, avec un arrondi qui reste dans cette extension.

Les manches continus utilisent des écarts de frettes proportionnels à `L × (1 − 2^(−n/12))`. Les mini-leçons de 12 cases occupent leur cadre sans défilement horizontal ; celles de 24 cases conservent des cases d’au moins 44 px et une hauteur calculée pour les cibles tactiles. Le défilement est conditionné par l’espace disponible.

Les réponses de Parcours portent l’identité de leur session et question. Un événement d’une question précédente est ignoré. Une rafale très rapprochée sur la dernière bonne note n’est pas transformée en erreur sur la suivante ; une réponse fraîche correcte reste acceptée. La recette reproduit les événements sans pointerId, mais ne remplace pas une vérification sur iPhone physique.

Une nouvelle zone Arcade comporte trois paliers : découverte seule, passerelles par groupes de trois questions, puis mélange cumulatif. Quatre questions de découverte sont garanties lors de l’entrée dans une nouvelle zone, même si un bonus a franchi le premier palier. La réduction progressive du timer reste indépendante.

Le record de série est sauvegardé au niveau de l’instrument et de l’accordage, indépendamment des records de points par mode. Seul un dépassement strict est surligné. Les résultats de Parcours et Arcade partagent la structure résumé/actions, des proportions et une palette communes ; leurs fonctions spécifiques et animations sont conservées.

Le mode d’altérations Mixte affiche de façon stable C♯, E♭, F♯, G♯, B♭ (Do♯, Mi♭, Fa♯, Sol♯, Si♭). Il vise le repérage du manche, sans prétendre choisir l’orthographe harmonique des partitions. Une page explicative est accessible dans les réglages. Atelier reste l’apparence initiale ; le choix Selon l’appareil est conservé.

L’album présente cinq colonnes en paysage et trois en portrait. Une édition musicale cyan distingue les cartes jouables sans modifier leur rareté. Les réglages de remise à zéro gardent des libellés accessibles mais visuellement discrets ; l’import possède sa flèche montante.

`launch-motion.html` propose trois entrées animées, avec les palettes Arcade et Parcours : Portique, Impulsion et Ruban. Ces propositions ne modifient pas les transitions en application avant un choix explicite.
