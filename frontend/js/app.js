cat > frontend/js/app.js <<'EOF'
import { SceneEngine } from "./scene.js";

const BOOT_DURATION = 1600;

const boot = document.getElementById("boot");
const app = document.getElementById("app");

function updateClock() {
    const clock = document.getElementById("scene-clock");

    if (!clock) {
        return;
    }

    clock.textContent = new Intl.DateTimeFormat("uk-UA", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date());
}

function startNex() {
    const scene = new SceneEngine(app);

    scene.mount();

    updateClock();
    window.setInterval(updateClock, 1000);

    window.setTimeout(() => {
        boot.classList.add("boot--hidden");
    }, BOOT_DURATION);
}

window.addEventListener("DOMContentLoaded", startNex);
EOF
