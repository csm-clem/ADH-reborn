# Confort du manche et propositions d’animation

Le frettage Arcade utilise la formule `L × (1 − 2^(−n/12))`, avec une échelle physique indépendante de la largeur disponible. Le cadrage reste fixe tant que la cible reste dans la zone courante, y compris sur ses frontières (0 → 4, 5 → 4).

La découverte Parcours par zone utilise la même géométrie que les autres activités, sans multiplicateur horizontal. Un masque SVG progressif commence au bord réel du manche lorsqu’il débute après la case zéro. Les mini-leçons par corde disposent d’une hauteur intrinsèque de 180 px, avec des cases de 28 px (12 cases) ou 22 px (24 cases) : le défilement natif ne s’active que si le cadre est trop étroit.

`result-motion.html` présente trois propositions rejouables et comparables : Élan arcade, Score en cascade, Record lumineux. Le curseur permet d’examiner chaque instant ; le mouvement réduit suit le réglage système et peut être activé manuellement. Les exemples sont fictifs et n’écrivent aucune donnée de progression. Ces propositions ne changent pas encore l’animation de la vraie result-card.

Les écrans de lancement partagent les dégradés des boutons via les mêmes variables de couleurs : orange pour Arcade, bleu pour Parcours. Les icônes de navigation restent dessinées au trait et utilisent les jointures arrondies du composant SVG commun.

Recette : tests de géométrie et réinitialisation, Chromium sur ordinateur et mobile, mini-leçons 12/24 cases, interactions tactiles et souris, animations rejouées et parcourues, mouvement réduit et absence de débordement de page.
