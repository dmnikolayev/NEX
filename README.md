# NEX Living House v0.5 — Clean Scene

У цій версії прибрано всі великі дублюючі панелі:

- Internet panel
- Solar panel
- Transformer card
- Deye card
- Battery card
- великі іконки House Log

Залишено лише сцену, погоду, годинник, компактний House Log та п’ять HUD, прив’язаних до фізичних об’єктів.

## Запуск

```bash
python3 -m http.server 8080
```

Відкрити `http://localhost:8080`.

## Підключення даних

Значення мають `data-value` атрибути, тому їх можна напряму оновлювати з `HouseState` або `ha-adapter.js`.
