# Validation v0.22

- **112 tests Node réussis**, dont les nouvelles vérifications des registres, de la tonalité, des tempos, des longs buffers et du démarrage après synthèse.
- `npm run check` : syntaxe JavaScript vérifiée.
- PHP 8.4 local : syntaxe et exécution du relais vérifiées avec capture de courriel, sans envoi réel. Destinataire et objet décodé exacts, Reply-To facultatif, rejet des injections d’en-têtes, jetons et origine, limite d’essais.
- Formulaire Chromium : validation des champs, confirmation après capture, erreurs réseau/serveur avec texte conservé, fermeture au clavier, retour du focus et quatre tailles d’écran.
- Cartes de succès : date et bouton sur la même ligne dans trois catégories et quatre tailles. Couleurs calculées du thème accessible conformes aux valeurs demandées.
- Mode débug : 50 activités terminées et tous les succès disponibles ; sauvegarde réelle inchangée.
- Cohérence musicale : 108 affectations sur six instruments standards vérifiées dans le navigateur ; début de récompense identique aux hauteurs de l’exercice.
- 18 suites musicales terminées dans le jeu, avec leurs preuves de collection enregistrées.
- 18 arrangements exécutés dans Web Audio : départs programmés après la préparation des sons, buffers couvrant les tenues et périodicité de la première note compatible avec le registre de l’exercice. Ce contrôle technique ne remplace pas une comparaison perceptive avec un enregistrement.
- Dossier FTP testé sous `/dist/`, installation de ses ressources puis onboarding et parcours hors ligne.

Les essais utilisent Chromium/Linux. La réception effective du courriel sur o2switch et l’écoute de validation sur le téléphone du porteur de projet restent à faire. L’audit musical décrit séparément les limites de deux relectures externes ; ces limites ne sont pas transformées en tests prétendument réussis.

## Captures

- [Formulaire et message d’échec sans perte du texte](bug-form.png).
- [Confirmation après capture locale](bug-confirmation.png).
- [Parcours en thème Inclusif-Contrasté](course-accessible.png).
- Cartes : [repères](success-landmarks.png), [fluidité](success-fluency.png), [musiques](success-music.png).

Les succès visibles sont des résultats simulés du mode débug.
