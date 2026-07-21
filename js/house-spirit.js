(() => {
  "use strict";

  class HouseSpirit {
    constructor({ visibleMs = 8000 } = {}) {
      this.visibleMs = visibleMs;
      this.timer = null;
      this.active = false;
    }

    get element() {
      return document.getElementById("houseSpirit");
    }

    get bubble() {
      return document.getElementById("houseSpiritBubble");
    }

    say(text, { duration = this.visibleMs } = {}) {
      const element = this.element;
      const bubble = this.bubble;
      const message = String(text || "").trim();

      if (!element || !bubble || !message) return;

      clearTimeout(this.timer);
      bubble.textContent = message;
      element.classList.add("talking");
      this.active = true;

      this.timer = setTimeout(() => this.sleep(), duration);
    }

    wake() {
      const element = this.element;
      if (!element) return;
      element.classList.add("awake");
    }

    sleep() {
      const element = this.element;
      if (!element) return;

      clearTimeout(this.timer);
      element.classList.remove("talking", "awake");
      this.active = false;
    }
  }

  window.HouseSpirit = HouseSpirit;
  window.houseSpirit = new HouseSpirit();
})();
