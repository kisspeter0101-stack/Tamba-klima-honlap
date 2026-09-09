# Támba Klíma – honlap tervezet és tartalmi specifikáció

> Ez a dokumentum tartalmazza az összes információt, amely alapján a Támba Klíma
> weboldala elkészíthető: a célokat, az arculatot (tűz–jég dizájn), az
> oldalszerkezetet, a végleges szövegeket, az árakat, a bővített GYIK-et, a
> funkciók specifikációját (referenciakép-feltöltés, jövőbeli chatbot) és a
> technikai ajánlásokat.
>
> Forrás: `Tambaklima_adatgyujto_kerdoiv.docx` (kitöltött kérdőív) és
> `Támba klíma.jpg` (a meglévő tűz–jég arculati kép, amellyel az autó is
> fóliázva van).

---

## 1. A projekt célja és kerete

| | |
|---|---|
| **Fő cél** | A vállalkozás **professzionális digitális jelenléte** és **figyelemfelhívás**. Nem tranzakciós oldal – a részleteket a megrendelővel **telefonon** egyeztetik. |
| **Elsődleges konverzió** | **Telefonhívás** (06 20 542 2171). Másodlagos: ajánlatkérő űrlap kitöltése. |
| **Másodlagos cél** | Bizalomépítés (referenciák, árak átláthatósága, képesítés, biztosítás), helyi keresési láthatóság (Nyíregyháza és környéke). |
| **Hangnem** | Barátságos-közvetlen, de szakmailag hiteles. Rejtett költségek nélkül, érthető megfogalmazás. |
| **Nyelv** | Magyar (egynyelvű). |
| **NINCS az oldalon** | **Időpontfoglaló rendszer** – a megrendelő kifejezett kérése. A folyamat: érdeklődés → telefonos egyeztetés → felmérés. |

### Amit az oldalnak mindenképp tudnia kell (kiemelt elvárások)

