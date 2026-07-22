export class LayoutEngine{
  constructor(){this.current=null;this.listeners=new Set()}
  async init(){await this.load();addEventListener("resize",()=>this.load(),{passive:true})}
  mode(){return innerWidth<700?"mobile":innerWidth<1100?"tablet":"desktop"}
  async load(){
    const r=await fetch(`layout/${this.mode()}.json`,{cache:"no-store"});
    if(!r.ok)throw new Error(`layout: ${r.status}`);
    this.current=await r.json();
    this.apply();
    for(const fn of this.listeners)fn(this.current);
  }
  apply(){
    for(const [key,p] of Object.entries(this.current.nodes||{})){
      const n=document.querySelector(`[data-node="${key}"]`);
      if(!n)continue;
      n.style.left=`${p.x}%`;n.style.top=`${p.y}%`;
      if(p.scale)n.style.setProperty("--node-scale",p.scale);
    }
    const bg=document.getElementById("scene-background");
    if(bg&&this.current.camera?.objectPosition)bg.style.objectPosition=this.current.camera.objectPosition;
  }
  subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
}
