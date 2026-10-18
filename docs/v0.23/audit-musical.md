# Audit musical v0.23

Le contrôle automatisé de la synthèse vérifie la fréquence, les durées des buffers et la ponctualité de la programmation. Il ne prouve pas à lui seul la fidélité à un enregistrement. Les remarques ci-dessous distinguent les transcriptions choisies, les adaptations et les éléments restant à vérifier à l’écoute humaine.

## Références et modifications

| Morceau | Passage et contrôle | Références |
|---|---|---|
| Higher Ground, RHCP | Deux mesures d’introduction de basse. E1 et ses octaves, G et A ; correction du dernier groupe de la première mesure et de l’anticipation de la seconde. Croches swing et triolets, 138 BPM selon l’édition basse. Le timbre clean ne reproduit pas le slap de Flea. | [Tablature rythmique](https://www.bigbasstabs.com/red_hot_chili_peppers_bass_tabs/higher_ground_ver_3.html), [édition basse à 138](https://www.musicnotes.com/sheetmusic/red-hot-chili-peppers/higher-ground/MN0075042), [atelier audio Bonedo](https://www.bonedo.de/artikel/die-besten-bass-riffs-in-tabs-und-noten-flea-higher-ground/) |
| My Sharona | Quatre mesures du riff de basse de Gary Ramsey, avec silences de croches, passage F♯ et réponse C–B♭. G1/G2 pour la basse ; adaptation par octaves uniquement pour le manche d’entraînement. Tempo fixé à 147, corroboré par l’édition publiée ; la tablature de travail indique 145 et les prises peuvent varier légèrement. | [Partition rythmique](https://www.guitartabs.cc/tabs/k/knack/my_sharona_btab_ver_3.html), [édition à 147](https://www.musicnotes.com/sheetmusic/the-knack/my-sharona/MN0075422), [cours avec audio](https://www.justinguitar.com/songs/the-knack-my-sharona-chords-tabs-guitar-lesson-sb-304) |
| Around the World | Le passage choisi est la descente d’introduction, pas la boucle ascendante principale qui arrive ensuite. Les hauteurs F♯2 à E1 sont celles du « riff 1 » consulté. Six attaques courtes puis deux plus longues ; deux occurrences de cette mesure. La restitution à la référence supprime les changements de tonalité du catalogue antérieur. | [Riff 1 et articulation courte](https://www.gotabs.com/daft-punk/around-the-world-bass), [analyse Ableton de la boucle principale, distincte de l’extrait choisi](https://learningmusic.ableton.com/make-basslines/around-the-world.html) |
| Seven Nation Army | Deux mesures de l’introduction, 120 BPM. Les deux doubles-croches sans numéro sont des silences ; l’effet d’octave descend d’une octave la ligne de guitare notée. Les glissés restent omis, ce qui limite l’exactitude du phrasé instrumental. | [Tablature rythmique, guitare avec pédale d’octave](https://www.guitartabs.cc/tabs/w/white_stripes/seven_nation_army_tab_ver_12.html), [édition publiée](https://www.musicnotes.com/sheetmusic/the-white-stripes/seven-nation-army/MN0111409) |
| The Entertainer | Mesures 5–8 de l’édition Mutopia : les accords en octaves de la seconde partie contiennent une voix supérieure et une voix inférieure. La ligne retenue suit maintenant l’octave inférieure pour éviter le saut aigu signalé. Écoute à 92 BPM, choix explicite d’accélération ; l’édition indique « Not fast » et un MIDI à 72. Ce n’est donc pas une affirmation de tempo d’un disque original. | [Source LilyPond complète](https://github.com/MutopiaProject/MutopiaProject/blob/master/ftp/JoplinS/entertainer/entertainer.ly) |
| Billie Jean | Deux mesures de la ligne de basse, notes courtes et silences de doubles-croches, 117 BPM. Nouvelle référence pop/funk, sans ajout d’harmonie. | [Tablature rythmique](https://www.guitartabs.cc/tabs/m/michael_jackson/billie_jean_btab_ver_6.html), [clip de référence](https://www.youtube.com/watch?v=Zi_XLOBDo_Y) |
| Another One Bites the Dust | Levée puis deux mesures de basse, 110 BPM. Les silences écrits et les durées staccato sont conservés. Pas de notes fantômes synthétisées. | [Tablature rythmique](https://www.bigbasstabs.com/queen_bass_tabs/another_one_bites_the_dust_bass_tab.html), [cours avec écoute](https://onlinebasscourses.com/learn-basslines/learn-another-one-bites-the-dust-on-bass-guitar/) |

Les autres références conservées suivent les éditions indiquées dans les audits v0.20 et v0.22. Leur écoute garde désormais le registre et la tonalité de cette édition, sans harmonie générique. Pour les standards repris par de nombreux interprètes, « référence » désigne cette édition : pas une promesse de reproduction de chaque enregistrement commercial.

## Demandes restant à terminer

### Premier appel chanté d’Immigrant Song

La cellule de basse demeure disponible. L’appel vocal n’a pas été ajouté : la tablature vocale non rythmique trouvée n’est pas une preuve suffisante de ses hauteurs, de son registre et de ses durées. Une [piste vocale rythmique est répertoriée](https://www.songsterr.com/a/wsa/led-zeppelin-immigrant-song-vocal-tab-s568), mais les événements de cette piste n’ont pas pu être contrôlés dans cet audit. Ne pas remplacer ce manque par une imitation inventée. À compléter avec une partition vocale lisible, puis une comparaison audio du passage précis. L’accompagnement doit alors être la ligne effectivement jouée dessous, pas un arpège d’accords ajouté.

### Come As You Are et F♯

Le riff dans l’accordage original abaissé commence D–D–D♯–E. La version de doigté souvent enseignée en accordage standard donne E–E–F–F♯, donc une autre tonalité. Il faut arbitrer entre conserver cet extrait adapté dans le mélange F♯ avec une récompense originale, ou conserver aussi l’extrait dans la tonalité originale et lui trouver une autre activité compatible. La question a été soumise au porteur du projet ; aucune fausse attribution à F♯ n’est faite en attendant.

[Explication de l’accordage original](https://guitarcontrol.com/how-to-play-come-as-you-are-on-guitar/), [cours et sections du riff](https://www.actiontab.com/actiontabs/come_as_you_are_main_by_nirvana).

### Thunderstruck, corde entière

Retiré de la zone 0–4 et réservé à une activité ultérieure par corde entière. La [transcription du riff descendant consultée](https://www.chords-and-tabs.net/song/name/ac-dc-thunderstruck-19) utilise la corde B3 en accordage standard ; la demande mentionne E4. Le choix du passage et de la corde devra donc être précisé au moment d’implémenter ce parcours, en gardant la vraie hauteur sonore. My Sharona fournit ici les octaves de G.

## Accompagnements

Le générateur générique basse + arpège est entièrement désactivé. Les morceaux sont rendus comme lignes instrumentales issues des références. Aucun accompagnement supplémentaire n’est présenté comme l’original sans transcription séparée vérifiée. Les données historiques des accords restent dans les anciens catalogues mais ne sont plus jouées.