- **Referenciakép-feltöltés** – a vállalkozó által kezelt (admin) galéria, ld. [6.1](#61-referencia-galéria--admin-képfeltöltés).
- **Bővebb GYIK szekció** – az összes ügyféloldali kérdést lefedő, kereshető/akkordeonos rész, ld. [5.6](#56-gyik--gyakran-ismételt-kérdések).
- **Chatbot előkészítése** – későbbi bekötésre, a tudásbázis ez a dokumentum, ld. [6.3](#63-chatbot--későbbi-bővítés).
- **Reszponzív, „nem esik szét" megjelenés** számítógépen, tableten és telefonon, ld. [8](#8-reszponzivitás--eszközönkénti-követelmények).
- **Tűz–jég arculat** következetes visszaköszönése (egységben az autófóliával).

---

## 2. Célközönség

| Szegmens | Jellemző igény | Üzenet nekik |
|---|---|---|
| **Magánszemélyek** (lakossági) | Gyors, tiszta, korrekt árú klímatelepítés; nyári csúcsidőben elérhetőség; érthető tájékoztatás | „Precíz szerelés, átlátható ár, ingyenes felmérés." |
| **Cégek / irodák / kereskedelmi egységek** | Számlaképesség, rugalmas időpont, multi-split és nagyobb rendszerek, karbantartási megbízhatóság | „Számlaképesen, rugalmasan, karbantartással együtt." |
| **Fűtési célú vásárlók** | Hőszivattyús / fűtésre optimalizált klíma fő fűtésként | „Hűtés és fűtés – egész évben." |

A kérdőív szerint **mindkét fő szegmens** (magán + céges) egyformán fontos.

---

## 3. Arculat és dizájnrendszer – „Tűz és jég"

### 3.1. A koncepció

A meglévő képen (és az autófólián) a **bal oldal hideg** (kék jég, hódara,
hópelyhek), a **jobb oldal meleg** (sárga-narancs-vörös láng, szikra), középen
a kettő találkozása. A felirat: **„TÁMBA"** hűvös kékkel, **„KLÍMA"** meleg
naranccsal, alatta **sárga telefonszám**, majd a szlogen:
**„HŰTÉS FŰTÉS – EGÉSZ ÉVBEN"**.

Ez a kettősség az egész oldal vezérmotívuma:

- **Hűtés** jellegű tartalmak, ikonok, kártyák → **kék** jelölés.
- **Fűtés / hőszivattyú** jellegű tartalmak → **narancs** jelölés.
- A „HŰTÉS · FŰTÉS – EGÉSZ ÉVBEN" tengely végigvezet az oldalon (hero,
  szolgáltatások, záró CTA).
- Szekcióelválasztók **ferde (diagonal) vágással**, ami a tűz–jég találkozási
  vonalát idézi.

### 3.2. Színpaletta

| Szerep | Név | HEX | Használat |
|---|---|---|---|
| Hideg – világos | Jég kék | `#4FC3F7` | ikonok, kiemelés, „hűtés" kártyák akcentusa |
| Hideg – alap | Ég kék | `#1E9BE0` | linkek, gombok (hideg vég), grafikák |
| Hideg – mély | Mély kék | `#0B5CAB` | fejléc/lábléc, „TÁMBA" felirat, gomb-hover |
| Hideg – sötét | Éjkék | `#073B73` | sötét háttérsávok |
| Hideg – halvány | Dér fehér | `#EAF6FF` | világos szekcióháttér |
| Meleg – világos | Nap sárga | `#FFD21E` | apró kiemelések, ikonrészletek |
| Meleg – alap | Narancs | `#FF8A1F` | „KLÍMA" felirat, „fűtés" kártyák, másodlagos CTA |
| Meleg – erős | Vörös-narancs | `#F5561D` | fő CTA-gomb (gradiens vég), hangsúlyok |
| Meleg – mély | Mély vörös | `#C42911` | hover, hangsúlyos állapotok |
| Kiemelő | Jelző sárga | `#FFC400` | **telefonszám**, „X Ft-tól" ár-kiemelés |
| Szöveg | Éjfekete | `#0E1621` | törzsszöveg, címsorok sötét háttéren fehér |
| Másodlagos szöveg | Palaszürke | `#5B6B7B` | segédszöveg, feliratok |
| Háttér | Világos szürke | `#F5F8FB` | oldalháttér |
| Alap | Fehér | `#FFFFFF` | kártyák, tartalmi dobozok |

- **Fő CTA gomb:** kék→narancs vagy narancs→vörös **gradiens**
  (`#1E9BE0 → #F5561D`), fehér felirattal, lekerekített sarok, jól látható
  fókuszgyűrű.
- **Hero háttér:** bal alsó hideg kék → jobb felső meleg narancs átmenet,
  középen világos „villanás"; SVG/CSS gradienssel (ne bitmap, hogy minden
  méreten éles maradjon), finoman animálható.
- **Kontraszt:** minden szöveg érje el a **WCAG AA** szintet. Sárga
  (`#FFC400`) csak sötét háttéren vagy fekete kontúrral használható szövegként.

### 3.3. Tipográfia

| Szint | Betűtípus (javaslat) | Stílus |
|---|---|---|
| Logó / wordmark | **Anton** vagy **Archivo Black** (erős, kissé condensed) | nagybetűs, vékony fehér kontúr + finom árnyék (a kép szerint) |
| Címsorok (H1–H3) | **Montserrat** 700/800 | tömör, magabiztos |
| Törzsszöveg | **Inter** (vagy `system-ui`) 400/500 | 16–18 px, jó sorköz (1,6) |

- Fluid méretezés `clamp()`-pel:
  - H1: `clamp(2rem, 5vw, 3.5rem)`
  - H2: `clamp(1.5rem, 3.5vw, 2.25rem)`
  - Törzs: `clamp(1rem, 1.2vw, 1.125rem)`
- Google Fonts helyett önhosztolt betűk (teljesítmény + GDPR), `font-display: swap`, a fő betűk `preload`-dal.

### 3.4. Logó / wordmark

Kész logó **nincs**. A weboldal készítője állítsa elő a **„TÁMBA KLÍMA"
wordmarkot** a kép alapján:

- „TÁMBA" hideg kék gradiens, „KLÍMA" meleg narancs gradiens.
- Vékony fehér körvonal + lágy árnyék, enyhén dinamikus (dőlt vagy lendületes) vágás.
- Készüljön: vízszintes és halmozott (2 soros) változat, csak-ikon változat
  (pl. stilizált hópehely + láng monogram), világos és sötét háttérre,
  `SVG` + `PNG` + `favicon` + `OG-kép`.
- Szlogen lockup: „HŰTÉS · FŰTÉS – EGÉSZ ÉVBEN" világosszürkével, sötét kontúrral.

### 3.5. Motívumok, ikonok, fotók

- **Motívumok:** bal oldali dér/hókristály textúra, jobb oldali szikra/láng,
  középső „gőz/robbanás" a találkozásnál. Diszkréten, ne nyomja el a tartalmat.
- **Ikonok:** egységes vonalas készlet, kétszínű kiemeléssel (kék a hűtéshez,
  narancs a fűtéshez).
- **Fotók:**
  - A **fóliázott autó** fotója bizalmi elemként a hero közelében és a
    „Rólunk" részben (egységes arculat üzenete).
  - Szerelés közbeni és kész munkák fotói (min. 30 db – ld. [11](#11-átadandó-anyagok-a-megrendelőtől)).
  - Egységes színkezelés: hideg-meleg kontraszt, kitakart arcok/rendszámok, ahol kell.

### 3.6. Mozgás / animáció

- Finom, céltudatos animációk: hero gradiens lassú lélegzése, ikon-hover,
  scroll-reveal, számláló („30+ elvégzett munka").
- **`prefers-reduced-motion`** tiszteletben tartása (kikapcsolható mozgás).
- Semmi villódzó, gyors vagy figyelemelterelő effekt.

---

## 4. Oldalszerkezet (sitemap) és navigáció

```
Főoldal  (/)
├─ Szolgáltatások            (/szolgaltatasok)      – vagy főoldali szekció + horgonyok
├─ Árak                      (/arak)
├─ Referenciák / Galéria     (/referenciak)
├─ GYIK                      (/gyik)
├─ Rólunk                    (/rolunk)
├─ Kapcsolat                 (/kapcsolat)           – elérhetőségek + ajánlatkérő űrlap
├─ Adatkezelési tájékoztató  (/adatkezeles)         – láblécből
├─ Impresszum                (/impresszum)          – láblécből
└─ Admin (nem publikus)      (/admin)               – referenciakép-feltöltés
```

**Fejléc (sticky):** logó balra; menü jobbra; kiemelt, mindig látható
**„06 20 542 2171"** gomb (kék→narancs gradiens, telefon ikon).
**Mobil:** hamburger menü + **ragadós alsó hívásgomb** a képernyő alján.

**Lábléc:** cégadatok, elérhetőségek, nyitvatartás (6:00–20:00), rövid menü,
közösségi linkek (Facebook, Google Cégem), Adatkezelés + Impresszum linkek,
„Weboldal készítése: …".

---

## 5. Oldalankénti tartalom (végleges szövegekkel)

> A szövegek felhasználásra készek. A `⚠︎` jelöltek egyeztetendők a
> megrendelővel (ld. [10](#10-nyitott-kérdések--telefonon-egyeztetendő)).

### 5.1. Főoldal

**1) Hero**

- **H1:** „Hűtés és fűtés – egész évben, Nyíregyházán és 50 km-es körzetében"
- **Alcím:** „Klímatelepítés, hőszivattyú, karbantartás és javítás – rejtett
  költségek nélkül, precízen, gyorsan."
- **Fő CTA:** „Hívás: 06 20 542 2171" · **Másodlagos CTA:** „Ajánlatkérés"
- **Bizalmi sáv (a hero alján):** „Ingyenes helyszíni felmérés · Felelősség­biztosítás
  · Számlaképes · 30+ elvégzett munka"
- **Ár-horgony (kiemelve):** „Klímaszerelés **80 000 Ft-tól**"
- **Vizuál:** tűz–jég kompozíció; opcionálisan a fóliázott autó beúszó képe.

**2) Szolgáltatások rács** (kártyák; kék = hűtés, narancs = fűtés)

Rövid felvezető: „Lakossági és céges klímamunkák egy kézből – a felméréstől a
karbantartásig." Alatta a [5.2](#52-szolgáltatások) kártyái (ikon + név +
1 mondat + „Részletek").

**3) „Miért a Támba Klíma?"** – 6 érv (a kérdőívből)

- **Rejtett költségek nélkül** – az árat előre, tételesen tisztázzuk.
- **Érthető, őszinte felvilágosítás** – közérthetően elmondjuk, mi miért kell.
- **Minőségi anyagok** – bevált alkatrészek és szakszerű kivitelezés.
- **Precíz, gyors munkavégzés** – tiszta, rendezett befejezés.
- **Az Ön igénye az első** – a helyiséghez és a céljához választunk gépet és helyet.
- **Ingyenes helyszíni felmérés** – 30 perc utazási időn belül díjmentes.

**4) Árak – kivonat**

3–4 kiemelt ár kártyán (alapszerelés 80 000 Ft-tól; karbantartás 15 000 Ft;
kiszállás/felmérés ingyenes) + **„Teljes árlista"** gomb + kis betűs figyelmeztetés:
„A végleges ár helyszíni felmérés után alakul ki. 3 géptől egyedi ár."

**5) Hogyan zajlik?** – 4 lépés

1. **Kapcsolatfelvétel** – telefonon vagy az ajánlatkérő űrlapon.
2. **Helyszíni felmérés** – megnézzük az adottságokat, meghallgatjuk az igényeket.
3. **Klímaválasztás + árajánlat** – a helyiséghez illő gép és pontos ár a felméréskor.
4. **Időpont és telepítés** – egyeztetett időpontban, precízen kivitelezve.

**6) Referenciák** – 6–8 kiemelt kép a galériából + „Összes referencia" gomb.

