/** Native details semantics, with cancellable height animation in both directions. */
export function bindDetailsMotion(root) {
  const motions = new WeakMap();
  root.addEventListener('click', event => {
    const summary = event.target.closest('summary');
    if (!summary || event.target.closest('a,button,input,select,textarea') || summary.parentElement?.tagName !== 'DETAILS') return;
    const details = summary.parentElement;
    // These cells select a note in an external panel and have no expanding body.
    if (details.classList.contains('progress-cell') || !details.children.length || details.children.length === 1 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    const current = motions.get(details), opening = current ? !current.opening : !details.open;
    const from = details.getBoundingClientRect().height;
    if (current) { current.animation.onfinish = null; current.animation.cancel(); }
    const previous = current?.previous || { height: details.style.height, overflow: details.style.overflow };
    details.style.height = ''; details.open = true;
    const full = details.getBoundingClientRect().height;
    const closed = summary.getBoundingClientRect().height + parseFloat(getComputedStyle(details).paddingTop || 0) + parseFloat(getComputedStyle(details).paddingBottom || 0) + parseFloat(getComputedStyle(details).borderTopWidth || 0) + parseFloat(getComputedStyle(details).borderBottomWidth || 0);
    details.style.overflow = 'hidden';
    const animation = details.animate([{height: `${from}px`}, {height: `${opening ? full : closed}px`}], {duration: 240, easing: 'ease-in-out'});
    motions.set(details, {animation, opening, previous});
    animation.onfinish = () => {
      if (motions.get(details)?.animation !== animation) return;
      details.open = opening; details.style.height = previous.height; details.style.overflow = previous.overflow;
      animation.cancel(); motions.delete(details);
    };
  });
}
