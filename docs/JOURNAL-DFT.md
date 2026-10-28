# Daily Fretboard Trainer — Journal des modifications

⭐️ Nouveautés · ⚙️ Améliorations · 🐛 Corrections · 🎉 Événements

Les entrées décrivent uniquement les versions publiées en live. Les essais intermédiaires restent dans le bac à sable et sont regroupés lors de leur promotion. Historique rédigé depuis les rapports du dépôt ; aucune date non corroborée n’est ajoutée.

## v0.38 — Un jeu plus fluide et un parcours plus direct

- ⭐️ Tous les parcours implémentés sont accessibles dès l’ouverture : zones jusqu’à la case 24, chaque corde, duos voisins et cordes mélangées.
- ⚙️ Le catalogue ne dépend plus d’un lien de prévisualisation ; les résultats existants restent conservés.
- ⭐️ Le journal permet de filtrer les nouveautés, améliorations, corrections et événements.
- ⚙️ Dépliez ou repliez toutes les versions du journal en un geste.
- ⚙️ Les releases sont nommées v0.x et leurs essais v0.x.y, avec un compteur indépendant pour chaque prochaine release.
- 🐛 La mise à jour du bac à sable retélécharge les fichiers cohérents sans effacer les progrès ; une page de réparation récupère les anciennes installations bloquées.
- ⚙️ La version v0.x.y reste visible dans le lab et le mode débug apparaît en premier dans les paramètres.
- ⭐️ Un balayage vers la gauche remonte d’un niveau dans Parcours, sans détourner les gestes sur le manche.
- 🐛 Corrections rythmiques de Seven Nation Army et Feel Good Inc., montée d’Around the World et retour d’Immigrant Song avec son appel vocal sur le riff saturé.
- 🐛 Les mises à jour ne se bloquent plus pendant le téléchargement des fichiers volumineux ; la migration depuis les anciennes versions conserve les progrès.
- ⚙️ Les fonds, cartes et surfaces de navigation se distinguent dans les quatre thèmes.
- ⚙️ Les textes secondaires et les libellés blancs sur les dégradés gagnent en contraste.
- ⚙️ Les titres de page, de section et de chapitre suivent une hiérarchie commune.
- ⭐️ Un fil d’Ariane réel sur ordinateur et un retour parent explicite sur mobile indiquent votre position.
- ⭐️ Le retour et l’avance du navigateur suivent les pages visitées dans l’application.
- ⭐️ L’accueil propose un accès direct à la séance à reprendre ou à la prochaine activité.
- ⚙️ Parcours, Progrès, Succès et Réglages portent les mêmes noms sur chaque appareil ; l’onglet actif se repère aussi par sa forme.
- ⭐️ La pratique ciblée se parcourt par Zones, Cordes, Duos et Mélanges.
- ⚙️ Les retours restaurent le défilement et les sections ouvertes du parcours.
- ⚙️ Les choix et réglages utilisent des grilles adaptées aux ordinateurs, avec une lecture confortable.
- ⭐️ La page Progrès présente la prochaine étape et la dernière activité réussie avant la carte du manche.
- ⚙️ Les réglages sont regroupés par instrument, jeu et son, apparence, sauvegardes et aide.
- ⭐️ Les chapitres affichent À commencer, En cours ou Terminé, avec texte et symbole, et signalent la prochaine séance.
- 🐛 Le raccourci de révision affiche le nom de l’activité qu’il lance réellement.
- 🐛 Après réouverture sur un chapitre, le Retour du navigateur remonte vers ses parents ; un rechargement ne duplique pas l’historique.
- ⚙️ La consigne reste au-dessus du manche et des réponses, visible pendant l’appui ; les écrans étroits et peu hauts conservent les commandes utiles.
- ⚙️ Les activités Nommer et Retrouver expliquent le geste attendu avant le lancement, sans étape obligatoire supplémentaire.
- ⚙️ La découverte explique le nombre d’emplacements restant à trouver avant de poursuivre ; l’écoute coupée indique comment la réactiver.
- ⚙️ Les introductions montrent graphiquement où regarder et où répondre, sans indiquer la réponse évaluée.
- ⚙️ Le clavier permet de naviguer sur le manche et dans Progrès, de mettre en pause avec Échap et de retrouver le focus après une fenêtre ; les touches sont documentées.
- ⚙️ Un balayage vers la droite revient à la page précédente ; vers la gauche, il retrouve une page déjà visitée. Le manche et les cartes gardent leurs gestes propres.
- 🐛 Les manches longs partagent les proportions graphiques du manche court : cordes, frettes, inlays, marges et fondus de défilement.
- ⚙️ Les fibres de l’Érable miel et de Studio nuit sont légèrement renforcées ; Studio nuit retrouve un bois brun et un relief plus naturel.
- ⚙️ Le catalogue affiche à nouveau simultanément Zones, Cordes, Duos et Mélanges, sans onglets filtrants.
- ⚙️ Les chapitres se distinguent par ＋ À commencer, ▶ En cours et ✓ Terminé, avec leur libellé.
- ⚙️ La destination active adopte la même surface contrastée sur ordinateur et mobile ; les boutons mobiles occupent toute la hauteur de la barre.
- ⚙️ Les mises à jour réutilisent les fichiers inchangés à partir de leurs empreintes vérifiées ; elles évitent une seconde installation de réparation et affichent la préparation.
- 🐛 Le téléchargement du nouveau service worker attend l’accord du joueur ; refuser garde la version courante et la proposition revient au prochain démarrage.
- ⚙️ Aide et Sauvegardes et mises à jour utilisent les mêmes séparations fines que les autres réglages.
- ⚙️ Le manche se place au-dessus des réponses sur tous les écrans, avec une hauteur proportionnelle d’environ 250 px sur un écran FHD.
- ⚙️ Le contenu suit le balayage de la page et la transition de retour ou d’avance se termine par un mouvement court, désactivé si les animations sont réduites.
- ⚙️ Le mouvement tactile des cartes utilise un amortissement régulier et une translation plus mesurée pour des reflets fluides.
- 🐛 Les manches longs des introductions et leçons conservent une hauteur lisible et défilent horizontalement sans déplacer les consignes.
- ⭐️ Les pourcentages du manche reflètent les vingt dernières réponses à chaque emplacement ; les validations et succès restent conservés.
- ⚙️ Chaque famille de notes enchaîne Découvrir, Nommer les notes et Retrouver les notes, avec les notes précédemment apprises.
- ⚙️ Les présentations d’activités retirent les mentions du nombre de questions et le mot mélangées.
- ⚙️ Le logo reprend le dégradé sunrise ; le lab utilise sa variante bleue, y compris pour ses icônes PWA.
- ⚙️ Les repères de focus ne s’affichent qu’après utilisation de Tab, tout en conservant les commandes accessibles au clavier.
- 🐛 La découverte conserve son bouton de poursuite visible sur les petits écrans, avec des espacements adaptés.
- 🐛 Toutes les cordes des manches réduits conservent une zone tactile valide ; les schémas longs utilisent une seule zone de défilement.

