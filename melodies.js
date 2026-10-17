import {OCTAVE_MUSIC,DANCE_MUSIC,EXTRA_RIFFS,practiceExcerpt} from './octave-music.js';
import {isCompletePhrase} from './reward-music.js';
/** Short verified excerpts. Sources and exact reference pitches are documented in docs/MELODIES-SOURCES.md. */
const sources={
 twinkle:'https://github.com/cuthbertLab/music21/blob/master/music21/corpus/airdsAirs/book2.abc',
 cuckoo:'https://github.com/nathanaelmeister/Piano_-_First_two_hand_exercises/blob/master/input-files/017_Deutsches_Volkslied_-_Kuckuck_kuckuck.ily',
 bride:'https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Here%20Comes%20the%20Bride%20-%20Ly%20Core%20-%20Bb.ly',
 entertainer:'https://github.com/MutopiaProject/MutopiaProject/blob/master/ftp/JoplinS/entertainer/entertainer.ly',
 rainbow:'https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Over%20the%20Rainbow%20-%20Ly%20Core%20-%20Eb.ly',
 trek:'https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Star%20Trek%20-%20Ly%20Core%20-%20C.ly',
 intervals:'https://github.com/chromatone/chromatone.center/blob/master/content/theory/notes/ear-traning/reference-songs/index.md'
};
export const MELODIES=[...OCTAVE_MUSIC.map(practiceExcerpt),practiceExcerpt(DANCE_MUSIC),...EXTRA_RIFFS.map(practiceExcerpt),
 {id:'seven-nation',title:'Seven Nation Army',composer:'The White Stripes · Jack White',notes:[52,52,55,52,50,48],beats:[1.5,.5,.75,.75,.5,1],source:'https://www.the-maestro-online.com/blog/seven-nation-army-minor-scale/',listenSource:'https://www.youtube.com/watch?v=zkQvHQ-u084',section:'Début du riff · 2003',modern:true},
 {id:'come-as-you-are',title:'Come As You Are',composer:'Nirvana · Kurt Cobain',notes:[38,38,39,40,43,40],beats:[.5,.5,.5,.5,.5,.5],source:'https://www.justinguitar.com/songs/nirvana-come-as-you-are-chords-tabs-guitar-lesson-bs-723',listenSource:'https://www.justinguitar.com/songs/nirvana-come-as-you-are-chords-tabs-guitar-lesson-bs-723',section:'Début du riff · 1991',modern:true},
 {id:'twinkle',title:'Ah ! vous dirai-je, maman',composer:'Air traditionnel',notes:[67,67,74,74],beats:[1,1,1,1],source:sources.twinkle,section:'Début de la mélodie'},
 {id:'cuckoo',title:'Kuckuck, Kuckuck',composer:'Air traditionnel allemand',notes:[67,64,67,64,62,60],beats:[1,1,1,1,1,1],rests:[0,1,0,1,0,0],source:sources.cuckoo,section:'Début de la mélodie'},
 {id:'bride',title:'Chœur des fiançailles',composer:'Richard Wagner',notes:[65,70,70,70],beats:[2,1.5,.5,3],source:sources.bride,section:'Début de la mélodie'},
 {id:'entertainer',title:'The Entertainer',composer:'Scott Joplin',notes:[64,72,64,72],beats:[.5,1,.5,1],source:sources.entertainer,section:'Début du thème, après l’introduction'},
 {id:'jaws',title:'Les Dents de la mer',composer:'John Williams',notes:[40,41,40,41],beats:[1,1,1,1],source:sources.intervals,section:'Cellule à deux notes'},
 {id:'rainbow',title:'Over the Rainbow',composer:'Harold Arlen',notes:[63,75],beats:[2,2],source:sources.rainbow,section:'Deux premières notes'},
 {id:'trek',title:'Star Trek',composer:'Alexander Courage',notes:[55,65],beats:[2,3],source:sources.trek,section:'Deux premières notes'},
 {id:'maria',title:'Maria',composer:'Leonard Bernstein',notes:[60,66],beats:[1,1],source:sources.intervals,section:'Repère de triton à deux notes'},
 {id:'frere',title:'Frère Jacques',composer:'Air traditionnel',notes:[60,62],beats:[1,1],source:sources.intervals,section:'Deux premières notes'},
 {id:'bonnie',title:'My Bonnie Lies over the Ocean',composer:'Air traditionnel écossais',notes:[60,69],beats:[1,1],source:sources.intervals,section:'Premier saut mélodique'},
 {id:'saints',title:'When the Saints Go Marching In',composer:'Air traditionnel',notes:[60,64],beats:[1,1],source:sources.intervals,section:'Deux premières notes'}
];
function candidates(pool,maxNotes=6){const pitches=[...new Set(pool.map(p=>p.midi))],out=[];for(const melody of MELODIES)for(let length=Math.min(maxNotes,melody.notes.length);length>=2;length--){const notes=melody.notes.slice(0,length);if(new Set(notes).size<2)continue;for(const start of pitches){const shift=start-notes[0],sequence=notes.map(n=>pool.find(p=>p.midi===n+shift));if(sequence.every(Boolean))out.push({...melody,sequence,shift,length,events:sequence.map((p,i)=>({midi:p.midi,beats:melody.beats[i],restAfter:melody.rests?.[i]||0}))});}}return out.sort((a,b)=>b.length-a.length);}
export function melodyFor(module,{exclude=new Set()}={}){
 const possible=candidates(module.pool).filter(c=>isCompletePhrase(c.id)&&!exclude.has(c.id)).sort((a,b)=>(Number(b.modern||false)-Number(a.modern||false))||b.length-a.length),found=possible.find(c=>module.pitchClass===undefined||c.sequence.some(p=>p.midi%12===module.pitchClass))||possible[0];
 return found?{...found,adaptation:found.shift?'Extrait transposé pour les notes de cet exercice.':'Extrait dans les hauteurs de cet exercice.'}:null;
}

/** One work per activity across a configuration's entire zone, independent of notation. */
export function melodiesForPlan(plan){
 const used=new Set(),assigned=new Map();
 for(const m of [...plan.modules.filter(m=>m.kind==='family'),...plan.modules.filter(m=>m.kind!=='family')]){const selected=melodyFor(m,{exclude:used});if(selected){used.add(selected.id);assigned.set(m.id+'-find',selected);}}
 return assigned;
}
export function melodyById(id,shift=0){const melody=MELODIES.find(m=>m.id===id);return melody?{...melody,shift}:null;}
