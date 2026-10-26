/** Player-facing history, curated from docs/CHANGES-v*.md. No planned features. */
export const CHANGE_TYPES=Object.freeze({feature:['⭐️','Nouveautés'],improvement:['⚙️','Améliorations'],bug:['🐛','Corrections'],event:['🎉','Événements']});
export const RELEASE_HISTORY=Object.freeze([
 ['0.35','Un manche continu pour les 24 cases',[
 ['improvement','Le guide du manche dispose de sa propre section, distincte des réglages de confort et du plein écran.'],
 ['feature','Les activités 0–24 de la prévisualisation utilisent un manche défilable au doigt et par glisser à la souris.'],
 ['improvement','Chaque case garde au moins 44 pixels de largeur. Barre de défilement et fondu indiquent la suite du manche.'],
 ['bug','Faire glisser le manche ne valide aucune réponse. Les boutons restent en option et les activités 0–12 conservent leur affichage.']]],
 ['0.34','Des sauvegardes mieux protégées',[
 ['bug','Les préférences illisibles ou issues d’un format futur sont conservées, sans remplacement silencieux. Une restauration valide rétablit la sauvegarde.'],
 ['improvement','Vérification automatique des nouveaux modules JavaScript et de toutes les ressources nécessaires au mode hors ligne.'],
 ['improvement','Préparation technique du parcours étendu ; le parcours courant reste inchangé en attendant la recette de l’affichage 0–24.']]],
 ['0.33','Votre collection, en poche',[
 ['feature','Vue Album à trois cartes par ligne, avec ouverture interactive en grand.'],
 ['improvement','Les cinq finitions de la v0.32 habillent aussi les couvertures de l’Album.'],
 ['bug','Glissement horizontal des cartes distinct du défilement vertical ; filtres À faire et En cours séparés.'],
 ['improvement','Parcours reprend votre dernière page ; un second appui ramène aux branches. Doubles coches plus compactes.'],
 ['improvement','Rythme de Seven Nation Army corrigé, descente d’Around the World détachée et nouveau défi Feel Good Inc.']]],
 ['0.32','Cinq matières à collectionner',[
 ['improvement','Papier d’atelier, aluminium brossé, opale bleue, argent nacré et or gravé : finitions distinctes selon la rareté.'],
 ['improvement','Matières adaptées aux thèmes Studio Nuit, Inclusif-contrasté et Papier, avec textures dans les marges.']]],
 ['0.31','Des boutons plus nets et un journal intégré',[
 ['feature','Consultez le journal des modifications depuis les Paramètres, même hors ligne.'],
 ['improvement','Boutons principaux : dégradé horizontal orange vers rouge, puis bleu clair vers indigo au survol. Boutons secondaires : gris vers bleu ardoise.'],
 ['bug','Suppression de l’ombre du texte et du contour visible des boutons.']]],
 ['0.30','Sunrise, sauvegardes et clavier',[
 ['feature','Déplacez-vous sur le manche au clavier avec les flèches et les touches Début et Fin.'],
 ['improvement','Sauvegardes exportées avec un format identifié ; les anciens exports restent compatibles.'],
 ['improvement','Préparation et vérification des mises à jour automatisées.']]],
 ['0.29','Tout l’instrument en vue',[
 ['improvement','Les exercices sur une corde montrent toutes les cordes de l’instrument. Les boutons de réponse restent facultatifs en portrait.'],
 ['feature','Sur ordinateur, saisissez et faites glisser la carte des progrès.'],
 ['improvement','Reflets des cartes de succès plus discrets et contrastes renforcés.']]],
 ['0.28','Vos succès prennent vie',[
 ['feature','Une animation annonce les succès débloqués et permet de retrouver leur carte dans la collection.'],
 ['bug','Reflets des cartes activés dès le contact tactile.'],
 ['improvement','Proportions du manche rétablies et texture de bois vectorielle légère.']]],
 ['0.27','Des repères plus lisibles',[
 ['bug','Les roues de réponse proposent toutes les notes naturelles ou chromatiques nécessaires.'],
 ['feature','Un niveau « Parfait » complète la carte des progrès, avec une double coche.'],
 ['improvement','Cartes non acquises désaturées, filtre Tout et barre de défilement proportionnelle.']]],
 ['0.26','Une collection interactive',[
 ['feature','Cartes de succès interactives, cinq niveaux de rareté et reflets suivant la souris ou le doigt.'],
 ['improvement','Critères au verso, progression visible et commandes de défi et d’écoute accessibles sur les cartes.']]],
 ['0.25','Un parcours mieux guidé',[
 ['improvement','Le parcours s’organise en trois branches : Grand Débutant, Progression guidée et Pratique ciblée.'],
 ['feature','Carte unique des progrès, de la corde à vide à la case 24.'],
 ['bug','Reprise de séance et conservation des acquis renforcées.']]],
 ['0.24','Les Premiers Parcours',[
 ['event','Arrivée de la bêta des Premiers Parcours.'],
 ['feature','Quatre chapitres Grand Débutant, trois zones du manche, les trois premières cordes ciblées jusqu’à 12 et un premier niveau guidé.'],
 ['improvement','Cours visuels et bilans adaptés à l’instrument.']]],
 ['0.23','Bien débuter, garder ses progrès',[
 ['feature','Configuration guidée en trois écrans et tutoriel facultatif du manche.'],
 ['feature','Mises à jour proposées à l’utilisateur et conservation des progrès entre versions bêta.'],
 ['improvement','Aide à l’installation sur iPhone et préparation de l’audio améliorées.']]],
 ['0.22','Un problème à signaler ?',[
 ['feature','Formulaire de signalement de bug dans l’application.'],
 ['improvement','Récompenses musicales et lisibilité des succès améliorées.']]],
 ['0.21','Des défis qui avancent',[
 ['improvement','Noms des succès plus joueurs et progression d’accomplissement visible.'],
 ['bug','Retour au parcours et commandes des paramètres clarifiés.']]],
 ['0.20','Manche et collection plus clairs',[
 ['improvement','Contrastes, carte des progrès et présentation de la collection améliorés.'],
 ['bug','Correction du retour visuel des mauvaises réponses sur le manche.']]],
 ['0.19','Votre collection de succès',[
 ['feature','Première collection de succès, critères et progression sauvegardée.'],
 ['feature','Quatre palettes coordonnées : Atelier, Studio Nuit, Inclusif-contrasté et Papier.']]],
 ['0.18','Apprendre par familles de notes',[
 ['feature','Nouveau parcours par familles : découverte des emplacements, puis mélanges avec les notes déjà apprises.'],
 ['feature','Choix entre dièses et bémols dans les paramètres et les exercices.'],
 ['improvement','Micro-leçons et enchaînement des récompenses musicales revus.']]],
 ['0.17','Des fondations plus robustes',[
 ['improvement','Services partagés pour le son, les données et le fonctionnement de l’application.'],
 ['bug','Sauvegardes et restauration renforcées.']]],
 ['0.16','Un manche stable',[
 ['bug','Le manche reste stable pendant les interactions.'],
 ['improvement','Démonstrations revues et passage au temps moyen pour mesurer la fluidité.']]],
 ['0.15','Un jeu qui s’enchaîne',[
 ['feature','Entraînement cumulatif et indice affichant les noms au départ du manche.'],
 ['improvement','Réponses enchaînées immédiatement et schémas de manche partagés.']]],
 ['0.14','Plus de réactivité',[
 ['improvement','Styles des commandes centralisés et visualisation des progrès revue.'],
 ['bug','Notes jouables à la suite sans attendre la fin du son précédent.']]],
 ['0.13','Des résultats plus clairs',[
 ['improvement','Fiche de résultat reconstruite, écoute et timbres améliorés.'],
 ['feature','Extraits musicaux dans les suites finales.']]],
 ['0.12','Vos records personnels',[
 ['feature','Résultats enrichis et records personnels comparés au même exercice.'],
 ['feature','Bouton pour écouter le son choisi dans les paramètres.'],
 ['improvement','Transitions et démarrage du chronométrage revus.']]],
 ['0.11','Des exercices mieux nommés',[
 ['improvement','Titres par sujet d’étude, sous-titres par activité et choix des timbres dans les paramètres.']]],
 ['0.10','Des parties plus courtes',[
 ['improvement','Nommer et retrouver sont séparés en activités distinctes, avec des séries plus courtes.'],
 ['improvement','Retours visuels et fiche de résultat simplifiés.']]],
 ['0.9','Des premiers pas plus visuels',[
 ['feature','Illustrations d’instruments fournies pour la configuration.'],
 ['bug','Corrections vertes associées à la hauteur demandée.'],
 ['improvement','Explications à la première rencontre d’un type d’exercice.']]],
 ['0.8','Daily Fretboard Trainer',[
 ['event','L’application prend le nom Daily Fretboard Trainer.'],
 ['improvement','Manche visible, résultats et configuration des instruments améliorés.']]],
 ['0.7','Votre accordage à vous',[
 ['feature','Accordages courants et éditeur personnalisé avec écoute des cordes.']]],
 ['0.6','Un jeu plus fluide',[
 ['improvement','Manche agrandi, confort tactile et ordre des cordes harmonisés.']]],
 ['0.5','Premier pilote pédagogique',[
 ['feature','Parcours adapté au profil instrumental et premières activités pédagogiques du pilote.']]],
 ['0.4','Prêt à jouer',[
 ['feature','Préparation visuelle avant les questions et disposition adaptée au portrait et au paysage.'],
 ['improvement','Manche clair et repères plus lisibles.']]],
 ['0.3','Comprendre et répondre',[
 ['improvement','Micro-leçons, consignes, réponses tactiles et présentation des résultats améliorées.']]],
 ['0.2','Premiers retours intégrés',[
 ['bug','Pause et chronométrage corrigés lors des changements d’orientation.'],
 ['improvement','Proportions du manche, timbre de guitare et confort de lecture améliorés.']]]
].map(([version,title,items])=>Object.freeze({version,title,items})));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderChangelog(release){return `<header class="page-heading"><div><h1>Journal des modifications</h1><p>Les nouveautés et corrections de Daily Fretboard Trainer.</p></div></header><button class="button quiet-button" data-action="settings">← Retour aux paramètres</button><section class="change-legend panel" aria-label="Légende">${Object.values(CHANGE_TYPES).map(([icon,label])=>`<span><span aria-hidden="true">${icon}</span> ${label}</span>`).join('')}</section><p class="muted">Version installée : ${esc(release)}. Les entrées décrivent les changements à leur livraison.</p><div class="change-history">${RELEASE_HISTORY.map((entry,i)=>`<details class="panel change-release" ${i===0?'open':''}><summary><strong>v${esc(entry.version)}</strong><span>${esc(entry.title)}</span></summary><ul>${entry.items.map(([type,text])=>`<li><span aria-hidden="true">${CHANGE_TYPES[type][0]}</span><span><span class="visually-hidden">${CHANGE_TYPES[type][1]} : </span>${esc(text)}</span></li>`).join('')}</ul></details>`).join('')}</div>`;}
