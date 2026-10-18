> État courant : voir l’[audit v0.20](v0.20/audit-musical.md). Ce document décrit des choix antérieurs ; sept arrangements de la v0.19 sont désormais en révision, et certaines durées ont été corrigées.

État courant : voir [l’audit musical v0.22](v0.22/audit-musical.md), qui précise les corrections de rythme, les tempos, le registre exact de l’exercice et les limites de relecture.


# Extraits musicaux du pilote

La recherche a été effectuée en ligne dans des partitions LilyPond/ABC publiées et dans une table pédagogique d’intervalles. Le catalogue contient de très courts extraits, pas des morceaux complets. Aucun enregistrement tiers n’est embarqué : les notes sont synthétisées localement.

## Références consultées

Les hauteurs ci-dessous servent à vérifier les intervalles et leur sens ; la transposition dans l’exercice est calculée séparément. C4 désigne le do central.

| Exemple | Passage vérifié | Source |
|---|---|---|
| Ah ! vous dirai-je, maman | G4 G4 D5 D5, premières notes ; quatre noires | [music21, Aird’s Airs livre 2, X:0369](https://github.com/cuthbertLab/music21/blob/master/music21/corpus/airdsAirs/book2.abc), titre « Aire de l’Opera Françoise », identification dans les notes du corpus |
| Kuckuck, Kuckuck | G4 E4, silence, G4 E4, silence, D4 C4 | [Partition de chant traditionnel allemand](https://github.com/nathanaelmeister/Piano_-_First_two_hand_exercises/blob/master/input-files/017_Deutsches_Volkslied_-_Kuckuck_kuckuck.ily) |
| Chœur des fiançailles — Wagner | F4 B♭4 B♭4 B♭4 ; durées 2 / 1,5 / 0,5 / 3 temps | [Here Comes the Bride, partition en si bémol](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Here%20Comes%20the%20Bride%20-%20Ly%20Core%20-%20Bb.ly) |
| The Entertainer — Scott Joplin | E4 C5 E4 C5 ; début du thème après l’introduction, doubles croches / croches | [Partition Mutopia, thème après la levée](https://github.com/MutopiaProject/MutopiaProject/blob/master/ftp/JoplinS/entertainer/entertainer.ly) |
| Over the Rainbow — Harold Arlen | E♭4 E♭5 ; saut d’octave initial | [Partition en mi bémol](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Over%20the%20Rainbow%20-%20Ly%20Core%20-%20Eb.ly) |
| Star Trek — Alexander Courage | G3 F4 ; septième mineure ascendante, première note 2 temps, suivante prolongée sur 3 temps | [Partition en do](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Star%20Trek%20-%20Ly%20Core%20-%20C.ly) |

Les repères suivants sont documentés dans la [table d’intervalles de Chromatone](https://github.com/chromatone/chromatone.center/blob/master/content/theory/notes/ear-traning/reference-songs/index.md) :

- **Les Dents de la mer**, John Williams : cellule répétée de seconde mineure ascendante. Le rythme est régularisé ; ce n’est pas une transcription de l’enregistrement.
- **Maria**, Leonard Bernstein : deux notes du triton ascendant.
- **Frère Jacques** : deux premières notes, seconde majeure ascendante.
- **My Bonnie Lies over the Ocean** : saut initial de sixte majeure.
- **When the Saints Go Marching In** : deux premières notes, tierce majeure ascendante.

Pour ces cinq références, la source établit le repère d’intervalle ; elle ne fournit pas une partition complète. Les deux notes sont proposées à durées égales. Ces références ne sont pas présentées comme des phrases musicales entières.

## Sélection et adaptation

`melodies.js` cherche d’abord le plus long début compatible du catalogue, limité à six notes. Une transposition uniforme conserve les intervalles ; **chaque hauteur MIDI**, et pas seulement son nom sans octave, doit exister dans les positions autorisées de l’exercice. Dans une leçon d’intervalle, l’extrait doit employer les deux hauteurs étudiées.

Un exercice limité à deux notes ne permet souvent qu’un appel de deux à quatre notes. Par exemple, la quinte utilise les quatre premières notes d’« Ah ! vous dirai-je, maman », sans ajouter de sixte. Le transfert entre cordes reprend le même court appel sur les mêmes cases des deux cordes, en annonçant cette adaptation. Les accordages alternatifs utilisent le même calcul : une quinte diatonique diminuée n’est pas remplacée artificiellement par une quinte juste.

Si aucun extrait vérifié ne convient, l’activité conserve une **« Suite d’entraînement »**, sans lui attribuer un titre de morceau. Aucun intervalle n’est déformé pour forcer une correspondance.

La micro-leçon présente le titre, le passage et l’adaptation. Les liens documentaires restent dans ce dossier ; le jeu propose une écoute locale. Le bouton d’écoute joue le modèle avec les durées relatives disponibles ; l’élève retrouve ensuite les notes, sans évaluation rythmique. Les questions restent silencieuses et seules les bonnes réponses sont sonorisées.

## Limites avant commercialisation

Ce catalogue est un pilote pédagogique de courts incipits, avec des œuvres traditionnelles et quelques repères modernes. La publication d’une partition sur GitHub ne constitue pas une licence commerciale. Avant une diffusion payante, vérifier les droits applicables aux extraits modernes ou les remplacer par un répertoire autorisé ; aucun droit sur une œuvre moderne n’est déduit de sa seule présence dans ce document.

## Actualisation v0.19

Attribution unique par œuvre et par parcours : `melodiesForPlan` remplace la sélection indépendante pour les activités jouées. Répertoire étendu à la funk, au disco, à la house et au rock électronique ; 25 œuvres différentes pour les 25 finales du parcours six cordes standard. Sources et adaptations dans [le rapport v0.19](CHANGES-v0.19.md). Les suites sans correspondance unique restent explicitement des suites d’entraînement.
