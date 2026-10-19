"""Production illustration assets, separate from all HTML controls."""
from pathlib import Path
import json,math,re,subprocess,xml.etree.ElementTree as E
root=Path(__file__).resolve().parent.parent;out=root/'achievement-art';out.mkdir(exist_ok=True)
cards=json.loads(subprocess.run(['node','--input-type=module','-e',"import {ACHIEVEMENTS} from './achievement-catalog.js';console.log(JSON.stringify(ACHIEVEMENTS))"],cwd=root,text=True,capture_output=True,check=True).stdout)
def P(d,fill='none',stroke='url(#metal)',w=3,extra=''):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'
def C(x,y,r,fill='none',stroke='url(#metal)',w=3):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>'
def R(x,y,w,h,fill='url(#enamel)',rx=12,extra=''):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" {extra}/>'
def T(x,y,t,size=20,fill='#F8E8C7'):return f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Georgia,serif" font-size="{size}" fill="{fill}">{t}</text>'
def ring(x=315,y=280,r=95):return C(x+5,y+10,r,'#10232F33','none')+C(x,y,r,'url(#enamel)','url(#metal)',7)+C(x,y,r-11,'none','#C9DDD2',1)
def orbital(n=5):
 s=ring(r=70)
 for i in range(n):
  a=2*math.pi*i/n-.9;x=315+155*math.cos(a);y=280+109*math.sin(a)
  s+=P(f'M315 280L{x} {y}',stroke='#DFD8B0',w=2)+C(x,y,22,'url(#metal)','#A9D8CE',2)
 return s
def neck(i=0):
 s=R(128,180,372,188,'#183643',9,extra='stroke="url(#metal)" stroke-width="6"')
 for j in range(7):s+=P(f'M{164+j*49} 181V367',stroke='#B2D5CB',w=1.8)
 for j in range(5):s+=P(f'M130 {210+j*31}H499',stroke='#D5CCAB',w=1)
 s+=C(211+i*47,241,12,'url(#foil)','none')+C(355-i*23,303,12,'url(#metal)','none')
 return '<g transform="rotate(-10 315 275)">'+s+'</g>'
def wave(n=4):
 return ''.join(P(f'M66 {230+i*18}C150 {80+i*12} 215 {420-i*8} 315 {248+i*8}S490 {155+i*12} 564 {240+i*12}',stroke='url(#foil)',w=3)for i in range(n))
def steps(n=4):
 return ''.join(R(147+i*72,345-i*48,61,40+i*48,'url(#metal)',6)+P(f'M{156+i*72} {356-i*48}H{195+i*72}',stroke='#FFFFFF',w=1) for i in range(n))
def vinyl(x=315,y=276,r=126):
 s=C(x+7,y+10,r,'#0E233333','none')+C(x,y,r,'url(#foil)','none')+C(x,y,r-10,'#17354B','none')
 s+=''.join(C(x,y,j,'none','#BED4CB55',.7)for j in range(48,r-12,9))
 return s+C(x,y,38,'url(#enamel)','#E2D8B9',2)+C(x,y,6,'#132B3C','none')
def flag(x,y):return P(f'M{x} {y+120}V{y}L{x+100} {y+25}L{x} {y+49}','url(#foil)','url(#metal)',4)
def seal():return ring(r=119)+P('M255 281L297 322L379 229',stroke='url(#foil)',w=18)

