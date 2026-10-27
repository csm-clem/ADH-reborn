/** Browser history and presentation memory. No learning result is stored in history. */
export class NavigationController {
 constructor({root,read,restore,window:win=globalThis.window}){this.root=root;this.read=read;this.restore=restore;this.win=win;this.views=new Map();this.current=null;this.restoring=false;this.frame=0;this.win.history.scrollRestoration='manual';this.win.addEventListener('popstate',e=>{const state=e.state?.dftNavigation;if(!state)return;this.capture();this.restoring=true;try{restore(state);}finally{this.restoring=false;}});}
 key(s){return JSON.stringify([s.profile,s.screen,s.nav?.branch,s.nav?.route,s.nav?.chapter,s.course,s.activity]);}
 capture(){if(!this.current)return;const details=[...this.root.querySelectorAll('details')].map((el,i)=>({key:el.dataset.memoryKey||el.id||String(i),open:el.open}));const focus=this.root.contains(this.win.document.activeElement)?this.win.document.activeElement:null;this.views.set(this.key(this.current),{scroll:this.win.scrollY,details,focus:focus?.id||null});}
 beforeRender(){this.capture();}
 afterRender(){const state=this.read();if(!state.profile)return;const changed=!this.current||this.key(state)!==this.key(this.current);if(!this.restoring){if(!this.current)this.win.history.replaceState({...this.win.history.state,dftNavigation:state},'');else if(changed)this.win.history.pushState({dftNavigation:state},'');}this.current=structuredClone(state);const memory=this.views.get(this.key(state));if(memory){for(const [i,el]of [...this.root.querySelectorAll('details')].entries()){const item=memory.details.find(d=>d.key===(el.dataset.memoryKey||el.id||String(i)));if(item)el.open=item.open;}}
  const restoreFocus=this.restoring;this.win.cancelAnimationFrame(this.frame);this.frame=this.win.requestAnimationFrame(()=>{this.win.scrollTo(0,memory?.scroll||0);if(restoreFocus&&memory?.focus)this.win.document.getElementById(memory.focus)?.focus({preventScroll:true});});
 }
}
