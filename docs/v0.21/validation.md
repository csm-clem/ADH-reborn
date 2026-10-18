# Validation v0.21

Recette automatisée sur Chromium local et tests Node ; pas encore une validation manuelle sur Android physique ni sur l’hébergement o2switch.

- `npm run check` : vérification syntaxique des modules.
- `npm test` : **107 tests réussis**. Les nouveaux tests vérifient notamment l’isolement du mode débug, sa réversibilité, son interdiction en V1, la validité des tentatives simulées, la couverture de toutes les positions pour les six instruments, le retour direct et le blocage de la découverte terminée.
- `tools/qa/onboarding.py` : six instruments et huit tailles d’écran ; pas de défilement de page ni de contrôles masqués ; accordage personnalisé, pagination, sons et notation conservés.
- `tools/qa/v021.py` : huit tailles pour l’alignement et l’emplacement fixe de l’illustration ; retour direct au parcours avec position de lecture conservée ; découverte terminée figée ; plein écran natif et sortie externe ; bouton de son général ; icône Play ; pourcentage sur chaque carte ; tous les succès et les 50 exercices simulés ; sauvegarde réelle inchangée après navigation, arrêt et rechargement ; réponses rapides conservées.
- `tools/qa/pilot-layout.py` : six instruments × cinq tailles ; manche, réponses et axes cadrés, boutons accessibles ordonnés de l’aigu au grave.
- `tools/qa/discovery-v021.py` : six instruments × cinq tailles ; compteur et bouton de découverte visibles, y compris en paysage 568 × 320.
- `tools/qa/package-offline.py` : démarrage du dossier FTP depuis `/dist/`, six images d’instruments en cache, onboarding et parcours accessibles hors ligne.

La collection de test comprend 6 succès de repères, 2 de fluidité et 20 éléments musicaux : 2 succès généraux et 18 pochettes. Les captures montrant ces récompenses sont des **simulations**, pas des résultats d’élèves.

## Captures

- [Accueil ordinateur](onboarding-1280.png), [téléphone](onboarding-375.png), [paysage](onboarding-844.png).
- [Découverte terminée](discovery-complete.png).
- [Repères](collection-landmarks.png), [fluidité](collection-fluency.png), [musiques](collection-music.png).
- [Progrès simulés](debug-progress.png).
