/* Ajánlatkérő űrlap fogadó végpont (Vercel serverless függvény).
 *
 * A weboldal az űrlap adatait ide küldi (POST /api/ajanlat, JSON). A függvény ellenőrzi a bemenetet,
 * majd továbbítja a Google Apps Script végpontnak, amely a Google Táblázatba írja a sort, a fotókat a
 * Drive-ra menti, és e-mailben értesíti Csabát. A beállításról a backend/ELESITES.md ír.
 *
 * Környezeti változók (Vercel → Project → Settings → Environment Variables):
 *   APPS_SCRIPT_URL     az Apps Script web app URL-je
 *   APPS_SCRIPT_SECRET  közös titok (ugyanaz, mint az Apps Script "SECRET" tulajdonsága)
 */

// Csak ezeket a mezőket fogadjuk el (a többit eldobjuk).
var ENGEDELYEZETT = [
  "szolg", "db", "telepules", "ingatlan", "ugyanoda", "hozzajarulas", "allapot", "idoszak",
  "terulet", "haszn", "nap", "akcio", "marka", "kor", "utolso", "hiba",
  "emelet", "fal", "kulteri", "szemben", "tav", "kondenz", "aram", "regi",
  "mikor", "nev", "telefon", "email", "hozzajarulas_adat"
];
var MAX_FOTO = 4;
var MAX_FOTO_ADAT = 1200000; // karakter / kép (base64)

function tisztit(s, max) {
  return String(s == null ? "" : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}

function engedelyezettOrigin(req) {
  var origin = req.headers.origin;
  if (!origin) return true; // nem böngészős kérés; a titkot és a mezőellenőrzést az Apps Script is ellenőrzi
  try {
    var host = new URL(origin).hostname;
    return host === "tambaklima.hu" || host === "www.tambaklima.hu" ||
      host === "localhost" || host === "127.0.0.1" || /\.vercel\.app$/.test(host);
  } catch (e) { return false; }
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.status(405).json({ ok: false }); return; }
  if (!engedelyezettOrigin(req)) { res.status(403).json({ ok: false }); return; }

  var url = process.env.APPS_SCRIPT_URL, secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) { console.error("ajanlat: hiányzó környezeti változó"); res.status(500).json({ ok: false }); return; }

  var body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== "object") { res.status(400).json({ ok: false }); return; }

  // Honeypot: a botok kitöltik a rejtett mezőt. Úgy teszünk, mintha sikerült volna.
  if (body.weboldal) { res.status(200).json({ ok: true }); return; }

  var forras = body.mezok && typeof body.mezok === "object" ? body.mezok : {};
  var mezok = {};
  ENGEDELYEZETT.forEach(function (k) {
    if (forras[k] != null && forras[k] !== "") mezok[k] = tisztit(forras[k], k === "hiba" ? 2000 : 300);
  });

  if (!mezok.szolg || !mezok.telepules || !mezok.nev || !mezok.telefon || mezok.hozzajarulas_adat !== "igen") {
    res.status(400).json({ ok: false, hiba: "hianyzo_mezo" }); return;
  }
  if (!/^[+0-9()\s.\-]{6,25}$/.test(mezok.telefon)) { res.status(400).json({ ok: false, hiba: "telefon" }); return; }
  if (mezok.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mezok.email)) { res.status(400).json({ ok: false, hiba: "email" }); return; }

  var szoveg = [];
  if (Array.isArray(body.szoveg)) {
    body.szoveg.slice(0, 40).forEach(function (p) {
      if (Array.isArray(p) && p.length === 2) szoveg.push([tisztit(p[0], 80), tisztit(p[1], 500)]);
    });
  }

  var fotok = [];
  if (Array.isArray(body.fotok)) {
    body.fotok.slice(0, MAX_FOTO).forEach(function (f, i) {
      if (f && typeof f.adat === "string" && f.adat.length <= MAX_FOTO_ADAT && /^[A-Za-z0-9+\/=]+$/.test(f.adat)) {
        fotok.push({ nev: "foto-" + (i + 1) + ".jpg", adat: f.adat });
      }
    });
  }

  var ctrl = new AbortController();
  var timer = setTimeout(function () { ctrl.abort(); }, 25000);
  try {
    var r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret: secret, mezok: mezok, szoveg: szoveg, fotok: fotok }),
      redirect: "follow",
      signal: ctrl.signal
    });
    var valasz = null;
    try { valasz = JSON.parse(await r.text()); } catch (e) { valasz = null; }
    if (valasz && valasz.ok) { res.status(200).json({ ok: true, azonosito: valasz.azonosito }); return; }
    console.error("ajanlat: az Apps Script hibát adott", r.status, valasz && valasz.hiba);
    res.status(502).json({ ok: false });
  } catch (e) {
    console.error("ajanlat: továbbítási hiba", e && e.name);
    res.status(502).json({ ok: false });
  } finally {
    clearTimeout(timer);
  }
};
