# v0.23 — Premiers pas, progrès conservés et mises à jour choisies

18 octobre 2026. Livraison de recette, zone 0–4 toujours jouable ; aucune extension du parcours au-delà de cette zone dans ce lot.

## Entrée des grands débutants

La configuration devient un guide en trois écrans, avec un seul choix principal à la fois :

1. **Votre instrument favori** : illustration réelle, instrument et nombre de cordes.
2. **Vos noms de notes habituels** : correspondance visuelle C–D–E / Do–Ré–Mi, choix réversible. Les deux conviennent à quelqu’un qui débute.
3. **Votre accordage** : « Un doute ? Gardez Standard », notes du grave vers l’aigu et bouton d’écoute. L’éditeur personnalisé existant reste disponible.

Les boutons Précédent / Suivant restent visibles sur les formats vérifiés, y compris les éditeurs des six instruments en 320×568, 844×390 et 280×320.

Après la première configuration, un tutoriel facultatif présente, sur cinq cartes : les lignes/cordes et leur orientation, le sillet et la corde à vide, les cases et les repères fixes, nommer une pastille, puis retrouver sa place. **Suivant**, **Précédent** et **Ignorer** permettent d’avancer sans test supplémentaire. Il peut être rejoué depuis les Paramètres. Ce tutoriel est distinct des futurs chapitres pédagogiques : aucun nouveau découpage arbitraire du parcours n’est introduit.

Les consignes des micro-leçons ont été raccourcies. Les exemples de suites montrent maintenant les notes numérotées dans leur ordre ; les illustrations de mélanges évitent de superposer toutes les étiquettes du manche. Avant les premières activités sur les cordes à vide, l’accordage choisi est rappelé explicitement.

Pour une question de position sur une corde donnée, la corde est soulignée sur le manche et son numéro mis en valeur. Cela distingue, par exemple, B3 sur la corde 3 de B3 sur la corde 2. La consigne conserve son emplacement : les questions et réponses n’ont pas été rapprochées.

## Audio et installation

