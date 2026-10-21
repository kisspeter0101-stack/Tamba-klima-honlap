# Ajánlatkérő űrlap élesítése (Google Táblázat + Apps Script + Vercel)

Az űrlap (`ajanlatkeres.html`) a `/api/ajanlat` Vercel-függvényen át küld a Google Apps Scriptnek,
az pedig a Csaba Google-fiókjában lévő táblázatba ír, a fotókat a Drive-ra menti, és e-mailt küld Csabának.
A vevő **semmilyen árat nem lát**: az ár csak a táblázatban, Csaba számára jelenik meg (javasolt ár).

> **Jelszót ne kérj Csabától.** A beállításhoz két lépésnek kell Csaba bejelentkezett fiókjában történnie
> (a szkript engedélyezése és az üzembe helyezés). Ezt Csabi maga teszi meg, te telefonon vagy képernyőmegosztáson
> végigvezeted, 10–15 perc. Így a Google-fiókja (levelezés, Drive, Google Cégprofil) nem kerül hozzád.

## 1. A táblázat (Csaba fiókjában)
1. Csaba belép a Google-fiókjába, és új Google Táblázatot hoz létre. Név: **Támba Klíma – ajánlatkérések**.
2. **Megosztás** → add hozzá a saját Google-fiókodat **Szerkesztőként** (így később te is tudod karbantartani).

## 2. Az Apps Script
1. A táblázatban: **Bővítmények → Apps Script**.
2. Töröld a meglévő kódot, és másold be a `backend/Code.gs` teljes tartalmát. **Mentés** (🖫).
3. A felső függvénylistából válaszd a **`beallitas`** függvényt, majd **Futtatás**.
   - Engedélyt kér (Táblázatok, Drive, Gmail, külső kérés). Csaba kattintson: *Engedélyek áttekintése* → a saját fiókja →
     *Speciális* → *Tovább a projekthez (nem biztonságos)* → *Engedélyezés*. (A figyelmeztetés azért jelenik meg, mert
     a szkriptet nem a Google ellenőrizte. A szkript a sajátja.)
   - A futás után a **Végrehajtási napló**ban megjelenik a **titok** (hosszú karaktersor). **Másold ki**, a Vercelhez kell.
4. Válaszd a **`proba`** függvényt, majd **Futtatás**: az **Ajánlatkérések** munkalapon új sor jelenik meg, és Csaba
   e-mailben értesítést kap. (Ez egy kitalált Teszt Elek ajánlatkérés. A sort később töröld.)
5. **Üzembe helyezés → Új üzembe helyezés** → fogaskerék → **Webalkalmazás**:
   - Leírás: `ajánlatkérés v1`
   - **Futtatás mint: Én (Csaba e-mail-címe)**
   - **Hozzáférés: Bárki**
   - **Üzembe helyezés** → másold ki a **Webalkalmazás URL**-t (`https://script.google.com/macros/s/…/exec`).

## 3. Vercel
Vercel → a projekt → **Settings → Environment Variables**, két új változó (Production, Preview, Development):

| Név | Érték |
|---|---|
| `APPS_SCRIPT_URL` | az Apps Script webalkalmazás URL-je |
| `APPS_SCRIPT_SECRET` | a `beallitas` naplójában kapott titok |

Utána **Deployments → (legutóbbi) → ⋯ → Redeploy**, hogy a változók érvénybe lépjenek.

## 4. Kipróbálás
1. Nyisd meg a `https://tambaklima.hu/ajanlatkeres.html` oldalt, tölts ki egy próbát (adj meg egy fotót is).
2. Ellenőrizd: új sor a táblázatban, a fotó linkje a sorban, Csaba megkapta az e-mailt.
3. Töröld a próbasorokat (a `proba` és a saját próbád) és a Drive-ból a próbafotókat.
4. A Drive-mappa (**Támba Klíma – ajánlatkérések fotói**) megosztható veled megtekintőként, hogy te is lásd a fotókat.

## 5. Utána
- A **Javasolt ár (Ft)** oszlopba kerülnek a képletek. Terv: külön **Szabályok** munkalap a díjakkal (alapár kW szerint,
  csővezeték Ft/m, falátfúrás, kiszállás településenként, porlasztó stb.), a sorok képlettel számolnak innen.
  Csaba a **Státusz** oszlopban követi: Új → Visszahívva → Felmérés egyeztetve → Ajánlat kiküldve → Elfogadva / Elvetve.
- A Kapcsolat oldalról a régi kapcsolati űrlapot a sikeres éles teszt után le lehet venni, csak egy hivatkozás marad az
  Ajánlatkérés oldalra (az Adatkezelési tájékoztató 2.1. pontját és a FormSubmit feldolgozót ekkor ki kell venni).
- Az Adatkezelési tájékoztató **megőrzési idejét** (4. pont, jelenleg „[pl. 12] hónap”) véglegesíteni kell.
- Ha módosítod a `Code.gs`-t: az Apps Scriptben **Üzembe helyezés → Üzembe helyezések kezelése → ✎ → Új verzió**,
  különben az élő URL a régi kódot futtatja.

## Hibakeresés
- **Az űrlap „nem sikerült elküldeni” hibát ad:** Vercel → a projekt → **Logs**: `ajanlat:` kezdetű sorok.
  „hiányzó környezeti változó” → hiányzik az `APPS_SCRIPT_URL` / `APPS_SCRIPT_SECRET`, vagy nem volt redeploy.
  „az Apps Script hibát adott … hitelesites” → a két helyen a titok nem egyezik.
- **Nincs e-mail:** Apps Script → **Végrehajtások** menü; Gmail napi küldési korlát (kb. 100 üzenet) még messze van.
- **A fotó nem jön át:** az iPhone HEIC képeit egyes böngészők nem tudják átméretezni; a többi adat ilyenkor is megérkezik.
