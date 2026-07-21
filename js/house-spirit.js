class HouseSpirit{
 constructor(){this.timer=null;this.last=""}
 say(text,duration=8000){if(!text||text===this.last)return;const root=document.getElementById("houseSpirit"),bubble=document.getElementById("houseSpiritBubble");if(!root||!bubble)return;this.last=text;bubble.textContent=text;root.classList.add("talking");clearTimeout(this.timer);this.timer=setTimeout(()=>root.classList.remove("talking"),duration)}
}
window.houseSpirit=new HouseSpirit();
