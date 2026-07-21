(() => {
"use strict";
const initialState={
 grid:{voltage:230,online:true,power:821},solar:{power:1800,today:6.4},
 inverter:{power:1800,mode:"Сонячний режим"},battery:{soc:82,runtimeHours:13,power:430},
 house:{power:821},internet:{online:true,ping:27},weather:{temperature:18,state:"Хмарно",forecast:[
  {day:"Сьогодні",icon:"☁",high:18,low:14},{day:"Ср",icon:"🌤",high:20,low:15},{day:"Чт",icon:"☀",high:22,low:16}
 ]},
 events:[
  {time:"14:31",icon:"☀",title:"Сонячна генерація",detail:"1.8 кВт",priority:2},
  {time:"14:30",icon:"⚡",title:"Перехід на сонячну енергію",detail:"Інвертор працює в нормі",priority:2},
  {time:"14:28",icon:"🔌",title:"Мережа відновлена",detail:"Напруга 230 В",priority:3},
  {time:"13:55",icon:"◉",title:"Інтернет відновлено",detail:"Starlink Online",priority:2},
  {time:"11:12",icon:"▣",title:"Будинок в автономії",detail:"Споживання від батареї",priority:3},
  {time:"06:31",icon:"☾",title:"Нічний режим",detail:"Будинок в автономії",priority:1}
 ],
 summaries:[
  {time:"",icon:"☀",title:"Сонце сьогодні",detail:"6.4 кВт·год"},
  {time:"",icon:"⌂",title:"Будинок сьогодні",detail:"4.9 кВт·год"},
  {time:"",icon:"▣",title:"Використано батареї",detail:"9%"}
 ]
};
function merge(t,p){for(const[k,v]of Object.entries(p||{})){t[k]=v&&typeof v==="object"&&!Array.isArray(v)?merge({...t[k]},v):v}return t}
let state=structuredClone(initialState);const listeners=new Set();
window.HouseState={get:()=>structuredClone(state),set(p){state=merge(structuredClone(state),p);listeners.forEach(fn=>fn(structuredClone(state)))},subscribe(fn){listeners.add(fn);fn(structuredClone(state));return()=>listeners.delete(fn)},reset(){state=structuredClone(initialState);listeners.forEach(fn=>fn(structuredClone(state)))}};
})();
