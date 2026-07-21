export class HAAdapter {
  constructor(config,state){this.config=config;this.state=state;this.base=(config.baseUrl||'').replace(/\/$/,'')}
  start(){this.refresh();this.timer=setInterval(()=>this.refresh(),Math.max(5000,this.config.pollMs||15000))}
  async refresh(){const entries=Object.entries(this.config.entities||{}).filter(([,id])=>id);if(!entries.length)return;try{const values={};await Promise.all(entries.map(async([k,id])=>{const r=await fetch(`${this.base}/api/states/${encodeURIComponent(id)}`,{headers:this.config.token?{Authorization:`Bearer ${this.config.token}`}:{}});if(!r.ok)throw new Error(`${id}: ${r.status}`);values[k]=await r.json()}));this.apply(values)}catch(e){console.warn('NEX HA adapter:',e)}}
  apply(v){const n=k=>Number(v[k]?.state),text=k=>String(v[k]?.state??''),ok=k=>v[k]&&!['unavailable','unknown',''].includes(text(k));this.state.update({
    solar:{power:ok('solarPower')?n('solarPower'):this.state.value.solar.power,today:ok('solarToday')?n('solarToday'):this.state.value.solar.today},
    house:{power:ok('housePower')?n('housePower'):this.state.value.house.power,today:ok('houseToday')?n('houseToday'):this.state.value.house.today},
    battery:{soc:ok('batterySoc')?n('batterySoc'):this.state.value.battery.soc,runtimeMinutes:ok('batteryRuntime')?this.runtime(text('batteryRuntime')):this.state.value.battery.runtimeMinutes,temperature:ok('batteryTemperature')?n('batteryTemperature'):this.state.value.battery.temperature,power:ok('batteryPower')?n('batteryPower'):this.state.value.battery.power},
    grid:{online:ok('gridVoltage'),power:ok('gridPower')?n('gridPower'):this.state.value.grid.power,voltage:ok('gridVoltage')?n('gridVoltage'):this.state.value.grid.voltage,temperature:ok('gridTemperature')?n('gridTemperature'):this.state.value.grid.temperature},
    internet:{online:ok('internetOnline')?['on','online','true','1'].includes(text('internetOnline').toLowerCase()):this.state.value.internet.online,ping:ok('internetPing')?n('internetPing'):this.state.value.internet.ping}
  })}
  runtime(v){const h=v.match(/(\d+)\s*h/i),m=v.match(/(\d+)\s*m/i);if(h||m)return Number(h?.[1]||0)*60+Number(m?.[1]||0);return Number(v)||0}
}