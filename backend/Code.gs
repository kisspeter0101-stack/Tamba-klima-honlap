/**
 * Támba Klíma – ajánlatkérések fogadása (Google Apps Script)
 *
 * A Google Táblázatból megnyitva (Bővítmények → Apps Script) kell beillesztni; a táblázathoz kötött szkript.
 * A weboldal a Vercel /api/ajanlat függvényen keresztül küld ide, amely:
 *   1. ellenőrzi a közös titkot,
 *   2. új sort ír az "Ajánlatkérések" munkalapra,
 *   3. a fotókat a Drive-ra menti (a linkek a sorba kerülnek),
 *   4. kiszámolja a javasolt árat a Szabályok / Készülékek / Települések munkalap alapján (csak Csabának látszik),
 *   5. e-mailben értesíti Csabát, és Naptár-eseményt vesz fel a visszahívásra.
 *
 * Első lépés: futtasd egyszer a beallitas() függvényt (lásd backend/ELESITES.md).
 */

var MUNKALAP = "Ajánlatkérések";
var SZABALYOK_LAP = "Szabályok";
var TELEPULESEK_LAP = "Települések";
var KESZULEKEK_LAP = "Készülékek";

// [mezőnév az űrlapban, oszlopfejléc]. Az időbélyeg, azonosító, státusz, fotók, összegzés és a javasolt ár oszlopokat a szkript tölti ki.
var OSZLOPOK = [
  ["idobelyeg", "Időbélyeg"], ["azonosito", "Azonosító"], ["statusz", "Státusz"],
  ["szolg", "Szolgáltatás"], ["db", "Készülékek száma"], ["telepules", "Település"], ["ingatlan", "Ingatlan"],
  ["ugyanoda", "Új készülék a régi helyén"], ["hozzajarulas", "Társasházi hozzájárulás"],
  ["allapot", "Épület állapota"], ["idoszak", "Munka ideje (iroda)"],
  ["terulet", "Alapterület"], ["haszn", "Használat"], ["nap", "Napsütés"], ["akcio", "Akciós készülék"],
  ["marka", "Márka"], ["kor", "Készülék kora"], ["utolso", "Utolsó karbantartás"], ["hiba", "Hiba leírása"],
  ["emelet", "Szint"], ["fal", "Fal anyaga"], ["kulteri", "Kültéri egység helye"],
  ["szemben", "Ugyanazon a falon"], ["tav", "Távolság"], ["kondenz", "Kondenzvíz"], ["aram", "Áramforrás"],
  ["regi", "Régi készülék"], ["mikor", "Mikorra"],
  ["nev", "Név"], ["telefon", "Telefon"], ["email", "E-mail"],
  ["fotok", "Fotók (Drive)"], ["osszegzes", "Összegzés"],
  ["javasolt_also", "Javasolt ár – alsó (Ft)"], ["javasolt_felso", "Javasolt ár – felső (Ft)"],
  ["tetelek", "Tételes bontás"], ["megjegyzes", "Megjegyzés (Csaba)"]
];

var STATUSZOK = ["Új", "Visszahívva", "Felmérés egyeztetve", "Ajánlat kiküldve", "Elfogadva", "Elvetve"];

