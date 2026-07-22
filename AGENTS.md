# NEX Living House

## Product vision

NEX is not a traditional Home Assistant dashboard.

It is a living digital scene of the house.

The user looks at the house, not at dashboard cards.

## Core UI rules

- The house is the visual center.
- No large dashboard cards.
- No duplicated information.
- One physical object has one compact HUD.
- HUD elements must visually belong to their objects.
- Data should be minimal and readable at a glance.
- The scene should feel cinematic, calm, and premium.
- House Log looks like subtle subtitles, not a panel.
- Details may open only after clicking an object.
- Do not add new features until the static scene is clean.

## Current milestone

NEX v0.5 — Clean Scene.

Remove these legacy blocks completely:

- large Transformer panel
- large Solar panel
- large Starlink/Internet panel
- large DEYE panel
- large Battery panel
- large colored icons in House Log
- duplicated values

Keep:

- NEX logo
- clock and date
- compact weather
- subtle House Log
- compact HUD near transformer
- compact HUD near solar panels
- compact HUD near inverter/house
- compact HUD near battery
- compact HUD near Starlink
- background house image
- Home Assistant state integration

## Current known asset

Background images are located in:

assets/

Examples:

- assets/house-bg-v2.png
- assets/house-concept-v4.png

Do not remove or rename image assets without checking all references.

## Required workflow

1. Inspect the existing repository before editing.
2. Do not replace the project with a newly generated template.
3. Preserve the existing Home Assistant integration.
4. Preserve all working entity mappings.
5. Make small focused changes.
6. Show the diff after editing.
7. Do not commit or push until the user approves.