## v0.37 — Des cours plus courts et mieux cadrés

- 🐛 Les exemples et les nouveaux essais restent sur les cordes du duo ou de l’activité choisie.
- ⚙️ Les cours jusqu’à la case 24 proposent un manche continu défilable, avec les boutons de réponse en option.
- ⚙️ Les cours de correspondances présentent chaque relation utile une fois, sans enchaîner des dizaines d’exemples identiques.

## v0.35 — Un manche continu pour les 24 cases

- ⚙️ Le guide du manche dispose de sa propre section, distincte des réglages de confort et du plein écran.
- ⭐️ Les activités 0–24 de la prévisualisation utilisent un manche défilable au doigt et par glisser à la souris.
- ⚙️ Chaque case garde au moins 44 pixels de largeur. Barre de défilement et fondu indiquent la suite du manche.
- 🐛 Faire glisser le manche ne valide aucune réponse. Les boutons restent en option et les activités 0–12 conservent leur affichage.

## v0.34 — Des sauvegardes mieux protégées

- 🐛 Les préférences illisibles ou issues d’un format futur sont conservées, sans remplacement silencieux. Une restauration valide rétablit la sauvegarde.
- ⚙️ Vérification automatique des nouveaux modules JavaScript et de toutes les ressources nécessaires au mode hors ligne.
- ⚙️ Préparation technique du parcours étendu ; le parcours courant reste inchangé en attendant la recette de l’affichage 0–24.

