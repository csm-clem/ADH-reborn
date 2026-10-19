# Daily Fretboard Trainer v0.26 — collection de succès interactive

Livraison du 19 octobre 2026. Les maquettes approuvées sont intégrées à l’application sous forme de composants fonctionnels. Le cahier des charges graphique d’origine reste dans `docs/succes-direction-artistique/` comme référence de conception.

## Ce qui est livré

- **42 modèles de succès**, quatre variantes supplémentaires de précision par zone et une carte par morceau compatible. Sur guitare six cordes standard : **60 cartes** disponibles, dont 14 pochettes musicales. Le total s’adapte aux défis et morceaux réellement accessibles sur le profil.
- Cinq raretés : Commune, Inhabituelle, Rare, Épique, Légendaire. Mot et étoiles sont alignés sur une seule ligne. La rareté vient du défi ; elle ne dépend d’aucun tirage ou achat.
- **42 illustrations vectorielles distinctes** pour les modèles, plus quatre illustrations propres aux variantes de zones, avec des objets liés à chaque réussite : jack, famille, pont, atlas, fil, horloge, disques… Les finitions communes relient la collection sans recopier cinq images sur toutes les cartes.
- Des pochettes musicales différenciées par composition et palette : disque, micros de basse, globe, rubans, eau, clavier, orbites, etc. Leur music-sleeve utilise les événements réels de la phrase écoutable : hauteur, départ, durée et silences.

## Une carte est un composant HTML actif

Les SVG sont uniquement les illustrations. Titre, boutons, pourcentage, barre, date, coche et liste des critères sont des éléments de l’interface de l’application.

| Élément | Comportement réel |
|---|---|
| Progression | Calculée depuis les preuves du joueur. Un clic sur la barre ouvre les critères correspondants. |
| Essayer | Lance la prochaine activité utile au défi, ou le cours nécessaire. Un accordage déjà nommé propose sa recherche, sans recommencer sa nomination. |
| Rejouer le défi | Relance une activité correspondant à la réussite ; les musiques conservent le contexte d’origine quand il faut changer de profil. |
| Critères | Retourne la carte ; les critères sont à puces, avec coches et compteurs. Le focus passe au verso, le recto devient inerte. |
| Écouter / Arrêter | Joue et arrête la phrase réellement obtenue, respecte le Mute ; les notes de la pochette s’animent au démarrage audio. |
| Date | Conservée avec l’ancien succès ; affichée sur la ligne de Rejouer, avec la date complète accessible au survol/lecteur d’écran. |

Les critères ne forment pas une liste d’étapes numérotées. Un succès reste acquis lorsqu’une activité est moins bien réussie ensuite. La vitesse est facultative : la carte Légendaire de fin de parcours n’impose aucun temps.

## Inclinaison et reflets

- À la souris, la carte s’incline autour de son centre et son reflet suit le pointeur. Elle revient à plat quand le pointeur la quitte.
- Au doigt, un glissement latéral déplace légèrement la carte, l’incline et déplace ses reflets ; au relâchement ou à l’annulation du geste, elle revient à plat.
- Le mouvement est plafonné : environ 7–8° et 24 px de translation au doigt. Le défilement vertical de la collection reste natif. Les gestes qui commencent sur un bouton gardent leur fonction de bouton.
- Le mouvement est géré par un contrôleur délégué et `requestAnimationFrame`, sans reconstruire les cartes à chaque mouvement. Aucun filtre SVG ou bruit animé n’est utilisé.
- La préférence système de réduction des animations désactive le mouvement 3D et garde toutes les fonctions. Les thèmes Papier et Inclusif-contrasté suppriment les reflets colorés.

## Précisions graphiques appliquées

Un seul fond `.stage` enveloppe l’album. Les cartes ne possèdent plus chacune leur socle de présentation. Les titres utilisent les retours à la ligne naturels du navigateur, sans `<br>` forcé.

La coche sort de l’illustration et prend la couleur principale du thème, notamment le rouge de l’Atelier. Le numéro unique de la carte reste visible ; la mention de série du pied de carte est retirée.

Essayer/Rejouer et Critères sont alignés sur les cartes ordinaires. Les pochettes musicales gardent Rejouer et sa date sur une première ligne, puis Écouter et Critères sur une seconde. Le style des boutons reste centralisé dans `components.css`, avec des pilules de 44 px minimum.

La collection propose les catégories Repères/Fluidité/Musiques, les filtres Tous/En cours/Acquis, le tri Parcours/Rareté/Récents et les vues Album/Liste. L’accueil de la collection suggère un prochain défi selon la progression.

## Règles et données

Les anciennes preuves ne sont pas effacées. Les IDs historiques, dates et pochettes acquises sont conservés. Une ancienne carte reste obtenue même si sa nouvelle version demande une couverture plus complète ; son verso précise qu’elle provient d’une version antérieure.

