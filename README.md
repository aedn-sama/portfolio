# Dev Inventory

Ein deutsches Backend-Portfolio als interaktive Minecraft-Bibliothek. Fünf Bücher öffnen Einstieg, Über mich, Tech Stack, Stärken & Schwächen und Kontakt. Statisches HTML, CSS und JavaScript; kein Backend und keine Laufzeitabhängigkeiten.

## Lokal starten

Node.js 22 oder neuer:

```sh
npm run dev
```

Die Seite läuft unter http://127.0.0.1:4173. Zum lokalen Start und zum Build ist keine Paketinstallation nötig.

```sh
npm run build
```

Der Build schreibt ausschließlich die öffentlichen Website-Dateien nach `dist/`. Alle Asset-Pfade sind relativ und funktionieren auch unter `/portfolio/` auf GitHub Pages. Schrift und Hintergrundbild werden lokal ausgeliefert; keine externen Schriftanbieter, Tracker oder Cookies.

## Inhalte anpassen

- `index.html`: deutsche Texte und fünf Rubriken.
- `profile.js`: öffentlicher Anzeigename, E-Mail-Adresse, LinkedIn/XING und GitHub. Leere Kontaktfelder erzeugen sichtbare Hinweise statt ungültiger Links. Vor einer vollständigen Veröffentlichung E-Mail und berufliches Profil ergänzen.
- `styles.css`: Farben, Pixel-Optik und responsive Layouts.
- `assets/bookshelf.png`: generierte Bücherregal-Szene; Entstehung und Prompt siehe `assets/IMAGE-PROMPT.md`.

Die GitHub-Verknüpfung ist auf `aedn-sama` gesetzt. Es werden keine beruflichen Projekte oder Nachweise erfunden.

## Bedienung

Bücher im Regal oder in der Inventarleiste anklicken. Tasten **1–5** wählen ein Kapitel. Innerhalb der Inventarleiste navigieren **← / →**, **Home** und **End**. Direkte Links wie `#tech-stack` und die Browser-Zurück-Funktion werden unterstützt. Sound ist standardmäßig ausgeschaltet und lässt sich oben aktivieren. Ohne JavaScript sind alle Kapitel sichtbar.

## GitHub Pages

Das Zielrepository ist https://github.com/aedn-sama/portfolio.

1. In **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** wählen.
2. Auf `main` pushen oder den Workflow **Deploy portfolio to GitHub Pages** manuell auslösen.
3. Nach erfolgreichem Deployment liegt die Seite voraussichtlich unter https://aedn-sama.github.io/portfolio/.

Der enthaltene Workflow baut die statische Seite und veröffentlicht ausschließlich `dist/`. Der Live-Status muss im Repository geprüft werden; die vorbereitete Konfiguration allein bestätigt noch kein Deployment.

Offizielle Dokumentation: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Prüfen

```sh
npm ci
npx playwright install chromium
npm test
```

Die Browser-Tests prüfen Rubrikenwechsel, direkte Links, Verlauf, Tastatur, optionale Soundsteuerung, vier Viewport-Größen und die Darstellung ohne JavaScript. Screenshots liegen nach dem Test in `test-results/` und werden nicht eingecheckt.

Die Schrift VT323 wird unter der SIL Open Font License verwendet, siehe `assets/fonts/OFL.txt`. Inoffizielles Minecraft-Fanprojekt; keine Verbindung zu Mojang oder Microsoft.