// --- Árszabályok: alapértékek. A Szabályok munkalapot Csaba szerkeszti, az itt megadott érték csak a kezdőérték. ---
// [kulcs, megnevezés, érték, egység, megjegyzés]. Üres érték = még nincs meghatározva (sárgával jelölve).
var SZABALYOK_ALAP = [
  ["ALAP_KW_ALATT", "Alapszerelés 3,5 kW-ig", 80000, "Ft", "Az alapszerelés tartalma: 3 m csővezeték, 1 falátfúrás, 3 m elektromos vezeték, takarócsatorna. Az árlista szerint „-tól”."],
  ["ALAP_KW_FELETT", "Alapszerelés 3,5 kW felett", 100000, "Ft", ""],
  ["CSO_ALAP_M", "Az alapszerelésben foglalt csővezeték", 3, "m", ""],
  ["CSO_FELAR", "Többlet csővezeték", 12000, "Ft / m", ""],
  ["ELEKTROMOS_ALAP_M", "Az alapszerelésben foglalt elektromos vezeték", 3, "m", ""],
  ["ELEKTROMOS_FELAR", "Többlet elektromos vezeték (az alapon felül)", "", "Ft / m", "KITÖLTENDŐ. A weboldal árlistája szerint az elektromos bekötés hosszabbítása 10 m-ig díjmentes, ezt egyeztetni kell."],
  ["MULTI_FELAR", "Multi-split: felár a 2. beltéri egységtől", 60000, "Ft / egység", "Az első beltéri egység az alapszerelés árában van."],
  ["PORLASZTO", "Kondenzvíz-porlasztó", 15000, "Ft", "Ha a kondenzvíz nem vezethető el."],
  ["LESZERELES", "Régi készülék leszerelése", 20000, "Ft", "Az árlista szerint „-tól”."],
  ["ELSZALLITAS", "Régi készülék elszállítása", "", "Ft", "KITÖLTENDŐ. Jelenleg egyedi megállapodás szerint."],
  ["KARBANTARTAS", "Karbantartás, tisztítás készülékenként", 15000, "Ft", "3 géptől egyedi ár."]
];

// Települések: a kiszállási díj. 0 = a felmérés és a kiszállás díjmentes; üres = még nincs meghatározva.
var TELEPULESEK_ALAP = [
  ["Nyíregyháza", 0], ["Nagykálló", 0], ["Napkor", 0], ["Nyírpazony", 0], ["Kálmánháza", 0], ["Kótaj", 0],
  ["Nagycserkesz", 0], ["Nyírtura", 0], ["Sényő", 0], ["Nyírtelek", 0], ["Nyírbogdány", 0], ["Kemecse", 0],
  ["Ibrány", ""], ["Rakamaz", ""], ["Tiszavasvári", ""], ["Balkány", ""], ["Dombrád", ""], ["Demecser", ""],
  ["Nagyhalász", ""], ["Kisvárda", ""], ["Mátészalka", ""], ["Nyírbátor", ""], ["Baktalórántháza", ""],
  ["Vaja", ""], ["Debrecen", ""], ["Egyéb település", ""]
];

// Az akciós készülékek. A kulcs az akciós plakát fájlneve kiterjesztés nélkül (assets/img/akcio/<kulcs>.jpg).
var KESZULEKEK_ALAP = [
  ["tcl-elite", "TCL Elite", 3.5, 235000, ""],
  ["midea-xtreme-save", "Midea Xtreme Save", 3.5, 275000, "Akciós klímatisztítás: 15 000 Ft"],
  ["midea-solstice", "Midea Solstice", 3.5, 310000, "Fűtésre optimalizálva, akár -25 °C-ig fűt"],
  ["midea-all-easy-pro", "Midea All Easy Pro", 3.5, 310000, ""],
  ["mdv-evo", "MDV EVO", 3.5, 250000, ""],
  ["midea-solunar", "Midea Solunar", 3.5, 290000, "Akciós klímatisztítás: 15 000 Ft"]
];

/** Egyszeri beállítás: munkalapok, fejléc, Drive-mappa, titok. Futtasd a szerkesztőből; többször is futtatható. */
function beallitas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(MUNKALAP) || ss.insertSheet(MUNKALAP);
  var fejlec = OSZLOPOK.map(function (o) { return o[1]; });
  sh.getRange(1, 1, 1, fejlec.length).setValues([fejlec]).setFontWeight("bold").setBackground("#073b73").setFontColor("#ffffff");
  sh.setFrozenRows(1);
  // minden adatcella sima szöveg, így a "+36 …" telefonszám vagy a "=…" kezdetű beírás nem értelmeződik képletként
  sh.getRange(2, 1, sh.getMaxRows() - 1, OSZLOPOK.length).setNumberFormat("@");
  // a javasolt ár oszlopok számok maradnak
  ["javasolt_also", "javasolt_felso"].forEach(function (k) {
    sh.getRange(2, oszlop_(k), sh.getMaxRows() - 1, 1).setNumberFormat("#,##0");
  });
  var statuszOszlop = oszlop_("statusz");
  sh.getRange(2, statuszOszlop, sh.getMaxRows() - 1, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSZOK, true).setAllowInvalid(true).build());
  sh.setColumnWidths(1, fejlec.length, 140);
  sh.setColumnWidth(oszlop_("tetelek"), 380);
  sh.setColumnWidth(oszlop_("osszegzes"), 300);

  arMunkalapok_(ss);

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

