# Recette navigateur

Ces contrôles demandent Python, `playwright` et Chromium. Ils restent hors du ZIP FTP ; l’application n’a pas de dépendance d’exécution.

Après `npm start` :

```sh
python tools/qa/onboarding.py
python tools/qa/pilot-layout.py
python tools/qa/pilot-browser.py
python tools/qa/pilot-backup-audio.py
python tools/qa/pilot-variants.py
python tools/qa/pilot-full.py
```

Chaque script utilise des contextes neufs, indépendants des autres scripts. Variables : `ADH_BASE_URL` (défaut `http://localhost:4173`), `CHROMIUM_BIN` (défaut `/usr/bin/chromium`), `ADH_QA_OUTPUT` (défaut `/tmp/adh-pilot-qa`).

- `onboarding.py` : six instruments, huit formats, commandes accessibles sans défilement de page, ordre des cordes, réglages et écoute.
- `pilot-layout.py` : position entière visible, roue immobile, préparation de 1,5 seconde, pause, plein écran, boutons accessibles et corrections colorées.
- `pilot-browser.py` : purge des versions précédentes, préférences conservées, erreurs/reprises, sauvegardes et redémarrage hors ligne.
- `pilot-backup-audio.py` : buffers audibles, espacement de 230 ms ou 420 ms, absence de chevauchement et annulation des sons au passage en muet.
- `pilot-variants.py` : accordages alternatifs, transfert entre cordes, échec sans déblocage et diagnostic de 108 questions avec familles.
- `pilot-full.py` : onze activités du pilote standard, motifs, validation et bouton principal suivant.

Les tests d’interface vérifient la temporisation réelle sur des interactions ciblées. Le parcours intégral utilise ensuite l’horloge virtuelle de Playwright pour accélérer les répétitions ; il ne mesure pas la vitesse d’un élève. Les essais audio vérifient le signal et sa programmation, pas la qualité du timbre perçue sur un téléphone réel.
