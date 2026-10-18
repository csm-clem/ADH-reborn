/** Immutable curriculum policy, reusable by every future fretboard zone. */
const naturals=Object.freeze([0,2,4,5,7,9,11]),missingNaturals=Object.freeze([5,0,7,2,9,4,11]),alterations=Object.freeze([6,1,8,3,10]);
const unique=xs=>[...new Set(xs)];
export const CURRICULUM_RULES=Object.freeze({
 zones:Object.freeze([[0,4],[4,8],[8,12],[12,16]].map(([start,end])=>Object.freeze({start,end}))),
 naturals,missingNaturals,alterations,minQuestions:20,maxQuestions:24,newFamilyShare:.3,
 familyOrder(profile,positions,{strings=profile.tuning.map((_,i)=>i)}={}){
  const available=new Set(positions.map(p=>p.midi%12)),open=unique(strings.map(s=>profile.tuning[s]%12));
  const start=(profile.tuning[strings[0]]+(naturals.includes(profile.tuning[strings[0]]%12)?0:1))%12;
  const pivot=naturals.indexOf(start),cycle=[...naturals.slice(pivot),...naturals.slice(0,pivot)];
  const natural=unique([...open.filter(pc=>naturals.includes(pc)),...cycle]);
  const alteredOpen=open.filter(pc=>!naturals.includes(pc));
  return unique([...natural,...alteredOpen,...alterations]).filter(pc=>available.has(pc));
 },
 zone(value={start:0,end:4}){if(!Number.isInteger(value.start)||!Number.isInteger(value.end)||value.start<0||value.end<value.start||value.end>24)throw new Error('Zone du manche invalide.');return Object.freeze({...value});}
});
