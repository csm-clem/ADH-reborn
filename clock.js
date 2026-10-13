/** Response timing independent of modal rendering, orientation and pointer gestures. */
export class ActiveClock {
  constructor(now=()=>performance.now()){this.now=now;this.reset();}
  reset(){this.total=0;this.since=this.now();this.reasons=new Set();}
  stop(reason){if(!this.reasons.size)this.total+=this.now()-this.since;this.reasons.add(reason);}
  resume(reason){if(!this.reasons.delete(reason))return;if(!this.reasons.size)this.since=this.now();}
  elapsed(){return Math.max(0,this.total+(this.reasons.size?0:this.now()-this.since));}
}
