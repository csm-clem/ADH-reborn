# Audit musical — 18 octobre 2026

## Méthode et portée

La v0.19 avait confondu trois vérifications différentes : disposer d’une source mentionnant un morceau, faire tenir ses notes sur le manche, et reproduire fidèlement le passage. Des rythmes simplifiés avaient été présentés trop affirmativement comme vérifiés. Cet audit corrige cette confusion.

Reprise des **25 passages précédemment sélectionnables**, avec consultation des partitions et des références externes disponibles : éditions LilyPond/ABC, notation rythmique et tablatures, ateliers publiés avec audio/vidéo. Comparaison des hauteurs, des durées, des silences, du passage désigné et de la fin choisie. Les sources communautaires ne sont pas des éditions officielles ; un contrôle de transcription ne garantit ni la micro-interprétation d’un disque, ni qu’un élève reconnaîtra un titre sur deux notes.

Le catalogue n’annonce pas des morceaux entiers. Il propose un début court à reproduire puis un **passage identifié** plus long à écouter. La récompense peut utiliser des notes non encore apprises. L’harmonisation est pédagogique ; les slides, le slap et le timbre original ne sont pas reproduits. Les transpositions et le registre d’écoute restent adaptés au jeu et sont annoncés.

`music-audit.js` est la règle unique : seuls les passages retenus peuvent être affectés ou sonorisés. Les sept autres restent documentés dans les données pour correction ; ils ne constituent plus de faux exemples jouables. Chaque œuvre n’est attribuée qu’une fois par instrument/zone. Sur une guitare standard, cela donne **18 finales connues distinctes**, au lieu de 25 ; les autres finales sont temporairement des suites d’entraînement explicitement nommées. Les 50 activités restent accessibles.

## Passages conservés et corrections

