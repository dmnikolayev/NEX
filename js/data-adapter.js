export class DataAdapter {
  constructor(config,state,onStatus){this.config=config;this.state=state;this.onStatus=onStatus;this.timer=null}
  start(){this.refresh();this.timer=setInterval(()=>this.refresh(),Math.max(5000,this.config.pollMs||10000))}
  async refresh(){
    const mode=this.config.mode||"demo";
    if(mode==="demo"){this.onStatus("DEMO","demo");return}
    try{
      const patch=mode==="endpoint"?await this.fromEndpoint():await this.fromHomeAssistant();
      this.state.update(patch);
      this.onStatus("LIVE","live");
    }catch(error){
      console.warn("NEX data adapter:",error);
      this.onStatus("OFFLINE","error");
    }
  }
  async fromEndpoint(){
    const url=this.config.endpoint?.url||"/api/house-state";
    const response=await fetch(url,{cache:"no-store"});
    if(!response.ok)throw new Error(`${url}: HTTP ${response.status}`);
    return normalize(await response.json());
  }
  async fromHomeAssistant(){
    const ha=this.config.homeAssistant||{}, base=(ha.baseUrl||"").replace(/\/$/,"");
    if(!base)throw new Error("Home Assistant baseUrl is empty");
    const entries=Object.entries(ha.entities||{}).filter(([,id])=>id);
    if(!entries.length)throw new Error("No Home Assistant entities configured");
    const headers=ha.token?{Authorization:`Bearer ${ha.token}`}:{};
    const data={};
    await Promise.all(entries.map(async([key,id])=>{
      const r=await fetch(`${base}/api/states/${encodeURIComponent(id)}`,{headers,cache:"no-store"});
      if(!r.ok)throw new Error(`${id}: HTTP ${r.status}`);
      data[key]=await r.json();
    }));
    return mapHA(data);
  }
}
function normalize(raw){
  // Accepts either the native NEX HouseState or a flat API response.
  if(raw.grid||raw.solar||raw.battery||raw.house)return raw;
  return {
    grid:{online:bool(raw.grid_online,true),power:num(raw.grid_power),voltage:num(raw.grid_voltage),temperature:num(raw.grid_temperature)},
    solar:{power:num(raw.solar_power),today:num(raw.solar_today)},
    house:{power:num(raw.house_power),today:num(raw.house_today)},
    battery:{soc:num(raw.battery_soc),runtimeMinutes:runtime(raw.battery_runtime),temperature:num(raw.battery_temperature),power:num(raw.battery_power)},
    internet:{online:bool(raw.internet_online,true),ping:num(raw.internet_ping)},
    weather:raw.weather||{forecast:[]},
    events:Array.isArray(raw.events)?raw.events:[]
  };
}
function mapHA(v){
  const val=k=>v[k]?.state, attrs=k=>v[k]?.attributes||{}, good=k=>v[k]&&!["unknown","unavailable",""].includes(String(val(k)??""));
  const forecast=good("weatherForecast")?(attrs("weatherForecast").forecast||[]):[];
  return {
    solar:{power:good("solarPower")?num(val("solarPower")):0,today:good("solarToday")?num(val("solarToday")):0},
    house:{power:good("housePower")?num(val("housePower")):0,today:good("houseToday")?num(val("houseToday")):0},
    battery:{soc:good("batterySoc")?num(val("batterySoc")):0,runtimeMinutes:good("batteryRuntime")?runtime(val("batteryRuntime")):0,temperature:good("batteryTemperature")?num(val("batteryTemperature")):0,power:good("batteryPower")?num(val("batteryPower")):0},
    grid:{online:good("gridVoltage"),power:good("gridPower")?num(val("gridPower")):0,voltage:good("gridVoltage")?num(val("gridVoltage")):0,temperature:good("gridTemperature")?num(val("gridTemperature")):0},
    internet:{online:good("internetOnline")?bool(val("internetOnline"),false):true,ping:good("internetPing")?num(val("internetPing")):0},
    weather:{
      temp:good("weatherTemperature")?num(val("weatherTemperature")):num(attrs("weatherCondition").temperature),
      condition:good("weatherCondition")?String(val("weatherCondition")):"partlycloudy",
      forecast:forecast.slice(0,3).map(x=>({label:day(x.datetime),icon:icon(x.condition),high:num(x.temperature),low:num(x.templow)}))
    }
  };
}
const num=v=>Number.parseFloat(v)||0;
function bool(v,fallback=false){if(v===undefined||v===null||v==="")return fallback;return ["on","online","true","1","yes"].includes(String(v).toLowerCase())}
function runtime(v){if(typeof v==="number")return v;const s=String(v||"");const h=s.match(/(\d+)\s*h/i),m=s.match(/(\d+)\s*m/i);return h||m?Number(h?.[1]||0)*60+Number(m?.[1]||0):num(s)}
function day(v){if(!v)return "";return new Date(v).toLocaleDateString("uk-UA",{weekday:"short"})}
function icon(c){return ({sunny:"☀️",clear:"☀️",partlycloudy:"🌤️",cloudy:"☁️",rainy:"🌧️",pouring:"🌧️",snowy:"❄️",fog:"🌫️"})[c]||"🌤️"}
