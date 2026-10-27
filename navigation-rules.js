/** UX contract: one clear next action; Branch → Path → Chapter → Activity. No pedagogical locks. */
export const NAVIGATION_RULES = Object.freeze({
  reviewAfterMs: 24 * 60 * 60 * 1000,
  branches: Object.freeze(["beginner", "guided", "targeted"]),
});
export const branchForRoute = (route) =>
  route === "beginner"
    ? "beginner"
    : route === "guided"
      ? "guided"
      : "targeted";
export function reviewRecommendation(catalog, data, route, now = Date.now()) {
  const scopes = route === "guided" ? ["z1", "cs1", "cs2"] : [route];
  const attempts = (data.attempts || []).filter(
    (a) =>
      a.finished &&
      catalog.activities.some(
        (m) => m.id === a.activity && scopes.includes(m.scopeId),
      ),
  );
  const last = attempts.at(-1);
  if (!last) return null;
  const resolved =
    last &&
    data.attempts.some(
      (a) =>
        a.at > last.at &&
        a.passed &&
        a.activity.startsWith("review") &&
        a.comparisonKey?.includes(":" + last.activity + ":"),
    );
  if (last.passed === false && !resolved && last.events.some((e) => !e.correct))
    return {
      activity: last.activity,
      kind: "errors",
      text: "Reprenons les notes qui vous ont posé problème.",
      source: last,
    };
  const valid = attempts.filter((a) => a.passed).at(-1);
  if (valid && now - last.at >= NAVIGATION_RULES.reviewAfterMs)
    return {
      activity: valid.activity,
      kind: "return",
      text: "Après cette pause, retrouvons vos repères.",
    };
  return null;
}

/** A right swipe returns; a left swipe follows existing forward history; instrument gestures and controls keep priority. */
export function parentNavigation(nav={}) {
 if(nav.chapter)return {...nav,branch:nav.branch||branchForRoute(nav.route),chapter:null};
 if(nav.route)return {...nav,branch:nav.branch||branchForRoute(nav.route),route:null,chapter:null};
 if(nav.branch)return {branch:null,route:null,chapter:null};
 return null;
}
export function bindParentSwipe(root,{enabled,back,forward=()=>{}}) {
 let start=null,consumeUntil=0;
 const excluded='input,select,textarea,summary,[role="slider"],.neck-viewport,.position-grid,.answer-wheel,.pilot-wheel,[data-pilot-action="note"],.pilot-position-buttons,.achievement-card,.mobile-nav,svg,dialog';
 root.addEventListener('pointerdown',e=>{
  consumeUntil=0;start=null;if(e.pointerType==='mouse'||!e.isPrimary||!enabled()||e.target.closest(excluded)||document.querySelector('dialog[open]'))return;
  start={id:e.pointerId,x:e.clientX,y:e.clientY,time:performance.now()};
 });
 root.addEventListener('touchmove',e=>{
  if(!start||e.touches.length!==1)return;const touch=e.touches[0],dx=touch.clientX-start.x,dy=touch.clientY-start.y;
  if(Math.abs(dx) > 12&&Math.abs(dx)>Math.abs(dy)*1.7&&e.cancelable)e.preventDefault();
 },{passive:false});
 root.addEventListener('pointerup',e=>{
  const from=start;start=null;if(!from||from.id!==e.pointerId||!enabled())return;
  const dx=e.clientX-from.x,dy=e.clientY-from.y;
  if(Math.abs(dx) > 70&&Math.abs(dx)>Math.abs(dy)*1.7&&performance.now()-from.time<900){consumeUntil=performance.now()+400;if(dx>0)back();else forward();}
 });
 root.addEventListener('pointercancel',()=>{start=null;});
 root.addEventListener('click',e=>{if(performance.now()<consumeUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
}
