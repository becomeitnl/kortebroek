// Draai met: node test.js
const assert = require("assert");
const { korteBroekOordeel } = require("./kortebroek.js");

const gevallen = [
  [{ gevoelTemp: 25, regenkans: 10, wind: 15 }, "ja"],
  [{ gevoelTemp: 15, regenkans: 10, wind: 10 }, "ja"],
  [{ gevoelTemp: 11, regenkans: 0, wind: 5 }, "nee"],
  [{ gevoelTemp: 26, regenkans: 90, wind: 10 }, "nee"],
  [{ gevoelTemp: 22, regenkans: 60, wind: 10 }, "twijfel"],
  [{ gevoelTemp: 14.5, regenkans: 10, wind: 10 }, "twijfel"],
  [{ gevoelTemp: 13, regenkans: 60, wind: 50 }, "nee"],
];

for (const [weer, verwacht] of gevallen) {
  const { oordeel, reden } = korteBroekOordeel(weer);
  assert.strictEqual(oordeel, verwacht, `${JSON.stringify(weer)} → ${oordeel} (${reden})`);
}
console.log(`Alle ${gevallen.length} tests geslaagd.`);
