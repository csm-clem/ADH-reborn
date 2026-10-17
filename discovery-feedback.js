/** Sound-direction guidance without revealing the answer's location. */
export function searchFeedback(target,chosen,attempt=0){
 const delta=target.midi-chosen.midi,distance=Math.abs(delta),direction=delta>0?'aigu':'grave';
 if(!delta)return ['Même son ! Cherche sur la corde demandée.','La hauteur est juste. Essaie la corde indiquée.','Tu as le bon son, sur une autre corde.'][attempt%3];
 const phrases=distance===1?[`Encore un tout petit peu plus ${direction} !`,`Tout près ! Un soupçon plus ${direction}.`,`Presque ! Juste un peu plus ${direction}.`,`À un petit pas : plus ${direction} !`]:distance<=3?[`Un peu plus ${direction} !`,`Tu approches : un peu plus ${direction}.`,`Presque trouvé, cherche plus ${direction}.`,`Bonne piste ! Encore un peu plus ${direction}.`]:distance<=7?[`Plus ${direction} !`,`Essaie un son plus ${direction}.`,`Continue vers les sons plus ${direction}s.`,`Par ici : cherche plus ${direction} !`]:[`Beaucoup plus ${direction} !`,`Change de registre : plus ${direction}.`,`Vise un son bien plus ${direction}.`,`Un grand saut vers les sons ${direction}s !`];
 return phrases[attempt%phrases.length];
}
