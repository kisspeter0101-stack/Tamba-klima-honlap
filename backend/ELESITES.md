# Ajánlatkérő űrlap élesítése (Google Táblázat + Apps Script + Vercel)

Az űrlap (`ajanlatkeres.html`) a `/api/ajanlat` Vercel-függvényen át küld a Google Apps Scriptnek.
Az Apps Script a táblázatba új sort ír, a fotókat a Drive-ra menti, e-mailt küld Csabának
(kattintható telefonszámmal), és Naptár-eseményt vesz fel a visszahívásra.
A vevő **semmilyen árat nem lát**. A **javasolt árat** (alsó–felső határ és tételes bontás) a szkript számolja ki a
**Szabályok**, **Települések** és **Készülékek** munkalapok értékeiből, és csak Csaba látja: a táblázatban és az értesítő e-mailben.

## Menetrend

1. **Teszt a saját Google-fiókodban** (1–2. szakasz), a Vercel **Preview** környezetével.
2. **Átadás Csabinak másolattal** (3. szakasz): ő a saját fiókjában másolatot készít, engedélyezi, üzembe helyezi.
3. **Élesítés** (4. szakasz): a Vercel **Production** környezetébe az ő URL-je és titka kerül, az ág bekerül a `main`-be.

Az ajánlatkérő a `main` ágon van, élesben fut. Új fejlesztést érdemes külön ágon készíteni, és a Vercel Preview-n kipróbálni.

## 1. A te tesztpéldányod (saját Google-fiók)

1. Új Google Táblázat: **sheets.new**, név: *Támba Klíma – ajánlatkérések (teszt)*.
2. **Bővítmények → Apps Script**. Töröld a kódot, másold be a `backend/Code.gs` teljes tartalmát, **Mentés**.
3. A projekt időzónája: Apps Script → **Projektbeállítások** (fogaskerék) → *Időzóna* → **Europe/Budapest**.
4. Függvénylista → **`beallitas`** → **Futtatás**. Engedélyek: *Engedélyek áttekintése* → a fiókod → *Speciális* →
   *Tovább a projekthez* → *Engedélyezés* (Táblázatok, Drive, Gmail, Naptár).
   A **Végrehajtási napló**ban megjelenik a **titok**. Másold ki.
5. **`proba`** → **Futtatás**: új sor az **Ajánlatkérések** munkalapon, e-mail az értesítési címre, Naptár-esemény
   („Visszahívás: Teszt Elek …”). Ez egy kitalált ajánlatkérés. A sort, az eseményt és a Drive-mappa fájlját később töröld.
6. **Üzembe helyezés → Új üzembe helyezés → Webalkalmazás**: *Futtatás mint: Én*, *Hozzáférés: Bárki*. Másold ki az URL-t.
7. **Vercel → Settings → Environment Variables**: `APPS_SCRIPT_URL` és `APPS_SCRIPT_SECRET`, **csak a Preview** környezetre.
8. Pushold az ágat: `git push -u origin ajanlatkero`. A Vercel külön tesztcímet épít (Deployments → az ág → Visit).
   Előfordulhat, hogy a Preview-hoz Vercel-bejelentkezés kell, ez normális.
9. A tesztcímen az `ajanlatkeres.html` oldalon tölts ki egy próbát fotóval. Ellenőrizd: sor, fotólink, e-mail, Naptár.

## 2. Mit érdemes tesztelni

- Különböző útvonalak: telepítés társasházba és családi házba, karbantartás, csere ugyanoda, csere máshová, áthelyezés.
- Fotó nélkül és fotóval. Telefonról is.
- Hiba esetén: Vercel → Logs (`ajanlat:` sorok), Apps Script → **Végrehajtások**.

## 3. Átadás Csabinak (másolattal)

A script a **saját fiókjában** fusson, ezért nem a hozzáférést adod át, hanem ő készít másolatot:

1. Oszd meg a tesztpéldányt Csabával (Megosztás → az e-mail-címe → *Megtekintő*), vagy másold a táblázat linkjét.
2. Csabi a saját fiókjában megnyitja, majd **Fájl → Másolat készítése**. (A hozzá kötött script is átmásolódik.)
   Név: *Támba Klíma – ajánlatkérések*. A másolat a teste, az övé.
