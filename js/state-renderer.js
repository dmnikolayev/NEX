export class StateRenderer {
  constructor(state){this.state=state;this.spiritTimer=null}
  init(){this.tickClock();setInterval(()=>this.tickClock(),1000)}
  tickClock(){const now=new Date();set('clock',now.toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'}));set('date',now.toLocaleDateString('uk-UA',{weekday:'long',day:'numeric',month:'long'}))}
  render(s){
    set('gridPower',power(s.grid.power));set('gridVoltage',`${fmt(s.grid.voltage,1)} V`);set('gridTemp',`${fmt(s.grid.temperature,1)}°C`);
    set('solarPower',power(s.solar.power));set('solarToday',`${fmt(s.solar.today,1)} kWh`);
    set('deyeConsumption',power(s.house.power));set('deyeToday',`${fmt(s.house.today,1)} kWh`);
    set('batterySoc',`${fmt(s.battery.soc,0)}%`);set('batteryRuntime',duration(s.battery.runtimeMinutes));set('batteryTemp',`${fmt(s.battery.temperature,0)}°C`);
    set('internetPing',`${fmt(s.internet.ping,0)} ms`);set('internetState',s.internet.online?'Internet online':'Internet offline');
    set('weatherTemp',`${s.weather.temp>0?'+':''}${fmt(s.weather.temp,0)}°`);set('weatherState',s.weather.state);set('weatherIcon',s.weather.icon);
    const fill=document.querySelector('#batteryFill');if(fill)fill.style.width=`${Math.max(0,Math.min(100,s.battery.soc))}%`;
    document.querySelector('#gridStatus')?.classList.toggle('offline',!s.grid.online);document.querySelector('#internetStatus')?.classList.toggle('offline',!s.internet.online);
    const forecast=document.querySelector('#forecast');if(forecast)forecast.innerHTML=(s.weather.forecast||[]).map(([d,t])=>`<span>${d} ${t}</span>`).join('');
    const log=document.querySelector('#houseLog');if(log)log.innerHTML=(s.events||[]).slice(0,4).map(e=>`<div class="log-row"><time>${e.time}</time><span>${e.text}</span></div>`).join('');
  }
  spirit(message,timeout=4200){const n=document.querySelector('#spirit');if(!n)return;n.textContent=message;n.classList.add('show');clearTimeout(this.spiritTimer);this.spiritTimer=setTimeout(()=>n.classList.remove('show'),timeout)}
}
const set=(id,v)=>{const n=document.getElementById(id);if(n)n.textContent=v};
const fmt=(n,d=0)=>Number(n||0).toLocaleString('uk-UA',{minimumFractionDigits:d,maximumFractionDigits:d});
const power=w=>Math.abs(Number(w||0))>=1000?`${fmt(Number(w)/1000,1)} kW`:`${fmt(w,0)} W`;
const duration=m=>{m=Math.max(0,Math.round(Number(m||0)));return `${Math.floor(m/60)}h ${String(m%60).padStart(2,'0')}m`}