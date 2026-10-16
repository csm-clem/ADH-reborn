# Recette navigateur

Ces contrôles demandent Python, `playwright` et Chromium. Ils restent hors du ZIP FTP ; l’application n’a pas de dépendance d’exécution.

Après `npm start` :

```sh
python tools/qa/onboarding.py
python tools/qa/new-features.py
python tools/qa/pilot-layout.py
python tools/qa/pilot-browser.py
python tools/qa/pilot-backup-audio.py
python tools/qa/pilot-variants.py
python tools/qa/pilot-full.py
npm run package
python tools/qa/package-offline.py
```

Chaque script utilise des contextes neufs, indépendants des autres scripts. Variables : `ADH_BASE_URL` (défaut `http://localhost:4173`), `CHROMIUM_BIN` (défaut `/usr/bin/chromium`), `ADH_QA_OUTPUT` (défaut `/tmp/adh-pilot-qa`).

- `new-features.py` : questions silencieuses, correction rouge/verte à hauteur exacte, passage automatique 500/1 000 ms, disque tactile, roue stable, pause/Muet/plein écran et résultats sur cinq formats.
- `onboarding.py` : six images fournies, huit formats, commandes accessibles sans défilement de page, ordre des cordes, réglages et écoute.
- `pilot-layout.py` : position entière visible, roue immobile, repères en gras et boutons accessibles ordonnés de l’aigu au grave.
- `pilot-browser.py` : purge des versions précédentes, préférences conservées, erreurs et révisions sans questions supplémentaires, sauvegardes et redémarrage hors ligne.
- `pilot-backup-audio.py` : buffers audibles, espacement de 230 ms ou 420 ms, absence de chevauchement et silence des questions et annulation des sons au passage en muet.
- `pilot-variants.py` : accordages alternatifs, transfert entre cordes, échec avec accès maintenu à la suite et deux diagnostics séparés de 30 questions.
- `package-offline.py` : dossier FTP servi en sous-répertoire, six images en cache et démarrage de la configuration hors connexion.
- `pilot-full.py` : vingt-deux exercices du pilote standard, motifs, validation et bouton principal suivant.

Les tests d’interface vérifient la temporisation réelle sur des interactions ciblées. Le parcours intégral utilise ensuite l’horloge virtuelle de Playwright pour accélérer les répétitions ; il ne mesure pas la vitesse d’un élève. Les essais audio vérifient le signal et sa programmation, pas la qualité du timbre perçue sur un téléphone réel.
