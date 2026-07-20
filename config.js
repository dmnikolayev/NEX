window.NEX_CONFIG = {
  demoMode: true,
  homeAssistant: { url: "", token: "" },
  entities: {
    gridVoltage: "sensor.deye_grid_voltage",
    gridOnline: "binary_sensor.grid_online",
    solarPower: "sensor.deye_pv_power",
    housePower: "sensor.deye_load_power",
    batterySoc: "sensor.deye_battery_soc",
    batteryRuntime: "sensor.nex_battery_runtime",
    batteryPower: "sensor.deye_battery_power",
    internetDownload: "sensor.internet_download_speed",
    internetUpload: "sensor.internet_upload_speed",
    internetPing: "sensor.internet_ping",
    internetOnline: "binary_sensor.internet_online",
    weather: "weather.home",
    humidity: "sensor.outdoor_humidity",
    windSpeed: "sensor.wind_speed"
  }
};