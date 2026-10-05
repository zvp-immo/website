# Website ZVP Immobilien

Statische Website der ZVP Immobilien eGbR – Ankauf, Entwicklung und Bestand von Mehrfamilienhäusern in Brandenburg.

- **Hosting:** GitHub Pages (Branch `main`, Ordner `/`), ausgeliefert über Cloudflare
- **Kontaktformular:** sendet an `/api/kontakt` – das übernimmt ein Cloudflare Worker, der die Nachricht über Brevo (EU) per E-Mail zustellt. Der Worker ist nicht Teil dieses Repositorys.
- **Schriften:** Manrope und Newsreader, lokal eingebunden (`assets/fonts`, SIL Open Font License) – keine Verbindung zu Google Fonts
- **Keine** Cookies, Tracking- oder Analyse-Werkzeuge

## Aufbau

| Datei / Ordner | Inhalt |
| --- | --- |
| `index.html` | Startseite (Über uns, Ankaufsprofil, Bestand, Team, Kontakt) |
| `impressum.html`, `datenschutz.html` | Rechtliche Seiten |
| `danke.html` | Bestätigung nach dem Absenden (falls JavaScript deaktiviert ist) |
| `404.html` | Fehlerseite |
| `assets/css`, `assets/js` | Gestaltung und Skript (Navigation, Formular) |
| `assets/img`, `assets/docs` | Bilder und Ankaufsprofil (PDF) |

Texte werden direkt in den HTML-Dateien gepflegt. Bilder lassen sich ersetzen, indem man eine Datei mit gleichem Namen hochlädt.
