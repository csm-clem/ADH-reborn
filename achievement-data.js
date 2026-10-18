import {MUSIC_ARRANGEMENT_VERSION} from './music-audit.js';
/** Import allowlist: preserve stable obtained IDs even after catalogue additions. */
export function validateAchievements(value=[]){
 if(!Array.isArray(value)||value.length>3000)throw new Error('Collection de succès invalide.');
 const keys=new Set();return value.map(u=>{
  if(!u||!/^[-a-z0-9]{1,100}$/.test(u.id)||typeof u.scope!=='string'||u.scope.length>500||typeof u.profileKey!=='string'||u.profileKey.length>300||!Number.isFinite(u.at)||u.at<0||u.at>8640000000000000||u.version!==1||!Array.isArray(u.proofs)||u.proofs.length>10||!u.proofs.every(p=>typeof p==='string'&&p.length<=150)||!u.zone||!Number.isInteger(u.zone.start)||!Number.isInteger(u.zone.end)||u.zone.start<0||u.zone.end>24||u.zone.end<u.zone.start)throw new Error('Preuve de succès invalide.');
  if(!Array.isArray(u.evidence)||u.evidence.length!==u.proofs.length||!u.evidence.every((e,i)=>e&&e.attempt===u.proofs[i]&&typeof e.activity==='string'&&/^[a-z0-9-]{1,100}$/.test(e.activity)&&Number.isFinite(e.at)&&e.at>=0&&Number.isInteger(e.total)&&e.total>=0&&e.total<=30&&Number.isInteger(e.correct)&&e.correct>=0&&e.correct<=e.total&&(e.meanMs===null||Number.isFinite(e.meanMs)&&e.meanMs>=0)&&Number.isInteger(e.aidedResponses)&&e.aidedResponses>=0&&e.aidedResponses<=e.total&&Number.isInteger(e.positions)&&e.positions>=0&&e.positions<=40&&typeof e.motifCompleted==='boolean'))throw new Error('Détail de preuve invalide.');
  const key=u.scope+':'+u.id;if(keys.has(key))throw new Error('Succès dupliqué dans la sauvegarde.');keys.add(key);
  const result={id:u.id,scope:u.scope,profileKey:u.profileKey,at:u.at,version:u.version,proofs:[...u.proofs],evidence:u.evidence.map(e=>({attempt:e.attempt,activity:e.activity,at:e.at,total:e.total,correct:e.correct,meanMs:e.meanMs,aidedResponses:e.aidedResponses,positions:e.positions,motifCompleted:e.motifCompleted})),zone:{...u.zone}};
  if(u.musicId!==undefined){if(!/^[-a-z0-9]{1,80}$/.test(u.musicId)||u.id!=='music-'+u.musicId||!Number.isInteger(u.shift)||Math.abs(u.shift)>100||typeof u.activity!=='string'||!/^[-a-z0-9]{1,100}$/.test(u.activity)||(!Number.isInteger(u.arrangementVersion)||u.arrangementVersion<1||u.arrangementVersion>MUSIC_ARRANGEMENT_VERSION))throw new Error('Pochette musicale invalide.');Object.assign(result,{musicId:u.musicId,shift:u.shift,activity:u.activity,arrangementVersion:u.arrangementVersion});}
  return result;
 });
}
