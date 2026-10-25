/**
 * Támba Klíma – ajánlatkérések fogadása (Google Apps Script)
 *
 * A Google Táblázatból megnyitva (Bővítmények → Apps Script) kell beillesztni; a táblázathoz kötött szkript.
 * A weboldal a Vercel /api/ajanlat függvényen keresztül küld ide, amely:
 *   1. ellenőrzi a közös titkot,
 *   2. új sort ír az "Ajánlatkérések" munkalapra,
 *   3. a fotókat a Drive-ra menti (a linkek a sorba kerülnek),
 *   4. e-mailben értesíti Csabát.
 *
 * Első lépés: futtasd egyszer a beallitas() függvényt (lásd backend/ELESITES.md).
 */

var MUNKALAP = "Ajánlatkérések";

// [mezőnév az űrlapban, oszlopfejléc]. Az első három, illetve az utolsó négy kitöltése a szkript dolga.
var OSZLOPOK = [
  ["idobelyeg", "Időbélyeg"], ["azonosito", "Azonosító"], ["statusz", "Státusz"],
  ["szolg", "Szolgáltatás"], ["db", "Készülékek száma"], ["telepules", "Település"], ["ingatlan", "Ingatlan"],
  ["ugyanoda", "Új készülék a régi helyén"], ["hozzajarulas", "Társasházi hozzájárulás"],
  ["allapot", "Épület állapota"], ["idoszak", "Munka ideje (iroda)"],
  ["terulet", "Alapterület"], ["haszn", "Használat"], ["nap", "Napsütés"],
  ["marka", "Márka"], ["kor", "Készülék kora"], ["utolso", "Utolsó karbantartás"], ["hiba", "Hiba leírása"],
  ["emelet", "Szint"], ["fal", "Fal anyaga"], ["kulteri", "Kültéri egység helye"],
  ["szemben", "Ugyanazon a falon"], ["tav", "Távolság"], ["kondenz", "Kondenzvíz"], ["aram", "Áramforrás"],
  ["regi", "Régi készülék"], ["mikor", "Mikorra"],
  ["nev", "Név"], ["telefon", "Telefon"], ["email", "E-mail"],
  ["fotok", "Fotók (Drive)"], ["osszegzes", "Összegzés"],
  ["javasolt_ar", "Javasolt ár (Ft)"], ["megjegyzes", "Megjegyzés (Csaba)"]
];

var STATUSZOK = ["Új", "Visszahívva", "Felmérés egyeztetve", "Ajánlat kiküldve", "Elfogadva", "Elvetve"];

/** Egyszeri beállítás: munkalap, fejléc, Drive-mappa, titok. Futtasd a szerkesztőből. */
function beallitas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(MUNKALAP) || ss.insertSheet(MUNKALAP);
  var fejlec = OSZLOPOK.map(function (o) { return o[1]; });
  sh.getRange(1, 1, 1, fejlec.length).setValues([fejlec]).setFontWeight("bold").setBackground("#073b73").setFontColor("#ffffff");
  sh.setFrozenRows(1);
  // minden adatcella sima szöveg, így a "+36 …" telefonszám vagy a "=…" kezdetű beírás nem értelmeződik képletként
  sh.getRange(2, 1, sh.getMaxRows() - 1, OSZLOPOK.length).setNumberFormat("@");
  // a javasolt ár oszlop számként kezelhető legyen (a későbbi képletekhez)
  var arOszlop = oszlop_("javasolt_ar");
  sh.getRange(2, arOszlop, sh.getMaxRows() - 1, 1).setNumberFormat("#,##0");
  var statuszOszlop = oszlop_("statusz");
  sh.getRange(2, statuszOszlop, sh.getMaxRows() - 1, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSZOK, true).setAllowInvalid(true).build());
  sh.setColumnWidths(1, fejlec.length, 140);

  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty("SECRET")) {
    props.setProperty("SECRET", Utilities.getUuid() + Utilities.getUuid().replace(/-/g, ""));
  }
  if (!props.getProperty("NOTIFY_EMAIL")) {
    props.setProperty("NOTIFY_EMAIL", Session.getEffectiveUser().getEmail());
  }
  if (!props.getProperty("SZAMLALO")) { props.setProperty("SZAMLALO", "0"); }
  if (!props.getProperty("NAPTAR")) { props.setProperty("NAPTAR", "igen"); } // "nem" = ne hozzon létre naptáresemény-t
  if (!props.getProperty("FOLDER_ID")) {
    props.setProperty("FOLDER_ID", DriveApp.createFolder("Támba Klíma – ajánlatkérések fotói").getId());
  }
  Logger.log("Kész. Másold a Vercelbe (APPS_SCRIPT_SECRET) ezt a titkot:\n" + props.getProperty("SECRET"));
  Logger.log("Értesítés e-mail-címe: " + props.getProperty("NOTIFY_EMAIL"));
}

