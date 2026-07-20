const boot=document.getElementById("boot");
const scene=document.getElementById("scene");

window.addEventListener("load",()=>{

    setTimeout(()=>{

        boot.classList.add("hide");

        scene.classList.add("show");

    },2000);

});
