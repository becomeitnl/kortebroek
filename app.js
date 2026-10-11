const STANDAARD = { naam: "De Bilt", lat: 52.11, lon: 5.18 };

const TEKST = {
  ja: { emoji: "🩳", titel: "Ja! Korte broek aan." },
  twijfel: { emoji: "🤔", titel: "Twijfelachtig…" },
  nee: { emoji: "👖", titel: "Nee, lange broek." },
};

const $ = (id) => document.getElementById(id);

let laatsteWeer = null;
let minTemp = DREMPELS.minTemp;
try {
  const bewaard = Number(localStorage.getItem("minTemp"));
  if (bewaard) minTemp = bewaard;
} catch {}

async function haalWeer(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: "temperature_2m_max,apparent_temperature_max,precipitation_probability_max,wind_speed_10m_max",
    timezone: "auto",
    forecast_days: 1,
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weerdienst gaf fout ${res.status}`);
  const d = (await res.json()).daily;
  return {
    temp: d.temperature_2m_max[0],
    gevoelTemp: d.apparent_temperature_max[0],
    regenkans: d.precipitation_probability_max[0] ?? 0,
    wind: d.wind_speed_10m_max[0],
  };
}

async function zoekPlaats(naam) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({ name: naam, count: 1, language: "nl" });
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error(`Plaats "${naam}" niet gevonden.`);
  const r = data.results[0];
  return { naam: r.name, lat: r.latitude, lon: r.longitude };
}

function toonLaden() {
  $("emoji").textContent = "⏳";
  $("verdict").textContent = "Even kijken…";
  $("reason").textContent = "";
}

function toonFout(err) {
  $("emoji").textContent = "⚠️";
  $("verdict").textContent = "Oeps";
  $("reason").textContent = err.message;
  $("details").hidden = true;
  laatsteWeer = null;
}

function toonOordeel() {
  const { oordeel, reden } = korteBroekOordeel(laatsteWeer, minTemp);
  $("emoji").textContent = TEKST[oordeel].emoji;
  $("verdict").textContent = TEKST[oordeel].titel;
  $("reason").textContent = reden;
  $("result").dataset.oordeel = oordeel;
}

async function check(plaats) {
  toonLaden();
  try {
    const weer = await haalWeer(plaats.lat, plaats.lon);
    laatsteWeer = weer;
    toonOordeel();

    $("place").textContent = plaats.naam;
    $("tmax").textContent = `${Math.round(weer.temp)}°C`;
    $("feels").textContent = `${Math.round(weer.gevoelTemp)}°C`;
    $("rain").textContent = `${weer.regenkans}%`;
    $("wind").textContent = `${Math.round(weer.wind)} km/u`;
    $("details").hidden = false;
  } catch (err) {
    toonFout(err);
  }
}

function gebruikLocatie() {
  if (!navigator.geolocation) return check(STANDAARD);
  toonLaden();
  navigator.geolocation.getCurrentPosition(
    (pos) => check({ naam: "Jouw locatie", lat: pos.coords.latitude, lon: pos.coords.longitude }),
    () => check(STANDAARD),
    { timeout: 8000 }
  );
}

$("city-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const naam = $("city").value.trim();
  if (!naam) return;
  toonLaden();
  try {
    const plaats = await zoekPlaats(naam);
    try { localStorage.setItem("plaats", JSON.stringify(plaats)); } catch {}
    check(plaats);
  } catch (err) {
    toonFout(err);
  }
});

$("locate").addEventListener("click", () => {
  try { localStorage.removeItem("plaats"); } catch {}
  gebruikLocatie();
});

$("grens").value = minTemp;
$("grens-waarde").textContent = `${minTemp}°C`;
$("grens").addEventListener("input", (e) => {
  minTemp = Number(e.target.value);
  $("grens-waarde").textContent = `${minTemp}°C`;
  try { localStorage.setItem("minTemp", minTemp); } catch {}
  if (laatsteWeer) toonOordeel();
});

let opgeslagen = null;
try { opgeslagen = JSON.parse(localStorage.getItem("plaats")); } catch {}
opgeslagen ? check(opgeslagen) : gebruikLocatie();
