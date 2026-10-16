# Recette navigateur

Ces contrôles demandent Python, `playwright` et Chromium. Ils restent hors du ZIP FTP ; l’application n’a pas de dépendance d’exécution.

Après `npm start` :

```sh
python tools/qa/onboarding.py
python tools/qa/new-features.py
python tools/qa/v011.py
python tools/qa/v012.py
python tools/qa/v013.py
python tools/qa/v014.py
python tools/qa/pilot-layout.py
python tools/qa/pilot-browser.py
python tools/qa/pilot-backup-audio.py
python tools/qa/pilot-variants.py
python tools/qa/pilot-full.py
npm run package
python tools/qa/package-offline.py
```

Chaque script utilise des contextes neufs, indépendants des autres scripts. Variables : `ADH_BASE_URL` (défaut `http://localhost:4173`), `CHROMIUM_BIN` (défaut `/usr/bin/chromium`), `ADH_QA_OUTPUT` (défaut `/tmp/adh-pilot-qa`).

- `v014.py` : boutons pilules partagés, espacement de Plein écran, réponse au pointerdown, touches rapprochées et résonance, Muet, modèle rythmique et carte de progrès.
- `v013.py` : écoute de l’accordage, Muet, illustration stable et corde à vide, inlays, résultats sur six formats et continuité du zoom de démarrage.
- `v012.py` : préparation de 1,5 seconde et pause exclues du chrono, apparition des questions, résultats sur six formats, erreurs/révision ciblée, records, partage PNG et préécoute.
- `v011.py` : texte de référence, image conservée lors du changement de notation, titres/sous-titres, timbres sauvegardés et capsules flottantes.
- `new-features.py` : questions silencieuses, correction rouge/verte à hauteur exacte, passage automatique 150 ms sur le manche ou 500 ms dans la roue après une bonne réponse, 1 000 ms après une erreur, disque tactile, roue stable, pause/Muet/plein écran et résultats sur cinq formats.
- `onboarding.py` : six images fournies, huit formats, commandes accessibles sans défilement de page, ordre des cordes, réglages et écoute.
- `pilot-layout.py` : position entière visible, roue immobile, repères en gras et boutons accessibles ordonnés de l’aigu au grave.
- `pilot-browser.py` : purge des versions précédentes, préférences conservées, erreurs et révisions sans questions supplémentaires, sauvegardes et redémarrage hors ligne.
- `pilot-backup-audio.py` : buffers audibles, espacement de 230 ms ou 420 ms, absence de chevauchement des modèles et silence des questions et annulation des sons au passage en muet.
- `pilot-variants.py` : accordages alternatifs, transfert entre cordes, échec avec accès maintenu à la suite et deux diagnostics séparés de 30 questions.
- `package-offline.py` : dossier FTP servi en sous-répertoire, six images en cache et démarrage de la configuration hors connexion.
- `pilot-full.py` : vingt-deux exercices du pilote standard, motifs, validation et bouton principal suivant.

Les tests d’interface vérifient la temporisation réelle sur des interactions ciblées. Le parcours intégral utilise ensuite l’horloge virtuelle de Playwright pour accélérer les répétitions ; il ne mesure pas la vitesse d’un élève. Les essais audio vérifient le signal et sa programmation, pas la qualité du timbre perçue sur un téléphone réel.