draw={
 'opens-named':lambda: ''.join(P(f'M{142+i*68} 381V{158+i%2*25}',stroke='#405B5B',w=7)+C(142+i*68,158+i%2*25,20,'url(#metal)','#F8E7B8',2)for i in range(6)),
 'open-strings':lambda: P('M91 257Q315 63 539 257L539 351Q315 440 91 351Z','url(#metal)','#DCE6DC',2)+P('M112 258Q315 105 518 258V334Q315 403 112 334Z','url(#enamel)','none',0)+''.join(P(f'M{150+i*67} 230V340',stroke='#DDE8CC',w=2)+C(150+i*67,277,9,'url(#foil)','none')for i in range(6)),
 'diagram-check':lambda: neck()+P('M98 151H193M98 151V217M524 386H432M524 386V327',stroke='url(#foil)',w=8),
 'beginner-route':lambda: R(156,157,318,227,'url(#metal)',16)+R(169,170,292,201,'url(#enamel)',10)+P('M235 223H383M235 248H354M235 273H335',stroke='#E3E8CC',w=5)+C(373,307,47,'url(#metal)','#E9E4CA',2)+P('M352 307l15 16 29-33',stroke='#254951',w=6),
 'first-discovery':lambda: ''.join(C(x,y,20,'url(#metal)','#F1DCA5',3)for x,y in [(170,215),(282,183),(438,233),(368,363),(215,328)])+P('M170 215C260 105 468 162 438 233S430 392 368 363S161 411 215 328S167 258 170 215',stroke='url(#foil)',w=5),
 'first-cumulative':lambda: orbital(7)+C(315,280,39,'url(#foil)','none')+P('M315 255V305M290 280H340',stroke='#244451',w=7),
 'natural-map':lambda: neck()+''.join(P(f'M100 {150+i*35}C260 {95+i*40} 360 {470-i*20} 535 {174+i*25}',stroke='#96B8A477',w=1)for i in range(6)),
 'full-map':lambda: R(150,161,324,227,'url(#metal)',25)+R(162,174,300,201,'url(#enamel)',16)+P('M179 214H445M179 242H445M179 270H445M179 298H445M228 187V357M285 187V357M342 187V357M399 187V357',stroke='#ADC8BB',w=1.5)+P('M220 284l58 54 132-130',stroke='url(#foil)',w=13),
 'z2-natural':lambda: ''.join(P(f'M{95+i*28} 398C{127+i*16} 330 {205+i*25} 148 {518-i*16} {145+i*17}',stroke='url(#foil)',w=1.3)for i in range(13))+ring(r=77)+T(315,302,'II',61),
 'z2-full':lambda: R(115,201,396,171,'url(#enamel)',6)+P('M125 210L202 150H435L501 210','url(#metal)','#F3E6C5',2)+P('M134 234H494M134 343H494',stroke='#E7D4B1',w=2)+P('M223 212V362M315 212V362M407 212V362',stroke='url(#foil)',w=3)+T(315,304,'II',60),
 'z3-natural':lambda: steps(5)+C(461,137,29,'url(#foil)','#D8E4CE',2)+P('M109 389Q260 374 461 137',stroke='#DDDCB4',w=2),
 'z3-full':lambda: '<g transform="rotate(-12 315 278)">'+''.join(R(119+i*80,201-i*7,72,166,'url(#metal)',8)+R(128+i*80,210-i*7,54,144,'url(#enamel)',4)for i in range(5))+'</g>'+T(315,298,'XII',68),
 'first-string-full':lambda: P('M85 332C164 374 186 153 318 191S457 374 552 197',stroke='#254B56',w=16)+P('M85 326C164 368 186 147 318 185S457 368 552 191',stroke='url(#foil)',w=8)+C(85,327,20,'url(#metal)','none')+C(552,193,20,'url(#metal)','none'),
 'second-string-full':lambda: P('M149 365Q65 92 315 151Q565 92 481 365',stroke='url(#metal)',w=18)+P('M149 365Q315 211 481 365',stroke='url(#foil)',w=5)+P('M315 151V294',stroke='#B8E1D5',w=3)+C(315,294,27,'url(#enamel)','#F3DFB4',4),
 'third-string-full':lambda: '<g transform="rotate(-12 315 278)">'+''.join(R(178+i*93,168,62,214,'url(#metal)',30)+R(188+i*93,181,42,188,'url(#enamel)',20)for i in range(3))+'</g>'+P('M122 340C216 426 420 409 526 204',stroke='url(#foil)',w=3),
 'same-pitch-bridges':lambda: ''.join(P(f'M{143+i*142} 350V229Q{213+i*142} 126 {282+i*142} 229V350','url(#enamel)','url(#metal)',9)for i in range(2))+P('M144 280H424',stroke='url(#foil)',w=8)+C(143,280,16,'#EFD4A3','none')+C(425,280,16,'#B7E5DC','none'),
 'octave-family':lambda: ''.join(R(197+i*27,344-i*61,235,31,'url(#metal)',8)+C(222+i*27,359-i*61,8,'url(#enamel)','none')for i in range(4))+P('M145 359V160M135 179l10-19 10 19',stroke='url(#foil)',w=4),
 'boundary-four':lambda: P('M101 331V222Q208 96 315 222Q422 96 529 222V331',stroke='url(#metal)',w=19)+P('M101 330H529',stroke='#ADC8BE',w=4)+P('M315 191V376',stroke='url(#foil)',w=6)+C(315,282,35,'url(#enamel)','#EEE1C1',3)+T(315,293,'4',34),
 'boundary-eight':lambda: '<g transform="rotate(-12 315 280)">'+P('M315 280C103 55 63 424 252 385C431 349 532 119 385 152C230 186 203 449 469 357',stroke='url(#metal)',w=15)+P('M315 280C103 55 63 424 252 385C431 349 532 119 385 152C230 186 203 449 469 357',stroke='#BCE0CD',w=2)+'</g>'+C(315,280,26,'url(#foil)','none'),
 'guided-level-one':lambda: steps(4)+flag(404,142)+P('M94 386Q310 420 508 202',stroke='url(#foil)',w=3),
 'three-natural-zones':lambda: ''.join(C(216+i*100,251+i%2*56,91,'none','url(#metal)',9)for i in range(3))+P('M110 361Q315 99 523 348',stroke='url(#foil)',w=4),
 'clean-session':lambda: seal()+''.join(C(315+145*math.cos(i*math.pi/10),280+145*math.sin(i*math.pi/10),3,'#A9C4AF','none')for i in range(20)),
 'perfect-name':lambda: ring(r=125)+T(315,313,'A',104)+P('M210 365Q315 426 420 365',stroke='url(#foil)',w=6),
 'perfect-find':lambda: ''.join(C(315,279,r,'none','url(#metal)',5 if r==120 else 2)for r in [120,85,46])+C(315,279,16,'url(#foil)','none')+P('M315 120V153M315 405V438M155 279H188M442 279H475',stroke='#D4DBC0',w=4),
 'perfect-natural':lambda: P('M192 174H456V366H192Z','url(#enamel)','url(#metal)',7)+P('M166 208H430V399H166Z','url(#enamel)','url(#metal)',7)+P('M229 297l42 42 95-103',stroke='url(#foil)',w=15),
 'perfect-chromatic':lambda: orbital(12)+C(315,280,50,'url(#foil)','none')+P('M292 280l17 17 34-41',stroke='#27434E',w=7),
 'repeat-proof':lambda: C(253,278,107,'url(#enamel)','url(#metal)',9)+C(384,278,107,'url(#enamel)','url(#metal)',9)+P('M214 276l28 29 49-58M345 276l28 29 49-58',stroke='url(#foil)',w=10),
 'personal-fluidity':lambda: P('M134 361L245 295L319 321L469 175',stroke='url(#metal)',w=19)+P('M399 175H469V247',stroke='url(#foil)',w=12)+''.join(C(x,y,16,'url(#enamel)','#D7E6D3',3)for x,y in [(134,361),(245,295),(319,321)]),
 'two-second':lambda: ring(r=132)+P('M315 278L382 202M315 278V170',stroke='url(#foil)',w=10)+C(315,278,10,'#DFDDC3','none')+P('M111 199H180M94 224H163M90 249H150',stroke='#A6CBC6',w=5),
 'three-flashes':lambda: ''.join(P(f'M{x+41} 161L{x-35} 287H{x+5}L{x-11} 386L{x+78} 254H{x+30}Z','url(#foil)','#D7E3DA',1.5)for x in [170,295,420]),
 'fluent-zones':lambda: wave(6)+''.join(C(154+i*155,276,54,'url(#enamel)','url(#metal)',7)+T(154+i*155,289,['I','II','III'][i],32)for i in range(3)),
 'first-chain':lambda: ''.join('<g transform="rotate(-24 '+str(200+i*100)+' 280)">'+R(144+i*100,242,112,76,'url(#metal)',35)+R(157+i*100,254,86,52,'url(#enamel)',26)+'</g>'for i in range(3)),
 'first-sleeve':lambda: R(134,171,232,237,'url(#metal)',5)+vinyl(370,274,127)+R(150,186,113,33,'url(#enamel)',1)+P('M164 365L248 281',stroke='#E0E4C9',w=4),
 'three-sleeves':lambda: ''.join('<g transform="rotate('+str(-16+i*16)+' 315 305)">'+R(188,173-i*6,254,238,'url(#metal)',4)+C(315,280,79,'url(#enamel)','#C5DED1',2)+'</g>'for i in range(3)),
 'seven-sleeves':lambda: ''.join('<g transform="rotate('+str(-33+i*11)+' 315 362)">'+R(194,163,242,230,'url(#metal)',4)+R(207,177,216,204,'url(#enamel)',1)+'</g>'for i in range(7))+C(315,276,64,'url(#foil)','none')+T(315,294,'7',57,'#233F4B'),
 'three-clean-phrases':lambda: wave(3)+''.join(C(179+i*133,279,43,'url(#enamel)','url(#metal)',5)+P(f'M{161+i*133} 278l13 14 27-30',stroke='url(#foil)',w=6)for i in range(3)),
 'three-strings':lambda: ''.join(P(f'M{143+i*165} 380Q{65+i*172} 172 {253+i*120} 158',stroke='url(#foil)',w=6)for i in range(3))+''.join(C(x,y,20,'url(#metal)','none')for x,y in [(143,380),(308,380),(473,380)]),
 'beta-encore':lambda: P('M196 168H434L418 275Q406 329 315 337Q224 329 212 275Z','url(#metal)','#F7E7B4',3)+P('M196 193Q98 153 138 263Q151 303 232 301M434 193Q532 153 492 263Q479 303 398 301',stroke='url(#foil)',w=14)+R(300,333,30,51,'url(#metal)',3)+R(241,380,148,20,'url(#metal)',7)+P('M315 192l14 29 33 5-24 23 5 33-28-15-28 15 5-33-24-23 33-5Z','url(#enamel)','#F8E7C4',2)
}

