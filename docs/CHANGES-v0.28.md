# Daily Fretboard Trainer v0.28

## Cartes : un reflet visible dès le toucher

Le geste attendait auparavant un déplacement horizontal de neuf pixels avant d'activer le reflet. Son déplacement était calculé sur la hauteur de la carte entière, ce qui réduisait encore l'effet lorsque le doigt parcourait son illustration.

- Le contact active maintenant immédiatement le reflet et l'inclinaison.
- Les petits mouvements suivent le doigt ; un déplacement horizontal de six pixels permet de déplacer légèrement la carte.
- Le reflet est calculé sur l'illustration avec une amplitude adaptée au doigt, et ses dimensions de référence restent stables pendant le geste pour éviter les oscillations.
- La bande de lumière et la finition holographique sont plus visibles. Une carte commune a aussi son reflet naturel ; la couleur reste désaturée tant qu'elle n'est pas acquise.
- Le relâchement, l'annulation du geste et la sortie rétablissent la carte à plat. Le défilement vertical reste natif. Les boutons ne déclenchent pas de glissement.
- Les choix de présentation Papier et Inclusif-Contrasté conservent leurs finitions sans holographie. L'option système de réduction des animations est respectée.

## « Succès débloqué » sur le résultat

La référence HTML fournie a servi de référence de mouvement : arrivée douce, petite impulsion sur la carte, halo bref et passage lumineux. Son texte, son illustration et ses couleurs de démonstration n'ont pas été repris tels quels.

Le composant affiche :

- **Succès débloqué** ;
- le **titre réel de la carte**, avec sa miniature et sa finition ;
- **Ajouté à votre collection.** ;
- un bouton **Voir le succès**.

Lorsqu'une activité débloque plusieurs succès, ils peuvent être parcourus avec les flèches et un compteur. Il n'y a ni changement automatique de titre, ni disparition imposée, ni redirection forcée. Le joueur garde accès aux commandes de résultat.

**Voir le succès** ouvre la collection avec les filtres permettant de voir la carte, fait défiler jusqu'à elle, la met en évidence et lui donne le focus clavier. L'ouverture n'attribue aucun succès : les règles et preuves existantes restent la seule source de déblocage.

Les animations s'appuient sur `transform` et `opacity`, ne bouclent pas et sont désactivées lorsque le système demande moins de mouvement. Le résultat reste lisible en mode réduit. La zone de résultat a été réorganisée sur les petits écrans pour conserver ses boutons visibles, y compris avec un titre long. Lorsqu’une récompense musicale est présente sur un écran court, son bouton d’écoute rejoint l’en-tête et garde le titre du morceau dans son nom accessible. Une ancienne bande de score vide et cachée, qui débordait horizontalement, a été retirée.

## Manche : retour aux proportions de la v0.23

La v0.27 étirait l'espacement des cordes pour remplir toute la hauteur disponible. C'était une mauvaise interprétation du besoin d'agrandir les cibles : sur un grand écran, le manche perdait ses proportions.

La géométrie de la v0.23 est restaurée pour le manche à plusieurs cordes : sa largeur transversale et l'espacement des cordes dépendent du nombre de cordes, **plus de la hauteur de la fenêtre**. Le manche est mis à l'échelle uniformément pour tenir dans son cadre, sans modifier ses proportions. Le cadrage peut donc conserver de l'espace autour du manche lorsque le cadre est plus haut que lui.

Les zones 4–8 et 8–12, les cordes entières et les alternatives tactiles des parcours bêta restent disponibles. Il ne s'agit pas de rétablir l'ancien catalogue de la v0.23.

### Texture légère et lisible

La source commune du manche dessine un léger modelé du bois et quelques fibres vectorielles statiques. Les cordes, frettes, inlays et pastilles sont dessinés au-dessus de cette finition.

- Aucun téléchargement de texture, aucune police ou bibliothèque supplémentaire.
- Aucun filtre de bruit `feTurbulence`, aucune texture animée et aucun calcul pendant le toucher.
- Fibres fines, à faible opacité, pour qu'elles ne ressemblent pas à des cordes supplémentaires.
- Texture commune aux schémas et au manche interactif, sans modifier les zones de réponse.
- Finition masquée dans les thèmes Inclusif-Contrasté et Papier pour préserver leurs repères visuels.

## Vérification et livraison

- **28 fichiers de tests Node** passent, dont quatre nouveaux tests des succès réels, du lien vers la collection, de la texture partagée et des ressources hors ligne.
- Une véritable activité a été terminée dans le navigateur : les succès obtenus apparaissent, les flèches les parcourent et le bouton cible la bonne carte. Un véritable cours a également été validé sans écrire artificiellement son résultat.
- Célébration : **16 dispositions** (quatre thèmes, téléphone 320 × 568 et 390 × 844, paysage 844 × 390, PC), commandes et texte visibles, réduction des animations contrôlée.
- Une activité de recherche suivie de sa suite musicale a aussi été terminée : la pochette de Higher Ground est obtenue, sa miniature musicale s’affiche et son bouton ouvre la bonne carte. Trois formats supplémentaires vérifient ce résultat avec lecteur audio.
- Geste tactile Chromium : contact sans mouvement, déplacement minime et glissement sur une carte commune, rare et légendaire ; retour à plat ; défilement vertical et boutons conservés.
- Manche et progrès : neuf configurations de jeu (guitare 6, guitare 8 et basse 4 sur trois formats), géométrie de référence contrôlée ; quatre thèmes des progrès restent fonctionnels.
- Captures et rapports dans [v0.28](v0.28/). Une vérification sur Safari/iPhone physique reste nécessaire : les gestes ont été injectés via le protocole tactile du navigateur Chromium, pas exécutés sur un iPhone réel.

La sauvegarde stable et les anciens succès sont conservés. Le ZIP est à déposer par FTP ; cette intervention n'a pas déployé les fichiers sur o2switch. Le passage vocal d'Immigrant Song reste en révision, comme annoncé en v0.27 ; cette livraison n'intervient pas sur le catalogue musical.
