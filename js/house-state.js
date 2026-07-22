export class HouseState {
  constructor(initial){this.value=structuredClone(initial);this.listeners=new Set()}
  subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
  update(patch){this.value=merge(this.value,patch);for(const fn of this.listeners)fn(this.value)}
}
function merge(base,patch){
  const out={...base};
  for(const [k,v] of Object.entries(patch||{})){
    out[k]=v&&typeof v==="object"&&!Array.isArray(v)?merge(base?.[k]||{},v):v;
  }
  return out;
}
