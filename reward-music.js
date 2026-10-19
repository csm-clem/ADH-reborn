import {musicChecked} from './music-audit.js';
import {OCTAVE_MUSIC,DANCE_MUSIC,EXTRA_RIFFS} from './octave-music.js';
/** Finished listening phrases, distinct from the deliberately tiny exercise excerpts.
 * Only sourced melodic lines are rendered; generic harmonic accompaniment is disabled.
 * Reference passages and exceptions are documented in docs/RECOMPENSES-MUSICALES.md.
 */
const PHRASES={...Object.fromEntries([...OCTAVE_MUSIC,DANCE_MUSIC,...EXTRA_RIFFS].map(m=>[m.id,{notes:m.notes.map((n,i)=>[n,m.beats[i],m.rests?.[i]||0]),chords:m.chords,bar:m.bar,step:m.step,section:m.section,voice:m.voice}])),
 'seven-nation':{notes:[[40,1.5],[40,.5],[43,.5],[40,.5],[38,1],[36,2],[35,2]],voice:'guitar-driven',chords:[[40,47,52],[40,47,52]],bar:4,step:60/120,section:'Deux mesures du riff principal, version de la partition de basse Bonedo'},
 'come-as-you-are':{notes:[[38,.5],[38,.5],[39,.5],[40,1],[43,.5],[40,.5],[43,.5],[40,.5],[40,.5],[39,.5],[38,.5],[45,.5],[38,.5],[38,1],[45,.5],[38,.5],[39,.5],[40,1]],chords:[[40,43,47],[38,42,45],[40,43,47]],bar:4,step:.5,section:'Levée, deux mesures du riff de guitare et note de reprise'},
 bride:{notes:[[65,2],[70,1.5],[70,.5],[70,3,1],[65,2],[72,1.5],[69,.5],[70,3,1]],chords:[[46,50,53],[46,50,53],[53,57,60],[46,50,53]],bar:4,step:60/216,section:'Première phrase complète'},
 entertainer:{notes:[[64,.25],[72,.5],[64,.25],[72,.5],[64,.25],[72,1.5],[72,.25],[74,.25],[75,.25],[76,.25],[72,.25],[74,.25],[76,.5],[71,.25],[74,.5],[72,1.5,.5]],chords:[[48,52,55],[53,57,60],[43,47,50],[48,52,55]],bar:2,step:60/92,section:'Première phrase du thème, voix inférieure des octaves du piano'},
 rainbow:{notes:[[63,2],[75,2],[74,1],[70,.5],[72,.5],[74,1],[75,1],[63,2],[72,2],[70,4],[60,2],[68,2],[67,1],[63,.5],[65,.5],[67,1],[68,1],[65,1],[62,.5],[63,.5],[65,1],[67,1],[63,2,2]],chords:[[51,55,58],[48,51,55],[56,60,63],[51,55,58],[56,60,63],[51,55,58],[46,50,53],[51,55,58]],bar:4,step:60/156,section:'Première section A complète'},
 trek:{notes:[[55,2],[65,3],[64,1],[62,2/3],[60,2/3],[59,2/3],[58,2],[58,6]],chords:[[48,52,55],[48,52,55],[44,48,51,54,58],[44,48,51,54,58]],bar:4,step:60/144,section:'Premier appel complet, quatre mesures'},
 jaws:{notes:[[40,1],[41,1],[40,1],[41,1],[40,.5],[41,.5],[40,.5],[41,.5],[40,.5],[41,.5],[40,.5],[41,.5],[40,4]],chords:[[28,35,40],[28,35,40],[28,35,40]],bar:4,step:.35,section:'Ostinato arrangé avec une fin, pas le thème intégral'},
 maria:{notes:[[60,1],[66,1],[67,4]],chords:[[55,59,62],[55,59,62]],bar:3,step:.55,section:'Appel à trois notes, rythme simplifié'},
 bonnie:{notes:[[60,1],[69,1.5],[69,.5],[67,1],[69,1],[72,1],[71,1],[69,3],[67,3],[64,3]],chords:[[48,52,55],[53,57,60],[48,52,55],[43,47,50],[48,52,55]],bar:3,step:.4,section:'Premier appel, rythme arrangé'},
 saints:{notes:[[60,1],[64,1],[65,1],[67,3],[60,1],[64,1],[65,1],[67,3]],chords:[[48,52,55],[48,52,55],[53,57,60],[48,52,55]],bar:3,step:.36,section:'Appel complet, rythme arrangé'}
};
/** One melodic timeline supplies both the exercise excerpt and the complete reward. */
export function referencePrefix(id,count){const notes=PHRASES[id]?.notes.slice(0,count);if(!notes)throw new Error('Phrase musicale inconnue : '+id);return {notes:notes.map(e=>e[0]),beats:notes.map(e=>e[1]),rests:notes.map(e=>e[2]||0)};}
export function isCompletePhrase(id){return Boolean(PHRASES[id])&&musicChecked(id);}
export function rewardFor(melody){
 if(!melody||!isCompletePhrase(melody.id))return null;const p=PHRASES[melody.id],shift=0; // Listening always returns to the source key and register, independently of training adaptation.
 let beat=0;const events=p.notes.map(([midi,beats,restAfter=0])=>{const e={midi:midi+shift,start:beat,beats,velocity:1,voice:p.voice||'guitar-clean'};beat+=beats+restAfter;return e;});

 return {title:melody.title,section:p.section,events,totalBeats:beat,step:p.step,durationMs:Math.ceil((beat*p.step+1)*1000),registerShift:shift,hasHarmony:false,completePhrase:isCompletePhrase(melody.id)};
}
