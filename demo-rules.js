/** Singleton of immutable display rules, shared by every demonstration. No session state. */
const same=(a,b)=>a&&b&&a.string===b.string&&a.fret===b.fret;
export const DEMO_RULES=Object.freeze({
 showNames:true,pointColor:'#267342',labelColor:'#44516b',showAnchor:false,
 points(module,{question=null,kind=null}={}){
  const points=question&&['name','find'].includes(kind)?[question.target]:module.kind==='interval'?[module.target]:['opens','tuning'].includes(module.kind)?module.focus:[module.focus?.[0]||module.pool[0]];
  return points.filter(Boolean).filter(p=>['opens','tuning'].includes(module.kind)||!same(p,module.anchor)||same(p,module.target)).map(p=>({...p,color:this.pointColor}));
 }
});
