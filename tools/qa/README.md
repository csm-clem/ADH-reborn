# Recette navigateur du pilote v0.6

Le site n’a aucune dépendance d’exécution. Ces contrôles complémentaires demandent Python, le paquet `playwright` et Chromium ; ils ne sont pas inclus dans le ZIP FTP.

Démarrer le serveur avec `npm start`, puis depuis la racine du dépôt :

```sh
python tools/qa/pilot-browser.py
python tools/qa/pilot-backup-audio.py
python tools/qa/pilot-variants.py
python tools/qa/pilot-full.py
python tools/qa/pilot-layout.py
```

Exécuter `pilot-browser.py` avant `pilot-backup-audio.py` : il crée la sauvegarde servant aux essais d’import. Chaque script ouvre un contexte navigateur neuf. Le parcours intégral prend environ une minute car il conserve les vrais décomptes et les passages automatiques de 500 ms.

Variables facultatives : `ADH_BASE_URL` (défaut `http://localhost:4173`), `CHROMIUM_BIN` (défaut `/usr/bin/chromium`), `ADH_QA_OUTPUT` (défaut `/tmp/adh-pilot-qa`, captures et sauvegardes synthétiques).

Ces scripts saisissent automatiquement les bonnes réponses pour vérifier les transitions et les contrats de réponse. Ils ne constituent pas une étude de l’apprentissage. Les essais audio vérifient des buffers non silencieux et un contexte actif, sans juger la qualité perçue du timbre. Tester aussi sur un téléphone réel.

`pilot-layout.py` vérifie la roue immobile, les dimensions des panneaux sur sept tailles, la temporisation, la pause et ses commandes, le plein écran, les boutons accessibles et l’ordre des cordes.
