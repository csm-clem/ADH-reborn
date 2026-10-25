# Corrections de collection après la v0.31

État : changements dans le code, sans publication ni nouveau numéro de version. La fusion graphique du ZIP v0.32 attend sa transmission dans cette discussion. Les fichiers d’installation et la version en ligne restent en v0.31.

## Interface

- Une variable commune `--double-check-spacing` et une classe `.double-check` resserrent les doubles coches, dans la légende comme dans les cases des Progrès. Les autres textes conservent leur espacement.
- Le contact tactile seul n’incline plus la carte. Un déplacement horizontal volontaire active l’inclinaison et les reflets ; le mouvement vertical conserve le défilement natif. Le relâchement ramène la carte à plat. Les boutons gardent leur fonction.
- Vue Album : trois couvertures par ligne, avec titre et progression. Chaque couverture est un bouton, sans minuscules contrôles imbriqués. L’ouverture affiche la vraie carte interactive dans une fenêtre plein écran sur téléphone et centrée sur ordinateur. Critères, défi et écoute restent les contrôles existants.
- Animation d’ouverture courte, désactivée lorsque les animations réduites sont demandées. Fermeture explicite, touche Échap, restitution du focus, arrière-plan non interactif et défilement de la fenêtre quand nécessaire.
- Chaque ouverture repart du recto, même si la carte précédente avait été retournée.
- `À faire` : non acquis, progression nulle. `En cours` : non acquis, progression positive. `Acquis` : preuve d’acquisition enregistrée. `Tous` : aucun de ces filtres.
- Navigation Parcours : depuis une autre section, reprise du dernier emplacement mémorisé. Depuis Parcours, appui sur sa navigation principale : retour aux trois branches. Aucun nouveau découpage de chapitres.

## Musiques : corrections et limites

### Seven Nation Army

Correction des attaques de la phrase : liaison initiale, croche pointée et double croche, silence de croche, puis fin sur deux mesures. Les notes mortes finales ne sont pas remplacées par des hauteurs inventées : leur durée devient un silence. La récompense et l’extrait d’exercice partagent cette chronologie.

La guitare originale étant abaissée par effet d’octave, le registre sonore du riff reste E2. Les nombres de la tablature indiquent les positions jouées avant cet effet. La partition fournie par l’utilisateur est la référence rythmique de cette correction ; les ornements de glissé ne sont pas synthétisés.

### Around the World

La descente est staccato : notes plus courtes, silences explicites, sans déplacement des attaques. Tempo ramené à 120 BPM conformément à la capture fournie. Le relevé antérieur des hauteurs est conservé : la capture recadrée ne permet pas de vérifier sûrement les cordes et l’accordage sur l’ensemble de la phrase. La correction complète des hauteurs demandée reste ouverte.

La transcription [Around the World sur GoTabs](https://www.gotabs.com/daft-punk/around-the-world-bass) distingue plusieurs riffs. Il faut confronter le passage exact à une partition complète ou au fichier Guitar Pro plutôt que mélanger ces variantes.

### Remplacement de Cantaloupe Island

Nouveau morceau : **Feel Good Inc.**, avec une pochette distincte et le numéro stable M028. Accordage et hauteurs en mi bémol mineur, timbre basse électrique, 139 BPM. La première phrase est relevée sur la [partition avec notation de Play Electric Bass](https://playelectricbass.com/wp-content/uploads/2023/12/Feel-Good-Inc.-Bass-Tabs-And-Notation-by-Gorillaz-PDF.pdf). Le tempo de cette partition pédagogique (120) est remplacé par le tempo original, corroboré par [Beatport / Parlophone](https://www.beatport.com/track/feel-good-inc/5367500). La lecture commence à la première attaque, sans le silence initial.

Cantaloupe Island n’est plus attribué aux nouveaux exercices. Sa carte M027 et son audio sont conservés uniquement pour les joueurs qui l’avaient déjà acquise : aucune preuve historique n’est réécrite.

### Immigrant Song : restant à faire

La suppression était une mise en attente explicite de l’audit musical : l’ancien extrait jouait la basse en octaves, pas le chant demandé. La [partition officielle guitare/voix](https://www.musicnotes.com/sheetmusic/led-zeppelin/immigrant-song/MN0068469) confirme F♯ mineur et 112 BPM, mais ces métadonnées ne suffisent pas à transcrire les hauteurs et durées du cri d’introduction.

La réintégration complète avec exposition à la guitare saturée puis chant superposé reste à réaliser sur une source rythmique lisible. Aucun chant ni accompagnement approximatif n’a été ajouté.

## Points en attente de contenu

- ZIP v0.32 de l’autre discussion : absent des pièces jointes et du dépôt à l’ouverture de cette tâche. Fusion graphique à effectuer dès réception.
- « faire un slide à gauche » et « Les cartes de niveau » : consignes incomplètes, aucun comportement supplémentaire déduit.
- Source complète du passage d’Around the World et du chant d’Immigrant Song.

## Vérification

- Tests Node : filtres distincts, préservation des préférences, rythme de Seven Nation Army, staccato sans décalage, attribution du nouveau morceau et conservation des anciennes cartes.
- Navigateur Chromium : Album à trois colonnes, ouverture/fermeture et critères actifs à 320, 390, 844 et 1440 px ; vraies entrées tactiles pour distinguer glissement horizontal et défilement vertical ; navigation Parcours ; doubles coches ; Échap et animations réduites.
- Ces essais de navigateur ne remplacent pas un essai sur un téléphone physique, notamment Safari iOS.
