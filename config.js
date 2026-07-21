window.NEX_CONFIG = {
  demoMode: true,
  storyRotationSeconds: 30,
  homeAssistant: { url: "", token: "" },
  entities: {
    gridVoltage: "sensor.deye_grid_voltage",
    gridOnline: "binary_sensor.grid_online",
    gridPower: "sensor.deye_grid_power",
    solarPower: "sensor.deye_pv_power",
    solarToday: "sensor.deye_pv_today",
    housePower: "sensor.deye_load_power",
    inverterPower: "sensor.deye_ac_output_power",
    inverterMode: "sensor.deye_work_mode",
    batterySoc: "sensor.deye_battery_soc",
    batteryRuntime: "sensor.nex_battery_runtime",
    batteryPower: "sensor.deye_battery_power",
    internetPing: "sensor.internet_ping",
    internetOnline: "binary_sensor.internet_online",
    weather: "weather.home"
  }
};
