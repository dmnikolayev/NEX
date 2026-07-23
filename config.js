window.NEX_CONFIG = {
  // "endpoint" uses your existing ha_api.py and is recommended.
  // "homeAssistant" polls Home Assistant REST directly.
  // "demo" keeps sample values.
  mode: "endpoint",

  pollMs: 10000,

  endpoint: {
    url: "/api/house-state"
  },

  homeAssistant: {
    baseUrl: "http://homeassistant.local:8123",
    token: "",
    entities: {
      solarPower: "",
      solarToday: "",
      housePower: "",
      houseToday: "",
      houseOnline: "",
      inverterTemperature: "",
      batterySoc: "",
      batteryRuntime: "",
      batteryTemperature: "",
      batteryPower: "",
      gridPower: "",
      gridVoltage: "",
      gridTemperature: "",
      internetOnline: "",
      internetUpload: "",
      internetDownload: "",
      weatherTemperature: "",
      weatherCondition: "",
      weatherForecast: ""
    }
  }
};