/** Létrehozza az árszabály-munkalapokat a kezdőértékekkel. A már meglévő munkalapot nem írja felül. */
function arMunkalapok_(ss) {
  tablaLetrehoz_(ss, SZABALYOK_LAP, ["Kulcs", "Megnevezés", "Érték", "Egység", "Megjegyzés"], SZABALYOK_ALAP, 3, [110, 300, 100, 90, 520]);
  tablaLetrehoz_(ss, TELEPULESEK_LAP, ["Település", "Kiszállási díj (Ft)"], TELEPULESEK_ALAP, 2, [200, 160]);
  tablaLetrehoz_(ss, KESZULEKEK_LAP, ["Kulcs", "Modell", "Teljesítmény (kW)", "Akciós ár alapszereléssel (Ft)", "Megjegyzés"], KESZULEKEK_ALAP, 4, [170, 220, 140, 200, 360]);
}

function tablaLetrehoz_(ss, nev, fejlec, sorok, ertekOszlop, szelessegek) {
  if (ss.getSheetByName(nev)) return;
  var lap = ss.insertSheet(nev);
  lap.getRange(1, 1, 1, fejlec.length).setValues([fejlec]).setFontWeight("bold").setBackground("#073b73").setFontColor("#ffffff");
  lap.setFrozenRows(1);
  lap.getRange(2, 1, sorok.length, fejlec.length).setValues(sorok);
  szelessegek.forEach(function (w, i) { lap.setColumnWidth(i + 1, w); });
  // az üres (még meghatározandó) értékek sárgák
  sorok.forEach(function (s, i) {
    if (s[ertekOszlop - 1] === "") { lap.getRange(i + 2, ertekOszlop).setBackground("#fff2cc"); }
  });
}

