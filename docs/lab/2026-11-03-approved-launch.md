# Lancement commun Arcade / Parcours

La transition retenue est intégrée aux vrais lancements : orange Arcade et bleu Parcours, via les dégradés partagés des boutons. Texte blanc unique, sans aberration chromatique ni déformation du titre.

Chronologie commune (2 350 ms, temps actif) :

- 0–300 ms : fondu du panneau dès le départ ; zoom de la page précédente 1 → 1,65, inclinaison et distorsion radiale conservées. Arrivée uniforme du texte en ease out entre 150 et 300 ms.
- 300–1 900 ms : zoom continu du texte 0,85 → 1,25.
- 1 100–2 200 ms : long fondu du texte, chevauchant la sortie.
- 1 900–2 350 ms : descente du panneau en ease in-out révélant la vraie première question.

La page précédente est une copie visuelle inerte, sans identifiants ni actions de jeu réutilisables. La première question est préparée sous le panneau, sans accepter de réponse ni dépenser son chronomètre. La pause fige la même horloge que l’animation ; le son, le redimensionnement et la reprise ne redémarrent pas le lancement. En mouvement réduit, seuls les fondus restent actifs.

Vérifications : 47 fichiers de tests Node, syntaxe, 15 tests des environnements, dépendances du paquet de production ; recette Chromium dédiée aux deux lancements (palettes, texte blanc, absence de couches RVB, pause/reprise/son, jeu inerte, première question identique, temps de réponse excluant le lancement, réduction du mouvement et largeur mobile/bureau). Non-régressions Arcade, géométrie/navigation, commandes et smoke du paquet de production.

Les planches comparatives restent disponibles comme propositions archivées. Cette intégration utilise la dernière maquette validée, et ne sélectionne pas une des anciennes planches. La validation humaine de l’essai reste distincte de la recette automatisée ; aucune validation sur iPhone physique n’est revendiquée.

Le premier essai de publication s’est arrêté avant transfert sur le test scroll-neck : le viewport du jeu remplaçait celui de la transition, mais la caméra le considérait déjà cadré. La caméra vérifie désormais aussi l’identité du viewport. Une recette déterministe place la première note au-delà de la case 18 et contrôle sa visibilité après la sortie.
