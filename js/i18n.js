
const dictionaries = {
  uk: {
    "brand.subtitle": "ЖИВИЙ БУДИНОК",
    "grid.label": "МЕРЕЖА",
    "solar.today": "СЬОГОДНІ",
    "settings.title": "НАЛАШТУВАННЯ",
    "settings.language": "МОВА",
    "status.demo": "ДЕМО",
    "status.live": "LIVE",
    "status.error": "ПОМИЛКА",
    "event.charging": "Батарея заряджається",
    "event.gridOk": "Мережа в нормі",
    "spirit.gridRestored": "⚡ Мережу відновлено",
    "spirit.batteryFull": "🔋 Батарея повністю заряджена",
    "spirit.cat": "🐈 Мур-р-р..."
  },
  en: {
    "brand.subtitle": "LIVING HOUSE",
    "grid.label": "GRID",
    "solar.today": "TODAY",
    "settings.title": "SETTINGS",
    "settings.language": "LANGUAGE",
    "status.demo": "DEMO",
    "status.live": "LIVE",
    "status.error": "ERROR",
    "event.charging": "Battery is charging",
    "event.gridOk": "Grid is normal",
    "spirit.gridRestored": "⚡ Grid restored",
    "spirit.batteryFull": "🔋 Battery fully charged",
    "spirit.cat": "🐈 Purr..."
  }
};

const STORAGE_KEY = "nex.language";
let language = localStorage.getItem(STORAGE_KEY) || "uk";
if (!dictionaries[language]) language = "uk";

export function t(key) {
  return dictionaries[language]?.[key] ?? dictionaries.uk[key] ?? key;
}

export function getLanguage() {
  return language;
}

export function getLocale() {
  return language === "en" ? "en-GB" : "uk-UA";
}

export function applyLanguage(nextLanguage = language) {
  if (!dictionaries[nextLanguage]) return;
  language = nextLanguage;
  localStorage.setItem(STORAGE_KEY, language);
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll('input[name="language"]').forEach(input => {
    input.checked = input.value === language;
  });

  window.dispatchEvent(new CustomEvent("nex:languagechange", {
    detail: { language }
  }));
}
