# Támba Klíma – weboldal

Klímás vállalkozás bemutatkozó weboldala. **Tűz és jég** arculat (egységben a cég
autófóliájával). Cél: professzionális digitális jelenlét és figyelemfelhívás –
a részleteket a megrendelő telefonon egyezteti.

A teljes tartalmi specifikáció: [`brief/Tamba_Klima_honlap_tervezet.md`](brief/Tamba_Klima_honlap_tervezet.md).

---

## Technológia

**Statikus HTML + CSS + JavaScript. Nincs build lépés, nincs függőség.**
Bármely statikus tárhelyen fut (GitHub Pages, Cloudflare Pages, Netlify, hazai
tárhely). A `brief` a headless CMS-es továbbfejlesztést javasolja – lásd lent.

## Fájlszerkezet

```
index.html            Főoldal
szolgaltatasok.html   Szolgáltatások
arak.html             Árlista
referenciak.html      Galéria (szűrő + lightbox)
gyik.html             Bővebb GYIK (FAQPage strukturált adattal)
kisokos.html          Klíma-kisokos – örökzöld magyarázók (FAQPage)
rolunk.html           Rólunk
kapcsolat.html        Elérhetőségek + ajánlatkérő űrlap (FormSubmit.co)
koszonjuk.html        Köszönőoldal az űrlap elküldése után
aszf.html             Általános Szerződési Feltételek (VÁZLAT – jogi ellenőrzés kell)
adatkezeles.html      Adatkezelési tájékoztató (VÁZLAT – jogi ellenőrzés kell)
impresszum.html       Impresszum (hiányzó adatokkal)
404.html              Hibaoldal
assets/css/styles.css Teljes dizájnrendszer (színek, tipográfia, reszponzív)
assets/js/main.js     Menü, galéria, lightbox, űrlap, chatbot-helyőrző
assets/img/           logo.svg, favicon.svg, tuz-jeg-arculat.jpg, ref-placeholder.svg
robots.txt, sitemap.xml, CNAME, .nojekyll
.github/workflows/pages.yml   GitHub Pages deploy (opcionális út)
brief/                Az adatgyűjtő kérdőív, az eredeti arculati kép és a tervezet
```

## Helyi előnézet

Root-relatív hivatkozások miatt egyszerű helyi szerver kell (a `file://`
megnyitás nem tölti be az almappákat):

```bash
# Python 3
python -m http.server 8080
# vagy Node
npx serve .
# vagy VS Code "Live Server" bővítmény
```

Aztán: <http://localhost:8080>

---

## Kitelepítés GitHubra és élesítés

### 1) Repo létrehozása és feltöltés

A gépen jelenleg **nincs `gh` CLI**, ezért a repót kézzel kell létrehozni:

1. Hozz létre egy üres repót a GitHubon (pl. `tamba-klima-honlap`), README nélkül.
2. Ebben a mappában:

```bash
git add -A
git commit -m "Első verzió: Támba Klíma weboldal"
git branch -M main
git remote add origin https://github.com/<felhasznalonev>/tamba-klima-honlap.git
git push -u origin main
```

> Ha telepíted a GitHub CLI-t (`winget install GitHub.cli`, majd `gh auth login`),
> a fenti helyett elég: `gh repo create tamba-klima-honlap --public --source . --push`.

### 2) Közzététel – GitHub Pages

- **Egyszerű út:** repó → *Settings → Pages → Build and deployment → Deploy from
  a branch → `main` / `(root)`*. Pár perc múlva él a `https://<felhasznalonev>.github.io/tamba-klima-honlap/` címen.
  Ehhez a HTML-ben a hivatkozások **relatívak**, szóval almappás címen is működik.
- **Vagy Actions úton:** *Settings → Pages → Source: GitHub Actions*. A mellékelt
  `.github/workflows/pages.yml` a `main`-re pusholásnál automatikusan deployol.

### 3) Egyéni domain: `tambaklima.hu`

- A `CNAME` fájl már tartalmazza a domaint (GitHub Pageshez kell).
- A domain szolgáltatónál állíts be `A`/`CNAME` rekordokat a
  [GitHub Pages dokumentáció](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site) szerint,
  majd a Pages beállításban add meg a domaint és kapcsold be az „Enforce HTTPS"-t.
- Ha **nem** GitHub Pagest használtok, a `CNAME` fájl törölhető.

Alternatíva Pages helyett: Cloudflare Pages / Netlify – repo bekötése, build
parancs nincs, kiadási könyvtár a repo gyökere.

