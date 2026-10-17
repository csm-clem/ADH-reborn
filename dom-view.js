/** Keyed DOM reconciliation: preserve layout, focus and ongoing animations between answers. */
const nodeKey=n=>n.nodeType===1?(n.getAttribute('data-view-key')||n.id||(n.hasAttribute('data-echo-id')?'echo:'+n.getAttribute('data-echo-id')+':'+(n.classList.contains('wrong')?'wrong':'right'):null)||(n.hasAttribute('data-note')?'note:'+n.getAttribute('data-note'):null)||(n.hasAttribute('data-pilot-string')?'cell:'+n.getAttribute('data-pilot-string')+':'+n.getAttribute('data-pilot-fret'):null)||(n.hasAttribute('data-lesson-string')?'lesson:'+n.getAttribute('data-lesson-string')+':'+n.getAttribute('data-lesson-fret'):null)):null;
const compatible=(a,b)=>a&&a.nodeType===b.nodeType&&(a.nodeType!==1||a.tagName===b.tagName&&a.namespaceURI===b.namespaceURI);
function sync(a,b){
 if(a.nodeType!==1){if(a.nodeValue!==b.nodeValue)a.nodeValue=b.nodeValue;return;}
 const layoutOwned=a.hasAttribute('data-layout-owned'),labelOwned=a.closest?.('.note-tag');
 const preserve=name=>(layoutOwned&&name==='style')||(labelOwned&&['transform','style','x','y','width','height'].includes(name));
 for(const attr of [...a.attributes])if(!b.hasAttribute(attr.name)&&!preserve(attr.name))a.removeAttribute(attr.name);
 for(const attr of b.attributes)if(!preserve(attr.name)&&a.getAttribute(attr.name)!==attr.value)a.setAttribute(attr.name,attr.value);
 patchChildren(a,b);
}
function patchChildren(parent,next){
 const old=[...parent.childNodes],keyed=new Map(old.map(n=>[nodeKey(n),n]).filter(([k])=>k)),used=new Set();let cursor=parent.firstChild;
 for(const desired of [...next.childNodes]){
  const k=nodeKey(desired);let actual=k?keyed.get(k):cursor;
  if(actual&&(used.has(actual)||!compatible(actual,desired)||(!k&&nodeKey(actual))))actual=null;
  if(!actual){actual=desired.cloneNode(true);parent.insertBefore(actual,cursor);}
  else {if(actual!==cursor)parent.insertBefore(actual,cursor);sync(actual,desired);}
  used.add(actual);cursor=actual.nextSibling;
 }
 for(const n of old)if(!used.has(n)&&n.parentNode===parent)n.remove();
}
export function renderView(root,html,key){
 if(root.dataset.renderView!==key){root.innerHTML=html;root.dataset.renderView=key;return;}
 const template=document.createElement('template');template.innerHTML=html;patchChildren(root,template.content);
}