/** Próba: egy kitalált ajánlatkérést ír be, e-mail értesítéssel. Futtasd a beállítás után. */
function proba() {
  var eredmeny = feldolgoz_({
    mezok: {
      szolg: "telepites", db: "1", telepules: "Nyíregyháza", ingatlan: "lakas", hozzajarulas: "igen",
      terulet: "22", haszn: "hutes", emelet: "1-2", fal: "panel", kulteri: "homlokzat", kondenz: "lefolyo", aram: "kozel",
      mikor: "1 hónapon belül", nev: "Teszt Elek", telefon: "+36 30 123 4567", email: "teszt@example.com",
      hozzajarulas_adat: "igen"
    },
    szoveg: [["Szolgáltatás", "Új klíma telepítése"], ["Település", "Nyíregyháza"]],
    fotok: []
  });
  Logger.log(JSON.stringify(eredmeny));
}

function doGet() {
  return json_({ ok: true, szolgaltatas: "tamba-klima-ajanlat" });
}

function doPost(e) {
  try {
    var keres = JSON.parse(e.postData.contents);
    var titok = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (!titok || keres.secret !== titok) { return json_({ ok: false, hiba: "hitelesites" }); }
    return json_(feldolgoz_(keres));
  } catch (err) {
    return json_({ ok: false, hiba: "feldolgozas" });
  }
}

function feldolgoz_(keres) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var props = PropertiesService.getScriptProperties();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(MUNKALAP);
    if (!sh) { return { ok: false, hiba: "nincs_munkalap" }; }

    var mezok = keres.mezok || {};
    var most = new Date();
    var szamlalo = parseInt(props.getProperty("SZAMLALO") || "0", 10) + 1;
    props.setProperty("SZAMLALO", String(szamlalo));
    var azonosito = "AK-" + Utilities.formatDate(most, "Europe/Budapest", "yyyy") + "-" + ("000" + szamlalo).slice(-4);

    // fotók a Drive-ra
    var fotoLinkek = [];
    var fotok = keres.fotok || [];
    if (fotok.length && props.getProperty("FOLDER_ID")) {
      var mappa = DriveApp.getFolderById(props.getProperty("FOLDER_ID"));
      fotok.slice(0, 4).forEach(function (f, i) {
        try {
          var blob = Utilities.newBlob(Utilities.base64Decode(f.adat), "image/jpeg", azonosito + "-foto-" + (i + 1) + ".jpg");
          fotoLinkek.push(mappa.createFile(blob).getUrl());
        } catch (hiba) { /* egy rossz kép ne akassza meg az egész ajánlatkérést */ }
      });
    }

    var osszegzes = (keres.szoveg || []).map(function (p) { return p[0] + ": " + p[1]; }).join("\n");

    var kitoltes = {
      idobelyeg: Utilities.formatDate(most, "Europe/Budapest", "yyyy-MM-dd HH:mm"),
      azonosito: azonosito,
      statusz: "Új",
      fotok: fotoLinkek.join("\n"),
      osszegzes: osszegzes
    };
    var sor = OSZLOPOK.map(function (o) {
      var kulcs = o[0];
      if (kitoltes[kulcs] !== undefined) return kitoltes[kulcs];
      return mezok[kulcs] !== undefined ? String(mezok[kulcs]) : "";
    });
    var celSor = sh.getLastRow() + 1;
    sh.getRange(celSor, 1, 1, sor.length).setNumberFormat("@").setValues([sor]);
    sh.getRange(celSor, oszlop_("javasolt_ar")).setNumberFormat("#,##0");

    // A sor már a táblázatban van: az értesítések hibája ne tegye "sikertelenné" az ajánlatkérést
    // (különben a vevő újra beküldené, és duplikátum keletkezne).
    var sorUrl = ss.getUrl() + "#gid=" + sh.getSheetId() + "&range=A" + celSor;
    try { ertesit_(azonosito, mezok, keres.szoveg || [], fotoLinkek, sorUrl); } catch (hiba1) { Logger.log("e-mail hiba: " + hiba1); }
    try { naptar_(azonosito, mezok, osszegzes, sorUrl, most); } catch (hiba2) { Logger.log("naptár hiba: " + hiba2); }
    return { ok: true, azonosito: azonosito };
  } finally {
    lock.releaseLock();
  }
}

/** Az "Szolgáltatás" stb. olvasható értéke az összegzésből (a weboldal címkéi szerint). */
function szoveg_(szoveg, cimke) {
  for (var i = 0; i < szoveg.length; i++) { if (szoveg[i][0] === cimke) return szoveg[i][1]; }
  return "";
}

