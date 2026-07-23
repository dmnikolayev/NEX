import {HouseState} from "./house-state.js";
import {DataAdapter} from "./data-adapter.js";
import {StateRenderer} from "./state-renderer.js";
import {LayoutEngine} from "./layout-engine.js";
import {EnergyFlow} from "./energy-flow.js";

const initial={
  grid:{online:true,power:1800,voltage:236.8,temperature:39},
  solar:{power:1800,today:5.2},
  house:{online:true,power:1800,today:5.2},
  inverter:{temperature:39},
  battery:{soc:82,runtimeMinutes:1278,temperature:21,power:-420},
  events:[]
};

const state=new HouseState(initial);
const renderer=new StateRenderer(state);
const layout=new LayoutEngine();

renderer.init();
await layout.init();
state.subscribe(s=>renderer.render(s));
renderer.render(state.value);

const flow=new EnergyFlow(document.getElementById("energy-flow"),state,layout);
flow.start();

const badge=document.getElementById("connection-badge");
const adapter=new DataAdapter(window.NEX_CONFIG||{mode:"demo"},state,(label,cls)=>{
  badge.textContent=label;badge.className=`connection-badge ${cls||""}`;
});
adapter.start();

const cat=document.getElementById("nex-cat");
function animateCat(showMessage=false){
  if(!cat)return;
  cat.classList.remove("pet");
  void cat.offsetWidth;
  cat.classList.add("pet");
  setTimeout(()=>cat.classList.remove("pet"),1500);
  if(showMessage)renderer.spirit("🐈 Мур-р-р...");
}
cat?.addEventListener("click",()=>animateCat(true));
(function scheduleCat(){
  setTimeout(()=>{animateCat(false);scheduleCat()},60000+Math.random()*120000);
})();


const pulseButton=document.getElementById("pulse-details");
const pulseSystem=document.getElementById("pulse-system");
pulseButton?.addEventListener("click",()=>{
  const open=pulseSystem?.hasAttribute("hidden");
  if(open)pulseSystem?.removeAttribute("hidden");else pulseSystem?.setAttribute("hidden","");
  pulseButton.setAttribute("aria-expanded",String(!!open));
});

const systemApi=document.getElementById("system-api");
const originalStatus=adapter.onStatus;
adapter.onStatus=(label,cls)=>{
  originalStatus(label,cls);
  if(systemApi){systemApi.textContent=label;systemApi.classList.toggle("offline",cls==="error");}
};
