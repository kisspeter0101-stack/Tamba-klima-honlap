/* =============================================================
   Támba Klíma – kliens oldali JS (függőség nélkül)
   - mobil menü
   - galéria szűrő + lightbox
   - GYIK "csak egy nyitva" (opcionális)
   - ajánlatkérő űrlap (helyi visszajelzés + mailto tartalék)
   - chatbot helyőrző panel
   ============================================================= */
(function () {
  "use strict";

  /* ---------- Év a láblécben ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Mobil menü ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Galéria szűrő ---------- */
  var filterBar = document.querySelector(".gallery-filters");
  var gallery = document.querySelector(".gallery");
  if (filterBar && gallery) {
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      filterBar.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      var f = btn.getAttribute("data-filter");
      gallery.querySelectorAll("figure").forEach(function (fig) {
        var cat = fig.getAttribute("data-cat") || "";
        fig.hidden = !(f === "all" || cat === f);
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lb = document.querySelector(".lightbox");
  if (lb && gallery) {
    var lbImg = lb.querySelector("img");
    var shots = [];
    var idx = 0;

    function collectVisible() {
      shots = Array.prototype.slice
        .call(gallery.querySelectorAll("figure"))
        .filter(function (f) { return !f.hidden; })
        .map(function (f) { return f.querySelector("img"); });
    }
    function show(i) {
      if (!shots.length) return;
      idx = (i + shots.length) % shots.length;
      var src = shots[idx].getAttribute("data-full") || shots[idx].src;
      lbImg.src = src;
      lbImg.alt = shots[idx].alt || "Referenciafotó";
    }
    function open(target) {
      collectVisible();
      var i = shots.indexOf(target);
      show(i < 0 ? 0 : i);
      lb.setAttribute("data-open", "true");
      document.body.style.overflow = "hidden";
      lb.querySelector(".lightbox__close").focus();
    }
    function close() {
      lb.setAttribute("data-open", "false");
      document.body.style.overflow = "";
    }
    gallery.addEventListener("click", function (e) {
      var b = e.target.closest("button.shot");
      if (!b) return;
      open(b.querySelector("img"));
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.closest(".lightbox__close")) close();
      else if (e.target.closest(".lightbox__nav.prev")) show(idx - 1);
      else if (e.target.closest(".lightbox__nav.next")) show(idx + 1);
    });
    document.addEventListener("keydown", function (e) {
      if (lb.getAttribute("data-open") !== "true") return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Ajánlatkérő űrlap ----------
     Az űrlap natívan a FormSubmit.co végpontra POST-ol (lásd kapcsolat.html).
     Itt csak: kliensoldali ellenőrzés, mézesbödön (honeypot), képméret-korlát,
     és dupla küldés elleni gombtiltás. A tényleges küldést a böngésző végzi.
  --------------------------------------------------------------- */
  var form = document.querySelector("form[data-quote-form]");
  if (form) {
    var status = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var MAX_UPLOAD = 8 * 1024 * 1024; // ~8 MB összes kép

    var showErr = function (msg) {
      if (!status) { alert(msg); return; }
      status.className = "form-status is-err";
      status.textContent = msg;
    };

    form.addEventListener("submit", function (e) {
      // Honeypot: ha a rejtett mező ki van töltve, bot -> csendben eldobjuk
      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) { e.preventDefault(); return; }

      if (!form.reportValidity()) { e.preventDefault(); return; }

      var files = form.querySelector('input[type="file"]');
      if (files && files.files && files.files.length) {
        var total = 0;
        for (var i = 0; i < files.files.length; i++) total += files.files[i].size;
        if (total > MAX_UPLOAD) {
          e.preventDefault();
          showErr("A csatolt képek túl nagyok. Kérjük, küldjön kevesebb vagy kisebb képet, a többit pedig Messengeren – vagy hagyja el a fotókat, és a felmérésen megnézzük.");
          return;
        }
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Küldés…";
      }
      if (status) {
        status.className = "form-status is-ok";
        status.textContent = "Küldés folyamatban…";
      }
      // innen a natív beküldés fut, és a FormSubmit a köszönőoldalra irányít
    });
  }

  /* ---------- Aktuális akciók ----------
     Az akciók az assets/data/akciok.json fájlból jönnek (soronként egy kép).
     Üres tömb vagy hiba esetén a szekció a "nincs akció" szöveget mutatja.
  --------------------------------------------------------------- */
  var promoWrap = document.querySelector("[data-promos]");
  if (promoWrap) {
    var promoGrid = promoWrap.querySelector("[data-promo-grid]");
    var promoEmpty = promoWrap.querySelector("[data-promo-empty]");
    fetch("assets/data/akciok.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (list) {
        if (!Array.isArray(list)) list = [];
        list = list.slice(0, 3);
        if (!list.length) return;
        promoGrid.innerHTML = "";
        list.forEach(function (a) {
          if (!a || !a.kep) return;
          var link = document.createElement("a");
          link.className = "promo";
          link.href = a.link || "kapcsolat.html";
          if (/^https?:/.test(link.href)) { link.target = "_blank"; link.rel = "noopener"; }
          var img = document.createElement("img");
          img.src = a.kep;
          img.alt = a.alt || "Aktuális akció";
          img.loading = "lazy";
          link.appendChild(img);
          var cta = document.createElement("span");
          cta.className = "promo__cta";
          cta.innerHTML = "<span>" + (a.gomb || "Kérek ajánlatot") + "</span><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M5 12h14M13 6l6 6-6 6'/></svg>";
          link.appendChild(cta);
          promoGrid.appendChild(link);
        });
        promoGrid.hidden = false;
        if (promoEmpty) promoEmpty.hidden = true;
      })
      .catch(function () { /* marad a "nincs akció" állapot */ });
  }

  /* ---------- GYIK / Kisokos kereső ----------
     Ékezet-érzéketlen szűrés a kérdés + válasz szövegében.
  --------------------------------------------------------------- */
  var faqInput = document.getElementById("faq-q");
  if (faqInput) {
    var norm = function (s) {
      return (s || "")
        .toLowerCase()
        .replace(/[áàâ]/g, "a").replace(/[éè]/g, "e").replace(/[íì]/g, "i")
        .replace(/[óòöő]/g, "o").replace(/[úùüű]/g, "u")
        .replace(/\s+/g, " ")
        .trim();
    };
    var faqItems = Array.prototype.slice.call(document.querySelectorAll(".faq"));
    var faqGroups = Array.prototype.slice.call(document.querySelectorAll(".faq-group"));
    var noResult = document.querySelector("[data-faq-noresult]");
    var noResultTerm = noResult ? noResult.querySelector("[data-term]") : null;

    faqInput.addEventListener("input", function () {
      var q = norm(faqInput.value);
      var hits = 0;
      faqItems.forEach(function (item) {
        var match = q === "" || norm(item.textContent).indexOf(q) !== -1;
        item.hidden = !match;
        item.open = q !== "" && match;
        if (q !== "" && match) hits++;
      });
      faqGroups.forEach(function (group) {
        var anyVisible = group.querySelector(".faq:not([hidden])");
        group.hidden = q !== "" && !anyVisible;
      });
      if (noResult) {
        var show = q !== "" && hits === 0;
        noResult.hidden = !show;
        if (show && noResultTerm) noResultTerm.textContent = faqInput.value.trim();
      }
    });
  }

  /* ---------- Térkép: kattintásra betöltő Google Térkép ----------
     Adatvédelmi okból a Google Térkép csak a látogató kattintására töltődik be.
  --------------------------------------------------------------- */
  document.querySelectorAll("[data-map]").forEach(function (box) {
    var btn = box.querySelector("[data-map-load]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var src = box.getAttribute("data-map-src");
      if (!src) return;
      var f = document.createElement("iframe");
      f.src = src;
      f.title = box.getAttribute("data-map-label") || "Térkép";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.setAttribute("allowfullscreen", "");
      box.innerHTML = "";
      box.appendChild(f);
    });
  });

  /* ---------- Chatbot helyőrző ----------
     TODO (élesítés): ide kerül a valódi chat-widget beillesztő scriptje.
     A tudásbázis a brief/Tamba_Klima_honlap_tervezet.md GYIK + Árak + Szolgáltatások része.
     Ügyelj rá, hogy a widget ne takarja a mobil ragadós hívásgombot (lásd .chat-fab bottom).
  --------------------------------------------------------------- */
  var fab = document.querySelector(".chat-fab");
  var pop = document.querySelector(".chat-pop");
  if (fab && pop) {
    fab.addEventListener("click", function () {
      var open = pop.getAttribute("data-open") === "true";
      pop.setAttribute("data-open", String(!open));
    });
    pop.querySelector("[data-chat-close]").addEventListener("click", function () {
      pop.setAttribute("data-open", "false");
    });
  }
})();
