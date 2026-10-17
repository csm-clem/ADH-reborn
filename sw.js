const CACHE=`fretboard-trainer-v0.15.0:${self.registration.scope}`;
const ASSETS=['./','./index.html','./ui-kit.html','./ui.css','./tokens.css','./components.css','./progress.css','./progress.js','./style.css','./brand.css','./app.js','./release.js','./state.js','./instrument-art.js','./learning-help.js','./tuning.js','./onboarding.js','./onboarding.css','./pilot.js','./pilot-ui.js','./pilot.css','./neck-view.js','./neck.css','./answer-wheel.css','./discovery-feedback.js','./core.js','./clock.js','./sound.js','./melodies.js','./result.css','./results.js','./result-ui.js','./fonts/jost.ttf','./fonts/open-sans.ttf','./manifest.webmanifest','./instruments/guitar6strings.webp','./instruments/guitar7strings.webp','./instruments/guitar8strings.webp','./instruments/bass4strings.webp','./instruments/bass5strings.webp','./instruments/bass6strings.webp','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('adh-reborn-')||key.startsWith('fretboard-trainer-'))&&key.endsWith(`:${self.registration.scope}`)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request)).then(cached=>cached||fetch(event.request).catch(error=>{
    if(event.request.mode==='navigate')return caches.match(new URL('./index.html',self.registration.scope));
    throw error;
  })));
});
