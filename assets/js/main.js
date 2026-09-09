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
     TODO (élesítés): kösd be egy backendre / szolgáltatásra:
       - saját serverless végpont (pl. /api/ajanlat) + e-mail (Resend/Postmark)
       - vagy Formspree / Web3Forms / Netlify Forms
     + spamvédelem: Cloudflare Turnstile vagy hCaptcha
     Addig: helyi visszajelzés + mailto tartalék, hogy a látogató ne vesszen el.
  --------------------------------------------------------------- */
  var form = document.querySelector("form[data-quote-form]");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var nev = (data.get("nev") || "").toString().trim();
      var tel = (data.get("telefon") || "").toString().trim();
      var email = (data.get("email") || "").toString().trim();
      var telepules = (data.get("telepules") || "").toString().trim();
      var uzenet = (data.get("uzenet") || "").toString().trim();

      var to = form.getAttribute("data-mailto") || "tambaklima25@gmail.com";
      var subject = "Ajánlatkérés a weboldalról – " + (nev || "névtelen");
      var body =
        "Név: " + nev + "\n" +
        "Telefon: " + tel + "\n" +
        "E-mail: " + email + "\n" +
        "Település: " + telepules + "\n\n" +
        "Üzenet:\n" + uzenet + "\n";
      var href =
        "mailto:" + to +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (status) {
        status.className = "form-status is-ok";
        status.textContent =
          "Köszönjük! Megnyitjuk a levelezőt a kész üzenettel – küldje el, és hamarosan visszahívjuk. Sürgős esetben hívjon: 06 20 542 2171.";
      }
      window.location.href = href;
      form.reset();
    });
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
