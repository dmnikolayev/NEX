# NEX Living House — v0.3 step 2

Параметри:
- Solar: W зараз + kWh за день
- Deye/House: W зараз + kWh за день
- Battery: SOC + прогноз часу + температура
- Grid/Transformer: W + V + температура
- Internet: окремий online/offline + ping

## Підключення Home Assistant
Відкрий `config.js`, встав точні `entity_id`, токен і постав `enabled:true`.

## Старі картки
Цей `index.html` старих карток не містить. Якщо вони залишились — відкритий старий каталог або кеш.
Запусти нову папку на іншому порту:

```bash
cd NEX-v0.3-step2
python3 -m http.server 8081
```

Потім відкрий `http://IP:8081/` і зроби hard reload.
