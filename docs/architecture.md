# Servermanagementpanel Website – Technische Dokumentation

_Last updated: 2025-06-16_

## 1. Projektzweck
Die Website fungiert als mehrsprachige Landing- & Informationsseite für das Hosting-Produkt **Servermanagementpanel**. Sämtliche Texte, URLs, Bilder–Pfad-Platzhalter usw. werden erst _zur Build-Zeit_ via Ansible ersetzt. Dadurch kann jede Sprache oder jedes Branding aus demselben Quell-HTML erzeugt werden.

---
## 2. Repository-Aufbau
```
├── ansible/
│   ├── playbooks/
│   │   ├── replace.yml        # Variablen-Substitution + Header/Footer
│   │   ├── deploy.yaml        # Deployment auf Staging/Prod-Hosts (nginx reload)
│   │   └── vars/*.yml         # Sprachdateien (Dict: replacements)
│   ├── templates/             # z. B. nginx-vHost-Templates
│   └── inventory-*.ini        # Host-Listen für Jenkins-Runs
├── header.html / footer.html  # Statische Layout-Fragmente
├── index.html, GTC/, …        # Quell-HTML mit Platzhaltern
├── Rendered/*                 # **Nur** CI-Output, _niemals_ manuell ändern
└── docs/architecture.md       # Diese Datei
```

---
## 3. Platzhalter-System
* **Konvention:** Alle Schlüssel beginnen mit `VARIABLE-…`.  
* Im HTML werden sie in Großschreibung notiert, z. B. `VARIABLE-WEBSITEURL`.  
* In `ansible/playbooks/vars/<lang>.yml` liegt ein Dictionary `replacements:` mit den Zielwerten pro Sprache.
* Header/Footer werden per Platzhalter `HEADERHEADERHEADER` bzw. `FOOTERFOOTERFOOTER` in die Seiten injiziert.

Vorteile:
1. 100 % Übersetzbarkeit ohne Duplikate.
2. Content-Redakteure brauchen keinen HTML-Zugriff – Änderung via YAML genügt.
3. Einfaches White-Label-Branding durch alternativen Variablen-Satz.

---
## 4. Haupt-Playbook `replace.yml`
1. **Reset** auf den Branch `origin/Variables` → sauberer Quellzustand.
2. **Find + Slurp** aller `.html`-Dateien.
3. **Replace-Task**: Schleife über jede Datei × jedes Key-Value-Paar aus `replacements`.
4. **Header/Footer** per `slurp` laden und mittels `lineinfile` in einer vordefinierten Seiten-Liste austauschen.
5. **(Optional)** Git-Stash → Checkout `Rendered/<Language>` → Commit → Push → zurück.

Alle Git-Schritte sind auskommentiert, weil Jenkins sie explizit ausführt (siehe § 6).

---
## 5. Zusätzliche Playbooks
| Datei            | Zweck |
|------------------|-------|
| `deploy.yaml`    | Git-Pull & nginx-reload direkt auf Webserver (Staging/Prod). |
| `secret_key.yml` | Beispieltemplate zum Verteilen geheimer Schlüssel (derzeit nicht aktiv). |

---
## 6. CI/CD-Pipeline
1. **Entwickler-Push** auf den Branch `Variables` (GitHub oder self-hosted GitLab).  
2. **GitLab-Webhook** startet einen Jenkins-Job _pro Sprache_.  
3. Jenkins Job-Schritte (Beispiel `Build-Website-English`):
   ```bash
   cd ansible
   ansible-playbook playbooks/replace.yml -e "@playbooks/vars/en.yml"
   cd ..
   git fetch --all
   git stash
   git checkout Rendered/English
   git checkout stash -- .
   git add -- . ':!ansible'
   git commit -m "Aktualisierte gerenderte Dateien"
   git push origin Rendered/English
   git checkout Variables
   git reset --hard origin/Variables
   ```
4. _Optional_: Anschließender `deploy.yaml`-Run gegen Produktiv-Hosts.

---
## 7. Entwickler-Workflow
1. **Änderungen** (HTML, YAML, Header/Footer) **immer** im Branch `Variables` vornehmen.  
2. Prüfen, dass neue Platzhalter in **allen** Sprach-YAMLs existieren.  
3. Push → Jenkins rendert & deployed.

### 7.1 Neue Sprache hinzufügen
1. YAML kopieren: `cp ansible/playbooks/vars/en.yml ansible/playbooks/vars/es.yml`.  
2. Werte übersetzen & anpassen.  
3. Jenkins-Job klonen (oder Matrix-Job erweitern) für `es.yml`.  
4. Branch `Rendered/Spanish` wird automatisch erzeugt.

### 7.2 Neue Seite hinzufügen
1. HTML-Gerüst erstellen, Platzhalter verwenden.  
2. Pfad ggf. zur `list:` in `replace.yml` hinzufügen, falls Header/Footer-Injection nötig ist.  
3. Sprach-YAML ergänzen.

---
## 8. Lokales Testen
```bash
# 1. Variables-Branch pullen
# 2. Eine Sprache wählen
cd ansible
ansible-playbook playbooks/replace.yml -e "@playbooks/vars/de-de.yml"
# Output liegt anschließend in den Quelldateien neben ansible/ → Browser öffnen
```

> _Hinweis:_ Für lokale Tests keinen Render-Branch committen! Einfach `git reset --hard origin/Variables`, sobald man fertig ist.

---
## 9. Glossar wichtiger Platzhalter (Auszug)
| Platzhalter | Beschreibung |
|-------------|--------------|
| `VARIABLE-WEBSITEURL` | Basis-URL der gehosteten Assets |
| `VARIABLE-WEBSITESUPPORTURL` | Link zum Support-Ticket-System |
| `VARIABLE-MENUHOME` | Menüeintrag „Startseite“ |
| `VARIABLE-FOCUSPOINT1TITLE` | Titel des ersten Fokus-Kästchens auf der Startseite |
| `…` | (Siehe vollständige YAML-Dateien) |

---
## 10. Lizenz & Maintainer
Siehe Wurzel-`README.md` für Lizenz-Hinweise und Maintainer-Kontaktdaten.
