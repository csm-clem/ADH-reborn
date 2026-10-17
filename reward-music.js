/** Finished listening phrases, distinct from the deliberately tiny exercise excerpts.
 * Harmony is a pedagogical arrangement, not a reproduction of a source accompaniment.
 * Reference passages and exceptions are documented in docs/RECOMPENSES-MUSICALES.md.
 */
const PHRASES={
 twinkle:{notes:[[67,1],[67,1],[74,1],[74,1],[76,1],[76,1],[74,2],[72,1],[72,1],[71,1],[71,1],[69,1],[69,1],[67,2]],chords:[[55,59,62],[60,64,67],[55,59,62],[62,66,69],[55,59,62],[60,64,67],[62,66,69],[55,59,62]],bar:2,step:.4,section:'Première phrase complète'},
 cuckoo:{notes:[[67,1],[64,1,1],[67,1],[64,1,1],[62,1],[60,1],[62,1],[60,2,1]],chords:[[48,52,55],[48,52,55],[43,47,50],[48,52,55]],bar:3,step:.42,section:'Première phrase complète'},
 bride:{notes:[[65,2],[70,1.5],[70,.5],[70,3,1],[65,2],[72,1.5],[69,.5],[70,3,1]],chords:[[46,50,53],[46,50,53],[53,57,60],[46,50,53]],bar:4,step:.35,section:'Première phrase complète'},
 entertainer:{notes:[[64,.25],[72,.5],[64,.25],[72,.5],[64,.25],[72,1.5],[84,.25],[86,.25],[87,.25],[88,.25],[84,.25],[86,.25],[88,.5],[83,.25],[86,.5],[84,1.5,.5]],chords:[[48,52,55],[53,57,60],[43,47,50],[48,52,55]],bar:2,step:.65,section:'Première phrase du thème, sans la levée suivante'},
 rainbow:{notes:[[63,2],[75,2],[74,1],[70,.5],[72,.5],[74,1],[75,1],[63,2],[72,2],[70,4],[60,2],[68,2],[67,1],[63,.5],[65,.5],[67,1],[68,1],[65,1],[62,.5],[63,.5],[65,1],[67,1],[63,2,2]],chords:[[51,55,58],[48,51,55],[56,60,63],[51,55,58],[56,60,63],[51,55,58],[46,50,53],[51,55,58]],bar:4,step:.36,section:'Première section A complète'},
 trek:{notes:[[55,2],[65,3],[64,1],[62,2/3],[60,2/3],[59,2/3],[58,2],[58,6]],chords:[[48,52,55],[48,52,55],[44,48,51,54,58],[44,48,51,54,58]],bar:4,step:.33,section:'Premier appel complet, quatre mesures'},
 jaws:{notes:[[40,1],[41,1],[40,1],[41,1],[40,.5],[41,.5],[40,.5],[41,.5],[40,.5],[41,.5],[40,.5],[41,.5],[40,4]],chords:[[28,35,40],[28,35,40],[28,35,40]],bar:4,step:.35,section:'Ostinato arrangé avec une fin, pas le thème intégral'},
 maria:{notes:[[60,1],[66,1],[67,4]],chords:[[55,59,62],[55,59,62]],bar:3,step:.55,section:'Appel à trois notes, rythme simplifié'},
 frere:{notes:[[60,1],[62,1],[64,1],[60,1],[60,1],[62,1],[64,1],[60,1],[64,1],[65,1],[67,2],[64,1],[65,1],[67,2],[67,.75],[69,.25],[67,.5],[65,.5],[64,1],[60,1],[67,.75],[69,.25],[67,.5],[65,.5],[64,1],[60,1],[60,1],[55,1],[60,2],[60,1],[55,1],[60,2]],chords:Array.from({length:8},()=>[48,52,55]),bar:4,step:.32,section:'Air complet, harmonisation simple'},
 bonnie:{notes:[[60,1],[69,1.5],[69,.5],[67,1],[69,1],[72,1],[71,1],[69,3],[67,3],[64,3]],chords:[[48,52,55],[53,57,60],[48,52,55],[43,47,50],[48,52,55]],bar:3,step:.4,section:'Premier appel, rythme arrangé'},
 saints:{notes:[[60,1],[64,1],[65,1],[67,3],[60,1],[64,1],[65,1],[67,3]],chords:[[48,52,55],[48,52,55],[53,57,60],[48,52,55]],bar:3,step:.36,section:'Appel complet, rythme arrangé'}
};
export function rewardFor(melody){
 if(!melody||!PHRASES[melody.id])return null;const p=PHRASES[melody.id];let shift=melody.shift||0;
 while(p.notes[0][0]+shift<55)shift+=12;while(p.notes[0][0]+shift>76)shift-=12;
 let beat=0;const events=p.notes.map(([midi,beats,restAfter=0])=>{const e={midi:midi+shift,start:beat,beats,velocity:1};beat+=beats+restAfter;return e;});
 for(let i=0;i<p.chords.length&&i*p.bar<beat;i++){const chord=p.chords[i],start=i*p.bar,duration=Math.min(p.bar,beat-start);events.push({midi:chord[0]+shift,start,beats:Math.min(1,duration),velocity:.42,voice:'bass-electric'});for(let j=0;j<duration;j++)events.push({midi:chord[1+j%(chord.length-1)]+shift,start:start+j+.08,beats:.8,velocity:.25,voice:'guitar-clean'});}
 return {title:melody.title,section:p.section,events,step:p.step,durationMs:Math.ceil((beat*p.step+1)*1000),registerShift:shift,hasHarmony:true};
}
