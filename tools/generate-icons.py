"""Deterministic sunrise identity, warm for live and cool for the independent lab."""
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parent.parent/'icons'
for name,colors in [('live',('#bb4d00','#c33232')),('lab',('#23799b','#27339e'))]:
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="sunrise"><stop stop-color="{colors[0]}"/><stop offset="1" stop-color="{colors[1]}"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#sunrise)"/><g fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round"><path d="M135 125v262M215 125v262M295 125v262M375 125v262" opacity=".9"/><path d="M113 175h286M113 256h286M113 337h286" opacity=".45"/></g><circle cx="215" cy="256" r="32" fill="#fff"/></svg>\n'
 (ROOT/(name+'.svg')).write_text(svg)
 image=Image.new('RGBA',(1024,1024));pixels=image.load();a=tuple(bytes.fromhex(colors[0][1:]));b=tuple(bytes.fromhex(colors[1][1:]));
 for x in range(1024):
  color=tuple(round(a[i]+(b[i]-a[i])*x/1023) for i in range(3))+(255,)
  for y in range(1024):pixels[x,y]=color
 mask=Image.new('L',image.size);ImageDraw.Draw(mask).rounded_rectangle((0,0,1023,1023),224,fill=255);image.putalpha(mask)
 d=ImageDraw.Draw(image)
 for x in [135,215,295,375]:d.line((x*2,250,x*2,774),fill=(255,255,255,230),width=26)
 for y in [175,256,337]:d.line((226,y*2,798,y*2),fill=(255,255,255,160),width=26)
 d.ellipse((366,448,494,576),fill='white')
 for size in [192,512]:(image.resize((size,size),Image.Resampling.LANCZOS)).save(ROOT/f'{name}-{size}.png')
 image.resize((512,512),Image.Resampling.LANCZOS).save(ROOT/f'{name}-maskable-512.png')
 if name=='live':
  (ROOT/'icon.svg').write_text(svg)
  for size in [192,512]:(ROOT/f'icon-{size}.png').write_bytes((ROOT/f'{name}-{size}.png').read_bytes())
  (ROOT/'maskable-512.png').write_bytes((ROOT/f'{name}-maskable-512.png').read_bytes())
