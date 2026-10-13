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
