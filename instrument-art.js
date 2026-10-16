/** Lightweight vector silhouettes, original drawings inspired by common instrument families. */
const MODELS={
 guitar6:{family:'strat',label:'guitare électrique à double échancrure, type Stratocaster',color:'#b64f35',edge:'#612c23',board:'#a56c3a',head:'inline',pickguard:true,pickups:3},
 guitar7:{family:'soloist',label:'guitare électrique sept cordes, type Soloist',color:'#713245',edge:'#241a28',board:'#413431',head:'pointed',pickups:2},
 guitar8:{family:'headless',label:'guitare électrique huit cordes sans tête, type Hz8',color:'#535361',edge:'#23252c',board:'#5c4333',head:'none',pickups:2},
 bass4:{family:'fender-bass',label:'basse quatre cordes, silhouette classique type Fender',color:'#c37d35',edge:'#4a271e',board:'#a87945',head:'bass',pickguard:true,pickups:2},
 bass5:{family:'ibanez-bass',label:'basse cinq cordes à corps sculpté, type Ibanez',color:'#387d79',edge:'#173e40',board:'#513e32',head:'compact',pickups:2},
 bass6:{family:'ibanez-bass',label:'basse six cordes à corps sculpté',color:'#aa764d',edge:'#4d3024',board:'#513e32',head:'compact',pickups:2}
};
const bodies={
 strat:'M600 127C608 109 600 87 614 57C621 39 630 39 632 53L634 97C641 108 654 110 663 98C676 83 687 80 704 87C730 97 750 108 771 127C808 159 797 209 766 232C734 254 687 246 667 226C655 214 645 209 631 208C609 205 594 193 593 174C592 158 601 146 600 127Z',
 soloist:'M601 128L615 38Q622 29 624 43L633 100Q642 115 655 100L681 65L699 86Q724 91 748 115C787 141 809 182 785 218C761 254 708 248 679 228Q651 207 624 209L594 188L599 154Z',
 headless:'M593 130L616 74Q627 64 630 79L632 108Q641 116 650 104L672 73L697 88Q724 98 749 123L782 126L797 160L776 177L789 199Q777 232 741 242L705 229L692 207L674 221L650 211Q622 210 606 190L592 168Z',
 'fender-bass':'M600 126C605 112 595 91 604 57Q614 28 625 40L633 94Q638 111 650 104Q664 94 666 77Q669 61 680 72C691 90 716 94 740 116C777 145 797 183 778 215C758 250 711 252 680 229Q652 206 629 211C599 213 584 196 588 176Q591 151 600 126Z',
 'ibanez-bass':'M600 130Q606 105 605 76L611 35Q619 23 626 42L635 98Q641 112 651 101L677 56Q684 46 686 65L683 91Q722 94 749 123C780 151 799 186 779 217C756 249 713 244 681 225Q658 209 633 212Q605 215 594 190Q587 164 600 130Z'
};
export function instrumentPicture(instrument){
 const m=MODELS[instrument.id],n=instrument.strings,bass=instrument.id.startsWith('bass'),headless=m.head==='none',id=`art-${instrument.id}`,nut=headless?156:139,bridge=headless?730:739,top=126,bottom=164;
 const strings=Array.from({length:n},(_,i)=>top+i*(bottom-top)/(n-1));
 const frets=Array.from({length:24},(_,i)=>nut+(bridge-nut)*(1-2**(-(i+1)/12)));
 const neck=`M${nut} 122L625 116L625 175L${nut} 168Z`;
 const head=m.head==='pointed'?'M139 122L37 100L22 114L96 165L139 168Z':m.head==='bass'?'M139 122L62 81Q33 72 28 98L22 130Q20 145 43 149L139 168Z':m.head==='compact'?'M139 122L74 107L42 125L60 163L139 168Z':'M139 122L61 90Q43 85 39 102L27 133Q25 146 44 148L139 168Z';
 const tunerPoints=Array.from({length:n},(_,i)=>{const split=m.head==='pointed'||m.head==='compact';return split?{x:58+Math.floor(i/2)*22,y:i%2?173:105}:{x:43+i*15,y:86+i*4};});
 const hardware=m.family==='headless'?'#202328':'#d3d6d9';
 return `<svg class="setup-instrument-picture" viewBox="250 0 570 280" role="img" aria-label="${m.label}, ${n} cordes" data-model="${m.family}"><defs><linearGradient id="${id}-body" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${m.edge}"/><stop offset=".36" stop-color="${m.color}"/><stop offset=".65" stop-color="${m.color}"/><stop offset="1" stop-color="${m.edge}"/></linearGradient><linearGradient id="${id}-metal" x2="0" y2="1"><stop stop-color="#f6f6f4"/><stop offset=".5" stop-color="#88909a"/><stop offset="1" stop-color="#dce0e4"/></linearGradient><linearGradient id="${id}-wood"><stop stop-color="#bc8b56"/><stop offset=".45" stop-color="#e4bc80"/><stop offset="1" stop-color="#ba8851"/></linearGradient></defs><ellipse cx="540" cy="256" rx="260" ry="6" fill="#44516b" opacity=".08"/><path d="${bodies[m.family]}" fill="url(#${id}-body)" stroke="${m.edge}" stroke-width="2"/><path d="${bodies[m.family]}" fill="none" stroke="white" stroke-opacity=".2" stroke-width="1" transform="translate(3 -2)"/>
 ${m.pickguard?`<path d="M616 114Q639 124 657 103Q680 100 701 118L720 176L705 202L672 214L636 189L605 178Z" fill="#efeee7" stroke="#bcb9ad" stroke-width="1.5"/>`:''}
 <g transform="translate(260 65.25) scale(.58 .55)">${!headless?`<path d="${head}" fill="url(#${id}-wood)" stroke="#9d7448" stroke-width="1.5"/>${tunerPoints.map(p=>`<g><path d="M${p.x} ${p.y+12}V${p.y}" stroke="#8b939c" stroke-width="4"/><ellipse cx="${p.x}" cy="${p.y}" rx="6" ry="5" fill="url(#${id}-metal)"/></g>`).join('')}`:`<rect x="146" y="120" width="13" height="50" rx="3" fill="#353941"/>`}
 <path d="${neck}" fill="${m.board}" stroke="#825e3b" stroke-width="1.5"/>${[1,2,3].map(i=>`<path d="M${nut+2} ${126+i*9}L620 ${121+i*12}" stroke="#e3c393" stroke-opacity=".15" fill="none"/>`).join('')}
 ${frets.map((x,i)=>`<path d="M${x} ${122-(x-nut)*6/(625-nut)}L${headless?x+3:x} ${168+(x-nut)*7/(625-nut)}" stroke="#bdc0be" stroke-width="1.7"/>${[2,4,6,8,14,16,18,20].includes(i)?`<circle cx="${(x+(frets[i-1]||nut))/2}" cy="145" r="2.3" fill="#e4d6bf"/>`:i===11?`<circle cx="${(x+frets[i-1])/2}" cy="135" r="2" fill="#e4d6bf"/><circle cx="${(x+frets[i-1])/2}" cy="155" r="2" fill="#e4d6bf"/>`:''}`).join('')}
 <path d="M${nut} 122V168" stroke="#eee6d7" stroke-width="4"/></g>
 ${Array.from({length:m.pickups},(_,i)=>{const x=bass?655+i*37:638+i*(m.pickups===3?30:55);return `<rect x="${x}" y="119" width="${m.pickups===3?12:22}" height="53" rx="4" fill="${m.pickguard&&!bass?'#eeeae0':'#24272c'}" stroke="#85888b" stroke-width="1"/>${strings.map(y=>`<circle cx="${x+6}" cy="${y}" r="1.5" fill="#b4b8ba"/>`).join('')}`;}).join('')}
 <rect x="${bridge-8}" y="118" width="${headless?30:23}" height="58" rx="3" fill="${hardware}" stroke="#777e86"/>
 ${strings.map((y,i)=>`<g data-art-string="${i+1}"><rect x="${bridge-5}" y="${y-2}" width="14" height="4" rx="1" fill="url(#${id}-metal)"/><path d="M${260+(headless?150:75)*.58} ${65.25+(headless?y:129+i*5)*.55}L${260+nut*.58} ${65.25+y*.55}L${bridge+8} ${y}" fill="none" stroke="#c9cbd0" stroke-width="${.65+i*.16}"/>${headless?`<rect x="${bridge+17}" y="${y-2}" width="12" height="4" rx="1" fill="#9b9fa7"/>`:''}</g>`).join('')}
 ${[0,1,2].slice(0,bass?3:2).map((_,i)=>`<circle cx="${723-i*22}" cy="${195+i*10}" r="7" fill="${bass?'#34383e':'#eee9dc'}" stroke="#878b91" stroke-width="1.5"/><path d="M${723-i*22} ${190+i*10}v3" stroke="#727880"/>`).join('')}
 ${m.family==='strat'?'<path d="M749 174l17 29 20 3" fill="none" stroke="#a4abb2" stroke-width="3" stroke-linecap="round"/>':''}<circle cx="787" cy="177" r="3" fill="#a3a8ad"/></svg>`;
}
