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

## Recette v0.21

`v021.py` : onboarding, retour au parcours, découverte figée, états natifs du plein écran, Mute, collection et mode débug réversible.
`discovery-v021.py` : compteur et bouton visibles sur six instruments et cinq tailles.
Les scripts génériques `onboarding.py`, `pilot-layout.py` et `package-offline.py` complètent cette recette.

## Recette v0.22

`mail-v022.py` exige le serveur PHP local sur 127.0.0.1:4174 avec un `sendmail_path` de capture. Il ne doit jamais être utilisé pour envoyer vers une boîte réelle. `v022.py` utilise le même serveur de capture pour vérifier le formulaire et les cartes. `audio-runtime-v022.py` contrôle les 18 arrangements dans Web Audio. `music-v020.py` reste utilisable pour terminer les 18 suites. Les tests génériques de paquet et les tests Node complètent la recette.

## Recette bêta v0.24

Après `npm start` :

```sh
python tools/qa/beta-browser.py
python tools/qa/beta-offline.py
npm run package
ADH_BASE_URL=http://localhost:4173/dist/ python tools/qa/beta-offline.py
```

`beta-browser.py` contrôle 25 dispositions, sept parties complètes et neuf cours, ainsi que la simulation réversible de progression. `beta-offline.py` vérifie les nouveaux modules précachés, les cours hors ligne, la correction d’octave, la stabilité du manche et les commandes sur petit écran. Ces deux scripts constituent la recette du nouveau catalogue ; les anciens scénarios aux nombres fixes d’activités ne décrivent plus ce catalogue. Les variables `ADH_BASE_URL` et `ADH_QA_OUTPUT` permettent de choisir la cible et le dossier des rapports. Un contrôle sur iPhone réel reste nécessaire.


## Recette v0.25

`python tools/qa/v025.py` reproduit la reprise après rechargement, la séparation de la démonstration, les variantes de cours après erreur, les trois branches, les cibles 0–24, la barre de défilement et le bilan guidé. Il contrôle aussi quatre thèmes sur quatre formats et mesure le coût de préparation de deux notes dans un AudioContext Chromium réel ; cette mesure ne représente pas la latence acoustique du matériel Windows. `beta-browser.py` et `beta-offline.py` sont adaptés à la nouvelle navigation. Les tests Node couvrent également la conservation des acquis après rotation du journal et la calibration des timbres.

## Recette v0.27

- `python tools/qa/refinement-v027.py` : neuf configurations du manche, roues naturelles/chromatiques, entrées rapides, quatre thèmes de progrès, état Parfait et rapport réel de la poignée de défilement ; vérifie aussi que le bouton Essayer n'hérite pas d'un filtre gris.
- `python tools/qa/collection-v027.py` : collection Tout, vingt dispositions, commandes, critères, mouvement souris/tactile et audio. La vue alternative Liste est retirée.
- `python tools/qa/collection-offline-v027.py` : utilise le ZIP extrait dans `work/v027/ftp-check/` ; vérifie son démarrage et ses ressources hors ligne. Le test exige le paquet préparé, extrait à cet endroit et servi par `npm start`.

Les captures et résultats sont écrits dans `docs/v0.27/`. Le chiffre de 59 cartes concerne un profil guitare 6 standard neuf de cette version ; les cartes historiques acquises et les autres accordages peuvent changer le total.

## Recette v0.28

- `python tools/qa/cards-touch-v028.py` : vrais événements tactiles injectés par CDP Chromium. Un contact et un mouvement de trois pixels doivent déjà modifier le reflet. Vérifie ensuite le glissement, le retour à plat, le défilement vertical, les boutons et la réduction du mouvement.
- `python tools/qa/celebration-v028.py` : termine une activité avec ses réponses, parcourt plusieurs succès, contrôle seize dispositions du résultat, puis ouvre la carte exacte avec focus et filtres adaptés.
- `python tools/qa/celebration-music-v028.py` : termine une activité de recherche et sa suite pour obtenir Higher Ground, puis vérifie trois formats avec pochette et lecteur audio.
- `python tools/qa/refinement-v028.py` : vérifie la géométrie v0.23 sur neuf configurations, les roues, les réponses rapides et les progrès.
- `python tools/qa/collection-offline-v028.py` : vérifie le ZIP extrait dans `work/v028/ftp-check/`, notamment le nouveau module de célébration précaché.

Rapports et captures dans `docs/v0.28/`. Ces tests ne remplacent pas une manipulation sur un iPhone physique.
