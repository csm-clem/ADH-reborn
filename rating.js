export const RATING_HELP='<p>Les étoiles décrivent votre séance ; elles ne verrouillent aucun exercice.</p><ul><li>0 : aucune réponse, ou plus de 10 erreurs.</li><li>1 : de 6 à 10 erreurs.</li><li>2 : de 3 à 5 erreurs.</li><li>3 : au maximum 2 erreurs, sans condition de vitesse.</li><li>4 : au maximum 1 erreur et temps moyen de 2,5 s ou moins.</li><li>5 : aucune erreur et temps moyen de 1 s ou moins.</li></ul><p>Pour 4 ou 5 étoiles, chaque réponse doit être sans aide et disposer d’un temps valide. La moyenne porte sur les bonnes réponses. Les reprises ne remplacent pas la première réponse.</p>';
export function ratingAdvice(events){
 const es=events.filter(e=>!e.retry);if(!es.length)return '';
 const errors=es.filter(e=>!e.correct).length,autonomous=es.every(e=>!e.aids?.length&&e.timingInterpretable!==false&&Number.isFinite(e.ms)&&e.ms>=0);
 if(errors)return 'Pour 5 étoiles : terminez sans erreur, sans aide, avec un temps moyen de 1 seconde ou moins.';
 if(!autonomous)return 'Pour 5 étoiles : confirmez toutes les réponses sans aide, avec des temps valides et une moyenne de 1 seconde ou moins.';
 const mean=es.reduce((s,e)=>s+e.ms,0)/es.length;
 return mean>1000?'Pour 5 étoiles : gardez le sans-faute et atteignez un temps moyen de 1 seconde ou moins.':'';
}
