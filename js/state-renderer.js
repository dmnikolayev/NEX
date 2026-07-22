export class StateRenderer{
  constructor(state){this.state=state;this.last={}}
  init(){
    this.tickClock();setInterval(()=>this.tickClock(),30000);
    this.makeBatteryBars();
  }
  tickClock(){
    const now=new Date();
    text("clock-time",now.toLocaleTimeString("uk-UA",{hour:"2-digit",minute:"2-digit"}));
    const raw=now.toLocaleDateString("uk-UA",{weekday:"long",day:"numeric",month:"long"});
    text("clock-date",raw.charAt(0).toUpperCase()+raw.slice(1));
  }
  render(s){
    text("grid-power",power(s.grid.power));text("grid-voltage",`${fmt(s.grid.voltage,1)} V`);text("grid-temp",`${fmt(s.grid.temperature,0)}°C`);
    toggleOffline("grid-hud",!s.grid.online);
    text("internet-state",s.internet.online?"Online":"Offline");text("internet-ping",`${fmt(s.internet.ping,0)} ms`);
    toggleOffline("internet-hud",!s.internet.online);
    text("solar-power",power(s.solar.power));text("solar-today",`${fmt(s.solar.today,1)} kWh`);
    text("house-power",power(s.house.power));text("house-today",`${fmt(s.house.today,1)} kWh`);
    text("deye-power",power(s.house.power));
    document.getElementById("deye-ring")?.classList.toggle("charging",Number(s.battery.power)>30);
    text("battery-soc",`${fmt(s.battery.soc,0)}%`);
    text("battery-runtime",duration(s.battery.runtimeMinutes));
    text("battery-temp",`${fmt(s.battery.temperature,0)}°C`);
    this.fillBattery(s.battery.soc);
    this.renderWeather(s.weather);
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
  renderWeather(w={}){
    const fallback=[
      {label:"Сьогодні",icon:"🌤️",high:18,low:14},
      {label:"Ср",icon:"☀️",high:20,low:15},
      {label:"Чт",icon:"☀️",high:22,low:16}
    ];
    const rows=(w.forecast?.length?w.forecast:fallback).slice(0,3);
    document.getElementById("weather").innerHTML=rows.map(x=>`<article class="weather__day"><span class="weather__icon">${safe(x.icon||"🌤️")}</span><strong>${signed(x.high)}°</strong><small>${signed(x.low)}°</small></article>`).join("");
  }
  renderEvents(events=[]){
    const fallback=[
      {time:"09:12",text:"+2.0 кВт"},
      {time:"09:05",text:"Батарея заряджається"},
      {time:"08:47",text:"Мережа в нормі"},
      {time:"07:55",text:"Інтернет стабільний"}
    ];
    const rows=(events.length?events:fallback).slice(0,4);
    document.getElementById("house-log").innerHTML=rows.map(e=>`<article class="house-log__row"><time>${safe(e.time||"")}</time><span>${safe(e.text||"")}</span></article>`).join("");
  }
  detectEvents(s){
    if(this.last.gridOnline===false&&s.grid.online)this.spirit("⚡ Мережу відновлено");
    if(this.last.internetOnline===false&&s.internet.online)this.spirit("📡 Інтернет знову онлайн");
    if(this.last.soc<99&&s.battery.soc>=99)this.spirit("🔋 Батарея повністю заряджена");
    this.last={gridOnline:s.grid.online,internetOnline:s.internet.online,soc:s.battery.soc};
  }
  spirit(message){
    const n=document.getElementById("house-spirit");if(!n)return;
    n.textContent=message;n.classList.add("show");
    clearTimeout(this.spiritTimer);this.spiritTimer=setTimeout(()=>n.classList.remove("show"),4000);
  }
}
const text=(id,v)=>{const n=document.getElementById(id);if(n)n.textContent=v};
const fmt=(n,d=0)=>Number(n||0).toLocaleString("uk-UA",{minimumFractionDigits:d,maximumFractionDigits:d});
const signed=n=>`${Number(n)>0?"+":""}${fmt(n,0)}`;
const power=w=>Math.abs(Number(w||0))>=1000?`${fmt(Number(w)/1000,1)} kW`:`${fmt(w,0)} W`;
const duration=m=>{m=Math.max(0,Math.round(Number(m||0)));return `${Math.floor(m/60)}h ${String(m%60).padStart(2,"0")}m`};
const toggleOffline=(id,v)=>document.getElementById(id)?.classList.toggle("offline",v);
const safe=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
