export class HouseState {
  constructor(initial={}){this._value=structuredClone(initial);this.listeners=new Set()}
  get value(){return this._value}
  subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
  update(patch){this._value=deepMerge(this._value,patch);for(const fn of this.listeners)fn(this._value)}
}
function deepMerge(base,patch){const out={...base};for(const [key,value] of Object.entries(patch||{})){out[key]=value&&typeof value==='object'&&!Array.isArray(value)?deepMerge(base?.[key]||{},value):value}return out}