- L’AudioContext est réveillé directement dans l’interaction utilisateur, avant les attentes asynchrones ; la session audio demande le mode `playback` lorsque le navigateur l’expose. Les contextes fermés peuvent être recréés ; les contextes suspendus ou interrompus sont relancés lors d’une nouvelle interaction.
- Le passage en arrière-plan ne déclenche plus un arrêt audio décidé par DFT. Le chronomètre du jeu est toujours mis en pause pour ne pas pénaliser l’élève absent. Les commandes Pause et Mute explicites continuent d’arrêter les sons.
- Sur iPhone, **Installer sur iPhone · Comment faire ?** ouvre un guide visuel Safari → Partager → Sur l’écran d’accueil. Safari ne permet pas à cette PWA de déclencher directement et seule l’installation. [Procédure Apple](https://support.apple.com/en-mide/guide/iphone/iphea86e5236/27/ios/27).
- Un timbre **Guitare électrique saturée**, synthétisé et disponible hors ligne, rejoint les Paramètres. Les lignes de guitare de Smoke on the Water, Iron Man et Seven Nation Army l’utilisent dans leur récompense ; les lignes de basse gardent leur timbre de basse.

**Limite de vérification :** la lecture a été exercée dans Chromium et les séquences d’activation ont été testées, mais pas sur un iPhone physique. iOS peut suspendre un onglet ou son AudioContext lorsque l’application est en arrière-plan ou l’écran verrouillé, et ferme évidemment le son si le navigateur est arrêté. Le mode `playback` est une demande au navigateur, pas une garantie de lecture permanente. [Incident WebKit concernant l’arrière-plan](https://bugs.webkit.org/show_bug.cgi?id=261554).

## Progrès et mises à jour

La politique de remise à zéro des v0 est supprimée. Les données utilisent désormais une clé durable, indépendante du numéro de version. Une progression v0.22 valide encore présente sur la même origine et dans le même navigateur est copiée puis validée ; l’ancienne sauvegarde reste intacte. Les autres archives anciennes ne sont plus effacées au démarrage. Un format illisible ou une écriture refusée ne sont pas remplacés silencieusement par des résultats vides.

Les exports v0 compatibles restent importables. Changer de domaine, de navigateur ou d’appareil ne transfère pas le stockage local ; le compte n’est pas nécessaire pour conserver les résultats entre deux versions sur le même appareil. Les résultats déjà effacés par une ancienne version ne peuvent pas être reconstitués sans sauvegarde.

Une mise à jour disponible ouvre un dialogue **Mettre à jour / Plus tard**, hors exercice et hors autre dialogue. Le refus est conservé pendant ce lancement ; l’offre revient au prochain démarrage. L’acceptation vérifie d’abord la sauvegarde. Les annonces ne sont jamais servies depuis le cache hors ligne ; une panne réseau laisse la version actuelle utilisable.

Le service worker est associé à une version explicite : une vérification automatique du navigateur ne peut pas remplacer subrepticement la version refusée après fermeture des onglets. Ce scénario a été testé sur deux véritables générations de caches, avec conservation intégrale des résultats.

**Deux modes de déploiement :**

- Recommandé : une URL fixe, par exemple `adh-pwa/app/`, dont on remplace les fichiers à chaque livraison. Le fichier `update.json` fait partie du paquet.
- Dossiers versionnés : déposer aussi le fichier d’annonce `latest.json` dans `adh-pwa/`, au-dessus des dossiers `v0.xx/`, avec la version et l’URL relative de la nouvelle livraison. Le dialogue peut alors conduire vers le nouveau dossier sur la même origine.

**Premier passage depuis v0.22 :** cette ancienne version ne contenait pas ce protocole. Il faut ouvrir une fois la nouvelle URL manuellement. La reprise des résultats est ensuite automatique si ses données sont encore présentes. Fermer les anciens onglets et exporter ses résultats avant le premier transfert reste conseillé.

Le mécanisme conserve les structures actuellement compatibles. Un futur changement de schéma de données demandera son convertisseur et ses tests, sans remise à zéro par numéro de livraison.

## Collection des succès

Le bouton **Essayer** cherche la prochaine activité satisfaisant un critère encore manquant. Pour « Les présentations sont faites », si Nommer les cordes est réussi, il propose Retrouver les cordes. Pour une famille, il reprend la première de ses quatre validations manquantes ; les validations strictes de carte du manche gardent leurs critères d’aide et de couverture.

Les critères passent au **verso**, avec un retournement horizontal court. Le recto garde la progression, la récompense, l’écoute éventuelle et la date basique sur la ligne de Rejouer le défi. Liens externes, détails techniques et preuves détaillées ne sont plus affichés. Les preuves demeurent enregistrées dans les données, ce qui permet de conserver la validité des succès. La face cachée est désactivée pour le clavier ; le mouvement est supprimé si l’appareil préfère réduire les animations.

## Musique : corrections et limites

Les récompenses reviennent à la tonalité et au registre de leur référence, indépendamment d’une adaptation d’octave de l’exercice. Les accompagnements à base d’accords génériques sont supprimés ; aucune harmonie n’est ajoutée sans transcription contrôlée. Les sons restent des instruments synthétisés : aucun enregistrement original n’a été intégré.

- **Higher Ground** : véritable registre de basse, notes de fin des deux mesures et triolets corrigés ; référence rythmique à 138 BPM.
- **My Sharona** : reprise du riff de basse sur quatre mesures, avec ses silences, sa note de passage F♯ et sa réponse C–B♭. Registre de basse et tempo 147 BPM. Sert de référence pour la famille G, à la place de Thunderstruck.
- **Around the World** : référence descendante non transposée à l’écoute, articulation courte des six premières notes, tempo 121,3 BPM.
- **Seven Nation Army** : écoute dans le registre produit par l’effet d’octave ; maintien des silences et du tempo 120 BPM de la transcription.
- **The Entertainer** : choix de la voix inférieure des octaves dans la seconde partie ; tempo d’écoute porté à 92 BPM à la demande d’accélération, distinct de l’indication de l’édition Mutopia à 72.
- **Kuckuck, Kuckuck**, **Ah ! vous dirai-je, maman**, **Frère Jacques** et **Thunderstruck** sont retirés du catalogue de cette zone. Les finales utilisent notamment Billie Jean et Another One Bites the Dust lorsqu’elles correspondent aux notes disponibles. Les preuves historiques ne sont pas effacées.

[Audit musical : passages, références et points restant à arbitrer](v0.23/audit-musical.md).

**Deux demandes musicales ne sont pas présentées comme terminées :** l’ajout contrôlé du premier appel chanté d’Immigrant Song, et le placement de Come As You Are sur F♯ malgré la tonalité originale du riff. La question sur cette dernière contradiction reste ouverte. Le catalogue ne force pas une mélodie incompatible dans un exercice.

## Validation et livraison

[Contrôles effectués et captures](v0.23/validation.md).

[Archive FTP v0.23](../downloads/daily-fretboard-trainer-v0.23.zip) — déposer son contenu, dossier `api/` compris. Pour les dossiers versionnés, [annonce latest.json](../downloads/latest.json) à déposer dans `adh-pwa/`.
