# Validation v0.19

Recette du 17 octobre 2026. Chromium sans interface, application servie localement, puis paquet FTP testé sous `/dist/`. Les captures et historiques de recette utilisent des résultats fictifs ; ils ne démontrent pas un effet pédagogique réel.

| Contrôle | Résultat |
|---|---|
| Syntaxe des modules d’exécution | `npm run check` réussi |
| Tests Node | **95 tests réussis**, aucun échec |
| Parcours | 50 activités parcourues, ≥20 questions par activité, réussite et navigation suivantes, aucune tentative dupliquée, aucune erreur JavaScript |
| Nouveau répertoire, après son enrichissement | 25 suites différentes jouées dans Chromium ; 12 familles servies par des départs d’octaves ; 25 pochettes correctement attribuées |
| Correction et aide | Un seul point cible rouge, nom conservé pendant le délai de lecture ; roue par hauteur ; aide partagée manche/tableau et effacée après réponse |
| Découverte | Mauvais point rouge remplacé au prochain toucher, repères trouvés conservés |
| Succès | Obtention, dédoublonnage, preuves, export/import, réouverture, filtres persistants, vue liste et lecture/arrêt vérifiés |
| Chronométrage et musique | Délai final de 300 ms vérifié ; mauvaise note remet la chaîne à zéro ; phrase complète automatiquement jouée et arrêtable |
| Configuration | Six instruments × huit formats, de 240×320 à 1280×720 ; contrôles accessibles sans défilement, accordage et aperçu sonore conservés |
| Gameplay | Six instruments × cinq formats ; toutes les cases cadrées, boutons accessibles dans le bon ordre |
| Schémas de découverte | 20 compositions d’écran vérifiées ; pas de chevauchement entre numéros et noms à vide dans la recette dédiée |
| Introduction des passages musicaux | 15 compositions vérifiées, y compris paysage 568×320 ; commandes Écouter/À moi d’essayer visibles |
| Résultat avec nouveaux succès | Six formats, de 240×320 à 1280×720 ; boutons dans l’écran, annonce compacte sur écran court |
| Thèmes et collection | Quatre palettes et suivi de l’appareil ; cinq formats de collection, sans débordement horizontal |
| Distribution | Chargement sous un sous-dossier, cache des six images d’instruments, configuration et parcours accessibles hors ligne |

## Scripts reproductibles

- `tools/qa/v019.py`
- `tools/qa/music-v019.py`
- `tools/qa/music-lessons-v019.py`
- `tools/qa/result-fit-v019.py`
- `tools/qa/pilot-full.py`
- `tools/qa/onboarding.py`
- `tools/qa/pilot-layout.py`
- `tools/qa/lessons-v018.py`
- `tools/qa/reward.py`
- `tools/qa/package-offline.py`

## À vérifier sur de vrais appareils et avec des joueurs

Installation Android/Brave, latence sonore du téléphone, lisibilité en lumière extérieure et avec différents besoins visuels. Pour les succès, observer la compréhension des critères et l’envie de pratiquer plutôt que la simple accumulation. Pour les extraits, vérifier que les départs très courts évoquent bien le morceau après l’écoute de la phrase accompagnée. Cette validation humaine constitue S7 de la roadmap Succès ; la synchronisation entre appareils reste S8/phase 8.
