# Recette navigateur

Python, Playwright et Chromium sont nécessaires. Les outils de recette restent hors du ZIP FTP ; l’application n’a aucune dépendance d’exécution.

Pour la v0.16, après `npm start` :

```sh
python tools/qa/onboarding.py
python tools/qa/v016.py
python tools/qa/pilot-layout.py
python tools/qa/pilot-full.py
python tools/qa/reward.py
npm run package
python tools/qa/package-offline.py
```

- `onboarding.py` : six instruments, huit formats, commandes accessibles, accordages personnalisés, écoute et sauvegarde des préférences.
- `v015.py` (historique, démonstrations remplacées en v0.16) : réponses espacées de 100 ms, erreurs sans attente, corrections simultanées, roue active et dimensionnée sur cinq formats, indice retiré après une réponse et sauvegarde après aide, boutons de position persistants, préécoute de toutes les cordes, thème suivant le système, carte chromatique, second anneau conditionnel, leçon tactile sans réponse dévoilée et zoom arrière d’une seconde.
- `pilot-full.py` : vingt-deux activités standard, types séparés, séries cumulatives, motifs, résultats et bouton suivant. Les questions ne sont pas évaluées à une vitesse humaine dans ce test.
- `package-offline.py` : fichiers servis depuis un sous-répertoire FTP, images en cache et démarrage hors connexion.

Variables : `ADH_BASE_URL` (défaut `http://localhost:4173/`), `CHROMIUM_BIN` (défaut `/usr/bin/chromium`), `ADH_QA_OUTPUT` (défaut `/tmp/adh-pilot-qa`). Chaque script utilise un contexte neuf. Les captures servent à la revue visuelle, sans comparaison automatique de pixels.

`npm test` vérifie aussi les quotas sur de nombreux tirages et accordages, la géométrie commune, les états des composants, les sauvegardes, les corrections et la séparation des records. Les tests de son vérifient le signal et sa programmation ; l’écoute sur téléphone reste nécessaire pour apprécier le timbre.

Les autres scripts de ce dossier conservent des scénarios historiques, notamment les attentes de correction de 500/1 000 ms et la préparation de 1,5 seconde des v0.10–v0.14. Ils ne constituent plus la recette de ces comportements remplacés en v0.15. Les exigences encore valides sont reprises dans les tests Node ou dans les quatre scripts ci-dessus.

- `v016.py` : même SVG et mêmes cibles conservés après huit réponses, dimensions stables, absence de ripple, cinq formats, boutons persistants, cible verte nommée dans la démonstration, thème accessible, double roue.
- `pilot-layout.py` : six instruments × cinq formats, cibles et axes cadrés.

- `reward.py` : phrase accompagnée programmée dans Web Audio et arrêt de l’écoute.
