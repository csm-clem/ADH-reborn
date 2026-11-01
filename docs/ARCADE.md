# Arcade — premier essai

Règles du 1er novembre 2026. Implémentation expérimentale dans le lab ; confort,
équilibrage et sons restent à apprécier sur de vrais appareils.

## Quatre parcours

- Zones naturelles ou chromatiques : deux cordes physiques graves en zone I,
  ajout des cordes une par une, puis mélange cumulatif avec les zones II à VI.
- Cordes naturelles ou chromatiques : première corde grave sur 0–12, ajout des
  cordes une par une, puis extension à 0–24.
- Les zones du catalogue sont 0–4, 4–8, 8–12, 12–16, 16–20 et 20–24.
- Les hauteurs suivent l'accordage réel. Les frontières partagées ne dupliquent
  pas les emplacements. Le format initial consiste à nommer la note montrée.

Chaque tranche de 1 000 points, bonus compris, ajoute un périmètre. Pendant
l'introduction d'un nouveau périmètre, une question sur cinq porte sur les
nouveaux emplacements, quatre sur cinq sur le périmètre précédent. Aucun
diagnostic personnel ni niveau de départ recommandé n'est appliqué.
Après la couverture complète, l'endurance continue avec la descente du timer.
Le manche reste au-dessus de la roue ; sa fenêtre suit la cible avec les vrais
numéros de cases, au moyen du rendu commun.

## Temps, points et vies

- Trois vies initiales, aucune limite aux vies gagnées.
- Délai initial 4 000 ms, moins 10 ms après **chaque question résolue**, jusqu'à
  500 ms après 350 questions. La durée exacte n'est pas affichée pendant le jeu.
- La barre se vide de droite à gauche, ancrée à gauche. Réponse ou expiration
  résout une seule fois la question et remet la barre à plein.
- Les transitions de 80 ms et le rendu consomment le temps de la nouvelle
  question. La correction de 600 ms est exclue du délai de la suivante.
- Une erreur ou expiration coûte une vie et remet la série à zéro. Une réponse
  arrivée à l'échéance compte comme expiration, sans seconde pénalité.
- La pause et le passage en arrière-plan figent le temps actif ; reprise manuelle.
- Une bonne réponse ajoute 1 au compteur de réponses et 100 au score en points.

| Série | Bonus supplémentaire | Vies supplémentaires |
|---|---:|---:|
| 10 / 20 / 30 / 40 | 100 / 200 / 300 / 400 | 0 |
| 50 | 500 | 1 |
| 60 / 70 / 80 / 90 | 500 à chaque dizaine | 0 |
| 100 | 1 000 | 2 |
| 110 et suivantes | 1 000 à chaque dizaine | 0 |

Les récompenses sont des points ajoutés à la bonne réponse, pas des valeurs de
remplacement. Les jingles sont des motifs originaux synthétisés par le service
audio commun, sans échantillon repris d'un jeu. Le muet et la réduction des
animations sont respectés. Un bonus est compté comme un combo déclenché ; la
plus longue série sans erreur constitue le plus long combo.

## Résultats et données

La carte montre score total, bonnes réponses, combos déclenchés et plus long
combo. Un bouton ouvre les temps minimum/maximum/moyen des bonnes réponses,
erreurs, expirations, ventilation des points, vies gagnées et résultats par
emplacement. Les temps incluent les transitions et excluent les pauses.

Records séparés par mode, instrument, accordage et version de règles. Les
records sont conservés via le service de stockage existant et l'export/import,
sans ajouter de preuves d'apprentissage ni de succès au parcours. Le journal
des questions n'est pas conservé indéfiniment : statistiques agrégées par position.
Les sauvegardes anciennes sans champ Arcade restent valides ; les données
illisibles restent protégées par le mécanisme existant. Quitter une partie
l'abandonne ; aucune reprise de partie Arcade n'est promise après fermeture.

## Vérification

`tests/arcade-rules.test.mjs` couvre timer, bonus, périmètres, erreurs, courses à
l'expiration, identité des questions, pause et validation des sauvegardes.
`python tools/qa/arcade.py` vérifie le parcours complet de 100 succès, les vies,
le résultat à 14 500 points, les records après rechargement, le cache hors ligne
et les roues chromatiques à 320/390/844/1920 pixels. Le confort sur téléphone et
l'appréciation musicale des jingles restent une recette humaine distincte.


## Corrections de confort — 1er novembre 2026

Arcade possède son entrée dans la navigation principale, sur ordinateur et mobile.
Une préparation « À vous de jouer ! » d'une seconde précède le premier timer.
Le manche complet reste chargé et conserve le même SVG ; sa fenêtre défile vers
la cible en 80 ms, temps compris dans le QTE. Les fondus masquent les cases hors
cadre. La réduction des animations supprime le mouvement de scroll.

La pause cache uniquement le manche, la question et la roue ; elle conserve le
HUD visible. Les sons de réponse, de points et de vie supplémentaire sont
superposés dans le moteur audio commun, avec des bonus à volume réduit.

La carte des statistiques réutilise le composant du manche des progrès. Les
moyennes sont calculées par emplacement sur les réponses correctes. Le dégradé
va de vert intense pour 500 ms ou moins à rouge pour 4 000 ms ou plus ; gris
signifie qu'aucun temps n'est disponible. Les records antérieurs sans total
chronométré par emplacement restent lisibles et ne reçoivent pas une moyenne
inventée.


## Ajustements suivants — 1er novembre 2026

La préparation réutilise maintenant les classes launch-screen/launch-message du
Parcours : même fond uni, grand texte et zoom arrière. La caméra conserve une
fenêtre par zone (0–4 puis 4–8, etc.), avec les frontières rattachées à la zone
inférieure. La géométrie Arcade utilise la distance au sillet L × (1 − 2^(−n/12)),
sans agrandir les cases pour occuper la largeur du laptop. Les cibles à vide
restent à gauche du sillet ; les cordes dessinées partent du sillet.

Un bonus supplémentaire de 50 points est accordé à cinq réponses consécutives.
Il s'ajoute aux bonus existants : 100 succès donnent désormais 14 550 points et
11 combos. Les anciens records restent conservés. Le résultat affiche les
valeurs avant les intitulés, et « Notes d’affilée (record) » remplace le libellé
ambigu du plus long combo.

La carte temporelle utilise des fonds saturés clairs et une encre sombre.
Le détail d'une position montre précision, erreurs et délais, temps le plus
rapide/le plus lent et écart à la moyenne de la partie. Les phrases explicatives
retirées à la demande du joueur ne sont plus affichées.

La remise à zéro permet de sélectionner un accordage précis ; l'option Tous
les accordages reste disponible. La confirmation nomme la portée sélectionnée.
Immigrant Song passe à quatre mesures : moins de sauts à l'octave dans le riff,
une seule exposition de l'appel vocal, dont les hauteurs restent inchangées.