/** Próba: egy kitalált ajánlatkérést ír be, e-mail értesítéssel. Futtasd a beállítás után. */
function proba() {
  var eredmeny = feldolgoz_({
    mezok: {
      szolg: "telepites", db: "1", telepules: "Nyíregyháza", ingatlan: "lakas", hozzajarulas: "igen",
      terulet: "22", haszn: "hutes", akcio: "tcl-elite", emelet: "1-2", fal: "panel", kulteri: "homlokzat",
      szemben: "nem", tav: "8", kondenz: "lefolyo", aram: "kozel",
      mikor: "1 hónapon belül", nev: "Teszt Elek", telefon: "+36 30 123 4567", email: "teszt@example.com",
      hozzajarulas_adat: "igen"
    },
    szoveg: [["Szolgáltatás", "Új klíma telepítése"], ["Település", "Nyíregyháza"], ["Akciós ajánlat", "TCL Elite"]],
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

    // javasolt ár (csak Csabának): hiba esetén is rögzüljön az ajánlatkérés
    var javaslat = null;
    try { javaslat = javaslat_(mezok, ss); } catch (hibaAr) { Logger.log("árszámítás hiba: " + hibaAr); }

    var kitoltes = {
      idobelyeg: Utilities.formatDate(most, "Europe/Budapest", "yyyy-MM-dd HH:mm"),
      azonosito: azonosito,
      statusz: "Új",
      fotok: fotoLinkek.join("\n"),
      osszegzes: osszegzes,
      javasolt_also: "",
      javasolt_felso: "",
      tetelek: javaslat ? javaslatSzoveg_(javaslat) : ""
    };
    var sor = OSZLOPOK.map(function (o) {
      var kulcs = o[0];
      if (kitoltes[kulcs] !== undefined) return kitoltes[kulcs];
      return mezok[kulcs] !== undefined ? String(mezok[kulcs]) : "";
    });
    var celSor = sh.getLastRow() + 1;
    sh.getRange(celSor, 1, 1, sor.length).setNumberFormat("@").setValues([sor]);
    if (javaslat && javaslat.also !== null) {
      sh.getRange(celSor, oszlop_("javasolt_also")).setNumberFormat("#,##0").setValue(javaslat.also);
      sh.getRange(celSor, oszlop_("javasolt_felso")).setNumberFormat("#,##0").setValue(javaslat.felso);
    }

    // A sor már a táblázatban van: az értesítések hibája ne tegye "sikertelenné" az ajánlatkérést
    // (különben a vevő újra beküldené, és duplikátum keletkezne).
    var sorUrl = ss.getUrl() + "#gid=" + sh.getSheetId() + "&range=A" + celSor;
    try { ertesit_(azonosito, mezok, keres.szoveg || [], fotoLinkek, sorUrl, javaslat); } catch (hiba1) { Logger.log("e-mail hiba: " + hiba1); }
    try { naptar_(azonosito, mezok, osszegzes, sorUrl, most); } catch (hiba2) { Logger.log("naptár hiba: " + hiba2); }
    return { ok: true, azonosito: azonosito };
  } finally {
    lock.releaseLock();
  }
}

// ---------------------------------------------------------------------------
// Javasolt ár. A vevő sosem látja: csak a táblázatba és Csaba e-mailjébe kerül.
// A számok a Szabályok / Települések / Készülékek munkalapról jönnek, Csaba szerkesztheti őket.
// ---------------------------------------------------------------------------

/** Kulcs → érték térkép egy munkalapról (első oszlop a kulcs). Hiányzó munkalapra null. */
function lapTerkep_(ss, nev) {
  var lap = ss.getSheetByName(nev);
  if (!lap) return null;
  var adat = lap.getDataRange().getValues();
  var t = {};
  for (var i = 1; i < adat.length; i++) { if (adat[i][0] !== "") t[String(adat[i][0])] = adat[i]; }
  return t;
}

function szam_(v) { return (typeof v === "number" && isFinite(v)) ? v : null; }

function ft_(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " Ft"; }

function tartomany_(lo, hi) { return lo === hi ? ft_(lo) : ft_(lo) + " – " + ft_(hi); }

/**
 * Kiszámolja a javasolt árat az űrlap válaszaiból.
 * Eredmény: {also, felso, tetelek: [szöveg], jegyzetek: [szöveg], egyedi: bool}. Ha nincs mit számolni, az also null.
 */
function javaslat_(mezok, ss) {
  var szabRaw = lapTerkep_(ss, SZABALYOK_LAP);
  if (!szabRaw) return null;
  var szab = {};
  Object.keys(szabRaw).forEach(function (k) { szab[k] = szam_(szabRaw[k][2]); });
  var telepulesek = lapTerkep_(ss, TELEPULESEK_LAP) || {};
  var keszulekek = lapTerkep_(ss, KESZULEKEK_LAP) || {};

  var szolg = mezok.szolg || "";
  var db = parseInt(mezok.db || "1", 10) || 1;
  var tetelek = [], jegyzetek = [], also = 0, felso = 0;
  var eredmeny = { also: null, felso: null, tetelek: tetelek, jegyzetek: jegyzetek, egyedi: false };

  function hozzaad(nev, lo, hi) {
    tetelek.push(nev + ": " + tartomany_(lo, hi));
    also += lo; felso += hi;
  }
  function kesz() { eredmeny.also = also; eredmeny.felso = felso; return eredmeny; }

  if (szolg === "javitas") { jegyzetek.push("A javítás díja a hiba megismerése után adható meg."); eredmeny.egyedi = true; return eredmeny; }
  if (szolg === "nemtudom") { jegyzetek.push("Tanácsot kért: az ár a felmérés vagy a beszélgetés után adható meg."); eredmeny.egyedi = true; return eredmeny; }

  if (szolg === "karbantartas") {
    if (db >= 3) { jegyzetek.push("3 géptől egyedi ár."); eredmeny.egyedi = true; return eredmeny; }
    if (szab.KARBANTARTAS === null) { jegyzetek.push("A karbantartás díja nincs megadva a Szabályok munkalapon."); return eredmeny; }
    hozzaad("Karbantartás, tisztítás (" + db + " készülék × " + ft_(szab.KARBANTARTAS) + ")", szab.KARBANTARTAS * db, szab.KARBANTARTAS * db);
    kiszallas_(mezok, telepulesek, jegyzetek, hozzaad);
    return kesz();
  }

  if (szolg !== "telepites" && szolg !== "csere" && szolg !== "athelyezes") return eredmeny;

  if (db >= 3) { jegyzetek.push("3 géptől egyedi ár."); eredmeny.egyedi = true; return eredmeny; }
  if (szab.ALAP_KW_ALATT === null || szab.ALAP_KW_FELETT === null) {
    jegyzetek.push("Az alapszerelés díja nincs megadva a Szabályok munkalapon.");
    return eredmeny;
  }

  var csereHelyben = (szolg === "csere" && mezok.ugyanoda === "igen");
  var terulet = mezok.terulet || "";

  // 1) alap: akciós készülék (benne az alapszerelés) vagy az alapszerelés díja
  var gep = (szolg !== "athelyezes" && mezok.akcio) ? keszulekek[mezok.akcio] : null;
  if (gep && szam_(gep[3]) !== null) {
    hozzaad("Akciós készülék alapszereléssel (" + gep[1] + ")", gep[3], gep[3]);
    if (terulet === "50" || terulet === "70" || terulet === "70+") {
      jegyzetek.push("A kiválasztott akciós készülék (" + gep[2] + " kW) a megadott alapterülethez kicsi lehet.");
    }
  } else {
    if (mezok.akcio) { jegyzetek.push("A kiválasztott akciós készülék ára nem található a Készülékek munkalapon, egyeztetendő."); }
    var kicsi = (terulet === "22" || terulet === "35");
    var nagy = (terulet === "50" || terulet === "70" || terulet === "70+");
    var lo = nagy ? szab.ALAP_KW_FELETT : szab.ALAP_KW_ALATT;
    var hi = kicsi ? szab.ALAP_KW_ALATT : szab.ALAP_KW_FELETT;
    var cim = (szolg === "athelyezes") ? "Áthelyezés (az alapszerelés díja alapján)" : "Alapszerelés" + (kicsi ? " (3,5 kW-ig)" : nagy ? " (3,5 kW felett)" : " (3,5 kW-ig vagy felette)");
    hozzaad(cim, lo, hi);
    if (szolg === "athelyezes") { jegyzetek.push("Az áthelyezés díja a készülék típusától függ, felméréssel pontosítandó."); }
    if (szolg !== "athelyezes") { jegyzetek.push("A készülék ára az alapszerelésen felül értendő."); }
  }

  // 2) multi-split: a 2. beltéri egységtől felár
  if (db === 2) {
    if (szab.MULTI_FELAR !== null) { hozzaad("Második beltéri egység (multi-split felár)", szab.MULTI_FELAR, szab.MULTI_FELAR); }
    jegyzetek.push("A második készülék ára külön értendő.");
  }

  if (csereHelyben) {
    jegyzetek.push("Az új készülék a régi helyére kerül: a meglévő csővezetéket és bekötést a helyszínen kell ellenőrizni.");
  } else {
    // 3) többlet csővezeték
    var csoSav = { "5": [0, 2], "8": [2, 5], "9": [5, 10], "nemtudom": [0, 10] };
    var cso = (mezok.szemben === "igen" || !mezok.szemben) ? [0, 0] : (csoSav[mezok.tav] || [0, 10]);
    if (cso[1] > 0 && szab.CSO_FELAR !== null) {
      hozzaad("Többlet csővezeték (" + (cso[0] === cso[1] ? cso[0] : cso[0] + "–" + cso[1]) + " m × " + ft_(szab.CSO_FELAR) + ")", cso[0] * szab.CSO_FELAR, cso[1] * szab.CSO_FELAR);
    }
    if (mezok.tav === "9") { jegyzetek.push("A kültéri és beltéri egység 8 m-nél messzebb van: a felső határ legfeljebb 10 m többlet csővel számol."); }

    // 4) elektromos vezeték
    if (mezok.aram === "10" || mezok.aram === "10+" || mezok.aram === "nemtudom") {
      if (mezok.aram === "10+") {
        jegyzetek.push("Az áramforrás 10 m-nél messzebb van: a többlet elektromos vezeték egyedi ár, nincs az összegben.");
      } else if (szab.ELEKTROMOS_FELAR !== null) {
        var elMax = 7;
        hozzaad("Többlet elektromos vezeték (0–" + elMax + " m × " + ft_(szab.ELEKTROMOS_FELAR) + ")", 0, elMax * szab.ELEKTROMOS_FELAR);
      } else {
        jegyzetek.push("Az áramforrás 3 m-nél messzebb lehet: a többlet elektromos vezeték felára nincs megadva (Szabályok munkalap, ELEKTROMOS_FELAR), nincs az összegben.");
      }
    }

    // 5) kondenzvíz
    if (mezok.kondenz === "nincs" && szab.PORLASZTO !== null) {
      hozzaad("Kondenzvíz-porlasztó", szab.PORLASZTO, szab.PORLASZTO);
    } else if (mezok.kondenz === "nemtudom" && szab.PORLASZTO !== null) {
      hozzaad("Kondenzvíz-porlasztó (ha szükséges)", 0, szab.PORLASZTO);
    }
  }

  // 6) régi készülék
  if (szolg === "csere" && (mezok.regi === "leszerel" || mezok.regi === "elszallit")) {
    if (szab.LESZERELES !== null) { hozzaad("Régi készülék leszerelése", szab.LESZERELES, szab.LESZERELES); }
    if (mezok.regi === "elszallit") {
      if (szab.ELSZALLITAS !== null) { hozzaad("Régi készülék elszállítása", szab.ELSZALLITAS, szab.ELSZALLITAS); }
      else { jegyzetek.push("A régi készülék elszállítása egyedi megállapodás szerint, nincs az összegben."); }
    }
  }

  // 7) nehezített hozzáférés
  if (mezok.emelet === "3+" || mezok.kulteri === "teto") {
    jegyzetek.push("Nehezített hozzáférés (magasság, állvány, emelő): egyedi felár lehet, nincs az összegben.");
  }

  // 8) kiszállás
  kiszallas_(mezok, telepulesek, jegyzetek, hozzaad);
  return kesz();
}

function kiszallas_(mezok, telepulesek, jegyzetek, hozzaad) {
  var sor = mezok.telepules ? telepulesek[mezok.telepules] : null;
  if (sor && szam_(sor[1]) !== null) {
    if (sor[1] > 0) { hozzaad("Kiszállási díj (" + mezok.telepules + ")", sor[1], sor[1]); }
  } else {
    jegyzetek.push("Kiszállási díj egyeztetendő (" + (mezok.telepules || "ismeretlen település") + "), nincs az összegben.");
  }
}

/** A tételes bontás olvasható szövege (a táblázat és az e-mail). */
function javaslatSzoveg_(j) {
  var sorok = j.tetelek.slice();
  if (j.also !== null && j.tetelek.length) { sorok.push("Összesen: " + tartomany_(j.also, j.felso)); }
  if (j.jegyzetek.length) { sorok.push(""); sorok.push("Megjegyzések:"); j.jegyzetek.forEach(function (x) { sorok.push("- " + x); }); }
  return sorok.join("\n");
}

// ---------------------------------------------------------------------------

/** Az "Szolgáltatás" stb. olvasható értéke az összegzésből (a weboldal címkéi szerint). */
function szoveg_(szoveg, cimke) {
  for (var i = 0; i < szoveg.length; i++) { if (szoveg[i][0] === cimke) return szoveg[i][1]; }
  return "";
}

function he_(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function ertesit_(azonosito, mezok, szoveg, fotoLinkek, sorUrl, javaslat) {
  var cimzett = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
  if (!cimzett) return;
  var szolgaltatas = szoveg_(szoveg, "Szolgáltatás");
  var targy = "Új ajánlatkérés: " + (szolgaltatas ? szolgaltatas + ", " : "") + (mezok.telepules || "") + " – " + (mezok.nev || "");

  var telSzam = String(mezok.telefon || "");
  var telHref = "tel:" + telSzam.replace(/[^+0-9]/g, "");

  var arSor = "";
  if (javaslat && javaslat.also !== null) { arSor = "kb. " + tartomany_(javaslat.also, javaslat.felso); }
  else if (javaslat && javaslat.egyedi) { arSor = "egyedi, felmérés vagy megbeszélés után"; }
  var arSzoveg = javaslat ? javaslatSzoveg_(javaslat) : "";

  var sorok = szoveg.map(function (p) { return p[0] + ": " + p[1]; }).join("\n");
  var torzs = "Új ajánlatkérés érkezett a weboldalról (" + azonosito + ").\n\n" +
    "Név: " + (mezok.nev || "") + "\n" +
    "Telefon: " + telSzam + "\n" +
    "E-mail: " + (mezok.email || "–") + "\n" +
    "Mikorra: " + (mezok.mikor || "–") + "\n\n" +
    (arSor ? "Javasolt ár (csak neked látszik): " + arSor + "\n" + arSzoveg + "\n\n" : "") +
    "Összegzés:\n" + sorok + "\n\n" +
    (fotoLinkek.length ? "Fotók:\n" + fotoLinkek.join("\n") + "\n\n" : "") +
    "Megnyitás a táblázatban: " + sorUrl + "\n";

  var tabla = szoveg.map(function (p) {
    return "<tr><td style=\"padding:4px 12px 4px 0;color:#5b6b7b;vertical-align:top\">" + he_(p[0]) + "</td><td style=\"padding:4px 0\"><b>" + he_(p[1]) + "</b></td></tr>";
  }).join("");
  var arHtml = "";
  if (arSor) {
    arHtml = "<div style=\"margin:0 0 16px;padding:10px 14px;background:#eaf6ff;border-left:4px solid #1e9be0\">" +
      "<div style=\"font-size:13px;color:#5b6b7b\">Javasolt ár (csak neked látszik)</div>" +
      "<div style=\"font-size:18px;font-weight:bold;color:#073b73\">" + he_(arSor) + "</div>" +
      "<div style=\"font-size:13px;margin-top:6px;white-space:pre-line\">" + he_(arSzoveg) + "</div></div>";
  }
  var html = "<div style=\"font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0e1621;max-width:560px\">" +
    "<h2 style=\"margin:0 0 4px;color:#073b73\">Új ajánlatkérés</h2>" +
    "<p style=\"margin:0 0 14px;color:#5b6b7b\">" + he_(azonosito) + (mezok.mikor ? " · " + he_(mezok.mikor) : "") + "</p>" +
    "<p style=\"font-size:18px;margin:0 0 4px\"><b>" + he_(mezok.nev || "") + "</b></p>" +
    "<p style=\"margin:0 0 14px\"><a href=\"" + he_(telHref) + "\" style=\"display:inline-block;background:#1e9be0;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:bold\">Hívás: " + he_(telSzam) + "</a>" +
    (mezok.email ? " &nbsp;<a href=\"mailto:" + he_(mezok.email) + "\" style=\"color:#0b5cab\">" + he_(mezok.email) + "</a>" : "") + "</p>" +
    arHtml +
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
