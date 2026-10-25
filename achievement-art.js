import {rewardFor} from './reward-music.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/** A curated composition for each work; pitches/durations always come from the audio timeline. */
const MUSIC_ART=Object.freeze({
 'feel-good-inc':{colors:['#DFB26B','#96534F','#233C49'],object:'steps',code:'FG / INC'},
 'cantaloupe-island':{colors:['#F5BD68','#2E8B84','#263F59'],object:'island',code:'CI'},
 'higher-ground':{colors:['#D9A34E','#434F46','#153E48'],object:'pickup',code:'HG'},
 'my-sharona':{colors:['#F0D6B5','#B95E4C','#2E3B56'],object:'burst',code:'MS'},
 'immigrant-song':{colors:['#C8DADB','#4E7E92','#23394F'],object:'sail',code:'IS'},
 'singing-rain':{colors:['#83C8C0','#367791','#2D3D54'],object:'rain',code:'SR'},
 'christmas-song':{colors:['#D1AA73','#8C3C34','#384D44'],object:'star',code:'CS'},
 'around-world':{colors:['#DCE7B5','#276D75','#21354E'],object:'globe',code:'AW'},
 'billie-jean':{colors:['#A6A4DA','#4C6482','#242C50'],object:'steps',code:'BJ'},
 'bites-dust':{colors:['#E3B981','#947362','#293E49'],object:'comb',code:'BD'},
 'smoke-water':{colors:['#ACA5C4','#68677E','#22364A'],object:'smoke',code:'SW'},
 'iron-man':{colors:['#C5C6C7','#77695D','#243744'],object:'mask',code:'IM'},
 'seven-nation':{colors:['#D1DCD0','#C44F3E','#2E486D'],object:'disc',code:'SN / A'},
 'come-as-you-are':{colors:['#8DCAC7','#436E87','#173D52'],object:'water',code:'CA'},
 bride:{colors:['#EEE5C5','#B8A6A3','#465B6D'],object:'rings',code:'CF'},
 entertainer:{colors:['#E9C5A4','#A96A4F','#263F50'],object:'piano',code:'TE'},
 rainbow:{colors:['#F1BCA4','#9C9DCB','#395774'],object:'arcs',code:'OR'},
 trek:{colors:['#B7D4CC','#776F9E','#1C344C'],object:'orbit',code:'ST'}
});
export const musicArtIdentities=MUSIC_ART;
const path=(d,stroke='url(#METAL)',width=4,fill='none')=>`<path d="${d}" stroke="${stroke}" stroke-width="${width}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"/>`;
const circle=(x,y,r,fill='none',stroke='url(#METAL)',width=3)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const rect=(x,y,w,h,fill='url(#METAL)',rx=6)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
function object(kind){
 switch(kind){
  case 'pickup':return rect(156,82,310,172,'url(#METAL)',20)+rect(166,92,290,152,'#223F49',12)+Array.from({length:6},(_,i)=>circle(193+i*45,140,10,'url(#METAL)','none')+circle(193+i*45,195,10,'url(#METAL)','none')+path(`M${193+i*45} 49V278`,'#E8D7B1',1.5)).join('');
  case 'burst':return path('M315 37L344 109L417 57L396 135L494 143L417 184L471 252L377 229L347 292L311 233L224 283L240 211L142 187L239 148L208 76L288 118Z','#F4D5B0',3,'url(#METAL)')+circle(316,169,57,'#3A465C','#F3DEC2',3);
  case 'sail':return path('M332 44L168 235H332Z','#C7DCD6',3,'url(#METAL)')+path('M344 75L461 234H344Z','#C7DCD6',2,'#507C8B')+path('M145 247Q315 305 476 247L437 277H189Z','#DDE4D5',3,'url(#METAL)')+path('M330 36V251','#E4DBC3',5);
  case 'rain':return path('M158 153Q315 7 472 153Q432 131 395 161Q352 130 315 162Q272 130 235 161Q196 133 158 153Z','#E4E5CB',3,'url(#METAL)')+path('M315 75V245Q315 289 274 262','#E3D6BB',9)+Array.from({length:15},(_,i)=>path(`M${116+i*28} ${60+i%3*45}l-12 21`,'#C8E3DD',1)).join('');
  case 'island':return circle(315,135,95,'#EDC078','none')+path('M94 266Q219 220 315 241Q397 257 535 223','#B3E1CE',12)+path('M155 230Q269 178 437 230Z','#E7D0A4',3,'url(#METAL)')+path('M305 230Q331 167 302 98M303 105Q234 55 197 110M303 105Q349 40 402 88M303 105Q365 96 402 145M303 105Q243 101 231 158','#213F4B',9);
  case 'star':return path('M315 39L352 118L439 130L376 191L391 275L315 235L239 275L254 191L191 130L278 118Z','#F5E0AE',4,'url(#METAL)')+path('M315 62V225M211 135L376 191M254 191L416 135','#8C5C48',1);
  case 'globe':return circle(315,166,124,'#1F4655','url(#METAL)',7)+[38,76,112].map(r=>`<ellipse cx="315" cy="166" rx="${r}" ry="124" fill="none" stroke="#BFE0D2" stroke-width="1.5"/>`).join('')+[105,166,227].map(y=>path(`M${y===166?193:207} ${y}H${y===166?437:423}`,'#BFE0D2',1.5)).join('')+`<ellipse cx="315" cy="166" rx="178" ry="50" transform="rotate(-24 315 166)" fill="none" stroke="url(#METAL)" stroke-width="4"/>`;
  case 'steps':return Array.from({length:5},(_,i)=>rect(152+i*67,222-i*34,57,42+i*34,'url(#METAL)',3)+rect(159+i*67,230-i*34,43,30+i*34,'#4C638B',1)).join('')+path('M152 248L459 79','url(#METAL)',2);
  case 'comb':return rect(169,79,291,170,'url(#METAL)',19)+rect(181,91,267,146,'#374F53',12)+Array.from({length:8},(_,i)=>path(`M${205+i*29} 50V280`,'#DAD3B4',i<4?3:1.5)).join('')+circle(316,164,51,'#A8845E','url(#METAL)',5);
  case 'smoke':return Array.from({length:10},(_,i)=>path(`M${151+i*27} 285C${80+i*26} 203 ${435-i*12} 208 ${291+i*8} ${41+i*9}`,'url(#METAL)',i%3===0?5:1.5)).join('')+path('M116 263Q315 295 515 262','#D9C0D5',1);
  case 'mask':return path('M203 56L315 37L427 56L451 165L401 268H229L179 165Z','#E7E3CA',4,'url(#METAL)')+path('M225 83L315 65L406 83L419 164L380 240H250L211 164Z','#BACDCC',2,'#344C56')+path('M238 138l54 17-51 13M392 138l-54 17 51 13','#D1E3D9',7)+path('M273 204H357','#DAD7C0',5);
  case 'disc':return circle(389,162,128,'url(#METAL)','none')+circle(389,162,116,'#243E58','none')+Array.from({length:11},(_,i)=>circle(389,162,45+i*6,'none','#C9E1D144',.8)).join('')+circle(389,162,35,'#CB4E3A','#F1C59B',2)+circle(389,162,6,'#293E57','none')+`<g transform="rotate(-8 200 159)">${rect(111,65,164,199,'#F3D6A5',1)}<text x="127" y="143" fill="#29415B" font-family="system-ui,sans-serif" font-weight="800" font-size="45">SEVEN</text><text x="127" y="185" fill="#29415B" font-family="system-ui,sans-serif" font-weight="800" font-size="36">NATION</text><text x="127" y="228" fill="#BE4534" font-family="system-ui,sans-serif" font-weight="800" font-size="45">ARMY</text></g>`;
  case 'water':return Array.from({length:8},(_,i)=>path(`M93 ${111+i*18}Q196 ${53+i*20} 315 ${120+i*17}T537 ${131+i*13}`,'url(#METAL)',2)).join('')+circle(315,163,81,'none','#C0E0D3',3)+circle(315,163,65,'#2B596A66','url(#METAL)',6);
  case 'rings':return circle(267,165,99,'none','url(#METAL)',16)+circle(371,165,99,'none','url(#METAL)',16)+path('M185 69Q315 9 458 77','#F8E8C3',2)+path('M267 67L315 35L368 67','url(#METAL)',2);
  case 'piano':return `<g transform="rotate(-12 315 169)">${rect(151,72,335,196,'#223B4E',9)}${Array.from({length:9},(_,i)=>rect(161+i*35,88,32,164,'url(#METAL)',2)).join('')}${[0,1,3,4,5,7].map(i=>rect(182+i*35,87,22,99,'#243F4D',2)).join('')}</g>`;
  case 'arcs':return Array.from({length:7},(_,i)=>path(`M${164-i*12} 274A${151+i*12} ${151+i*12} 0 0 1 ${466+i*12} 274`,['#F0D3AB','#DDBA9B','#BCB1C4','#9ABAC6','#A3D3CB','#CDD8B8','#E4CBA8'][i],9)).join('');
  case 'orbit':return circle(315,164,76,'url(#METAL)','none')+`<ellipse cx="315" cy="164" rx="190" ry="57" transform="rotate(-25 315 164)" fill="none" stroke="url(#METAL)" stroke-width="4"/>`+path('M315 45L333 96H297Z','#F2E5BB',1,'#D9E7D5')+Array.from({length:18},(_,i)=>circle(90+(i*79)%440,41+(i*43)%245,1+i%2,'#F2E9CA','none')).join('');
  default:return '';
 }
}
export function achievementArtwork(def,namespace=''){
 if(!def.music)return `<img class="achievement-artwork" src="./achievement-art/${esc(def.id)}.svg" alt="" width="580" height="398" loading="lazy" decoding="async">`;
 const m=def.music,style=MUSIC_ART[m.id]||{colors:['#D1DCD0','#667D8D','#2E486D'],object:'orbit',code:'DFT'},p='music-art-'+namespace+m.id,events=rewardFor(m)?.events||[],low=Math.min(...events.map(e=>e.midi)),high=Math.max(...events.map(e=>e.midi)),end=Math.max(1,...events.map(e=>e.start+e.beats)),[a,b,c]=style.colors;
 const drawing=object(style.object).replaceAll('#METAL','#'+p+'-metal');
 return `<svg class="music-sleeve achievement-artwork" viewBox="0 0 630 398" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="${p}-bg" x2="1" y2="1"><stop stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient><linearGradient id="${p}-metal" x2="1" y2="1"><stop stop-color="#F5DBAD"/><stop offset=".3" stop-color="#B7DCD3"/><stop offset=".58" stop-color="#8BA6D3"/><stop offset=".82" stop-color="#E2B5BD"/><stop offset="1" stop-color="#EAD5A5"/></linearGradient></defs><rect width="630" height="398" fill="url(#${p}-bg)"/><path d="M0 301L630 68V398H0Z" fill="${c}" opacity=".25"/>${drawing}<text x="25" y="34" fill="#FFFFFF" font-family="system-ui,sans-serif" font-weight="650" font-size="12" letter-spacing="2">DFT / ${esc(style.code)}</text><rect x="25" y="304" width="580" height="76" rx="8" fill="#122B40" stroke="#C7DBD2" stroke-opacity=".4"/>${[325,340,355,370].map(y=>`<path d="M42 ${y}H588" stroke="#B4C9CA" stroke-opacity=".16" stroke-width=".8"/>`).join('')}<g class="music-events">${events.map((e,i)=>`<rect class="midi-event" data-midi="${e.midi}" data-event-index="${i}" data-start="${e.start}" data-beats="${e.beats}" style="--note-delay:${50+e.start*rewardFor(m).step*1000}ms;--note-duration:${Math.max(100,e.beats*rewardFor(m).step*1000)}ms" x="${42+e.start/end*546}" y="${364-(e.midi-low)/Math.max(1,high-low)*43}" width="${Math.max(.8,e.beats/end*546-.8)}" height="5" rx="1.5" fill="${i%3===0?'#F3D18D':i%3===1?'#C7DFD1':'#B5D1F1'}"/>`).join('')}</g></svg>`;
}
