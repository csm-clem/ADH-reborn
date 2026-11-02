/** Selected result direction C. Presentation only: the stored score is never changed. */
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-(1-clamp(x))**3;
export const recordSparks=()=>`<span class="result-sparks" aria-hidden="true">${Array.from({length:8},()=>'<i></i>').join('')}</span>`;
export function resultMotionAt(p){return {score:1-(1-clamp((p-.07)/.73))**1.6,rows:[0,1,2].map(i=>ease((p-.22-i*.09)/.18)),celebration:clamp((p-.52)/.28)};}
export function animateArcadeResult(root,total){
 const card=root.querySelector('.arcade-result-card');if(!card)return;
 const score=card.querySelector('[data-result-score]'),rows=[...card.querySelector('.arcade-stats').children],sparks=[...card.querySelectorAll('.result-sparks i')],shimmer=card.querySelector('.result-shimmer'),media=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
 const finish=()=>{cancelAnimationFrame(frame);score.textContent=total.toLocaleString('fr-FR');card.style.opacity='1';card.style.transform='none';rows.forEach(r=>{r.style.opacity='1';r.style.transform='none';});sparks.forEach(s=>s.style.opacity='0');shimmer.style.opacity='0';media.removeEventListener('change',changed);};
 const changed=()=>{if(media.matches)finish();};if(media.matches){finish();return;}media.addEventListener('change',changed);
 const begin=performance.now();function tick(now){if(!card.isConnected){media.removeEventListener('change',changed);return;}const p=clamp((now-begin)/2600),m=resultMotionAt(p),entry=ease(p/.3);score.textContent=Math.round(total*m.score).toLocaleString('fr-FR');card.style.opacity=entry;card.style.transform=`scale(${.98+.02*entry})`;
 rows.forEach((r,i)=>{r.style.opacity=m.rows[i];r.style.transform=`translateY(${(1-m.rows[i])*10}px)`;});
 const t=m.celebration,pulse=Math.sin(Math.PI*t);sparks.forEach((s,i)=>{const angle=i*Math.PI/4,travel=12+ease(t)*16;s.style.opacity=pulse*.85;s.style.transform=`translate(${Math.cos(angle)*travel}px,${Math.sin(angle)*travel}px) rotate(45deg) scale(${.4+pulse*.6})`;});
 shimmer.style.opacity=Math.sin(Math.PI*clamp((p-.25)/.65))*.4;shimmer.style.transform=`translateX(${-100+p*220}%) rotate(-18deg)`;if(p<1)frame=requestAnimationFrame(tick);else finish();}
 tick(begin);
}

/** Same restrained arrival for the learning summary; all controls remain immediately usable. */
export function animateLearningResult(card){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 card.animate([{opacity:0,transform:'translateY(14px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:600,easing:'cubic-bezier(.2,.8,.2,1)'});
 card.querySelectorAll('.result-stat-grid>div').forEach((row,i)=>row.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,delay:140+i*90,fill:'backwards',easing:'ease-out'}));
}
