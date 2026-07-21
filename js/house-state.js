(() => {
"use strict";

const initialState = {
  grid: {
    voltage: 230,
    frequency: 50.0,
    online: true,
    power: 0
  },
  solar: {
    power: 1800,
    today: 6.4
  },
  inverter: {
    power: 1800,
    mode: "Сонячний режим"
  },
  battery: {
    soc: 82,
    runtimeHours: 13,
    power: 430,
    usedToday: 9
  },
  house: {
    power: 820,
    today: 4.9
  },
  internet: {
    online: true,
    ping: 27
  },
  weather: {
    temperature: 18,
    state: "Хмарно"
  },
  today: {
    outages: 1,
    blackout: "2 хв"
  },
  events: [
    { time: "08:41", title: "Сонце прокинулося", detail: "Панелі почали генерацію" },
    { time: "08:18", title: "Мережа стабільна", detail: "Напруга повернулась у норму" },
    { time: "07:42", title: "Будинок прокинувся", detail: "Споживання зросло до 820 Вт" }
  ]
};

function deepMerge(target, patch) {
  for (const [key, value] of Object.entries(patch || {})) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      target[key] = deepMerge({ ...(target[key] || {}) }, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

const listeners = new Set();
let state = structuredClone(initialState);

window.HouseState = {
  get() {
    return structuredClone(state);
  },

  set(patch) {
    state = deepMerge(structuredClone(state), patch);
    listeners.forEach((listener) => listener(this.get()));
  },

  replace(nextState) {
    state = deepMerge(structuredClone(initialState), nextState);
    listeners.forEach((listener) => listener(this.get()));
  },

  subscribe(listener) {
    listeners.add(listener);
    listener(this.get());
    return () => listeners.delete(listener);
  },

  reset() {
    state = structuredClone(initialState);
    listeners.forEach((listener) => listener(this.get()));
  }
};
})();