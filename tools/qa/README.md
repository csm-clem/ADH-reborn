# Recette navigateur

Python, Playwright et Chromium sont nécessaires. Les outils de recette restent hors du ZIP FTP ; l’application n’a aucune dépendance d’exécution.

Pour la v0.18, après `npm start` :

```sh
python tools/qa/onboarding.py
python tools/qa/v018.py
python tools/qa/lessons-v018.py
python tools/qa/last-correction-v018.py
python tools/qa/services.py
python tools/qa/pilot-layout.py
python tools/qa/pilot-full.py
python tools/qa/reward.py
npm run package
python tools/qa/package-offline.py
```

- `onboarding.py` : six instruments, huit formats, commandes accessibles, accordages personnalisés, écoute et sauvegarde des préférences.
- `v015.py` (historique, démonstrations remplacées en v0.16) : réponses espacées de 100 ms, erreurs sans attente, corrections simultanées, roue active et dimensionnée sur cinq formats, indice retiré après une réponse et sauvegarde après aide, boutons de position persistants, préécoute de toutes les cordes, thème suivant le système, carte chromatique, second anneau conditionnel, leçon tactile sans réponse dévoilée et zoom arrière d’une seconde.
- `pilot-full.py` : cinquante activités standard, types séparés, séries cumulatives, motifs, résultats et bouton suivant. Les questions ne sont pas évaluées à une vitesse humaine dans ce test.
- `package-offline.py` : fichiers servis depuis un sous-répertoire FTP, images en cache et démarrage hors connexion.

Variables : `ADH_BASE_URL` (défaut `http://localhost:4173/`), `CHROMIUM_BIN` (défaut `/usr/bin/chromium`), `ADH_QA_OUTPUT` (défaut `/tmp/adh-pilot-qa`). Chaque script utilise un contexte neuf. Les captures servent à la revue visuelle, sans comparaison automatique de pixels.

`npm test` vérifie aussi les quotas sur de nombreux tirages et accordages, la géométrie commune, les états des composants, les sauvegardes, les corrections et la séparation des records. Les tests de son vérifient le signal et sa programmation ; l’écoute sur téléphone reste nécessaire pour apprécier le timbre.

Les autres scripts de ce dossier conservent des scénarios historiques, notamment les attentes de correction de 500/1 000 ms et la préparation de 1,5 seconde des v0.10–v0.14. Ils ne constituent plus la recette de ces comportements remplacés en v0.15. Les exigences encore valides sont reprises dans les tests Node ou dans les quatre scripts ci-dessus.

- `v016.py` : même SVG et mêmes cibles conservés après huit réponses, dimensions stables, absence de ripple, cinq formats, boutons persistants, cible verte nommée dans la démonstration, thème accessible, double roue.
- `pilot-layout.py` : six instruments × cinq formats, cibles et axes cadrés.

- `reward.py` : phrase accompagnée programmée dans Web Audio et arrêt de l’écoute.

- `services.py` : contexte audio unique, préférences communes, thème système actif et restauration de sauvegarde après changement d’instrument.

- `v018.py` : 50 activités, exemples nommés de toute une famille, découverte sans cible révélée, bascule de boutons immobile, erreur lisible 500 ms avant fondu et choix dièses/bémols conservant la question.
- `lessons-v018.py` : vingt dispositions de micro-leçons et commandes toutes visibles.
- `reward.py` : chaîne remise à zéro sur erreur et phrase complète accompagnée lancée automatiquement après réussite.

- `last-correction-v018.py` : dernière erreur lisible avant le résultat, centre du zoom stable et aucune réponse finale dupliquée.

### v0.19

`v019.py` vérifie les corrections, les octaves, les indices partagés, les succès et les thèmes. `result-fit-v019.py` vérifie les 300 ms après la dernière note et six formats de résultats. `pilot-full.py` parcourt les 50 activités ; `onboarding.py`, `pilot-layout.py`, `lessons-v018.py` et `package-offline.py` restent applicables à la version courante. Les captures de test ne représentent pas des résultats réels d’élèves.

`music-v019.py` joue les 25 passages différents et vérifie leurs obtentions. `music-lessons-v019.py` vérifie 15 présentations de passages musicaux sur petits écrans.

## Recette v0.20

`v020.py` : corrections sur le manche, roue de hauteurs, indice, succès et thèmes.
`details-v020.py` : couleurs calculées, ordre des calques, bordure 1 pt, contrastes, alignement et brouillon de bug.
`music-v020.py` : les 18 passages conservés sont joués et leurs succès enregistrés.
`reward-v020.py` : remise à zéro de la chaîne, dernière note puis lecture accompagnée.
Les outils génériques `onboarding.py`, `pilot-layout.py`, `pilot-full.py`, `result-fit-v019.py` et `package-offline.py` restent utilisables ; les noms de certains scripts rappellent leur version d’introduction.
