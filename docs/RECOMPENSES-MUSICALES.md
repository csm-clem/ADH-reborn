> État courant : voir l’[audit v0.20](v0.20/audit-musical.md). Ce document décrit des choix antérieurs ; sept arrangements de la v0.19 sont désormais en révision, et certaines durées ont été corrigées.

> Mise à jour v0.18 : la sélection active écarte les quatre cellules incomplètes (Jaws, Maria, Bonnie, Saints). Seuls les passages à phrase complète vérifiée sont retenus. L’écoute se déclenche automatiquement après une chaîne sans erreur ; la commande sur la fiche permet de l’arrêter ou de la relancer.

# Phrases musicales et récompenses d’écoute

Les exercices gardent leurs petits extraits contraints aux notes étudiées. Sur la fiche des exercices « retrouver » associés à un extrait connu, **Écouter** joue une phrase développée avec un accompagnement arpégé discret et une basse. L’élève n’a pas à reproduire ces notes supplémentaires. L’écoute est volontaire, interrompable et respecte Muet.

`reward-music.js` sépare ces arrangements du catalogue des questions. La transposition suit l’extrait sélectionné ; le registre peut être remonté d’octave pour une écoute claire. Aucun enregistrement tiers n’est embarqué. L’harmonisation est un arrangement pédagogique original, pas une transcription des orchestrations.

| Exemple | Étendue de la récompense | Vérification / source |
|---|---|---|
| Ah ! vous dirai-je, maman | Première période de 14 attaques, conclusion sur la tonique | Air traditionnel, voir [sources du pilote](MELODIES-SOURCES.md) |
| Kuckuck, Kuckuck | Première phrase, quatre mesures avec silences | [Partition LilyPond](https://github.com/nathanaelmeister/Piano_-_First_two_hand_exercises/blob/master/input-files/017_Deutsches_Volkslied_-_Kuckuck_kuckuck.ily) |
| Chœur des fiançailles | Premier appel complet, quatre mesures | [Partition](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Here%20Comes%20the%20Bride%20-%20Ly%20Core%20-%20Bb.ly) |
| The Entertainer | Première phrase du thème après l’introduction ; fin avant la levée suivante | [Mutopia, partition d’après l’édition 1902](https://github.com/MutopiaProject/MutopiaProject/blob/master/ftp/JoplinS/entertainer/entertainer.ly) |
| Over the Rainbow | Première section A de huit mesures | [Partition en mi bémol](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Over%20the%20Rainbow%20-%20Ly%20Core%20-%20Eb.ly) |
| Star Trek | Premier appel complet de quatre mesures, triolet conservé | [Partition en do](https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Star%20Trek%20-%20Ly%20Core%20-%20C.ly) |
| Frère Jacques | Air complet, accompagnement simple | [Partition de l’air traditionnel](https://imslp.org/wiki/Fr%C3%A8re_Jacques_%28Rameau%2C_Jean-Philippe%29) |
| Les Dents de la mer | Ostinato développé avec fin arrangée | Cellule E–F ; [exemple pédagogique](https://www.music-for-music-teachers.com/jaws-theme-song.html). **Ce n’est pas le thème intégral du film** |
| Maria | Appel à trois notes, rythme simplifié | Cellule C–F♯–G, [référence de l’éditeur](https://www.westsidestory.com/store/maria-from-west-side-story-voice-and-piano) ; pas de transcription intégrale vérifiée |
| My Bonnie | Premier appel, rythme arrangé | Notes du repère traditionnel ; pas de revendication de fidélité à un enregistrement particulier |
| When the Saints | Appel répété, rythme arrangé | Notes du repère traditionnel ; arrangement pédagogique |

Les deux derniers appels et les deux cellules de musique de film/comédie musicale restent des arrangements courts. Pour offrir des versions fidèles plus longues, il faudra sélectionner les éditions et vérifier les phrases correspondantes ; la v0.16 ne les annonce pas comme des morceaux complets. La disponibilité publique d’une partition ne garantit pas une autorisation d’exploitation commerciale ; la provenance et les droits du catalogue devront être validés avant commercialisation.