3. A másolatban: **Bővítmények → Apps Script**, a projekt időzónája legyen *Europe/Budapest*.
4. **`beallitas`** → **Futtatás** (engedélyezés a saját fiókjával). Ez létrehozza az ő titkát, az ő Drive-mappáját,
   és az értesítési cím az ő e-mail-címe lesz. A naplóból másold ki az új titkot.
5. **`proba`** → **Futtatás**: nála jelenjen meg a sor, az e-mail és a Naptár-esemény. Töröld a próbasort.
6. **Üzembe helyezés → Új üzembe helyezés → Webalkalmazás**: *Futtatás mint: Én*, *Hozzáférés: Bárki*. URL kimásolása.
7. Megosztás: a táblázatot és a Drive-mappát oszd meg a saját fiókoddal **Szerkesztőként**.

Ha ezt Csabi kényelmesebben egy képernyőmegosztás mellett csinálja, a jelszavát akkor sem kell elkérned.

## 4. Élesítés

1. **Vercel → Settings → Environment Variables**: az `APPS_SCRIPT_URL` és `APPS_SCRIPT_SECRET` **Production** értéke az ő
   másolatának URL-je és titka.
2. Fésüld össze az ágat: `git checkout main`, `git merge ajanlatkero`, `git push`. (A Production üzembe helyezés a
   változók után indul, így rögtön használja őket.)
3. Élő teszt a `https://tambaklima.hu/ajanlatkeres.html` oldalon. Töröld a próbasorokat, -fotókat és -eseményeket.

## 5. Később

- **Javasolt ár – finomítás:** a **Szabályok**, **Települések** és **Készülékek** munkalap sárga celláit Csabával kell kitölteni
  (a régi készülék elszállítása, a távolabbi települések kiszállási díja). Az akciós készülékek ára a **Készülékek**
  munkalapon van: ha az Akciók oldalon új akció kerül fel, ide is fel kell venni (a kulcs a plakát fájlneve kiterjesztés nélkül).
- A **Státusz** oszlop: Új → Visszahívva → Felmérés egyeztetve → Ajánlat kiküldve → Elfogadva / Elvetve.
- Az Adatkezelési tájékoztató **megőrzési ideje** (4. pont, jelenleg „[pl. 12] hónap”).
- AppSheet-próba (telefonos lista), Looker Studio irányítópult, Gemini-vázlat és PDF-ajánlat.
- A `Code.gs` módosítása után: **Üzembe helyezés → Üzembe helyezések kezelése → ✎ → Új verzió**, különben az élő URL
  a régi kódot futtatja.

## Beállítások a Script tulajdonságokban (Apps Script → Projektbeállítások → Script-tulajdonságok)

| Név | Jelentés |
|---|---|
| `SECRET` | közös titok a Vercel `APPS_SCRIPT_SECRET` változójával |
| `NOTIFY_EMAIL` | ide megy az értesítő e-mail (alapértelmezés: a fiók tulajdonosa) |
| `FOLDER_ID` | a fotók Drive-mappája |
| `NAPTAR` | `igen` (alapérték) vagy `nem`: ne hozzon létre naptáreseményt |
| `SZAMLALO` | az ajánlatkérés-azonosító számlálója |

## Hibakeresés

- **Az űrlap „nem sikerült elküldeni” hibát ad:** Vercel → Logs. „hiányzó környezeti változó” → hiányzik az
  `APPS_SCRIPT_URL` / `APPS_SCRIPT_SECRET` az adott környezetben, vagy nem volt új üzembe helyezés. „… hitelesites” →
  a két helyen a titok nem egyezik.
- **Nincs e-mail vagy Naptár-esemény, de van sor:** Apps Script → **Végrehajtások**. Az értesítés hibája nem akasztja meg
  a mentést, de a naplóban megjelenik („e-mail hiba”, „naptár hiba”). Gyakori ok: a `beallitas` engedélyezésekor a Naptár
  nem lett engedélyezve. Futtasd újra, és engedélyezz mindent.
- **A fotó nem jön át:** az iPhone HEIC képeit egyes böngészők nem tudják átméretezni. A többi adat ilyenkor is megérkezik.