---

## Élesítés előtti teendők (TODO)

A kódban `TODO` és a szövegben `⚠︎` jelöli. A legfontosabbak:

- [ ] **Valódi tartalom:** min. 30 referenciafotó (a `ref-placeholder.svg` helyére),
      csapatfotó, a fóliázott autó fotója.
- [ ] **Ajánlatkérő űrlap aktiválása** (`kapcsolat.html`): az űrlap a
      **FormSubmit.co**-ra POST-ol (`action="https://formsubmit.co/tambaklima25@gmail.com"`).
      Az **első** beküldés után a FormSubmit egy aktiváló e-mailt küld erre a
      címre – a benne lévő linket egyszer meg kell nyitni, utána minden űrlap
      e-mailben megérkezik. Aktiválás után a cím lecserélhető a FormSubmit
      által adott véletlen aliasra (adatvédelem). A `_next` rejtett mezőt
      írd át a tényleges élő címre, ha nem `tambaklima.hu`. Spam esetén a
      `_captcha` értéke `true`, vagy tegyél elé Cloudflare Turnstile-t.
      Nagy fotófeltöltésnél a FormSubmit-nak méretkorlátja van – a JS 8 MB
      felett figyelmeztet.
- [ ] **Betűk önhosztolása** a Google Fonts CDN helyett (GDPR).
- [ ] **ÁSZF, Adatkezelési tájékoztató, Impresszum** kitöltése és **jogi
      ellenőrzése** (nyilvántartási szám, tárhelyszolgáltató, székhelycím,
      megőrzési idő, adatfeldolgozók; az ÁSZF-ben a jótállás/szavatosság/elállás).
- [ ] **Google Maps sütikezelés:** a térkép jelenleg az oldal betöltésekor
      lejön → süti-hozzájárulás (consent) megoldás javasolt, vagy vissza
      kattintásra betöltőre (a régi `.map-embed` + `data-map` JS még megvan).
- [ ] **Facebook:** jelenleg személyes profil (`facebook.com/csaba.tamba`);
      céges oldal létrehozása után a link cseréje (lábléc, Kapcsolat, `sameAs`).
- [ ] **Google Cégem:** a láblécben most keresési link; cseréld a Google
      Cégem „profil megosztása" linkre / place ID-re.
- [ ] **Analitika:** süti nélküli megoldás (Plausible / Umami) + Search Console.
- [ ] **Betűk önhosztolása** a Google Fonts CDN helyett (GDPR).
- [ ] **Vélemények szekció** a főoldalra + 2-3 valódi értékelés (opcionális).
- [ ] **Nyitott üzleti kérdések** a `brief` 10. pontja szerint (megszólítás,
      pontos településlista, kazettás klíma felára, sürgősségi díj…).

## Chatbot (későbbi bővítés)

Az oldal előkészített: a jobb alsó lebegő gomb egy helyőrző panelt nyit.
Élesítéskor a valódi chat-widget beillesztő scriptje kerül a helyére
(`assets/js/main.js` „Chatbot helyőrző" blokk). Tudásbázisnak a
`brief/Tamba_Klima_honlap_tervezet.md` *Szolgáltatások + Árak + GYIK + Cégadatok*
része használható; a GYIK már `schema.org/FAQPage` jelöléssel készült.
Ügyelj rá, hogy a widget **ne takarja** a mobil ragadós hívásgombot
(a `.chat-fab` `bottom` értéke ezt már figyelembe veszi).

## Továbbfejlesztés headless CMS-re

A `brief` ajánlása szerint a galéria / GYIK / szövegek CMS-ből szerkeszthetők
legyenek. Javasolt út: Astro vagy Next.js statikus build + Sanity/Storyblok.
A jelenlegi HTML szerkezet és a `styles.css` közvetlenül átemelhető
komponensekbe.

---

## Arculati alapok

- **Színek:** hideg kék `#1E9BE0`/`#0B5CAB`/`#073B73`, meleg narancs
  `#FF8A1F`/`#F5561D`, kiemelő sárga `#FFC400`. Teljes paletta: `assets/css/styles.css` `:root`.
- **Betűk:** Montserrat (címsor), Inter (törzs).
- **Logó:** `assets/img/logo.svg` – helyettesíthető profi verzióval; a favicon a `favicon.svg`.

## Licenc / szerzői jog

A tartalom és az arculat a Támba Klíma tulajdona. A repó privát/publikus
állapotát a tulajdonos dönti el.
