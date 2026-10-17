# Revue UX — v0.16

La disposition relative questions/réponses reste conservée, conformément à la demande précédente. Cette revue porte sur la composition et la cohérence des composants, sans déplacer ces deux blocs.

## Principes appliqués

- **Hiérarchie et échelle** : un titre principal, une action principale, les actions secondaires moins contrastées. Les micro-leçons regroupent leur exemple et leur bouton « À moi d’essayer » au centre, plutôt que de disperser l’action au bas de l’écran.
- **Proximité et alignement** : contenus liés dans un même groupe, espacements réguliers et alignements communs. Les commandes de pause disposent au contraire de davantage d’espace pour limiter les erreurs de toucher.
- **Composants cohérents** : navigation en pilules ; étiquettes de notes et cellules de données en rectangles arrondis. La roue garde des cibles circulaires, qui font partie de son repère radial. Les boutons de positions forment une grille à cordes lisible, les aigus en haut.
- **Densité maîtrisée** : carte des progrès sur fond neutre, trois compteurs, pourcentage par position et détails à la demande. Les écrans courts gardent les commandes de résultat accessibles. Le tableau de boutons peut défiler dans son panneau sur les écrans trop courts : les cibles de 44 px ne sont pas réduites artificiellement.
- **Stabilité** : rendu DOM différentiel à clés stables, conservation du SVG et des cibles tactiles entre réponses. Les animations s’appliquent aux pastilles entrantes/sortantes, sans reconstruire le manche.
- **Accessibilité** : thème Contraste renforcé, focus visible, états accompagnés de symboles, gestion de la réduction des mouvements. La couleur ne suffit pas à expliquer un état. Cela ne constitue pas une certification WCAG ni un test avec des utilisateurs malvoyants.

## Références consultées en ligne

- [Nielsen Norman Group — principes visuels](https://www.nngroup.com/articles/principles-visual-design/) : échelle, hiérarchie, équilibre, contraste et regroupement.
- [NNG — hiérarchie visuelle](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/).
- [NNG — proximité](https://www.nngroup.com/articles/gestalt-proximity/).
- [W3C — ne pas utiliser uniquement la couleur](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
- [W3C — contraste du texte](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) : objectif 4,5:1 pour le texte courant, 3:1 pour le grand texte.
- [W3C — taille minimale des cibles](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) : minimum AA de 24 px avec exceptions d’espacement ; la PWA vise 44 px pour ses commandes principales.

## Couleurs à choisir

[Voir les six propositions](v0.16/choix-couleurs.png). Quatre ambiances et deux pistes d’accessibilité, car la demande « cinq » en énumère en réalité six. Aucune de ces nouvelles palettes ne remplace le manche du thème courant. Le thème accessible possède sa propre palette de contraste.
