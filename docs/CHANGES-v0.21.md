# v0.21 — Des succès qui avancent, des réglages plus clairs

Livraison du 18 octobre 2026. Le parcours reste celui du pilote 0–4 : aucun chapitre pédagogique supplémentaire n’est créé. Les chapitres seront définis ultérieurement, conformément à la précision du porteur du projet.

## Succès : des titres plus joueurs

Les identifiants, conditions et preuves sont conservés. Seuls les titres changent ; les titres des morceaux restent leurs véritables titres.

| Succès | Nouveau titre |
| --- | --- |
| Reconnaître et retrouver les cordes à vide | Les présentations sont faites |
| Réussir une famille et son mélange | Réunion de famille |
| Dernier mélange naturel | Le naturel revient au galop |
| Dernier mélange complet | Le manche dans la poche |
| Séance sans faute et sans aide | Zéro accroc |
| Suite musicale terminée | Le fil du riff |
| Record de vitesse sur le même exercice | Mon record prend la fuite |
| Sans faute en une seconde de moyenne maximum | Éclair de manche |
| Première phrase musicale collectionnée | Premier pressage |
| Trois phrases musicales différentes | Le club des vinyles |

Chaque carte affiche maintenant **une barre et un pourcentage**, y compris à 0 % et après son obtention. Une ligne courte précise ce qui avance : activités réussies, meilleur résultat sans aide, temps de référence ou phrases collectées. Les cartes débloquées gardent leur coche et leur preuve datée.

Le pourcentage est propre au défi :

- Repères : activités qualifiantes réalisées / activités nécessaires. Les critères d’absence d’aide et de diversité des positions restent appliqués lorsque requis.
- Sans faute : meilleur taux de réponses correctes sur une séance terminée sans aide.
- Record personnel : deux étapes explicites, établir une référence puis la battre **sur le même exercice et le même instrument**.
- Une seconde : rapprochement du meilleur temps sans faute ni aide vers la cible d’une seconde ; le temps réel est écrit sous la barre.
- Suites et pochettes : progression des questions, puis suite musicale à terminer. Une séance quittée peut donc afficher un avancement avant d’obtenir la récompense.
- Trois phrases : nombre de morceaux distincts collectés.

Un défi non obtenu reste sous 100 %, même lorsque des résultats incomplets semblent remplir un sous-critère. Ces indicateurs décrivent l’avancement vers une récompense, pas un pourcentage de maîtrise de l’instrument. Les règles d’obtention restent évaluées séparément à la fin d’une activité.

## Quitter, découvrir et régler

- « Quitter l’exercice » retourne **directement au parcours**, exactement comme « Retour au parcours ». Il n’ouvre plus la pause. La position de lecture de la liste est conservée pour chaque instrument pendant la navigation.
- Les futurs chapitres ne sont pas anticipés dans cette version : le retour à leur page précise sera raccordé quand ces pages existeront.
- Le plein écran change d’icône et de texte : quatre flèches vers l’intérieur pour sortir. L’état suit aussi une sortie déclenchée par le navigateur.
- Le son général utilise le composant partagé `icon-button sound-toggle`, avec état actif/coupé, libellé explicite et annonce accessible. Il concerne notes, démonstrations et mélodies. Les écoutes sont grisées lorsque le son est coupé.
- L’écoute de l’accordage dans les Paramètres utilise une icône **Play**.
- La découverte affiche un compteur bien visible, par exemple **2 / 3 emplacements à retrouver**. Dès que tous les emplacements exacts sont trouvés, les touches du manche et les boutons de réponse sont désactivés ; le bouton pour commencer l’exercice reste disponible.
- Sur les écrans courts, cette découverte garde son bouton visible grâce à une présentation compacte et à la suppression d’une consigne répétée.

## Onboarding

Le premier écran organise le texte et la configuration en deux colonnes sur grand écran, puis une colonne sur téléphone. La configuration est regroupée dans une carte. Titre, description et illustration s’alignent à gauche. Les avantages restent séparés de l’illustration.

Le SVG oblique occupe un emplacement de hauteur fixe et est positionné à l’intérieur de celui-ci : il ne peut plus repousser les autres éléments ni recouvrir les avantages. Sur les écrans trop courts, les éléments décoratifs s’effacent pour préserver les contrôles. Les boutons et listes gardent une hauteur tactile d’au moins 44 px. Le focus des listes reste visible, avec un contour plus fin et plus proche du champ.

## Mode débug temporaire

Dans **Paramètres → Mode débug → Simuler un parcours à 100 %** :

- Tous les exercices disponibles de l’instrument sont réussis à 100 %, avec des résultats permettant cinq étoiles.
- Toutes les positions de la zone sont travaillées dans les deux sens.
- Les succès disponibles sont obtenus via le **véritable évaluateur**, à partir de tentatives simulées valides. Pour les instruments standards actuels : 50 exercices, 10 succès généraux et 18 pochettes musicales vérifiées.
- Une bannière identifie la simulation ; les preuves et dates de cette collection simulée sont des données de test.
- Aucune progression simulée n’est écrite dans le stockage réel. L’export conserve les vrais résultats ; l’import est refusé pendant la simulation.
- **Retrouver mes vrais résultats** restaure le parcours initial. Un rechargement termine également la simulation. Changer d’instrument la termine avant d’ouvrir la configuration.

Ce mode est réservé aux versions v0, avec un garde-fou dans l’interface et dans le générateur. Avant V1, supprimer aussi physiquement le panneau, le générateur et ses références de livraison.

## Livraison et limites

[Archive FTP](../downloads/daily-fretboard-trainer-v0.21.zip). Décompresser et déposer son **contenu** dans `adh-pwa/v0.21/`, puis ouvrir `https://media.lecompositeur.com/adh-pwa/v0.21/`. Aucun transfert FTP n’est réalisé automatiquement.

Comme convenu pour toutes les v0, cette nouvelle version démarre avec une progression vide et conserve instrument et préférences. La protection des vrais résultats du mode débug concerne les résultats de cette même v0.21.

Cette livraison ne réalise pas encore le parcours complet au-delà de la zone 0–4 ni le paiement et l’essai de sept jours prévus pour V1. Les sept arrangements suspendus lors de l’audit musical v0.20 restent suspendus ; le mode débug ne contourne pas cette vérification.

[Validation et captures](v0.21/validation.md).
