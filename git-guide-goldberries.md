# Git Guide – The Goldberries
*Für alle die noch nie oder kaum mit Git gearbeitet haben.*

---

## Was ist Git überhaupt?

Git ist ein System das aufzeichnet wer wann welche Änderung an welcher Datei gemacht hat. GitHub ist die Website wo euer Repo (= euer Projektordner) online gespeichert ist.

Stellt euch das Repo wie ein gemeinsames Google Doc vor – nur dass niemand gleichzeitig tippt, sondern jeder seinen Teil fertigschreibt und dann hochlädt.

---

## Die wichtigsten Begriffe

**Repository (Repo):** Euer gesamter Projektordner – lokal auf eurem Computer und online auf GitHub.

**Commit:** Ein Schnappschuss eurer Änderungen mit einer kurzen Beschreibung. "Ich habe Screen 1 fertiggestellt" ist ein Commit. Git merkt sich jeden Commit – ihr könnt jederzeit zurückspringen.

**Branch:** Eine eigene Arbeitskopie des Repos. Ihr arbeitet auf eurem Branch ohne den anderen in die Quere zu kommen. Erst wenn ihr fertig seid, wird euer Branch mit `main` zusammengeführt.

**Main:** Der Hauptbranch – die "offizielle" Version eures Projekts. Direkt auf main arbeiten ist schlechte Praxis in Gruppenarbeit.

**Push:** Eure lokalen Commits auf GitHub hochladen.

**Pull:** Die neuesten Änderungen von GitHub auf euren lokalen Computer herunterladen.

**Merge:** Zwei Branches zusammenführen – meistens euren Feature-Branch in main.

**Pull Request (PR):** Eine Anfrage auf GitHub: "Ich möchte meinen Branch in main mergen." Andere können den Code reviewen und approven bevor er in main landet.

---

## Setup: Repo klonen (einmalig)

Bevor ihr arbeiten könnt, müsst ihr das Repo auf euren Computer kopieren.

**In VSCode:**
1. `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) → "Git: Clone" eingeben
2. URL einfügen: `https://github.com/Goldberries1180/The-Fellowship-of-the-Code-2026`
3. Ordner wählen wo das Repo gespeichert werden soll
4. "Open" klicken

**In WebStorm:**
1. Startscreen → "Get from VCS"
2. URL einfügen, Ordner wählen, "Clone"

**In der Kommandozeile (Terminal):**
```bash
git clone https://github.com/Goldberries1180/The-Fellowship-of-the-Code-2026
cd The-Fellowship-of-the-Code-2026
```

---

## Täglicher Workflow

### Schritt 1: Immer zuerst pullen
Bevor ihr anfangt zu arbeiten, holt ihr die neuesten Änderungen von GitHub:

**VSCode:** Unten links auf den Branch-Namen klicken → "Pull"
**WebStorm:** `Git` Menü → "Pull"
**Terminal:**
```bash
git pull
```

⚠️ Diesen Schritt nicht überspringen – sonst arbeitet ihr auf einer veralteten Version.

---

### Schritt 2: Einen neuen Branch erstellen

Für jeden Screen / jede Aufgabe erstellt ihr einen eigenen Branch.

**VSCode:**
1. Unten links auf den Branch-Namen klicken (steht "main")
2. "Create new branch" → Namen eingeben, z.B. `screen1-jana`
3. Enter

**WebStorm:**
1. Unten rechts auf Branch-Namen klicken
2. "New Branch" → Namen eingeben

**Terminal:**
```bash
git checkout -b screen1-jana
```

**Namenskonvention für euer Repo:**
- `screen1-[name]` für einen Screen
- `fix-css-[name]` für einen CSS-Fix
- `artifact3-md` für das Markdown-Dokument

---

### Schritt 3: Arbeiten und Committen

Ihr arbeitet normal in euren Dateien. Wenn ihr einen sinnvollen Stand erreicht habt – nicht erst ganz am Ende – macht ihr einen Commit.

**Was ist ein guter Zeitpunkt für einen Commit?**
- Screen-Struktur fertig (auch ohne Styling)
- CSS für eine Section fertig
- Bugfix abgeschlossen
- Vor dem Feierabend

**Committen in VSCode:**
1. Links auf das Source Control Icon (Verzweigungs-Symbol, dritte Icon in der Sidebar)
2. Geänderte Dateien erscheinen unter "Changes"
3. Dateien die ihr committen wollt mit `+` stagen
4. Commit-Message eintippen (z.B. "Add screen1 HTML structure")
5. Häkchen oben klicken (Commit)