## v0.33 — Votre collection, en poche

- ⭐️ Vue Album à trois cartes par ligne, avec ouverture interactive en grand.
- ⚙️ Les cinq finitions de la v0.32 habillent aussi les couvertures de l’Album.
- 🐛 Glissement horizontal des cartes distinct du défilement vertical ; filtres À faire et En cours séparés.
- ⚙️ Parcours reprend votre dernière page ; un second appui ramène aux branches. Doubles coches plus compactes.
- ⚙️ Rythme de Seven Nation Army corrigé, descente d’Around the World détachée et nouveau défi Feel Good Inc.

## v0.32 — Cinq matières à collectionner

- ⚙️ Papier d’atelier, aluminium brossé, opale bleue, argent nacré et or gravé : finitions distinctes selon la rareté.
- ⚙️ Matières adaptées aux thèmes Studio Nuit, Inclusif-contrasté et Papier, avec textures dans les marges.

## v0.31 — Des boutons plus nets et un journal intégré

- ⭐️ Consultez le journal des modifications depuis les Paramètres, même hors ligne.
- ⚙️ Boutons principaux : dégradé horizontal orange vers rouge, puis bleu clair vers indigo au survol. Boutons secondaires : gris vers bleu ardoise.
- 🐛 Suppression de l’ombre du texte et du contour visible des boutons.

## v0.30 — Sunrise, sauvegardes et clavier

- ⭐️ Déplacez-vous sur le manche au clavier avec les flèches et les touches Début et Fin.
- ⚙️ Sauvegardes exportées avec un format identifié ; les anciens exports restent compatibles.
- ⚙️ Préparation et vérification des mises à jour automatisées.

## v0.29 — Tout l’instrument en vue

- ⚙️ Les exercices sur une corde montrent toutes les cordes de l’instrument. Les boutons de réponse restent facultatifs en portrait.
- ⭐️ Sur ordinateur, saisissez et faites glisser la carte des progrès.
- ⚙️ Reflets des cartes de succès plus discrets et contrastes renforcés.

## v0.28 — Vos succès prennent vie

- ⭐️ Une animation annonce les succès débloqués et permet de retrouver leur carte dans la collection.
- 🐛 Reflets des cartes activés dès le contact tactile.
- ⚙️ Proportions du manche rétablies et texture de bois vectorielle légère.

## v0.27 — Des repères plus lisibles

- 🐛 Les roues de réponse proposent toutes les notes naturelles ou chromatiques nécessaires.
- ⭐️ Un niveau « Parfait » complète la carte des progrès, avec une double coche.
- ⚙️ Cartes non acquises désaturées, filtre Tout et barre de défilement proportionnelle.

## v0.26 — Une collection interactive

- ⭐️ Cartes de succès interactives, cinq niveaux de rareté et reflets suivant la souris ou le doigt.
- ⚙️ Critères au verso, progression visible et commandes de défi et d’écoute accessibles sur les cartes.

## v0.25 — Un parcours mieux guidé

- ⚙️ Le parcours s’organise en trois branches : Grand Débutant, Progression guidée et Pratique ciblée.
- ⭐️ Carte unique des progrès, de la corde à vide à la case 24.
- 🐛 Reprise de séance et conservation des acquis renforcées.

## v0.24 — Les Premiers Parcours

- 🎉 Arrivée de la bêta des Premiers Parcours.
- ⭐️ Quatre chapitres Grand Débutant, trois zones du manche, les trois premières cordes ciblées jusqu’à 12 et un premier niveau guidé.
- ⚙️ Cours visuels et bilans adaptés à l’instrument.

## v0.23 — Bien débuter, garder ses progrès

- ⭐️ Configuration guidée en trois écrans et tutoriel facultatif du manche.
- ⭐️ Mises à jour proposées à l’utilisateur et conservation des progrès entre versions bêta.
- ⚙️ Aide à l’installation sur iPhone et préparation de l’audio améliorées.

