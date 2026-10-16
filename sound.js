/** Karplus–Strong: a short noise excitation travelling along a damped string. */
export function pluckedString(hz,sampleRate=44100,seconds=1.6,random=Math.random){
  if(!Number.isFinite(hz)||hz<=0||hz>sampleRate/4)throw new Error('Pitch outside synthesis range');
  const samples=new Float32Array(Math.ceil(sampleRate*seconds));
  const delay=sampleRate/hz-.5,excitation=Math.ceil(delay)+1;
  const read=index=>{const i=Math.floor(index),fraction=index-i;return (samples[i]||0)*(1-fraction)+(samples[i+1]||0)*fraction;};
  // Higher notes cross the loop more often: compensate to retain a musical decay.
  const damping=Math.exp(-3/(hz*seconds));
  for(let i=0;i<samples.length;i++){
    samples[i]=i<excitation?(random()*2-1)*.65:.5*(read(i-delay)+read(i-delay-1))*damping;
    if(i<48)samples[i]*=i/48;
  }
  const fade=Math.min(512,samples.length);
  for(let i=0;i<fade;i++)samples[samples.length-1-i]*=i/fade;
  return samples;
}

export function instrumentVoice(instrumentId='guitar6'){return instrumentId.startsWith('bass')?'bass-electric':'guitar-clean';}
/** Clean magnetic-pickup timbres: pluck attack, harmonic-dependent decay, no distortion. */
export function electricString(hz,sampleRate=44100,seconds=1.8,voice='guitar-clean',random=Math.random){
 if(!Number.isFinite(hz)||hz<=0||hz>sampleRate/4)throw new Error('Pitch outside synthesis range');
 const bass=voice==='bass-electric',partials=bass?[1,.48,.2,.09,.045,.02]:[1,.6,.34,.22,.13,.085,.05,.025,.012],out=new Float32Array(Math.ceil(sampleRate*seconds));let peak=0;
 for(let i=0;i<out.length;i++){const t=i/sampleRate,attack=1-Math.exp(-t*(bass?650:950));let value=0;
  for(let n=1;n<=partials.length&&hz*n<sampleRate*.45;n++){const stretch=1+(bass?.000008:.00002)*n*n;value+=partials[n-1]*Math.sin(2*Math.PI*hz*n*stretch*t)*Math.exp(-t*((bass?1.8:2.2)+n*(bass?.22:.38)));}
  value=attack*value+(random()*2-1)*.025*Math.exp(-t*500);out[i]=value;peak=Math.max(peak,Math.abs(value));
 }
 const fade=Math.min(512,out.length);for(let i=0;i<out.length;i++)out[i]*=.8/(peak||1);for(let i=0;i<fade;i++)out[out.length-1-i]*=i/fade;return out;
}