function he_(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function ertesit_(azonosito, mezok, szoveg, fotoLinkek, sorUrl) {
  var cimzett = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
  if (!cimzett) return;
  var szolgaltatas = szoveg_(szoveg, "Szolgáltatás");
  var targy = "Új ajánlatkérés: " + (szolgaltatas ? szolgaltatas + ", " : "") + (mezok.telepules || "") + " – " + (mezok.nev || "");

  var telSzam = String(mezok.telefon || "");
  var telHref = "tel:" + telSzam.replace(/[^+0-9]/g, "");

  var sorok = szoveg.map(function (p) { return p[0] + ": " + p[1]; }).join("\n");
  var torzs = "Új ajánlatkérés érkezett a weboldalról (" + azonosito + ").\n\n" +
    "Név: " + (mezok.nev || "") + "\n" +
    "Telefon: " + telSzam + "\n" +
    "E-mail: " + (mezok.email || "–") + "\n" +
    "Mikorra: " + (mezok.mikor || "–") + "\n\n" +
    "Összegzés:\n" + sorok + "\n\n" +
    (fotoLinkek.length ? "Fotók:\n" + fotoLinkek.join("\n") + "\n\n" : "") +
    "Megnyitás a táblázatban: " + sorUrl + "\n";

  var tabla = szoveg.map(function (p) {
    return "<tr><td style=\"padding:4px 12px 4px 0;color:#5b6b7b;vertical-align:top\">" + he_(p[0]) + "</td><td style=\"padding:4px 0\"><b>" + he_(p[1]) + "</b></td></tr>";
  }).join("");
  var html = "<div style=\"font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0e1621;max-width:560px\">" +
    "<h2 style=\"margin:0 0 4px;color:#073b73\">Új ajánlatkérés</h2>" +
    "<p style=\"margin:0 0 14px;color:#5b6b7b\">" + he_(azonosito) + (mezok.mikor ? " · " + he_(mezok.mikor) : "") + "</p>" +
    "<p style=\"font-size:18px;margin:0 0 4px\"><b>" + he_(mezok.nev || "") + "</b></p>" +
    "<p style=\"margin:0 0 14px\"><a href=\"" + he_(telHref) + "\" style=\"display:inline-block;background:#1e9be0;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:bold\">Hívás: " + he_(telSzam) + "</a>" +
    (mezok.email ? " &nbsp;<a href=\"mailto:" + he_(mezok.email) + "\" style=\"color:#0b5cab\">" + he_(mezok.email) + "</a>" : "") + "</p>" +
    "<table style=\"border-collapse:collapse;font-size:14px\">" + tabla + "</table>" +
    (fotoLinkek.length ? "<p style=\"margin:14px 0 4px\"><b>Fotók</b></p>" + fotoLinkek.map(function (u, i) { return "<a href=\"" + he_(u) + "\">" + (i + 1) + ". fotó</a>"; }).join(" · ") : "") +
    "<p style=\"margin:18px 0 0\"><a href=\"" + he_(sorUrl) + "\" style=\"color:#0b5cab\">Megnyitás a táblázatban</a></p></div>";

  var opciok = { to: cimzett, subject: targy, body: torzs, htmlBody: html, name: "Támba Klíma weboldal" };
  if (mezok.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mezok.email)) { opciok.replyTo = mezok.email; }
  MailApp.sendEmail(opciok);
}

/** Visszahívási esemény a naptárba. 6:00 és 20:00 között fél óra múlva, egyébként másnap 7:00-ra (budapesti idő). */
function visszahivasIdopont_(most) {
  var tz = "Europe/Budapest";
  var ora = parseInt(Utilities.formatDate(most, tz, "H"), 10);
  if (ora >= 6 && ora < 20) { return new Date(most.getTime() + 30 * 60 * 1000); }
  var cel = new Date(most.getTime() + (ora >= 20 ? 24 : 0) * 60 * 60 * 1000);
  var nap = Utilities.formatDate(cel, tz, "yyyy-MM-dd");
  var eltolas = Utilities.formatDate(cel, tz, "XXX");
  return new Date(nap + "T07:00:00" + eltolas);
}

function naptar_(azonosito, mezok, osszegzes, sorUrl, most) {
  if (PropertiesService.getScriptProperties().getProperty("NAPTAR") === "nem") return;
  var kezdes = visszahivasIdopont_(most);
  var veg = new Date(kezdes.getTime() + 15 * 60 * 1000);
  var cim = "Visszahívás: " + (mezok.nev || "") + (mezok.telepules ? " (" + mezok.telepules + ")" : "");
  var leiras = "Telefon: " + (mezok.telefon || "") + "\n\n" + osszegzes + "\n\nTáblázat: " + sorUrl + "\nAzonosító: " + azonosito;
  var esemeny = CalendarApp.getDefaultCalendar().createEvent(cim, kezdes, veg, { description: leiras });
  esemeny.removeAllReminders();
  esemeny.addPopupReminder(0);
}

function oszlop_(kulcs) {
  for (var i = 0; i < OSZLOPOK.length; i++) { if (OSZLOPOK[i][0] === kulcs) return i + 1; }
  return 1;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
