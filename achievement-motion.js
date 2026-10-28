/** One delegated pointer controller for the whole album. No render on pointer movement. */
export function bindAchievementMotion(root){
 let active=null,bounds=null,artBounds=null,pointer=null,frame=0,latest=null,suppress=null,current=null,lastTime=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 const clamp=(v,max)=>Math.max(-max,Math.min(max,v));
 function clear(card){if(!card)return;card.classList.remove('is-tilting','is-dragging');const node=card.querySelector('.achievement-tilt');for(const p of ['--tilt-x','--tilt-y','--drag-x','--light-x','--light-y'])node?.style.removeProperty(p);}
 function reset(){cancelAnimationFrame(frame);frame=0;latest=null;current=null;lastTime=0;clear(active);if(pointer&&active?.hasPointerCapture?.(pointer.id))active.releasePointerCapture(pointer.id);active=null;pointer=null;bounds=null;artBounds=null;}
 function start(card){if(active!==card)reset();active=card;bounds=card.getBoundingClientRect();artBounds=card.querySelector('.achievement-art').getBoundingClientRect();}
 function paint(time){
  frame=0;if(!active||!latest||!bounds)return;
  const node=active.querySelector('.achievement-tilt'),art=artBounds;
  // A thumb moves over the artwork, not the entire (often very tall) card.
  const touch=!!pointer,dx=touch?(latest.x-pointer.x)*.35:0,dy=touch?(latest.y-pointer.y)*.2:0,
   nx=clamp((latest.x-art.left+dx)/art.width*2-1,1),ny=clamp((latest.y-art.top+dy)/art.height*2-1,1);
  const target={x:nx,y:ny,drag:pointer?.claimed?clamp((latest.x-pointer.x)*.2,18):0};if(!current)current={x:0,y:0,drag:0};const alpha=1-Math.exp(-Math.min(40,time-(lastTime||time-16))/(touch?65:35));lastTime=time;for(const k of ['x','y','drag'])current[k]+=(target[k]-current[k])*alpha;
  node.style.setProperty('--tilt-x',`${-current.y*7}deg`);node.style.setProperty('--tilt-y',`${current.x*8}deg`);
  node.style.setProperty('--light-x',`${(current.x+1)*50}%`);node.style.setProperty('--light-y',`${(current.y+1)*50}%`);
  node.style.setProperty('--drag-x',`${current.drag}px`);active.classList.add('is-tilting');if(Math.abs(target.x-current.x)+Math.abs(target.y-current.y)+Math.abs(target.drag-current.drag)>.01)frame=requestAnimationFrame(paint);
 }
 function queue(e){latest={x:e.clientX,y:e.clientY};if(!frame)frame=requestAnimationFrame(paint);}
 root.addEventListener('pointerover',e=>{if(reduced.matches||!fine.matches||e.pointerType!=='mouse')return;const card=e.target.closest('.achievement-card');if(!card||card.contains(e.relatedTarget))return;start(card);queue(e);});
 root.addEventListener('pointerdown',e=>{if(reduced.matches||e.button!==0||e.isPrimary===false||e.pointerType==='mouse'||e.target.closest('button,a,input,select,summary'))return;const card=e.target.closest('.achievement-card');if(!card||card.classList.contains('is-flipped'))return;start(card);pointer={id:e.pointerId,x:e.clientX,y:e.clientY,claimed:false};});
 root.addEventListener('pointermove',e=>{
  if(reduced.matches||!active)return;
  if(pointer){if(e.pointerId!==pointer.id)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(!pointer.claimed){if(Math.abs(dy)>9&&Math.abs(dy)>=Math.abs(dx)){reset();return;}if(Math.abs(dx)<6||Math.abs(dx)<Math.abs(dy)*1.2)return;pointer.claimed=true;active.setPointerCapture?.(e.pointerId);active.classList.add('is-dragging');}e.preventDefault();queue(e);}
  else if(e.pointerType==='mouse'&&fine.matches&&active.contains(e.target))queue(e);
 },{passive:false});
 root.addEventListener('pointerout',e=>{if(!pointer&&active&&!active.contains(e.relatedTarget))reset();});
 const release=e=>{if(pointer?.id!==e.pointerId)return;if(pointer.claimed)suppress={card:active,until:performance.now()+250};reset();};
 root.addEventListener('pointerup',release);root.addEventListener('pointercancel',release);root.addEventListener('lostpointercapture',e=>{if(pointer?.id===e.pointerId&&e.target===active&&!active.hasPointerCapture(e.pointerId))reset();});
 root.addEventListener('click',e=>{if(suppress&&performance.now()<suppress.until&&suppress.card.contains(e.target)){e.preventDefault();e.stopPropagation();}suppress=null;},{capture:true});
 window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);window.addEventListener('blur',reset);window.addEventListener('resize',reset);document.addEventListener('visibilitychange',reset);reduced.addEventListener('change',reset);
 return {reset};
}
