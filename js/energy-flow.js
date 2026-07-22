export class EnergyFlow{
  constructor(canvas,state,layout){this.canvas=canvas;this.ctx=canvas.getContext("2d");this.state=state;this.layout=layout;this.dpr=Math.min(devicePixelRatio||1,2);addEventListener("resize",()=>this.fit(),{passive:true});layout.subscribe(()=>this.fit())}
  start(){this.fit();requestAnimationFrame(t=>this.frame(t))}
  fit(){const r=this.canvas.getBoundingClientRect();this.canvas.width=Math.round(r.width*this.dpr);this.canvas.height=Math.round(r.height*this.dpr);this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0)}
  frame(t){this.draw(t);requestAnimationFrame(x=>this.frame(x))}
  draw(t){
    if(!this.layout.current)return;
    const c=this.ctx,r=this.canvas.getBoundingClientRect(),a=this.layout.current.anchors||{};
    const p=k=>[a[k][0]*r.width/100,a[k][1]*r.height/100];
    c.clearRect(0,0,r.width,r.height);
    const deye=p("deye");
    this.path(p("grid"),deye,"rgba(255,190,88,.62)",Math.abs(this.state.value.grid.power)>20,t,0);
    this.path(p("solar"),deye,"rgba(255,215,86,.64)",this.state.value.solar.power>20,t,.25);
    const bp=Number(this.state.value.battery.power)||0;
    this.path(bp>=0?deye:p("battery"),bp>=0?p("battery"):deye,"rgba(105,232,160,.62)",Math.abs(bp)>20,t,.5);
    this.path(deye,p("house"),"rgba(116,192,255,.58)",this.state.value.house.power>20,t,.75);
  }
  path(from,to,color,active,t,phase){
    if(!from||!to)return;const c=this.ctx;c.save();
    c.strokeStyle=color;c.globalAlpha=.34;c.lineWidth=1.1;c.setLineDash([2,9]);c.beginPath();c.moveTo(...from);c.lineTo(...to);c.stroke();
    if(active){
      const speed=1900,q=((t/speed)+phase)%1,x=from[0]+(to[0]-from[0])*q,y=from[1]+(to[1]-from[1])*q;
      c.globalAlpha=1;c.shadowColor=color;c.shadowBlur=12;c.fillStyle=color;c.beginPath();c.arc(x,y,2.5,0,Math.PI*2);c.fill();
    }
    c.restore();
  }
}
