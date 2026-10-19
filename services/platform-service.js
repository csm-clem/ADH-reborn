/** One set of browser subscriptions, independently disposable and testable. */
export function createPlatformService({getWindow=()=>globalThis.window,getDocument=()=>globalThis.document,delay=180}={}){
 let cleanup=()=>{},preference='light',media=null;
 function applyTheme(){const doc=getDocument();if(doc)doc.documentElement.dataset.theme=preference==='system'?(media?.matches?'dark':'light'):preference;}
 function connect(callbacks={}){
  cleanup();const win=getWindow(),doc=getDocument();if(!win||!doc)return ()=>{};const removers=[];let timer;
  function on(target,type,fn){target?.addEventListener(type,fn);removers.push(()=>target?.removeEventListener(type,fn));}
  media=win.matchMedia('(prefers-color-scheme: dark)');on(media,'change',applyTheme);
  on(doc,'visibilitychange',()=>{if(doc.hidden)callbacks.onHidden?.();else callbacks.onVisible?.();});on(win,'pagehide',()=>callbacks.onHidden?.());
  on(win,'resize',()=>{callbacks.onResize?.();clearTimeout(timer);timer=setTimeout(()=>callbacks.onResizeSettled?.(),delay);});
  on(doc,'fullscreenchange',()=>callbacks.onFullscreen?.(!!doc.fullscreenElement));
  on(win,'beforeinstallprompt',e=>{e.preventDefault();callbacks.onInstallPrompt?.(e);});
  let active=true;const dispose=()=>{if(!active)return;active=false;clearTimeout(timer);for(const remove of removers)remove();};cleanup=dispose;applyTheme();return dispose;
 }
 return Object.freeze({connect,setTheme(theme){preference=theme;applyTheme();},dispose(){cleanup();},
  async toggleFullscreen(){const doc=getDocument();if(doc.fullscreenElement){await doc.exitFullscreen();return true;}if(!doc.documentElement.requestFullscreen)return false;await doc.documentElement.requestFullscreen();return true;}
 });
}
export const platformService=createPlatformService();
