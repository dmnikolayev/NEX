(() => {
"use strict";

const $ = (id) => document.getElementById(id);
const cfg = window.NEX_CONFIG;
const stage = $("stage");

function fit() {
  const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform =
    `translate(${(innerWidth - 1920 * scale) / 2}px, ${(innerHeight - 1080 * scale) / 2}px) scale(${scale})`;
}
addEventListener("resize", fit);
fit();

function fmtPower(watts, latin = false) {
  const unitKw = latin ? "kW" : "кВт";
  const unitW = latin ? "W" : "Вт";
  return watts >= 1000
    ? `${(watts / 1000).toFixed(1)} ${unitKw}`
    : `${Math.round(watts)} ${unitW}`;
}

function renderEvents(events) {
  $("eventRows").innerHTML = events.slice(0, 3).map((event) => `
    <div class="event">
      <time>${event.time}</time>
      <p>${event.title}<small>${event.detail}</small></p>
    </div>
  `).join("");
}

function catPhrase(state) {
  if (!state.grid.online) {
    return "Світло пішло. Я вже перевів будинок на батарею.";
  }
  if (!state.internet.online) {
    return "Космос сьогодні мовчить.";
  }
  if (state.solar.power > state.house.power) {
    return "Сонце сьогодні старається.";
  }
  return "Поки все спокійно.";
}

function render(state) {
  $("gridVoltage").textContent = `${Math.round(state.grid.voltage)} V`;
  $("gridStatus").textContent = state.grid.online ? "Мережа є" : "Автономно";

  $("internetStatus").textContent = state.internet.online
    ? `Online · ${Math.round(state.internet.ping)} ms`
    : "Offline";

  $("solarPower").textContent = fmtPower(state.solar.power);
  $("inverterPower").textContent = state.inverter.mode;
  $("batteryRuntime").textContent = `≈ ${Math.round(state.battery.runtimeHours)} год`;
  $("housePower").textContent = fmtPower(state.house.power);

  $("solarDock").textContent = fmtPower(state.solar.power, true);
  $("deyeDock").textContent = fmtPower(state.inverter.power, true);
  $("batterySoc").textContent = `${Math.round(state.battery.soc)}%`;
  $("houseDock").textContent = fmtPower(state.house.power, true);

  $("footerGrid").textContent = state.grid.online ? "Online" : "Автономно";
  $("footerInternet").textContent = state.internet.online ? "Online" : "Offline";
  $("footerSolar").textContent = fmtPower(state.solar.power);
  $("footerBattery").textContent = `≈ ${Math.round(state.battery.runtimeHours)} год`;
  $("footerHouse").textContent = fmtPower(state.house.power);

  $("weatherTemp").textContent =
    `${state.weather.temperature >= 0 ? "+" : ""}${Math.round(state.weather.temperature)}°`;
  $("weatherState").textContent = state.weather.state;

  $("todayOutages").textContent = state.today.outages;
  $("todayBlackout").textContent = state.today.blackout;
  $("todaySolar").textContent = `${state.solar.today} кВт·год`;
  $("todayHouse").textContent = `${state.house.today} кВт·год`;
  $("todayBattery").textContent = `${state.battery.usedToday}%`;

  renderEvents(state.events);

  const speech = $("nexSpeech");
  const nex = $("nex");
  speech.textContent = catPhrase(state);
  nex.classList.add("talking");
  clearTimeout(render.hideCatTimer);
  render.hideCatTimer = setTimeout(() => nex.classList.remove("talking"), 8000);

  document.body.classList.toggle("grid-offline", !state.grid.online);
  document.body.classList.toggle("internet-offline", !state.internet.online);
}

function updateClock() {
  const now = new Date();
  $("clock").textContent = now.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit"
  });
  $("date").textContent = now.toLocaleDateString("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}
setInterval(updateClock, 1000);
updateClock();

function startDemo() {
  setInterval(() => {
    const current = HouseState.get();

    HouseState.set({
      solar: {
        power: Math.max(0, current.solar.power + (Math.random() - 0.48) * 180)
      },
      inverter: {
        power: Math.max(current.house.power, current.solar.power)
      },
      house: {
        power: Math.max(180, current.house.power + (Math.random() - 0.5) * 90)
      },
      internet: {
        ping: Math.max(8, current.internet.ping + (Math.random() - 0.5) * 4)
      }
    });
  }, 5000);
}

async function connectHA() {
  const url = cfg.homeAssistant.url ||
    `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/api/websocket`;

  const ws = new WebSocket(url);
  let id = 1;

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "auth_required") {
      ws.send(JSON.stringify({
        type: "auth",
        access_token: cfg.homeAssistant.token
      }));
      return;
    }

    if (message.type === "auth_ok") {
      ws.send(JSON.stringify({ id: id++, type: "get_states" }));
      return;
    }

    if (message.type === "result" && Array.isArray(message.result)) {
      applyStates(message.result);
      ws.send(JSON.stringify({
        id: id++,
        type: "subscribe_events",
        event_type: "state_changed"
      }));
      return;
    }

    if (message.type === "event" && message.event?.data?.new_state) {
      applyStates([message.event.data.new_state]);
    }
  };

  ws.onclose = () => setTimeout(connectHA, 5000);
}

function applyStates(list) {
  const map = Object.fromEntries(list.map((item) => [item.entity_id, item]));

  const numberValue = (key, fallback) => {
    const entity = map[cfg.entities[key]];
    const parsed = Number(entity?.state);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const boolValue = (key, fallback) => {
    const entity = map[cfg.entities[key]];
    if (!entity) return fallback;
    return ["on", "online", "true", "1", "home"].includes(
      String(entity.state).toLowerCase()
    );
  };

  const current = HouseState.get();
  const weather = map[cfg.entities.weather];

  HouseState.set({
    grid: {
      voltage: numberValue("gridVoltage", current.grid.voltage),
      online: boolValue("gridOnline", current.grid.online)
    },
    solar: {
      power: numberValue("solarPower", current.solar.power)
    },
    house: {
      power: numberValue("housePower", current.house.power)
    },
    inverter: {
      power: numberValue("solarPower", current.inverter.power)
    },
    battery: {
      soc: numberValue("batterySoc", current.battery.soc),
      runtimeHours: numberValue("batteryRuntime", current.battery.runtimeHours)
    },
    internet: {
      ping: numberValue("internetPing", current.internet.ping),
      online: boolValue("internetOnline", current.internet.online)
    },
    weather: weather ? {
      temperature: Number(weather.attributes.temperature ?? current.weather.temperature),
      state: weather.state || current.weather.state
    } : current.weather
  });
}

HouseState.subscribe(render);

if (cfg.demoMode) {
  startDemo();
} else {
  connectHA();
}
})();