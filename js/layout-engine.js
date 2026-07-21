export class LayoutEngine {
  constructor(){this.current=null;this.listeners=new Set()}
  async init(){await this.load();window.addEventListener('resize',()=>this.load())}
  mode(){const w=window.innerWidth;return w<700?'mobile':w<1100?'tablet':'desktop'}
  async load(){const mode=this.mode();const r=await fetch(`layout/${mode}.json`,{cache:'no-store'});this.current=await r.json();this.apply();for(const fn of this.listeners)fn(this.current)}
  apply(){for(const key of ['grid','solar','deye','battery','internet']){const p=this.current[key];const n=document.querySelector(key==='internet'?'.internet-hud':`.hud--${key}`);if(n){n.style.left=`${p.x}%`;n.style.top=`${p.y}%`}}}
  subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
}