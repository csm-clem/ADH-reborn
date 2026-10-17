/** One display policy: named examples; exploration reveals only successful positions. */
export const DEMO_RULES=Object.freeze({
 showNames:true,pointColor:'var(--note-correct)',labelColor:'var(--neck-ink)',showAnchor:false,
 points(module,{question=null,kind=null,explored=null}={}){
  const focus=module.focus||module.pool||[],points=explored?focus.filter(p=>explored.includes(`${p.string}:${p.fret}`)):question&&['name','find'].includes(kind)?[question.target]:focus;
  return points.filter(Boolean).map(p=>({...p,color:this.pointColor}));
 }
});