Les validations récentes et les couvertures durables des parcours sont réutilisées. Les nouveaux compteurs de collection survivent à la purge du journal détaillé : précision, séries, meilleurs temps, comparaison du même contrat, couverture par zone et phrases musicales terminées. Aucun résultat manquant dans l’ancien historique n’est inventé.

Les exigences de correspondance entre zones utilisent une couverture dans chacun des deux contextes, et pas seulement l’union de positions identiques. La nomination d’une hauteur exacte est distinguée de la reconnaissance de son seul nom de note. Une ancienne question en E ne peut pas certifier silencieusement une nouvelle question E2/E3.

Les parcours guidés réutilisent les activités canoniques ciblées, sans double comptage. Les seuils de vitesse utilisent le temps moyen des premières réponses correctes et interprétables, avec les conditions de précision du défi ; ni pause, ni chargement, ni transition de départ ne donnent une fausse performance. Les exercices interrompus et les aides ne permettent pas les succès de vitesse.

Les courses facultatifs Grand Débutant, les découvertes de familles et les chaînes musicales sans erreur disposent de leurs preuves. Les morceaux restent uniques dans l’affectation des activités canoniques de la bêta. Un morceau déjà obtenu reste dans la collection après un changement de profil.

Les défis incompatibles ne sont pas affichés comme des objectifs impossibles : par exemple une nomination d’accordage sans activité discriminante ou trois unissons qui n’existent pas dans un profil exotique. Les succès déjà acquis restent visibles.

## Architecture

| Fichier | Responsabilité |
|---|---|
| `achievement-catalog.js` | Les 42 définitions, les numéros et les cinq raretés. |
| `achievement-evidence.js` | Agrégats durables et validation des données importées. |
| `achievement-rules.js` | Une projection commune pour l’avancement, les conditions et la prochaine activité. |
| `achievements-ui.js` | Le composant HTML recto/verso et les actions de collection. |
| `achievement-motion.js` | Le contrôleur unique d’inclinaison souris/tactile. |
| `achievement-art.js` et `achievement-art/` | Compositions des pochettes et illustrations propres aux modèles. |
| `tools/generate-achievement-art.py` | Source reproductible des illustrations des 42 modèles. |

L’ajout d’une carte ne nécessite pas de recopier une page d’exercice. Les règles pures, la persistance, l’illustration et les interactions restent séparées.

## Vérifications réalisées

- `npm run check` : syntaxe des modules contrôlée.
- `npm test` : **26 fichiers de tests passent**, dont sept nouveaux scénarios sur la collection, les preuves après purge, les contrats, les anciens succès, les sources MIDI et l’ensemble des instruments.
- Validation XML des 46 illustrations, présence dans le cache PWA et dans le paquet FTP.
- Vingt combinaisons d’affichage : 320, 390, 768, 1 024 et 1 440 px, dans Atelier, Studio Nuit, Inclusif-contrasté et Papier. Pas de débordement horizontal ; alignement des actions, étoiles et coches vérifié.
- Gestes réels de pointeur Chromium : inclinaison souris, retour à plat, glissement tactile, relâchement et conservation du défilement vertical. Mobile testé en émulation, pas sur un iPhone physique.
- Barre ouvrant les critères, gestion du focus, réduction des animations, écoute/arrêt et animation des événements MIDI.
- Partie de nomination jouée par les contrôles du jeu, résultat et déblocages effectivement enregistrés ; l’accordage reste à 50 % tant que la recherche manque. Cours du diagramme parcouru et vérifications réellement répondues avant obtention de son succès.
- Mode Débug : tous les succès disponibles sont obtenus par les règles réelles, sans remplacer les résultats du joueur sur disque.
- ZIP extrait et servi dans un sous-dossier : rechargement hors ligne, 46 illustrations et quatre nouveaux modules en cache, rectos/versos et pochettes disponibles.

Les rapports JSON et captures sont dans [v0.26](v0.26/). Les performances matérielles et le rendu Safari sur appareil restent à vérifier en test utilisateur ; aucune certification d’accessibilité complète n’est revendiquée.

## Mise en ligne

Archive : [daily-fretboard-trainer-v0.26.zip](../downloads/daily-fretboard-trainer-v0.26.zip).

Copier son **contenu** dans le dossier choisi sur le serveur. Le dossier `achievement-art/`, les nouveaux modules et le nouveau `sw.js` font partie de la version : ne transférer uniquement ni le CSS ni les anciennes maquettes.

Pour une URL de test versionnée : `https://media.lecompositeur.com/adh-pwa/v0.26/`. Les données restent sous les mêmes clés de stockage et sur la même origine, sans remise à zéro. Le mécanisme de mise à jour des versions v0 reste actif. Le transfert FTP n’a pas été effectué depuis cet environnement.
