# NEX Living House v0.8 — Sensors

Готова сцена з підключенням даних.

## Структура

- `assets/house-bg-v2.png` — чистий фон.
- `config.js` — спосіб інтеграції та entity ID.
- `js/data-adapter.js` — отримання даних.
- `js/state-renderer.js` — оновлення UI.
- `js/energy-flow.js` — потоки електроенергії.
- `layout/*.json` — координати.

## Варіант 1: існуючий ha_api.py (рекомендовано)

У `config.js`:

```js
mode: "endpoint",
endpoint: { url: "/api/house-state" }
```

Endpoint може повернути вкладений стан:

```json
{
  "solar": {"power": 2000, "today": 6.4},
  "house": {"power": 238, "today": 5.6},
  "battery": {"soc": 82, "runtimeMinutes": 1278, "temperature": 21, "power": 420},
  "grid": {"online": true, "power": 251, "voltage": 236.8, "temperature": 39},
  "internet": {"online": true, "ping": 27},
  "weather": {"forecast": []},
  "events": []
}
```

Підтримується також плоска відповідь з ключами `solar_power`, `battery_soc` тощо.

## Варіант 2: прямий Home Assistant REST

У `config.js`:

```js
mode: "homeAssistant"
```

Заповни `baseUrl`, `token` та entity ID.

Увага: для прямого запиту з іншого хоста Home Assistant має дозволяти CORS. Токен не варто публікувати в інтернеті. Для локального дисплея або same-origin proxy це допустимо, але endpoint через `ha_api.py` безпечніший.

## Запуск

```bash
python3 -m http.server 8080
```

Відкрити:

```text
http://IP_RASPBERRY:8080
```


## v0.8.1
- вирівняно індикатори Deye/Battery та погоду;
- додано кота NEX з реакцією на клік;
- додано `server.py`, який прибирає 404 для `/api/house-state`.

Запуск із демо API:
```bash
python3 server.py
```

Проксі до чинного ha_api.py:
```bash
NEX_API_URL=http://127.0.0.1:5000/api/house-state python3 server.py
```


## v0.8.3 Stable

- виправлено падіння JavaScript через подвійне оголошення `cat`;
- прибрано зелену смугу батареї з фонового PNG;
- смуга заряду тепер повністю генерується HTML/CSS;
- повернуто стабільний layout без зникнення HUD;
- акуратно вирівняно Deye, Battery, House та погоду;
- кіт залишився окремим інтерактивним шаром.
