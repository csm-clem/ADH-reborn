import {OCTAVE_MUSIC,DANCE_MUSIC,EXTRA_RIFFS,practiceExcerpt} from './octave-music.js';
import {isCompletePhrase,referencePrefix} from './reward-music.js';
/** Short excerpts, selected only when the full passage passed its source audit. Sources and exact reference pitches are documented in docs/MELODIES-SOURCES.md. */
const sources={
 twinkle:'https://commons.wikimedia.org/wiki/File:Twinkle_Twinkle_Sheet_Music.png',
 cuckoo:'https://github.com/nathanaelmeister/Piano_-_First_two_hand_exercises/blob/master/input-files/017_Deutsches_Volkslied_-_Kuckuck_kuckuck.ily',
 bride:'https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Here%20Comes%20the%20Bride%20-%20Ly%20Core%20-%20Bb.ly',
 entertainer:'https://github.com/MutopiaProject/MutopiaProject/blob/master/ftp/JoplinS/entertainer/entertainer.ly',
 rainbow:'https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Over%20the%20Rainbow%20-%20Ly%20Core%20-%20Eb.ly',
 trek:'https://github.com/neonscribe/lilypond-lead-sheets/blob/main/Core/Star%20Trek%20-%20Ly%20Core%20-%20C.ly',
 intervals:'https://github.com/chromatone/chromatone.center/blob/master/content/theory/notes/ear-traning/reference-songs/index.md'
};
export const MELODIES=[...OCTAVE_MUSIC.map(practiceExcerpt),practiceExcerpt(DANCE_MUSIC),...EXTRA_RIFFS.map(practiceExcerpt),
 {id:'seven-nation',title:'Seven Nation Army',composer:'The White Stripes · Jack White',excerptLength:6,source:'https://www.chords-and-tabs.net/song/name/white-stripes-seven-nation-army-20',listenSource:'https://www.youtube.com/watch?v=zkQvHQ-u084',section:'Début du riff · 2003',modern:true},
 {id:'come-as-you-are',title:'Come As You Are',composer:'Nirvana · Kurt Cobain',excerptLength:6,source:'https://www.justinguitar.com/songs/nirvana-come-as-you-are-chords-tabs-guitar-lesson-bs-723',listenSource:'https://www.justinguitar.com/songs/nirvana-come-as-you-are-chords-tabs-guitar-lesson-bs-723',section:'Début du riff · 1991',modern:true},
 {id:'twinkle',title:'Ah ! vous dirai-je, maman',composer:'Air traditionnel',excerptLength:4,source:sources.twinkle,section:'Début de la mélodie'},
 {id:'cuckoo',title:'Kuckuck, Kuckuck',composer:'Air traditionnel allemand',excerptLength:6,source:sources.cuckoo,section:'Début de la mélodie'},
 {id:'bride',title:'Chœur des fiançailles',composer:'Richard Wagner',excerptLength:4,source:sources.bride,section:'Début de la mélodie'},
 {id:'entertainer',title:'The Entertainer',composer:'Scott Joplin',excerptLength:4,source:sources.entertainer,section:'Début du thème, après l’introduction'},
 {id:'jaws',title:'Les Dents de la mer',composer:'John Williams',excerptLength:4,source:sources.intervals,section:'Cellule à deux notes'},
 {id:'rainbow',title:'Over the Rainbow',composer:'Harold Arlen',excerptLength:2,source:sources.rainbow,section:'Deux premières notes'},
 {id:'trek',title:'Star Trek',composer:'Alexander Courage',excerptLength:2,source:sources.trek,section:'Deux premières notes'},
 {id:'maria',title:'Maria',composer:'Leonard Bernstein',excerptLength:2,source:sources.intervals,section:'Repère de triton à deux notes'},
 {id:'frere',title:'Frère Jacques',composer:'Air traditionnel',excerptLength:2,source:'https://noctavepiano.com/partitions/trad-frere-jacques/',section:'Deux premières notes'},
 {id:'bonnie',title:'My Bonnie Lies over the Ocean',composer:'Air traditionnel écossais',excerptLength:2,source:sources.intervals,section:'Premier saut mélodique'},
 {id:'saints',title:'When the Saints Go Marching In',composer:'Air traditionnel',excerptLength:2,source:'https://noctavepiano.com/partitions/trad-frere-jacques/',section:'Deux premières notes'}
].map(m=>m.excerptLength?{...m,...referencePrefix(m.id,m.excerptLength)}:m);
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
