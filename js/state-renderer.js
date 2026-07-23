import {t, getLocale} from "./i18n.js";
export class StateRenderer{
  constructor(state){this.state=state;this.last={}}
  init(){this.tickClock();setInterval(()=>this.tickClock(),30000);this.makeBatteryBars()}
  tickClock(){
    const now=new Date();
    text("clock-time",now.toLocaleTimeString(getLocale(),{hour:"2-digit",minute:"2-digit"}));
    const raw=now.toLocaleDateString(getLocale(),{weekday:"long",day:"numeric",month:"long"});
    text("clock-date",raw.charAt(0).toUpperCase()+raw.slice(1));
  }
  render(s){
    text("grid-voltage",`${fmt(s.grid.voltage,1)} ${getLocale()==="uk-UA"?"В":"V"}`);
    setLamp("grid-lamp",!!s.grid.online);

    text("solar-power",power(s.solar.power));
    text("solar-today",`${fmt(s.solar.today,1)} ${getLocale()==="uk-UA"?"кВт·год":"kWh"}`);

    text("deye-load",power(s.house.power));
    text("deye-temp",`${fmt(s.inverter?.temperature,0)}°C`);
    document.getElementById("deye-ring")?.classList.toggle("charging",Number(s.battery.power)>30);

    text("battery-runtime",duration(s.battery.runtimeMinutes));
    text("battery-temp",`${fmt(s.battery.temperature,0)}°C`);
    this.fillBattery(s.battery.soc);
    this.renderBatteryFlow(s);
    this.renderEvents(s.events);
    this.detectEvents(s);
  }
  makeBatteryBars(){
    const root=document.getElementById("battery-bars");if(!root)return;
    root.replaceChildren(...Array.from({length:10},()=>document.createElement("i")));
  }
  fillBattery(soc){
    const count=Math.round(Math.max(0,Math.min(100,Number(soc)||0))/10);
    document.querySelectorAll("#battery-bars i").forEach((n,i)=>n.classList.toggle("on",i<count));
  }
  renderBatteryFlow(s){
    const watts=Number(s.battery.power)||0;
    const root=document.getElementById("battery-flow");
    const onBattery=!s.grid.online || watts< -20;
    const charging=watts>20;
    const visible=onBattery || charging;
    if(!root)return;
    root.hidden=!visible;
    root.classList.toggle("charging",charging);
    root.classList.toggle("discharging",onBattery&&!charging);
    text("battery-arrow",charging?"↓":"↑");
    text("battery-power",power(Math.abs(watts)));
  }
  renderEvents(events=[]){
    const fallback=[{time:"09:12",text:getLocale()==="uk-UA"?"+2,0 кВт":"+2.0 kW"},{time:"09:05",text:t("event.charging")},{time:"08:47",text:t("event.gridOk")}];
    const rows=(events.length?events:fallback).slice(0,4);
    document.getElementById("house-log").innerHTML=rows.map(e=>`<article class="house-log__row"><time>${safe(e.time||"")}</time><span>${safe(e.text||"")}</span></article>`).join("");
  }
  detectEvents(s){
    if(this.last.gridOnline===false&&s.grid.online)this.spirit(t("spirit.gridRestored"));
        if(this.last.soc<99&&s.battery.soc>=99)this.spirit(t("spirit.batteryFull"));
    this.last={gridOnline:s.grid.online,soc:s.battery.soc};
  }
  spirit(message){
    const n=document.getElementById("house-spirit");if(!n)return;
    n.textContent=message;n.classList.add("show");clearTimeout(this.spiritTimer);
    this.spiritTimer=setTimeout(()=>n.classList.remove("show"),4000);
  }
}
const text=(id,v)=>{const n=document.getElementById(id);if(n)n.textContent=v};
const fmt=(n,d=0)=>Number(n||0).toLocaleString(getLocale(),{minimumFractionDigits:d,maximumFractionDigits:d});
const signed=n=>`${Number(n)>0?"+":""}${fmt(n,0)}`;
const power=w=>Math.abs(Number(w||0))>=1000
  ?`${fmt(Number(w)/1000,1)} ${getLocale()==="uk-UA"?"кВт":"kW"}`
  :`${fmt(w,0)} ${getLocale()==="uk-UA"?"Вт":"W"}`;
const duration=m=>{
  m=Math.max(0,Math.round(Number(m||0)));
  return getLocale()==="uk-UA"
    ?`${Math.floor(m/60)} год ${String(m%60).padStart(2,"0")} хв`
    :`${Math.floor(m/60)}h ${String(m%60).padStart(2,"0")}m`;
};
const setLamp=(id,on)=>document.getElementById(id)?.classList.toggle("off",!on);
const safe=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