| Passage | Contrôle / modification | Référence externe |
|---|---|---|
| Higher Ground, version RHCP | Première mesure complète du slap : 10 attaques, durées longues/courtes puis triolets ; suppression des attaques ajoutées. Ne pas annoncer la variante de seconde mesure. | [Rainer Wind, Bonedo : partition 12/8 et audio](https://www.bonedo.de/artikel/die-besten-bass-riffs-in-tabs-und-noten-flea-higher-ground/) ; [PDF](https://storage.googleapis.com/th-bonedo-av/wp-media-folder-bonedo//var/www/html/web/app/uploads/2018/09/Higher_Ground_Groove.pdf) ; corroboration de la division rythmique par [Bassline Publishing](https://www.basslinepublishing.com/video-course/shuffle-grooves/). |
| My Sharona | Deux mesures : correction de l’alternance croches / doubles croches. Les deux mesures font huit temps. | [Thomas Meinlschmidt, Bonedo, section My Sharona](https://www.bonedo.de/artikel/20-rock-bassgrooves-die-jeder-kennen-sollte/) ; [partition](https://storage.googleapis.com/th-bonedo-av/wp-media-folder-bonedo//var/www/html/web/app/uploads/2018/12/17.pdf). |
| Immigrant Song | Cellule en octaves confirmée, deux mesures, huit temps ; sortie glissée exclue du passage annoncé. | [Bonedo, exemple 5 avec vidéo et partition](https://www.bonedo.de/artikel/10-bass-riffs-mit-nur-zwei-toenen-bass-quickies-teil-3/) ; [PDF, page 1](https://storage.googleapis.com/th-bonedo-av/wp-media-folder-bonedo/2022/01/01-975281.pdf). |
| Thunderstruck | Vérification du riff descendant, deux mesures de doubles croches. Ce passage n’est pas le début de l’introduction ; le titre l’explicite. | [Tablature, riff 2](https://www.chords-and-tabs.net/song/name/ac-dc-thunderstruck-19), [démonstration vidéo](https://www.youtube.com/watch?v=RinFw8jcasY). |
| Singin’ in the Rain | Levée et première phrase du refrain ; les notes liées sont regroupées, la levée de la phrase suivante n’est pas jouée. | [LilyPond, section A](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Singin%27%20in%20the%20Rain%20-%20Ly%20Core%20-%20G.ly). |
| The Christmas Song | Quatre mesures de A1 confirmées : 16 temps. | [LilyPond](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/The%20Christmas%20Song%20-%20Ly%20Core%20-%20Eb.ly). |
| Around the World | Remplacement de la seule descente par les deux mesures du refrain : descente puis remontée, 16 croches. Registre remis à celui de la transcription de basse. | [Thomas Meinlschmidt, Bonedo, audio et PDF](https://www.bonedo.de/artikel/play-alike-daft-punk/) ; [partition, refrain](https://storage.googleapis.com/th-bonedo-av/wp-media-folder-bonedo/2021/04/02-563398.pdf). |
| Seven Nation Army | Premier tour de l’introduction. Silences de double croche conservés ; C et B durent deux temps chacun. Abandon du mélange précédent entre variantes d’introduction et de refrain. | [Transcription rythmique, Lee Jones, introduction](https://www.chords-and-tabs.net/song/name/white-stripes-seven-nation-army-20) ; [atelier Bonedo](https://www.bonedo.de/artikel/die-besten-bass-riffs-in-noten-und-tabs-the-white-stripes-seven-nation-army/). |
| Come As You Are | Levée, deux mesures du riff de **guitare**, puis note de reprise. Correction des deux noires qui avaient été transformées en croches ; les notes de levée suivantes manquantes sont rétablies. La variante de basse n’est pas utilisée comme si elle était identique. | [Guitare accordée DGCFAD, notation rythmique](https://www.gitaartabs.nl/akkoorden/nirvana/come-as-you-are-2), [JustinGuitar, cours vidéo](https://www.justinguitar.com/songs/nirvana-come-as-you-are-chords-tabs-guitar-lesson-bs-723). |
| Smoke on the Water | Quatre mesures, voix supérieure des doubles notes de guitare. Correction des durées et, surtout, rétablissement des silences au lieu de les fondre dans les notes. | [Transcription rythmique de l’introduction](https://www.guitartabs.cc/tabs/d/deep_purple/smoke_on_the_water_tab_ver_8.html). |
| Iron Man | Deux mesures du premier couplet de guitare : noires initiales puis alternance de doubles croches. Le glissé final est omis, sa durée reste incluse dans la dernière note. Ne pas mélanger les versions du riff de guitare et de la basse. | [Transcription, « Verse 1 »](https://www.guitartabs.cc/tabs/b/black_sabbath/iron_man_tab_ver_4.html), comparaison avec le [cours JustinGuitar](https://www.justinguitar.com/songs/black-sabbath-iron-man-chords-tabs-guitar-lesson-rf-014). |
| Ah ! vous dirai-je, maman | Première période traditionnelle de 14 attaques ; préfixe et phrase cohérents. | [music21, Aird’s Airs livre 2, X:0369](https://github.com/cuthbertLab/music21/blob/master/music21/corpus/airdsAirs/book2.abc). |
| Kuckuck, Kuckuck | Quatre mesures de la mélodie supérieure, avec les silences après les appels. | [Partition LilyPond](https://github.com/nathanaelmeister/Piano_-_First_two_hand_exercises/blob/master/input-files/017_Deutsches_Volkslied_-_Kuckuck_kuckuck.ily). |
| Chœur des fiançailles | Quatre premières mesures de la version droite en 2/2, silences conservés ; ne pas utiliser sa variante swing. | [LilyPond, début du refrain](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Here%20Comes%20the%20Bride%20-%20Ly%20Core%20-%20Bb.ly). |
| The Entertainer | Première phrase du thème après l’introduction. Le préfixe d’exercice était deux fois trop long par rapport à la récompense : doubles croches/croches désormais identiques. | [Mutopia, mesures 5 à 8, édition 1902](https://github.com/MutopiaProject/MutopiaProject/blob/master/ftp/JoplinS/entertainer/entertainer.ly). |
| Over the Rainbow | Section A1 de huit mesures, notes liées et silence final conservés. | [LilyPond, mi bémol](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Over%20the%20Rainbow%20-%20Ly%20Core%20-%20Eb.ly). |
| Star Trek | Premier appel de quatre mesures, avec triolet ; les deux B♭ successifs restent deux attaques distinctes avant la tenue. | [LilyPond, A1](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Star%20Trek%20-%20Ly%20Core%20-%20C.ly). |
| Frère Jacques | Air traditionnel ; passage « Sonnez les matines » remis en quatre croches régulières, au lieu d’un début pointé. | [Partition et écoute, édition Noctave](https://noctavepiano.com/partitions/trad-frere-jacques/) ; le thème traditionnel connaît aussi des variantes. |

## Sept passages mis en révision

| Morceau | Problème constaté | Condition de réintégration |
|---|---|---|
| I Was Made for Lovin’ You | Une source consultée annonce elle-même une transcription simplifiée ; la fin et le rythme de la boucle codée n’ont pas de corroboration suffisante. | Relever la phrase de basse complète sur une partition rythmique et une interprétation concordante. |
| Superstition | La source d’Ethan Hein décrit précisément les syncopes ; le rythme simplifié du code ne les restituait pas fidèlement. | Relever les attaques, tenues et silences du clavinet sur les deux mesures. |
| Get Lucky | Différences d’attaques de fin de mesure et rythme simplifié ; ne pas gommer arbitrairement les respirations du groove. | Repartir du [PDF et de l’audio de Rainer Wind](https://www.bonedo.de/artikel/sound-workshop-bass-3-daft-punk-get-lucky/), en identifiant exactement les quatre mesures du couplet. |
| Blue Monday, version Orgy | Les octaves avaient été regroupées au lieu d’alterner ; les sources d’accordage/version demandent une corroboration rythmique. | Fixer la version et son accordage, puis relever le riff avec une référence rythmique fiable. |
| Sweet Dreams | La tablature non rythmique utilisée prévient explicitement que sa transcription est incertaine. Le rythme a été supposé. | Vérifier l’interlude en octaves, distinct du synthé principal, sur partition et écoute concordantes. |
| bad guy | La boucle synthétisée ne couvrait pas les huit mesures de la transcription publiée, et simplifiait son groove. | Reprendre le [PDF et l’audio Bonedo](https://www.bonedo.de/artikel/die-besten-bass-riffs-in-noten-und-tabs-billie-eilish-bad-guy/), notamment la fin en D grave. |
| Another One Bites the Dust | Nombre d’attaques, silences et octaves de la réponse du riff à reprendre ; la disponibilité des notes n’était pas une preuve de fidélité. | Comparer les deux mesures de la [partition Bonedo](https://www.bonedo.de/artikel/20-rock-bassgrooves-die-jeder-kennen-sollte/) à leur lecture. |

Cette mise à l’écart est une limite de la livraison actuelle. **Ces sept arrangements ne sont pas corrigés et validés intégralement.** Les remplacer par des rythmes supposés pour maintenir artificiellement 25 titres reproduirait le problème signalé.

## Garde-fous techniques

- Contrôle de chaque préfixe d’exercice contre la ligne mélodique effectivement jouée par `rewardFor` : hauteurs, durées et silences. Même tempo de préécoute et de récompense.
- Contrôle des longueurs des mesures corrigées ; conservation explicite de `restAfter`.
- Contrôle que les morceaux en révision ne peuvent être attribués ou rejoués depuis une ancienne preuve importée.
- Sources identifiées, passages nommés, harmonisation pédagogique explicitée.
- Tests navigateur du jeu et de la collection ; ces tests établissent le fonctionnement et la cohérence interne, **pas une équivalence acoustique avec le disque**.