## v0.22 — Un problème à signaler ?

- ⭐️ Formulaire de signalement de bug dans l’application.
- ⚙️ Récompenses musicales et lisibilité des succès améliorées.

## v0.21 — Des défis qui avancent

- ⚙️ Noms des succès plus joueurs et progression d’accomplissement visible.
- 🐛 Retour au parcours et commandes des paramètres clarifiés.

## v0.20 — Manche et collection plus clairs

- ⚙️ Contrastes, carte des progrès et présentation de la collection améliorés.
- 🐛 Correction du retour visuel des mauvaises réponses sur le manche.

## v0.19 — Votre collection de succès

- ⭐️ Première collection de succès, critères et progression sauvegardée.
- ⭐️ Quatre palettes coordonnées : Atelier, Studio Nuit, Inclusif-contrasté et Papier.

## v0.18 — Apprendre par familles de notes

- ⭐️ Nouveau parcours par familles : découverte des emplacements, puis mélanges avec les notes déjà apprises.
- ⭐️ Choix entre dièses et bémols dans les paramètres et les exercices.
- ⚙️ Micro-leçons et enchaînement des récompenses musicales revus.

## v0.17 — Des fondations plus robustes

- ⚙️ Services partagés pour le son, les données et le fonctionnement de l’application.
- 🐛 Sauvegardes et restauration renforcées.

## v0.16 — Un manche stable

- 🐛 Le manche reste stable pendant les interactions.
- ⚙️ Démonstrations revues et passage au temps moyen pour mesurer la fluidité.

## v0.15 — Un jeu qui s’enchaîne

- ⭐️ Entraînement cumulatif et indice affichant les noms au départ du manche.
- ⚙️ Réponses enchaînées immédiatement et schémas de manche partagés.

## v0.14 — Plus de réactivité

- ⚙️ Styles des commandes centralisés et visualisation des progrès revue.
- 🐛 Notes jouables à la suite sans attendre la fin du son précédent.

## v0.13 — Des résultats plus clairs

- ⚙️ Fiche de résultat reconstruite, écoute et timbres améliorés.
- ⭐️ Extraits musicaux dans les suites finales.

## v0.12 — Vos records personnels

- ⭐️ Résultats enrichis et records personnels comparés au même exercice.
- ⭐️ Bouton pour écouter le son choisi dans les paramètres.
- ⚙️ Transitions et démarrage du chronométrage revus.

## v0.11 — Des exercices mieux nommés

- ⚙️ Titres par sujet d’étude, sous-titres par activité et choix des timbres dans les paramètres.

## v0.10 — Des parties plus courtes

- ⚙️ Nommer et retrouver sont séparés en activités distinctes, avec des séries plus courtes.
- ⚙️ Retours visuels et fiche de résultat simplifiés.

## v0.9 — Des premiers pas plus visuels

- ⭐️ Illustrations d’instruments fournies pour la configuration.
- 🐛 Corrections vertes associées à la hauteur demandée.
- ⚙️ Explications à la première rencontre d’un type d’exercice.

## v0.8 — Daily Fretboard Trainer

- 🎉 L’application prend le nom Daily Fretboard Trainer.
- ⚙️ Manche visible, résultats et configuration des instruments améliorés.

## v0.7 — Votre accordage à vous

- ⭐️ Accordages courants et éditeur personnalisé avec écoute des cordes.

## v0.6 — Un jeu plus fluide

- ⚙️ Manche agrandi, confort tactile et ordre des cordes harmonisés.

## v0.5 — Premier pilote pédagogique

- ⭐️ Parcours adapté au profil instrumental et premières activités pédagogiques du pilote.

## v0.4 — Prêt à jouer

- ⭐️ Préparation visuelle avant les questions et disposition adaptée au portrait et au paysage.
- ⚙️ Manche clair et repères plus lisibles.

## v0.3 — Comprendre et répondre

- ⚙️ Micro-leçons, consignes, réponses tactiles et présentation des résultats améliorées.

## v0.2 — Premiers retours intégrés

- 🐛 Pause et chronométrage corrigés lors des changements d’orientation.
- ⚙️ Proportions du manche, timbre de guitare et confort de lecture améliorés.