draw.update({
 'perfect-natural-z2':lambda: P('M148 362V219Q230 118 313 219Q397 118 480 219V362','url(#enamel)','url(#metal)',10)+P('M147 304H480',stroke='url(#foil)',w=6)+C(315,265,34,'url(#foil)','none')+T(315,277,'II',34,'#25444C'),
 'perfect-natural-z3':lambda: ''.join(C(201+i*111,285-i%2*70,69,'url(#enamel)','url(#metal)',7)for i in range(3))+P('M201 285L312 215L423 285',stroke='url(#foil)',w=5)+T(315,380,'III',40),
 'perfect-chromatic-z2':lambda: P('M315 118L450 216L405 367H225L180 216Z','url(#enamel)','url(#metal)',8)+P('M315 118V365M180 216L405 367M450 216L225 367',stroke='url(#foil)',w=3)+C(315,269,52,'url(#foil)','none')+T(315,284,'II',44,'#25444C'),
 'perfect-chromatic-z3':lambda: ''.join('<g transform="rotate('+str(-55+i*10)+' 315 370)">'+R(301,147,28,223,'url(#metal)',12)+'</g>'for i in range(12))+C(315,370,39,'url(#enamel)','#F3DDB3',5)+T(315,384,'III',31)
})
cards += [{**c,'id':c['id']+'-'+zone} for c in list(cards) if c['id'] in ['perfect-natural','perfect-chromatic'] for zone in ['z2','z3']]
originals={'first-session':'01-commune','first-family':'02-inhabituelle','one-second':'04-epique','beta-atlas':'05-legendaire'}
for c in cards:
 id=c['id'];level=c['level']
 if id in originals:
  f=(root/'docs/succes-direction-artistique/svg'/f'{originals[id]}.svg').read_text()
  defs=re.search(r'<defs>.*?</defs>',f,re.S).group()
  content=re.search(r'(<g clip-path=.*?</g>)<rect x="25" y="88"',f,re.S).group(1)
  if id=='first-family':
   content=re.sub(r'>E[₂₃₄]?</text>','>●</text>',content).replace('CARTOGRAPHIE / E','UNE MÊME FAMILLE')
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="25 88 580 398">{defs}<g font-family="system-ui,sans-serif">{content}</g></svg>'
 else:
  assert id in draw,id
  colors=[('#DFC6A2','#B18968','#A05033'),('#D9E6DF','#AFC8BC','#286C73'),('#718FAF','#263C5B','#3C65A9'),('#2B4965','#102132','#729FBC'),('#243943','#081722','#DDB866')][level-1]
  defs=f'''<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="{colors[0]}"/><stop offset="1" stop-color="{colors[1]}"/></linearGradient><linearGradient id="metal" x2=".8" y2="1"><stop stop-color="#FBE7B6"/><stop offset=".22" stop-color="#8EAAAE"/><stop offset=".46" stop-color="#EFF4D8"/><stop offset=".68" stop-color="{colors[2]}"/><stop offset="1" stop-color="#D0DABF"/></linearGradient><radialGradient id="enamel" cx=".3" cy=".2" r=".9"><stop stop-color="{colors[2]}"/><stop offset="1" stop-color="#17394B"/></radialGradient><linearGradient id="foil" x2="1" y2="1"><stop stop-color="#E9C276"/><stop offset=".32" stop-color="#B7E7D2"/><stop offset=".58" stop-color="#94A6E9"/><stop offset=".8" stop-color="#E6B0C4"/><stop offset="1" stop-color="#F0D397"/></linearGradient><pattern id="grain" width="11" height="13" patternUnits="userSpaceOnUse"><path d="M1 2l1 .4M8 9l1-.6" stroke="#fff" stroke-width=".6" opacity=".2"/></pattern></defs>'''
  s=R(25,88,580,398,'url(#bg)',0)+R(25,88,580,398,'url(#grain)',0)
  for i in range(10):s+=P(f'M{40+i*25} 480C{123+i*25} 362 {192+i*19} 125 {582-i*4} {121+i*24}',stroke='#F5E9C644',w=.6)
  s+=C(435,198,143,'#E3E9C412','none')+C(435,198,134,'none','#E6EED333',1)
  s+=draw[id]()+P('M61 142H118M61 142V165M569 435H518M569 435V412',stroke='#F7E4B5',w=1)
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="25 88 580 398">{defs}{s}</svg>'
 E.fromstring(svg)
 (out/f'{id}.svg').write_text(svg)
print('Illustrations uniques :',len(cards))
