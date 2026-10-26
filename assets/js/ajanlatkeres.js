/* Ajánlatkérő varázsló: feltételes kérdések, ellenőrzés, küldés a /api/ajanlat végpontnak */
(function () {
  var form = document.getElementById("wiz");
  var result = document.getElementById("wizResult");
  var steps = [].slice.call(form.querySelectorAll("[data-step]"));
  var bar = document.getElementById("wizBar");
  var label = document.getElementById("wizLabel");
  var back = document.getElementById("wizBack");
  var next = document.getElementById("wizNext");
  var cur = steps[0];
  var sending = false;
  var err = document.createElement("p");
  err.className = "wiz__err"; err.setAttribute("role", "alert"); err.hidden = true;
  form.querySelector(".wiz__nav").before(err);

  // Egy mező aktuális értéke. A rejtett (letiltott) mezőt üresnek vesszük, így egy korábbi útvonal
  // válasza nem szivárog át (pl. kondenzvíz, ha a kérdés már nem látszik).
  function val(name) {
    var f = form.elements[name];
    if (!f) return "";
    var nodes = f.length !== undefined && f.type === undefined ? [].slice.call(f) : [f];
    return nodes.every(function (n) { return n.disabled; }) ? "" : f.value;
  }

  // data-show="mező:érték1|érték2 másikmező:érték" – egy csoporton belül minden feltételnek teljesülnie kell;
  // a ";"-vel elválasztott csoportok közül elég az egyik (VAGY).
  function matches(el) {
    return el.getAttribute("data-show").split(";").some(function (group) {
      return group.trim().split(/\s+/).every(function (c) {
        var p = c.split(":");
        return p[1].split("|").indexOf(val(p[0])) !== -1;
      });
    });
  }

  function apply() {
    // 1) feltételes blokkok megjelenítése / elrejtése, 2) a rejtett blokkok mezőinek letiltása
    // (nem kötelezők, nem kerülnek be az adatok közé). Háromszor futtatjuk, hogy a láncolt feltételek is beálljanak.
    for (var pass = 0; pass < 3; pass++) {
      [].forEach.call(form.querySelectorAll("[data-show]"), function (el) { el.hidden = !matches(el); });
      [].forEach.call(form.querySelectorAll("input, select, textarea"), function (f) { f.disabled = !!f.closest("[hidden]"); });
    }
    // 3) lépések és folyamatjelző
    var vis = steps.filter(function (s) { return !s.hidden; });
    if (vis.indexOf(cur) === -1) cur = vis[0];
    var i = vis.indexOf(cur);
    steps.forEach(function (s) { s.classList.toggle("is-current", s === cur); });
    bar.style.width = ((i + 1) / vis.length * 100) + "%";
    label.textContent = (i + 1) + ". lépés / " + vis.length + " – " + cur.querySelector("legend").textContent;
    back.hidden = i === 0;
    next.textContent = i === vis.length - 1 ? "Ajánlatot kérek" : "Tovább";
  }

  function valid() {
    var fields = [].slice.call(cur.querySelectorAll("input, select, textarea"));
    for (var k = 0; k < fields.length; k++) {
      var f = fields[k];
      if (!f.disabled && !f.checkValidity()) {
        err.textContent = f.type === "checkbox" ? "Kérjük, fogadja el az adatkezelési tájékoztatót." : "Kérjük, töltse ki a *-gal jelölt kérdéseket.";
        err.hidden = false;
        var box = f.closest(".opts, .field, .field--check") || f;
        box.scrollIntoView({ behavior: "smooth", block: "center" });
        if (f.type !== "radio") f.focus({ preventScroll: true });
        return false;
      }
    }
    err.hidden = true;
    return true;
  }

  function nextStep() {
    if (!valid()) return;
    var vis = steps.filter(function (s) { return !s.hidden; });
    var i = vis.indexOf(cur);
    if (i === vis.length - 1) { finish(); return; }
    cur = vis[i + 1]; apply();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function prevStep() {
    var vis = steps.filter(function (s) { return !s.hidden; });
    var i = vis.indexOf(cur);
    if (i > 0) { cur = vis[i - 1]; err.hidden = true; apply(); form.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }


  var LABELS = [
    ["szolg", "Szolgáltatás"], ["db", "Készülékek száma"], ["telepules", "Település"], ["ingatlan", "Ingatlan"],
    ["ugyanoda", "Új készülék a régi helyén"], ["hozzajarulas", "Társasházi hozzájárulás"], ["emelet", "Emelet"], ["allapot", "Az épület állapota"], ["idoszak", "Mikor végezhető a munka"],
    ["terulet", "Alapterület"], ["haszn", "Használat"], ["nap", "Napsütés"], ["akcio", "Akciós ajánlat"], ["marka", "Márka"], ["kor", "Készülék kora"],
    ["utolso", "Utolsó karbantartás"], ["hiba", "Probléma"], ["kulteri", "Kültéri egység"],
    ["fal", "Fal anyaga"], ["szemben", "Kültéri egység ugyanazon a falon"], ["tav", "Egységek távolsága"],
    ["kondenz", "Kondenzvíz"], ["aram", "Áramforrás"], ["regi", "Régi készülék"], ["mikor", "Mikorra"], ["nev", "Név"], ["telefon", "Telefon"], ["email", "E-mail"]
  ];
  function shown(name) {
    var f = form.elements[name];
    if (!f) return "";
    var node = f.length !== undefined && f.type === undefined ? f[0] : f;
    if (node.disabled) return "";
    if (node.type === "radio") { var c = form.querySelector('[name="' + name + '"]:checked'); if (!c) return ""; var sp = [].slice.call(c.parentNode.querySelectorAll("span")).filter(function (s) { return !s.hidden; })[0]; return sp ? sp.textContent : ""; }
    if (node.tagName === "SELECT") return node.value ? node.options[node.selectedIndex].textContent : "";
    return node.value;
  }

  // --- Küldés -------------------------------------------------------------

  // Az űrlap nyers értékei (a Google Táblázat oszlopai ezekre a mezőnevekre épülnek).
  function collect() {
    var mezok = {};
    [].forEach.call(form.elements, function (f) {
      if (!f.name || f.disabled || f.type === "file" || f.type === "button" || f.name === "weboldal") return;
      if (f.type === "radio" && !f.checked) return;
      if (f.type === "checkbox") { if (f.checked) mezok[f.name] = "igen"; return; }
      if (f.value !== "") mezok[f.name] = f.value;
    });
    // olvasható összegzés: [címke, érték] párok
    var szoveg = [];
    LABELS.forEach(function (l) { var v = shown(l[0]); if (v) szoveg.push([l[1], v]); });
    return { mezok: mezok, szoveg: szoveg };
  }

  // A fotókat a böngészőben kicsinyítjük (max. 1280 px, JPEG), így kis méretben mennek át.
  function readPhotos(files) {
    var list = [].slice.call(files || []).filter(function (f) { return /^image\//.test(f.type); }).slice(0, 4);
    return Promise.all(list.map(function (file, i) {
      return new Promise(function (resolve) {
        var url = URL.createObjectURL(file), img = new Image();
        img.onload = function () {
          var s = Math.min(1, 1280 / Math.max(img.width, img.height));
          var c = document.createElement("canvas");
          c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          resolve({ nev: "foto-" + (i + 1) + ".jpg", adat: c.toDataURL("image/jpeg", 0.78).split(",")[1] });
        };
        img.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
        img.src = url;
      });
    })).then(function (arr) {
      arr = arr.filter(Boolean);
      var total = 0;
      return arr.filter(function (p) { total += p.adat.length; return total < 3300000; }); // a tárhely kérésmérete korlátos
    });
  }

  function showResult() {
    var sum = document.getElementById("summary"); sum.innerHTML = "";
    LABELS.forEach(function (l) {
      var v = shown(l[0]); if (!v) return;
      var li = document.createElement("li"), b = document.createElement("b"), s = document.createElement("span");
      b.textContent = l[1]; s.textContent = v; li.appendChild(b); li.appendChild(s); sum.appendChild(li);
    });
    form.hidden = true; result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function finish() {
    if (sending) return;
    sending = true; next.disabled = true; next.textContent = "Küldés…"; err.hidden = true;
    var data = collect();
    var fileInput = form.elements.fotok;
    readPhotos(fileInput && !fileInput.disabled ? fileInput.files : [])
      .then(function (fotok) {
        return fetch("/api/ajanlat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mezok: data.mezok, szoveg: data.szoveg, fotok: fotok, weboldal: form.elements.weboldal.value })
        });
      })
      .then(function (r) { return r.json().then(function (j) { return r.ok && j && j.ok; }, function () { return false; }); })
      .then(function (ok) {
        if (!ok) throw new Error("send");
        sending = false; showResult();
        // Az elküldött ajánlatkérést a központi számláló a /koszonjuk oldal megtekintéseként számolja (mint a régi űrlapnál).
        try { if (window.kpTrack) window.kpTrack("pageview", "/koszonjuk"); } catch (e) { /* a mérés hibája nem akadályozhatja a beküldést */ }
      })
      .catch(function () {
        sending = false; next.disabled = false; next.textContent = "Ajánlatot kérek";
        err.textContent = "Sajnos nem sikerült elküldeni. Kérjük, próbálja újra, vagy hívjon minket: +36 20 542 2171.";
        err.hidden = false;
      });
  }

  // Az akciós készülékek listája az Akciók oldal adatából (assets/data/akciok.json); az érték a plakát fájlneve.
  var akcioSelect = form.elements.akcio;
  if (akcioSelect) {
    fetch("assets/data/akciok.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (d) {
        ((d && d.akciok) || []).forEach(function (a) {
          if (!a || !a.kep) return;
          var kulcs = a.kep.split("/").pop().replace(/\.[^.]+$/, "");
          var nev = (a.alt || kulcs).split(/ klíma|,/)[0].trim();
          var o = document.createElement("option");
          o.value = kulcs; o.textContent = nev;
          akcioSelect.appendChild(o);
        });
      })
      .catch(function () { /* a lista nélkül is működik az űrlap */ });
  }

  form.addEventListener("change", function () { err.hidden = true; apply(); });
  form.addEventListener("keydown", function (ev) { if (ev.key === "Enter" && ev.target.tagName !== "TEXTAREA") { ev.preventDefault(); nextStep(); } });
  next.addEventListener("click", nextStep);
  back.addEventListener("click", prevStep);
  document.getElementById("wizRestart").addEventListener("click", function () {
    form.reset(); result.hidden = true; form.hidden = false; cur = steps[0]; next.disabled = false; apply(); window.scrollTo({ top: 0, behavior: "smooth" });
  });
  apply();
})();
