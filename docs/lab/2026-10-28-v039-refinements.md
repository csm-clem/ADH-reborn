# Lab v0.39 — second lot d’ajustements

## Versions

Le déploiement v0.39.2, build `b000020-0a12d8f4be20`, a été vérifié le 28 octobre 2026 à 20 h 41 (Paris). Son code applicatif est identique à v0.39.1 ; seul un script de vérification a changé. Une PWA ouverte peut garder l’ancienne version tant que sa mise à jour n’est pas acceptée. Une copie sous `/lab/builds/` reste volontairement immuable. Utiliser `/DFT/lab/` pour suivre l’essai courant, et le même lien immuable sur les deux appareils pour une comparaison stricte. Ne pas effacer le stockage du navigateur pour changer de version.

## Manche et gestes

- Les 25 positions longues ont une largeur de 40 px, hors marges. Le minimum total du manche terminal est de 1 026 pixels CSS : 25 × 40 + marge de 20 + terminaison de 6. La résolution physique Full HD ne garantit pas cette largeur CSS. Un appareil plus étroit garde le défilement et les cibles de 40 px.
- Mêmes marges entre le bois et les deux cordes extrêmes ; numéros de cordes séparés des cibles à vide.
- Fondu à gauche des zones commençant après le sillet. Après la case 24 : six pixels de terminaison arrondie, aucune nouvelle case et aucun fondu.
- Bordure du viewport retirée. Repères `#645035`. Épaisseur progressive renforcée pour les cordes graves, conservée pour la corde surlignée.
- Découvertes étendues sur ordinateur ; illustrations longues à hauteur lisible.
- Zone de réponse rembourrée symétriquement. Barre de découverte 8 px.

## Réponses et navigation

- Roues toujours rondes, jamais ovales. Portrait : deux anneaux concentriques si nécessaire. Paysage : boutons de 40 px et diamètre minimal 218 px pour garder les douze réponses distinctes.
- Bande supérieure compacte : commandes tactiles de 44 px, titre secondaire discret, consigne et localisation en ligne sur les petits écrans paysage. Le manche demeure au-dessus des réponses.
- Sur écran paysage trop bas, le contenu peut défiler verticalement : ne pas écraser une roue ou les cordes pour prétendre tout faire tenir.
- Chapitre comportant une seule activité : lancement direct. Le parent du parcours est conservé.
- Succès : ouverture en vue détaillée. La vue Album reste disponible via son bouton.

## Apparence

- Boutons : normal `#f8a744 → #e94647`, survol `#57abcf → #202980`. Thèmes Inclusif/Papier conservent leurs couleurs solides.
- Titres de dialogue réduits à 21–26 px.
- Cinq [propositions SVG de cartes communes](../art/common-proposals/index.html), accompagnées d’une liste et d’une intention pour chacune. Elles ne remplacent pas encore les illustrations en application.

## Validation

Tests Node et vérifications navigateur locaux effectués ; preuves dans `work/v039-refinements`, `work/round-wheel-v039`, `work/neck-settings-v039`, `work/ux-next` et `work/gameplay-ux`. Les captures utilisent Chromium simulant différentes dimensions ; aucune validation sur téléphone physique n’est déclarée. Le déploiement et la CI distante doivent être vérifiés séparément. La release live demeure v0.38.
