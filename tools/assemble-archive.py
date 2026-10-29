from pathlib import Path
import hashlib,json,struct,zipfile,xml.etree.ElementTree as ET

root=Path(__file__).resolve().parents[1]
m=json.loads((root/'archive-manifest.json').read_text())
out=root/'delivery';out.mkdir(exist_ok=True)
archive=out/m['filename'];whole=hashlib.sha256()
with archive.open('wb') as f:
 for p in m['parts']:
  data=(root/'archive-parts'/p['path']).read_bytes()
  assert len(data)==p['size'] and hashlib.sha256(data).hexdigest()==p['sha256']
  f.write(data);whole.update(data)
assert archive.stat().st_size==m['size'] and whole.hexdigest()==m['sha256']
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 pngs=[n for n in z.namelist() if n.startswith('png/') and n.endswith('.png')]
 svgs=[n for n in z.namelist() if n.startswith('svg/') and n.endswith('.svg')]
 assert len(pngs)==25 and len(svgs)==5
 for n in pngs:
  with z.open(n) as f:h=f.read(24)
  assert h[:8]==b'\x89PNG\r\n\x1a\n' and struct.unpack('>II',h[16:24])==(1024,1536)
 for n in svgs:ET.fromstring(z.read(n))
 selection=json.loads(z.read('selection.json'))
 note='# DFT — cinq styles de cartes sélectionnés\n\nLes cinq SVG sont autonomes. Cadre, textes, progression, boutons et décors vectoriels ; illustration PNG intégrée et masquée à sa fenêtre. Les microtextures sont reconstruites, sans promesse d’identité pixel par pixel. Maquettes graphiques, données simulées. Aucune modification de l’application.\n\n'
 for s in selection:note+='- '+s['rarity']+' '+s['variant']+' — '+s['name']+'\n'
 small=out/'DFT-selection-5-cartes-svg.zip'
 with zipfile.ZipFile(small,'w') as selected:
  for n in sorted(svgs)+['SELECTION.md']:
   entry=zipfile.ZipInfo(n,(2026,10,29,0,0,0));entry.compress_type=zipfile.ZIP_DEFLATED;entry.external_attr=0o100644<<16
   selected.writestr(entry,note.encode() if n=='SELECTION.md' else z.read(n),compresslevel=6)
for p in [archive,small]:
 sha=hashlib.sha256(p.read_bytes()).hexdigest()
 (out/(p.name+'.sha256')).write_text(sha+'  '+p.name+'\n')
 print(p.name,p.stat().st_size,sha)
print('Verified 25 PNGs, five SVGs, original archive CRC and SHA-256')