**Committen in WebStorm:**
1. `Cmd+K` (Mac) / `Ctrl+K` (Windows)
2. Dateien auswählen
3. Message eintippen → Commit

**Terminal:**
```bash
git add .                          # alle geänderten Dateien stagen
git commit -m "Add screen1 HTML structure"
```

**Gute Commit-Messages:**
- ✅ "Add criticality toggle to screen1"
- ✅ "Fix checkbox label alignment"
- ✅ "Add shared nav styles to style.css"
- ❌ "changes"
- ❌ "asdf"
- ❌ "ich weiß nicht mehr"

---

### Schritt 4: Pushen

Eure Commits sind jetzt lokal gespeichert – noch nicht auf GitHub. Pushen lädt sie hoch.

**VSCode:** Source Control → "Publish Branch" (beim ersten Push) oder "Push" (danach)
**WebStorm:** `Cmd+Shift+K` / `Ctrl+Shift+K`
**Terminal:**
```bash
git push
# Beim ersten Push eines neuen Branches:
git push -u origin screen1-jana
```

---

### Schritt 5: Pull Request erstellen

Wenn euer Screen fertig ist und ihr ihn in main mergen wollt:

1. Auf GitHub öffnen: `github.com/Goldberries1180/The-Fellowship-of-the-Code-2026`
2. GitHub zeigt oben einen Banner: "screen1-jana had recent pushes" → "Compare & pull request"
3. Titel eingeben: z.B. "Add Screen 1 – New Route Decision"
4. Kurze Beschreibung was ihr gemacht habt
5. "Create pull request"

---

### Schritt 6: PR reviewen und approven

Eine andere Person aus dem Team schaut den PR an:

1. Auf GitHub → "Pull requests" Tab
2. Den PR öffnen
3. "Files changed" anschauen – grün = hinzugefügt, rot = gelöscht
4. "Review changes" → "Approve" wenn alles passt
5. Nach Approval: "Merge pull request" → "Confirm merge"

**Wichtig:** Nie den eigenen PR selbst mergen ohne dass jemand drübergeschaut hat – außer es ist dringend.

---

## Das gemeinsame CSS – wie geht das?

Das ist der heikelste Teil bei Gruppenarbeit. Alle vier Screens verwenden `style.css` – wenn zwei Personen gleichzeitig daran arbeiten gibt es Konflikte.

**Empfohlene Lösung für euch:**

Eine Person ist für `style.css` zuständig und führt alle CSS-Änderungen zusammen. Die anderen schreiben ihr screen-spezifisches CSS zunächst direkt in die HTML-Datei mit `<style>` Tags, und die CSS-Person überträgt es dann in die gemeinsame Datei.

Oder: Ihr teilt `style.css` in Sections auf und jede Person schreibt nur in ihre Section:

```css
/* ===================== */
/* GLOBAL / Jana         */
/* ===================== */

/* ===================== */
/* SCREEN 1 / Person A   */
/* ===================== */

/* ===================== */
/* SCREEN 2 / Person B   */
/* ===================== */
```

---

## Was tun bei einem Merge-Konflikt?

Ein Konflikt entsteht wenn zwei Personen dieselbe Zeile in derselben Datei geändert haben.

Git markiert das so in der Datei:
```
<<<<<<< HEAD
    background-color: white;
=======
    background-color: #f5f5f5;
>>>>>>> screen2-anna
```

**Was zu tun ist:**
1. Nicht in Panik verfallen
2. Die Datei öffnen – VSCode zeigt Konflikte farblich an
3. Entscheiden welche Version richtig ist (oder beide kombinieren)
4. Die `<<<<`, `====`, `>>>>` Zeilen löschen
5. Committen

Am besten löst ihr Konflikte gemeinsam – nicht alleine wenn ihr unsicher seid.

---

## Kurz-Referenz

| Was | Terminal | VSCode |
|-----|----------|--------|
| Neuestes holen | `git pull` | Pull Button |
| Branch erstellen | `git checkout -b name` | Branch-Menü unten links |
| Änderungen stagen | `git add .` | `+` bei Dateien |
| Committen | `git commit -m "message"` | Häkchen in Source Control |
| Pushen | `git push` | Push Button |
| Branch wechseln | `git checkout main` | Branch-Menü unten links |

---

*Wenn etwas nicht funktioniert: nicht einfach irgendwas ausprobieren – fragt zuerst. Die meisten Git-Fehler lassen sich leicht beheben solange man nicht in Panik weitere Befehle ausführt.*
