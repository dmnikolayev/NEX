# NEX Living House v4 layout

Перший перехід до затвердженого дизайну:

- центральний будинок;
- верхня панель NEX, час і погода;
- події зліва;
- статистика дня справа;
- підписи біля фізичних об'єктів;
- нижній енергетичний ланцюг;
- компактний статусний рядок;
- NEX-кіт.

Запуск:

```bash
python3 -m http.server 8080
```


## UI v1 / Data Engine

This release introduces a centralized `HouseState` store.

All screen values now render from one state object:

- Grid
- Solar
- Inverter
- Battery
- House
- Internet
- Weather
- Today statistics
- Events

`app.js` only renders and connects data sources. Home Assistant updates are written into `HouseState`.


## UI v2 — Concept Polish
- Enlarged the house scene and reduced visual duplication from the prototype artwork.
- Rebuilt the energy centre as five separate glass modules with animated links.
- Repositioned physical-object labels and the NEX cat closer to the approved concept.
- Refined top bar, timeline, Today panel, spacing, blur, shadows and typography.
