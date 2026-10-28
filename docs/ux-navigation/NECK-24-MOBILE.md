# Exercices 0–24 sur mobile — analyse et proposition

État : corrections de cadrage implémentées ; refonte des roues et loupe tactile proposées, pas encore implémentées.

## Ce que montrent les captures

- Le texte d’aide au défilement et les marges consomment la hauteur disponible.
- En paysage, le panneau de réponse occupe une grande largeur mais la roue est limitée par la hauteur restante. Les boutons conservent une taille minimale et finissent par se chevaucher.
- En portrait, la roue pourrait utiliser davantage la largeur disponible.
- Après rotation, une pastille à nommer pouvait sortir du cadrage conservé. Sa position fait partie de la question ; recadrer ce point est légitime. Une question Retrouver ne doit jamais être recadrée sur sa bonne réponse.
- Les dimensions Full HD de l’image ne sont pas les dimensions CSS utilisables par la PWA. Les barres du système, le zoom et la densité de pixels comptent.

## Largeur tactile : le compromis

Le plancher actuel de **44 px CSS par position** est conservé. À vide plus 24 cases représentent 25 positions : au moins 1 100 px, hors marges. La géométrie minimale courante mesure 1 112 px ; elle peut être plus large selon la hauteur de l’instrument.

Un téléphone de 844 px CSS de large ne peut donc pas afficher ces 25 cibles de 44 px simultanément sur une seule ligne. Réduire toute l’image par une transformation CSS réduirait aussi ses cibles.

Comportement de base retenu : manche entier et centré lorsqu’il tient, aucune scrollbar dans ce cas ; défilement natif et cases de 44 px lorsqu’il ne tient pas. La scrollbar et les indications de continuation réapparaissent au redimensionnement. Aucune rotation forcée.

Pour obtenir absolument une vue intégrale sur les téléphones plus étroits, une **loupe tactile déportée au-dessus du doigt** est une piste à prototyper : l’appui prévisualise, le glissement affine et le relâchement valide, avec des cases grossies à au moins 44 px dans cette loupe. Les erreurs dues au premier contact ne doivent pas être comptées. Le coût du geste supplémentaire doit être testé avant adoption. Cette proposition ne fait pas partie du correctif actuel.

## Roues : proposition de composition

Conserver un seul centre, les notes naturelles à l’extérieur et les altérations à l’intérieur ; aucune case artificielle entre B–C et E–F.

- Portrait : deux anneaux circulaires proches de la largeur utile, avec boutons de 48 px et texte lisible. Réduire les marges du panneau, pas ses cibles.
- Paysage suffisamment large : deux anneaux **ovales concentriques** pour exploiter la largeur sans placer deux roues côte à côte. Un prototype géométrique de 688 × 178 px, avec centres sur des ellipses de rayons 320/65 et 220/30, laisse au moins 49 px entre les centres des 12 boutons. Il reste à vérifier les libellés, les marges et les variantes sur chaque écran avant mise en œuvre.
- Si les cibles de 48 px ne tiennent pas, conserver une disposition accessible et accepter un débordement contrôlé ; ne jamais écraser les boutons jusqu’au chevauchement.

## Hauteur et hiérarchie

En paysage, regrouper navigation, progression et consigne dans une bande compacte, tout en gardant les boutons de commande touchables. Garder la corde demandée visible. Le manche reste au-dessus des réponses sur une seule colonne.

Retirer l’aide permanente « Faites glisser… » du jeu après sa première explication. Réduire les marges verticales et la grande boîte blanche autour des réponses. Une aide à la demande peut utiliser l’espace libre sur les côtés de la roue ovale, sans ajouter une ligne obligatoire.

## Corrections réalisées dans ce lot

- Séparateurs entre les groupes de paramètres Aide/Sauvegardes.
- Centrage du manche et défilement conditionnel, y compris après rotation.
- Introductions 12/24 cases ouvertes sur la largeur disponible, hauteur de manche 240 px.
- Palette des boutons #f8a744 → #e94647, puis #f8a744 → #202980 au survol.
- Fin physique à la case 24 : pas de demi-case colorée ni de fondu ; petit arrondi à droite. Le fondu des autres zones continue d’indiquer une vraie continuation.
