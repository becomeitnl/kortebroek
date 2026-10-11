# Korte Broek Weer? 🩳

Een eenvoudige website die elke dag vertelt of het korte broeken weer is.

- Gebruikt de gratis [Open-Meteo](https://open-meteo.com/) API (geen API-sleutel nodig).
- Vraagt om je locatie; weiger je dat, dan wordt De Bilt gebruikt.
- Je kunt ook een plaatsnaam intypen; die wordt onthouden in je browser.

## Hoe wordt beslist?

Op basis van de verwachting voor vandaag (zie `kortebroek.js`):

| Oordeel | Wanneer |
|---|---|
| 🩳 Ja | gevoelstemperatuur ≥ 20°C, regenkans ≤ 50%, wind ≤ 40 km/u |
| 🤔 Twijfel | warm genoeg, maar één bezwaar (wat regen, wind, of net onder de 20°C) |
| 👖 Nee | gevoelstemperatuur < 17°C, regenkans ≥ 80%, of meerdere bezwaren |

De drempels staan bovenaan in `kortebroek.js` en zijn makkelijk aan te passen.

## Lokaal draaien

Open `index.html` in je browser, of start een simpele server:

```sh
python3 -m http.server 8000
# ga naar http://localhost:8000
```

Tests van de beslisregels:

```sh
node test.js
```

## Online zetten

Het zijn alleen statische bestanden, dus GitHub Pages werkt direct:
Settings → Pages → *Deploy from a branch* → kies de branch en map `/ (root)`.
