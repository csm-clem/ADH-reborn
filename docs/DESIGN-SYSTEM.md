# Composants partagés de Daily Fretboard Trainer

## Contrat de styles

Le point d’entrée unique est `ui.css`. Il déclare l’ordre des couches avant leurs imports :

1. `tokens` : palette, typographies, espacements, arrondis, cibles tactiles et durées.
2. `base` : structure historique et charte, progressivement simplifiées.
3. `components` : apparence commune des actions, panneaux et champs.
4. `pages` : disposition propre à un écran, ses diagrammes et son contenu.

Les anciennes déclarations concurrentes d’apparence des boutons ont été retirées. Les couleurs principales des vues ont été reliées aux variables communes. Les fichiers historiques ne sont pas entièrement réécrits ; leur disposition reste en place pour limiter les régressions.

## Actions

```html
<button class="button primary">Exercice suivant</button>
<button class="button secondary">Écouter</button>
<button class="button quiet-button compact">Refaire</button>
<button class="text-button">Retour</button>
<button class="icon-button" aria-label="Écouter">…</button>
```

- Les actions textuelles utilisent un arrondi pilule ; les boutons-icônes sont ronds.
- `primary` porte l’action principale, `secondary` une action complémentaire, `quiet-button` une action sans accent.
- `compact` réduit le texte et les marges internes, sans descendre sous 44 px de hauteur.
- `on-dark` et `accent` sont des variantes explicites de bouton-icône.
- Hover, appui, focus clavier et désactivation sont définis une seule fois.
- Les réponses musicales de la roue sont un composant de jeu distinct : leur cercle et leurs corrections rouge/verte ne sont pas des variantes de navigation.

Une page peut positionner un bouton, définir sa largeur ou l’aligner dans une grille. Elle ne redéfinit pas sa couleur, son fond, son arrondi, sa police ou ses états. Pour un nouveau besoin visuel, ajouter une variante dans `components.css` puis la montrer dans la galerie ; ne pas ajouter un sélecteur du type `.nouvelle-page .button { border-radius:… }`.

Les panneaux réutilisent `.panel` et les contrôles réutilisent les règles communes des champs. Les nouveaux composants de jeu doivent s’appuyer sur les tokens et être mutualisés lorsqu’ils sont utilisés dans plusieurs formats.

## Référence et contrôles

`ui-kit.html` est une galerie interne sans lien dans la navigation du produit. Elle montre les actions, les variantes compactes, les commandes désactivées, un champ et le bouton de détails. Elle est aussi présente dans le paquet FTP.

`tests/design-system.test.mjs` recherche les surcharges d’apparence interdites sur les classes d’action partagées dans tous les fichiers CSS de page, y compris leurs media queries. La recette Chromium vérifie les styles calculés dans la vraie application, les dimensions et l’accès aux boutons. Les captures conservées avec les rapports servent de références visuelles ; aucune comparaison automatique de pixels n’est encore en place.

Pour un nouvel exercice, ajouter les données pédagogiques au générateur et réutiliser le contrôleur et les vues. Une nouvelle question du même format ne nécessite ni nouvelle page HTML ni nouvelle feuille de styles. Un nouveau format doit réutiliser les composants existants et faire l’objet d’une seule implémentation partagée.
