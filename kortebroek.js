// Beslisregels: is het korte broeken weer?
// Los van de pagina gehouden zodat het ook te testen is met Node.

const DREMPELS = {
  minTemp: 15,      // °C, gevoelstemperatuur overdag (standaard, instelbaar op de site)
  koudMarge: 3,     // °C onder minTemp is het sowieso lange broek
  maxRegenkans: 50, // %
  maxWind: 40,      // km/u
};

// weer: { gevoelTemp, regenkans, wind }
// minTemp: vanaf hoeveel graden iemand een korte broek draagt
// geeft { oordeel: "ja" | "twijfel" | "nee", reden }
function korteBroekOordeel(weer, minTemp = DREMPELS.minTemp) {
  const { gevoelTemp, regenkans, wind } = weer;

  if (gevoelTemp < minTemp - DREMPELS.koudMarge) {
    return { oordeel: "nee", reden: `Te koud: het voelt maximaal als ${Math.round(gevoelTemp)}°C.` };
  }
  if (regenkans >= 80) {
    return { oordeel: "nee", reden: `Grote kans op regen (${regenkans}%).` };
  }

  const bezwaren = [];
  if (gevoelTemp < minTemp) bezwaren.push(`het is fris (${Math.round(gevoelTemp)}°C)`);
  if (regenkans > DREMPELS.maxRegenkans) bezwaren.push(`${regenkans}% kans op regen`);
  if (wind > DREMPELS.maxWind) bezwaren.push(`harde wind (${Math.round(wind)} km/u)`);

  if (bezwaren.length === 0) {
    return { oordeel: "ja", reden: `Lekker: tot ${Math.round(gevoelTemp)}°C en weinig kans op regen.` };
  }
  if (bezwaren.length === 1 && gevoelTemp >= minTemp - 1) {
    return { oordeel: "twijfel", reden: `Kan net, maar ${bezwaren[0]}.` };
  }
  return { oordeel: "nee", reden: `Liever niet: ${bezwaren.join(", ")}.` };
}

if (typeof module !== "undefined") {
  module.exports = { korteBroekOordeel, DREMPELS };
}
