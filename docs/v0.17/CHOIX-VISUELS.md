# Deux choix indépendants : thème de l’application et manche

## Planches à examiner

- [Six manches harmonisés — PNG](manches.png) · [PDF](manches.pdf).
- [Six thèmes avec usages — PNG](themes.png) · [PDF](themes.pdf).
- [Planche de manches en HTML](manches.html) et [planche de thèmes en HTML](themes.html), consultables depuis le dépôt servi localement ou après téléchargement.
- [Toutes les couleurs et les contrôles de contraste](palettes.json).

Les six manches précédents sont repris et complétés. Les nouveaux thèmes sont des directions à comparer. **Les planches ne remplacent pas les couleurs du jeu et n’ajoutent pas encore de sélecteur de manche personnalisé dans les Paramètres.** Le code livré concerne l’architecture des services.

## Six manches harmonisés

Chaque proposition associe fond, cordes, frettes, sillet, inlays, pastille neutre, réussite, erreur, fond d’étiquette et texte. Les trois états sont visibles dans chaque image ; les noms de notes conserveront une étiquette rectangulaire arrondie et neutre. ✓ et × complètent la couleur pour distinguer les états.

| Manche | Intention et associations |
|---|---|
| **1. Érable miel** | Le plus familier et lumineux. Cordes brunes, frettes bronze, pastille neutre ardoise ; vert sapin et rouge brique suffisamment foncés pour rester lisibles sur le miel. Mon choix par défaut. |
| **2. Ambre clair** | Un bois plus soutenu, davantage présent à l’écran. Traits chocolat/bronze, neutre bleu ardoise, réussite vert forêt et erreur lie-de-vin : l’ensemble reste chaud sans que tout devienne orange. |
| **3. Acajou doux** | Plus proche d’une identité électrique chaleureuse. Traits brun sombre, pastille indigo, vert profond et bordeaux ; les états foncés évitent de se fondre dans le bois rosé. |
| **4. Sauge minérale** | Une alternative calme au bois réaliste. Cordes gris vert, frettes végétales, bleu ardoise pour la question et framboise sombre pour l’erreur. Pertinent pour une personnalisation sobre. |
| **5. Sable inclusif** | Réussite bleue et erreur orange, repère neutre anthracite. Symboles distincts, sans dépendance au couple rouge/vert. Piste pour certaines déficiences de perception des couleurs, à tester avec les personnes concernées. |
| **6. Contraste renforcé** | Fond jaune très pâle, traits graphite, états bleu profond/brun rouge. Contrastes plus élevés, contours nets ; priorité aux repères visuels. Ne prétend pas couvrir tous les besoins visuels. |

Les contrôles sRGB donnent **au moins 3,5:1** pour les cordes, frettes et pastilles sur leur fond dans ces six propositions. Les symboles blancs atteignent plus de 6:1 sur les pastilles de réponse. Il s’agit d’un contrôle local des couleurs opaques : ni le fade de fin de manche, ni tous les textes de l’application ne sont certifiés par ce chiffre.

## Six thèmes utiles

Ce ne sont pas six couleurs d’accent interchangeables. Chaque direction vise un contexte et doit influer sur les contrastes, les surfaces ou la densité visuelle, parfois sur la taille des cibles et les mouvements.

| Thème | Besoin couvert | Choix de design | Limite / point à tester |
|---|---|---|---|
| **1. Atelier** | Séances quotidiennes en lumière habituelle | Fond blanc, ardoise et accent terre cuite ; hiérarchie simple, charte Le Compositeur, manche miel associé dans la maquette | Choix de départ recommandé ; la luminosité réelle dépend de l’écran |
| **2. Studio nuit** | Travail du soir dans une pièce sombre | Surfaces ardoise foncées, texte clair modéré, accent pêche et bois sombre. Réduit la grande plage blanche | Aucune promesse médicale de réduction de fatigue ni d’économie d’énergie ; ne remplace pas le réglage de luminosité |
| **3. Scène** | Repères rapides sur un téléphone posé sur pupitre, en répétition | Noir profond, accent citron, contours affirmés, cibles de réponse et caractères agrandis. Peu d’ornements, priorité à la lecture à distance | L’application reste tactile : cela ne remplace pas un mode mains libres. Un éclairage intense peut demander le thème clair |
| **4. Papier** | Préférence monochrome et concentration, piste pour écran à encre électronique | Gris stricts, contours, aucun dégradé ni ombre. Réussite/erreur distinguées par symboles ; mouvements à supprimer dans cette direction | Les performances d’un navigateur à encre électronique restent à tester ; les animations ne sont pas modifiées dans l’application livrée |
| **5. Repères inclusifs** | Distinguer réussite et erreur sans rouge/vert | Bleu/orange, symboles et libellés, contours renforcés. Interface claire, manche sable | Ne garantit pas l’adaptation à toutes les formes de daltonisme ; les symboles restent essentiels |
| **6. Lecture renforcée** | Grands caractères et repères faciles à distinguer | Texte plus grand, traits plus forts, contraste élevé, cibles élargies et ornements réduits. Une mise en page plus lisible plutôt qu’un simple filtre de couleur | Prévoir le zoom du navigateur et les textes agrandis sans masquer les commandes ; sur écran extrême, pagination ou défilement plutôt que réduction forcée du texte |

**Recommandation :** Atelier en défaut, Studio nuit pour la préférence sombre, Lecture renforcée et Repères inclusifs comme choix d’accessibilité distincts. Papier et Scène apportent une valeur contextuelle ; les proposer comme préférences facultatives si les tests confirment leur utilité.

## Futur réglage « Mon manche »

La proposition sépare deux axes : **Apparence de l’application** et **Apparence du manche**. Changer le thème ne doit pas effacer une personnalisation du manche.

1. Choisir un préréglage parmi les six manches.
2. Ouvrir « Personnaliser » pour modifier les couleurs par rôle : bois, cordes, frettes/sillet, trois états, étiquette de note. Conserver l’ordre et les noms des rôles dans tous les thèmes.
3. Garder un aperçu stable avec une note neutre, une bonne réponse et une erreur. Le joueur sait immédiatement ce qu’il change.
4. Afficher les contrastes utiles et une commande « Ajuster le contraste » si une combinaison rend un repère difficile à distinguer. Garder les symboles indépendants du choix de couleurs.
5. Prévoir « Revenir au préréglage » ; conserver les préférences localement via le nouveau magasin partagé. La future synchronisation de compte reste en phase 8.

Les données proposées sont déjà nommées par rôle dans `palettes.json`. Elles serviront de référence à l’implémentation après ton choix ; il n’y a pas de nouveau Singleton de couleurs à ajouter : un catalogue immuable et des préférences explicites suffiront.