**7) Vélemények** – néhány Facebook-hozzászólás (⚠︎ szöveg + engedély
beszerzendő) + „Értékeljen minket a Google-on" link.

**8) GYIK – kivonat** – 5–6 leggyakoribb kérdés akkordeonban + „Összes kérdés".

**9) Márkák** – „Elsősorban Midea klímákat telepítünk, de bármilyen márkát
beszerzünk: MDV, Gree, TCL, Polar, Vivax." (logósor vagy szöveges felsorolás)

**10) Szolgáltatási terület** – rövid szöveg + térkép/lista: „Nyíregyháza és
kb. 50 km-es körzete. 30 perc utazási időn belül a helyszíni felmérés ingyenes."
(⚠︎ pontos településlista bekérendő.)

**11) Záró CTA sáv** – „Kérjen ingyenes felmérést" + „Hívás: 06 20 542 2171".

**12) Lábléc** – ld. [4](#4-oldalszerkezet-sitemap-és-navigáció).

---

### 5.2. Szolgáltatások

Felvezető: „A felméréstől a karbantartásig minden klímamunkát elvégzünk –
lakossági és céges környezetben egyaránt, számlaképesen."

| Szolgáltatás | Jelölés | Leírás (az oldalra) |
|---|---|---|
| **Klímatelepítés – lakossági** | kék | Rövid határidővel, minőségi anyagokkal, precízen. A helyiséghez választjuk a megfelelő teljesítményű gépet. |
| **Klímatelepítés – irodai / kereskedelmi** | kék | Számlaképesen, rugalmas időpontokkal, a cég működéséhez igazodva. |
| **Multi-split rendszerek** | kék | Egy kültéri egységhez több beltéri – ideális, ha több helyiséget kell hűteni-fűteni. |
| **Ipari klímarendszerek (VRF / VRV)** | kék | Nagyobb épületek, üzletek, irodaházak komplex hűtés-fűtése. |
| **Hőszivattyú telepítés** | narancs | Fűtésre optimalizált rendszerek – akár fő fűtésként is, a megfelelő készülék kiválasztása után. |
| **Éves karbantartás, fertőtlenítés** | kék | Mosózsákos tisztítás megfelelő vegyszerekkel és gépekkel; szűrőtisztítás, fertőtlenítés a hosszú élettartamért. |
| **Javítás / hibaelhárítás** | kék | Megbízható hibakeresés és javítás. Fő szezonban a kapacitás korlátozott lehet. |
| **Régi klíma leszerelése / cseréje** | kék | Precíz leszerelés, az új gép a meglévő helyére; a régi készülék elszállítása egyedi megállapodás szerint. |
| **Mobil klíma üzembe helyezés** | kék | Mobil klímák szakszerű beüzemelése. |
| **Sürgősségi / hétvégi kiszállás** | narancs | Igény szerint, egyeztetés alapján. |
| **Energetikai tanácsadás** | kék | A helyiség méretéhez és az igényekhez igazítva választjuk ki és helyezzük el a megfelelő klímát. |
| **Segítség pályázathoz / állami támogatáshoz** | narancs | Tájékoztatás a lehetőségekről. (Visszafogott megjelenítés – ld. ⚠︎ [10](#10-nyitott-kérdések--telefonon-egyeztetendő).) |

Minden szolgáltatáskártya alja: „Kérdése van? **Hívjon: 06 20 542 2171**" +
„Ajánlatkérés" link.

---

### 5.3. Árak

**Bevezető szöveg:** „Szeretjük, ha az ügyfél előre látja, mire számíthat –
ezért az árainkat nyíltan közöljük. A táblázatban bruttó, tájékoztató árak
szerepelnek; a **végleges ár a helyszíni felmérés után** alakul ki."

| Tétel | Ár (bruttó, tájékoztató) |
|---|---|
| Alapszerelés – standard split, **3,5 kW-ig** | **80 000 Ft-tól** |
| Alapszerelés – nagyobb teljesítmény, **3,5 kW felett** | **100 000 Ft-tól** |
| Falon kívüli vezetéktakaró (kábelcsatorna) | **Az alapárban** |
| Többlet csővezeték (az alapban foglalt hosszon felül) | **12 000 Ft / méter** |
| Extra falátfúrás | **10 000 Ft / db** |
| Elektromos bekötés hosszabbítása | **10 méterig díjmentes**, felette egyedi |
| Multi-split rendszer | **+60 000 Ft / beltéri egység** |
| Kazettás / mennyezeti / padlón álló klíma felára | Egyedi (felmérés alapján) ⚠︎ |
| Régi készülék leszerelése | **20 000 Ft-tól** |
| Régi készülék elszállítása | Egyedi megállapodás szerint |
| Nehezített hozzáférés (magasból, állványról) | Egyedi – az állványbérlet függvényében |
| Karbantartás (alkalmanként) | **15 000 Ft** |
| Fertőtlenítő (vegyszeres) tisztítás | **15 000 Ft** |
| Kiszállási / helyszíni felmérés | **Ingyenes** (30 perc utazási időn belül) |

**Kiemelt sáv:** „**3 géptől egyedi ár** – kérjen személyre szabott ajánlatot."

**Fizetés:** készpénz vagy azonnali banki utalás. Számlát minden esetben adunk.
Részletfizetés jelenleg nincs. ⚠︎

**Garancia:**
- **Készülékre:** a gyártó által meghatározott garancia (jellemzően **5 év**),
  a rendszeres karbantartás elvégzéséhez kötve.
- **Szerelési munkára:** **1 év**.

---

### 5.4. Referenciák / Galéria

- Bevezető: „Néhány az elvégzett munkáink közül. A galéria folyamatosan bővül."
- **Rácsos galéria** kategóriaszűrővel: *Lakossági · Irodai / kereskedelmi ·
  Ipari · Hőszivattyú · Karbantartás*.
- Képre kattintva **lightbox**; opcionális rövid felirat (pl. „Split klíma,
  Nyíregyháza" – település és/vagy dátum).
- Lusta betöltés (lazy-load), leíró `alt` szövegek.
- A képeket a vállalkozó tölti fel az admin felületen – ld.
  [6.1](#61-referencia-galéria--admin-képfeltöltés).
- CTA a galéria alján: „Ilyen munkát szeretne? **Hívjon: 06 20 542 2171**".

---

### 5.5. Rólunk

**Szöveg (vázlat, a kérdőív alapján – ⚠︎ jóváhagyandó):**

> A **Támba Klíma** mögött **Támba Csaba egyéni vállalkozó** áll, 2–3 fős
> szerelőcsapattal. Hűtő- és klímaberendezés-szerelőként ipari hűtéstechnikával,
> klímákkal, hőszivattyúkkal, valamint víz-, gáz- és fűtésszereléssel is
> foglalkozunk.
>
> Nyíregyházán és kb. 50 km-es körzetében dolgozunk, lakossági és céges
> ügyfeleknek egyaránt. Elsősorban Midea klímákat telepítünk, de bármilyen
> márkát beszerzünk.
>
> Amit fontosnak tartunk: **rejtett költségek nélkül**, érthető tájékoztatás,
> minőségi anyagok, precíz és gyors munka, és hogy a megrendelő igényét
> maximálisan figyelembe vegyük.
>
> **Felelősségbiztosítással** dolgozunk, és minden munkáról **számlát adunk**.

**Kiemelt adatok blokkban:** alapítás 2025 · 2–3 szerelő · felelősségbiztosítás
· számlaképes · nyitvatartás 6:00–20:00 · szolgáltatási terület: Nyíregyháza +
50 km.

**Fotó:** csapatkép + a fóliázott autó (egységes arculat).

---

### 5.6. GYIK – Gyakran Ismételt Kérdések

**Megjelenés:** kereshető/akkordeonos, kategóriákba rendezve. Minden válaszra
`schema.org/FAQPage` strukturált adat kerül (SEO + a jövőbeli chatbot
tudásbázisa). Az oldal alján állandó CTA: „Nem találja a választ?
**Hívjon: 06 20 542 2171**".

#### Árak és fizetés

**Mennyibe kerül egy klíma telepítése?**
80 000 Ft-tól, a végösszeget a helyszín és a kivitelezés körülményei
befolyásolják. Pontos árat a díjmentes felmérés után tudunk mondani.

**Van-e „X Ft-tól" jellegű bevezető ár?**
Az alapszerelés 80 000 Ft-tól indul. **3 géptől egyedi árat** adunk.

**Milyen fizetési módokat fogadnak el, van-e részletfizetés?**
Készpénz és azonnali banki utalás. Számlát minden esetben adunk.
Részletfizetés jelenleg nincs. ⚠︎

**Kell fizetni a kiszállásért / felmérésért?**
30 perc utazási időn belül a helyszíni felmérés ingyenes. Ezen kívül
kiszállási díjjal dolgozunk, ilyenkor a felmérés nem díjmentes.

#### A telepítés folyamata

**Mennyi idő alatt zajlik le egy telepítés?**
Általában legalább 2 óra, de a körülményektől és a nehézségektől függ.

**Mi a megrendelés menete?**
Megkeresés → helyszíni felmérés → az igények egyeztetése → a megfelelő klíma
kiválasztása → árkalkuláció a felméréskor → időpont-egyeztetés a telepítésre.

**Vállalnak-e régi klíma leszerelését / cseréjét?**
Igen. A régi gépet szakszerűen leszereljük, az újat precízen, az igényeknek
megfelelően a helyére tesszük. A régi készülék elszállítása egyedi megállapodás
szerint történik.

#### Készülékválasztás

**Milyen klímát / márkát ajánlanak?**
Elsősorban Midea; emellett MDV, Gree, TCL, Polar, Vivax. Hogy melyik mire jó,
az a típustól függ – a felméréskor személyre szabottan javaslunk.

**Hogyan lehet kiszámolni, mekkora teljesítményű klíma kell?**
A klíma paraméterei megadják, mekkora alapterületet / légköbmétert képes
ellátni. A felméréskor a helyiség adottságai alapján választjuk ki a megfelelő
teljesítményt.

**Mennyire hangos a beltéri / kültéri egység?**
Az általunk forgalmazott gépek csendes működésűek.

#### Karbantartás

**Milyen gyakran kell karbantartani a klímát, és mennyibe kerül?**
A Midea évi 1 karbantartást ír elő, egyes gyártók (pl. Gree) évi 2-t.
A karbantartás alkalmanként 15 000 Ft, a fertőtlenítő tisztítás szintén 15 000 Ft.

#### Garancia

**Mennyi a garancia a készülékre és a beszerelésre?**
A készülékre a gyártó által meghatározott garancia vonatkozik (jellemzően 5 év),
a rendszeres karbantartáshoz kötve. A szerelési munkára 1 év garanciát vállalunk.

#### Fűtés / hőszivattyú

**Lehet-e télen fűteni is a klímával?**
Igen. A fűtésre optimalizált klímák akár fő fűtésként is tökéletesen működnek –
a megfelelő készülék kiválasztása után.

#### Hibaelhárítás

**Mennyi idő alatt érnek ki meghibásodás esetén?**
Rövid határidővel, akár aznap – attól függ, mennyire betáblázott az adott nap.

**Vállalnak-e javítást?**
Igen, megbízhatóan. Fő szezonban a kapacitás korlátozott lehet.

#### Terület és időpont

**Pontosan mely településeken vállalnak munkát?**
Nyíregyháza és kb. 50 km-es körzete. A közeli településeken ingyenes
kiszállással; a hosszabb menetidejű helyszíneken kiszállási díjjal (ide a
felmérés nem díjmentes). ⚠︎ pontos településlista

**Mennyivel előre kell időpontot foglalni?**
Szezonban célszerű legalább 2 héttel; szezonon kívül akár egy héten belül is.

#### Engedélyek

**Kell-e engedély a klíma felszereléséhez társasházban vagy bérleményben?**
Általában nem, de előfordulhat. Bérlemény esetén érdemes a tulajdonos
hozzájárulását kérni.

#### Támogatások

**Van-e jelenleg állami támogatás vagy pályázat klíma / hőszivattyú telepítésére?**
Időszakosan van. A gyakorlati tapasztalatunk vegyes, ezért ebben csak
korlátozott mértékben tudunk segíteni. ⚠︎ (megjelenítés egyeztetendő)

#### Javasolt további kérdések (⚠︎ válaszok jóváhagyása szükséges)

- **Adnak-e számlát?** – Igen, minden munkáról.
- **Dolgoznak-e hétvégén?** – Igény szerint, sürgősségi / egyeztetett kiszállással.
- **Kell-e külön aljzat / áramkör a klímának?** – A felméréskor ellenőrizzük;
  10 méterig az elektromos bekötés hosszabbítása díjmentes.
- **Hová kerülhet a kültéri egység?** – A felméréskor közösen jelöljük ki a
  legjobb helyet (falra, teraszra, tetőre – az adottságoktól függően).
- **Otthon nekem kell-e tisztítanom a szűrőt?** – A beltéri szűrőt érdemes
  1–2 hetente átöblíteni; a mélytisztítást az éves karbantartáson végezzük.

---

### 5.7. Kapcsolat

**Elérhetőségek (nagy, kattintható):**

- **Telefon:** 06 20 542 2171 (a domináns elem, `tel:` link)
- **E-mail:** tambaklima25@gmail.com ⚠︎ *(javasolt: `info@tambaklima.hu` a
  domainhez)*
- **Messenger / Facebook:** ⚠︎ pontos link bekérendő
- **Cím / székhely:** 4405 Nyíregyháza, Kökény utca 61.
- **Nyitvatartás:** minden nap 6:00–20:00
- **Szolgáltatási terület:** Nyíregyháza és 50 km-es körzete
- Térkép (beágyazott, adatvédelmi szempontból kattintásra töltődő / statikus kép + link).

**Ajánlatkérő űrlap** – ld. [6.2](#62-ajánlatkérő-űrlap).

---

### 5.8. Adatkezelési tájékoztató (vázlat)

Teljes ÁSZF nem szükséges (nincs online fizetés vagy szerződéskötés), de az
űrlap és a chatbot miatt **adatkezelési tájékoztató kell**. Tartalmi elemek:

- **Adatkezelő:** Támba Csaba e.v., székhely: 4405 Nyíregyháza, Kökény utca 61.,
  adószám: 91028273-1-35, nyilvántartási szám: ⚠︎, e-mail: ⚠︎, telefon: 06 20 542 2171.
- **Kezelt adatok:**
  - *Ajánlatkérő űrlap:* név, telefonszám, e-mail, település, üzenet,
    opcionálisan feltöltött fotó.
  - *Chatbot:* a beírt üzenetek / chat-napló.
  - *Látogatottság:* anonim analitika (ld. lent).
- **Cél:** kapcsolatfelvétel, ajánlatadás, a szolgáltatás egyeztetése.
- **Jogalap:** az érintett hozzájárulása, illetve szerződéskötést megelőző
  lépések megtétele.
- **Megőrzés:** az ügy lezárását követő ész­szerű ideig (pl. 12 hónap), utána törlés. ⚠︎
- **Adatfeldolgozók:** tárhelyszolgáltató, e-mail-küldő szolgáltatás,
  analitikai szolgáltató, chatbot-szolgáltató, spamvédelem (captcha). ⚠︎ (a
  végleges lista a technikai döntések után)
- **Érintetti jogok:** tájékoztatás, helyesbítés, törlés, tiltakozás; panasz a
  NAIH-hoz.
- **Sütik (cookie) tájékoztató:** milyen sütik, milyen célból, hogyan lehet
  letiltani.

---

## 6. Funkciók specifikációja

### 6.1. Referencia-galéria + admin képfeltöltés

**Publikus oldal**

- Rácsos galéria kategóriaszűrővel (Lakossági / Irodai / Ipari / Hőszivattyú /
  Karbantartás), lightbox, lazy-load, `alt` szövegek, opcionális felirat
  (cím / település / dátum).
- Reszponzív: mobil 1–2 oszlop, tablet 2–3, asztali 3–4 oszlop.

**Admin felület (`/admin`, nem publikus)**

- **Bejelentkezés** jelszóval (egy felhasználó elég a kezdéshez).
- **Feltöltés:** fogd-és-vidd, több fájl egyszerre; JPG/PNG/HEIC.
- **Automatikus feldolgozás:** átméretezés (max. ~1600 px hosszabb él),
  `WebP`/`AVIF` konverzió, tömörítés, **EXIF-adatok (GPS!) eltávolítása**.
- **Metaadatok:** kategória, cím, rövid leírás, település, dátum, sorrend.
- **Állapot:** piszkozat / közzétéve; **törlés**; átrendezés.
- **Tárolás:** a CMS médiakönyvtára vagy objektumtár (pl. Cloudinary /
  S3-kompatibilis); CDN-ről kiszolgálva.
- **Jogi:** csak olyan fotó tölthető fel, amelynek közzétételéhez az ügyfél
  hozzájárult; felismerhető személy / rendszám csak hozzájárulással.

*(Későbbi bővítés lehetősége: látogatói fotócsatolás az ajánlatkérő űrlapon –
külön moderálva. A v1-ben nincs nyilvános látogatói feltöltés.)*

### 6.2. Ajánlatkérő űrlap

- **Mezők:** Név\*, Telefonszám\*, E-mail, Település, „Miben segíthetünk?"
  (üzenet)\*, Fotó feltöltése (opcionális, több kép), **adatkezelési
  hozzájárulás checkbox\***.
- **Spamvédelem:** Cloudflare Turnstile vagy hCaptcha (adatvédelmi szempontból
  jobb, mint a Google reCAPTCHA).
- **Küldés után:** e-mail a vállalkozónak (a beküldött adatokkal + a fotók
  linkjeivel) **és** automatikus visszaigazoló e-mail az érdeklődőnek
  („Megkaptuk, hamarosan hívjuk. Sürgős esetben: 06 20 542 2171").
- **Visszajelzés az oldalon:** sikeres küldés / hibaüzenet, a gomb
  letiltása dupla küldés ellen.
- **Válaszidő szöveg:** „Munkaidőben jellemzően még aznap visszahívjuk."
- **Backend:** serverless függvény + tranzakciós e-mail szolgáltató
  (pl. Resend / Postmark); a feltöltött képek ideiglenes tárba, vírusellenőrzés
  után.
- A **telefon** vizuálisan mindig erősebb hívásra ösztönző elem, mint az űrlap.

### 6.3. Chatbot – későbbi bővítés

**Most:** nem épül be, de az oldal **előkészül** rá.

- **Cél:** az ügyféloldali kérdések kb. 80%-ának megválaszolása, terelés
  **telefonhívásra** vagy **ajánlatkérésre**; ár-nagyságrendek; a szolgáltatási
  terület ellenőrzése; márkainformáció.
- **NEM feladata:** időpontfoglalás, kötelező érvényű árajánlat adása.
- **Tudásbázis:** ez a dokumentum – a *Szolgáltatások*, *Árak*, *GYIK* és
  *Cégadatok* részek. A tartalom `schema.org/FAQPage` jelöléssel készül, így a
  bot és a Google is használni tudja.
- **Megjelenés:** lebegő widget jobb alul, márka színekkel; összecsukva
  „Kérdése van? Segítünk"; **ne takarja a mobil ragadós hívásgombot** (a widget
  a hívásgomb fölé, attól elkülönülve kerüljön).
- **Fallback:** minden bizonytalan válasznál „Ezt Csaba tudja pontosan
  megmondani: **06 20 542 2171**".
- **Adatvédelem:** a chat-napló kezelése bekerül az adatkezelési tájékoztatóba;
  sütikezelés / hozzájárulás szükség szerint.
- **Integráció:** a statikus oldalba beilleszthető script; a CMS-ből frissülő
  tartalom táplálja a tudásbázist.
- **Előkészítés a v1-ben:** strukturált (FAQPage) tartalom; hely a widgetnek a
  layoutban; a tartalmi blokkok (GYIK, Árak) géppel is jól olvasható jelölése.

### 6.4. Amit NEM tartalmaz az oldal

- **Időpontfoglaló / naptár rendszer** – kifejezett megrendelői kérés.
- Webshop, online fizetés.
- Blog / tudástár – a kérdőív szerint most nem kérnek. (Később bővíthető, jót
  tenne a helyi SEO-nak.)
- Ügyfélfiók / bejelentkezés a látogatóknak.
- Több nyelv.

---

## 7. Technikai ajánlás

| Terület | Ajánlás | Indoklás |
|---|---|---|
| **Architektúra** | **Statikus oldal + headless CMS** (pl. Astro vagy Next.js statikus build + Sanity / Storyblok) | Gyors, olcsó üzemeltetés, kiváló helyi SEO; a galéria / GYIK / szövegek CMS-ből szerkeszthetők; a chatbot később widgetként beköthető. |
| **Hosting** | Statikus host (Vercel / Netlify / Cloudflare Pages) vagy hazai tárhely; automatikus SSL | Egyszerű deploy, CDN, alacsony költség. |
| **Dinamikus részek** | Serverless függvények: ajánlatkérő űrlap feldolgozása, kép-upload, admin auth | Nem kell külön szervert üzemeltetni. |
| **Médiatár** | CMS média vagy Cloudinary / S3-kompatibilis tár + CDN, automatikus WebP/AVIF | Gyors képbetöltés minden eszközön. |
| **E-mail** | Domain alatti cím (`info@tambaklima.hu`) + tranzakciós szolgáltató (Resend / Postmark) az űrlaphoz | Profi megjelenés, kézbesíthetőség. |
| **Analitika** | **Plausible** vagy **Umami** (süti nélküli, GDPR-barát); Google Search Console | Cookie-banner nélkül is mérhető a forgalom. |
| **Sütik / consent** | Ha marad Google Analytics: consent banner kell. Süti nélküli analitikával elkerülhető. | Kevesebb jogi teher, jobb UX. |
| **Spamvédelem** | Cloudflare Turnstile / hCaptcha | Adatvédelmi szempontból jobb a reCAPTCHA-nál. |
| **Teljesítménycél** | Lighthouse (mobil) **90+**, LCP < 2,5 s, CLS < 0,1; JS minimalizálva | A sebesség rangsorolási tényező és konverziót növel. |
| **Betűk** | Önhosztolt (nem Google Fonts CDN), `preload` + `font-display: swap` | Sebesség + GDPR. |
| **Akadálymentesség** | WCAG 2.1 AA: kontraszt, `alt`, látható fókusz, billentyűzet-navigáció, `prefers-reduced-motion` | Szélesebb elérés, jogi elvárás. |
| **Verziókövetés / deploy** | Git + automatikus build a `main` ágról | Átlátható, visszaállítható. |

### 7.1. SEO

- **Fő kulcsszavak:** klímaszerelés Nyíregyháza, klíma telepítés Nyíregyháza,
  klímatisztítás Nyíregyháza, klíma karbantartás Nyíregyháza, hőszivattyú
  telepítés Nyíregyháza, multi-split telepítés, ipari klíma / VRF Nyíregyháza,
  mobil klíma beüzemelés, klíma javítás Szabolcs-Szatmár-Bereg.
- **Oldalanként:** egyedi `title` + `meta description`, egy `H1`, beszédes URL-ek.
- **Strukturált adat:** `LocalBusiness` (NAP: név, cím, telefon – a Google
  Cégem adataival azonos), `Service`, `FAQPage`.
- **Google Cégem:** profil kitöltése/optimalizálása, egyező adatok, fotók,
  szolgáltatáslista, a weboldal linkelése. ⚠︎ közvetlen profillink bekérendő.
- **Facebook oldal** linkelése a láblécből és a strukturált adatból.
- `sitemap.xml`, `robots.txt`, egyedi 404 oldal.
- **OG / közösségi kép:** tűz–jég arculatú megosztási kép.
- Később: külön aloldal a fő szolgáltatásoknak (most horgony is elég).

---

## 8. Reszponzivitás – eszközönkénti követelmények

**Alapelvek (minden méreten):**

- Fluid tipográfia (`clamp()`), rugalmas rács (CSS Grid / Flexbox), relatív
  egységek.
- **Semmilyen vízszintes görgetés.** Táblázatok, széles elemek saját,
  `overflow-x: auto` konténerben görgethetők.
- A tűz–jég átmenet és a motívumok **SVG/CSS** alapon skálázódnak (nem
  bitmap-ből törnek).
- Képek `srcset`/méretezett változatokkal, `AVIF`/`WebP`, `loading="lazy"`.
- Érintőbarát célpontok: min. **44×44 px**, elég nagy térközök.
- Törésmentes elrendezés 320 px és 1920 px között folyamatosan (ne csak a
  „szabvány" breakpointokon).

**Mobil (kb. 320–560 px):**

- Egy oszlop; hero-szöveg rövidebb változata; a CTA a hüvelykujj-zónában.
- **Ragadós alsó „Hívás" gomb** (teljes szélességű vagy jobb alsó FAB).
- Hamburger menü; a kiemelt telefonszám a menü tetején is.
- Az árlista **kártyákká** törik (nem vízszintesen görgethető táblázat).
- Galéria 1–2 oszlop.
- A chatbot widget **ne takarja** a ragadós hívásgombot.
- Betűméret min. 16 px (input mezőknél is, hogy iOS ne zoomoljon).

**Tablet (kb. 561–1024 px):**

- 2 oszlopos rácsok (szolgáltatások, előnyök, árkártyák).
- Hero: kép és szöveg egymás mellett vagy alatt, kényelmes térközzel.
- Menü lehet látható vagy kompakt; a hívásgomb a fejlécben marad.
- Galéria 2–3 oszlop.

**Asztali (1025 px+):**

- Tartalom max. szélessége ~1200–1280 px, középre zárva.
- 3–4 oszlopos szolgáltatásrács; nagyméretű hero a tűz–jég vizuállal.
- Finom hover-animációk, scroll-reveal, mértékkel adagolt parallax.
- A ferde szekcióelválasztók itt érvényesülnek leginkább – ügyelni, hogy
  kisebb méreteken ne vágjanak le szöveget.

**Tesztelési elvárás:** valós eszközökön / emulátorban ellenőrzés iPhone
(Safari), Android (Chrome), iPad, 13–15" laptop és nagy monitor méreten;
álló és fekvő tájolásban; lassú 3G/4G szimulációval a betöltés.

---

## 9. Cégadatok (összegyűjtve)

| Adat | Érték |
|---|---|
| Márkanév | Támba Klíma |
| Cégforma | Támba Csaba egyéni vállalkozó |
| Székhely / telephely | 4405 Nyíregyháza, Kökény utca 61. |
| Adószám | 91028273-1-35 |
| Egyéni váll. nyilvántartási szám | ⚠︎ hiányzik (impresszumhoz kell) |
| Alapítás éve | 2025 |
| Csapat | 2–3 szerelő |
| Nyitvatartás | minden nap 6:00–20:00 |
| Telefon | 06 20 542 2171 |
| E-mail | tambaklima25@gmail.com ⚠︎ (javasolt: info@tambaklima.hu) |
| Domain | tambaklima.hu |
| Szolgáltatási terület | Nyíregyháza és kb. 50 km-es körzete |
| Facebook | van ⚠︎ (pontos URL bekérendő) |
| Instagram | ⚠︎ van-e? |
| Google Cégem | van ⚠︎ (közvetlen profillink bekérendő; jelenleg csak keresési link) |
| Felelősségbiztosítás | igen |
| Képesítés | hűtő- és klímaberendezés-szerelő / hűtő- és szellőzésrendszer-szerelő; ipari hűtéstechnika, klíma, hőszivattyú, valamint víz-, gáz- és fűtésszerelés |
| Gyártói partnerség | nincs; elsősorban Midea, de bármilyen márkát beszerez |
| Forgalmazott márkák | Midea, MDV, Gree, TCL, Polar, Vivax |
| Logó / arculat | nincs kész logó – a weboldal készítője állítja elő a wordmarkot a tűz–jég kép alapján |
| Fotók | rendelkezésre állnak; min. 30 referenciafotó ígérve |

---

## 10. Nyitott kérdések – telefonon egyeztetendő

1. **Egyéni vállalkozói nyilvántartási szám** (impresszumhoz kötelező).
2. **Facebook oldal pontos URL-je**; van-e **Instagram**.
3. **Google Cégem** közvetlen profillink (a mostani csak keresési találat).
4. **E-mail:** marad a Gmail, vagy legyen `info@tambaklima.hu`?
5. **Megszólítás:** magázódás vagy tegeződés az egész oldalon? (a dokumentum
   most magázódik)
6. **Kazettás / mennyezeti / padlón álló klíma felára** – nincs megadva.
7. **Részletfizetés:** tényleg nincs? (a kérdőívben csak készpénz + utalás
   szerepel)
8. **Pontos szolgáltatási településlista**, és mit jelent a „30 perc utazási
   idő" (mely települések esnek bele az ingyenes felmérésbe).
9. **Sürgősségi / hétvégi kiszállás** díja és feltételei.
10. **Pályázati segítségnyújtás** megjelenítése – legyen-e egyáltalán a
    szolgáltatások közt, vagy csak a GYIK-ben említve?
11. **Facebook vélemények** kiválasztása + engedély a honlapon való
    megjelenítésre.
12. **Adatmegőrzési idő** az űrlapos megkereséseknél (pl. 12 hónap).
13. **ÁSZF:** megerősítés, hogy elég az adatkezelési tájékoztató (nincs online
    szerződéskötés/fizetés).
14. **Domain és tárhely** hozzáférés / jelenlegi szolgáltató.

---

## 11. Átadandó anyagok a megrendelőtől

- [ ] **Min. 30 jó minőségű referenciafotó** (kategóriánként, ha lehet) + az
      ügyfelek hozzájárulása a közzétételhez.
- [ ] **Csapatfotó(k).**
- [ ] **A fóliázott autó fotója** (lehetőleg több nézetből).
- [ ] **Facebook / Google vélemények** szövege + engedély.
- [ ] **Pontos szolgáltatási településlista.**
- [ ] **Facebook (és Instagram) oldal linkje**, Google Cégem profillink.
- [ ] **Cégadatok hiányzó mezői** (nyilvántartási szám stb.).
- [ ] Ha van: bármilyen meglévő arculati elem, betűtípus-preferencia, korábbi
      nyomdai anyag.

---

## 12. Verzió 1 – tartalmi checklista

- [ ] Wordmark / logó elkészítése a tűz–jég kép alapján (SVG, PNG, favicon, OG).
- [ ] Dizájnrendszer (színek, tipográfia, komponensek) implementálása.
- [ ] Főoldal az [5.1](#51-főoldal) szerinti szekciókkal.
- [ ] Szolgáltatások tartalom ([5.2](#52-szolgáltatások)).
- [ ] Árak oldal / szekció ([5.3](#53-árak)).
- [ ] Referencia-galéria + admin képfeltöltés ([6.1](#61-referencia-galéria--admin-képfeltöltés)).
- [ ] Bővebb GYIK `FAQPage` jelöléssel ([5.6](#56-gyik--gyakran-ismételt-kérdések)).
- [ ] Rólunk oldal ([5.5](#55-rólunk)).
- [ ] Kapcsolat oldal + ajánlatkérő űrlap ([5.7](#57-kapcsolat), [6.2](#62-ajánlatkérő-űrlap)).
- [ ] Adatkezelési tájékoztató + Impresszum + cookie-tájékoztató ([5.8](#58-adatkezelési-tájékoztató-vázlat)).
- [ ] Süti nélküli analitika + Search Console + sitemap/robots.
- [ ] Helyi SEO: `LocalBusiness` strukturált adat, Google Cégem összehangolása.
- [ ] Reszponzív ellenőrzés valós eszközökön ([8](#8-reszponzivitás--eszközönkénti-követelmények)).
- [ ] Teljesítmény- és akadálymentességi ellenőrzés (Lighthouse 90+).
- [ ] Chatbot-hely előkészítése a layoutban (bekötés később).

## 13. Későbbi bővítések

- Chatbot élesítése a jelen dokumentum tudásbázisával.
- Külön aloldalak a fő szolgáltatásoknak (SEO).
- Blog / tudástár (energiahatékonyság, okos vezérlés, levegőminőség) – ha
  a megrendelő később mégis szeretné.
- Látogatói fotócsatolás az ajánlatkéréshez (moderálva).
- Google-értékelések beágyazott megjelenítése.
- Egyszerű árkalkulátor, ha a tapasztalat indokolja.

---

*Készült a kitöltött adatgyűjtő kérdőív és a meglévő tűz–jég arculati kép
alapján. A `⚠︎` jelölt pontok a megrendelővel telefonon tisztázandók.*
