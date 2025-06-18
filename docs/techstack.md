# Tech-Stack & Designprinzipien

_Last updated: 2025-06-16_

## 1  Überblick
Die Website ist als **statische, CI-gerenderte Multi-Language-Site** realisiert. Build- und Deployment-Aufgaben übernimmt Ansible in Verbindung mit Jenkins, wodurch keinerlei Server-Side-Rendering notwendig ist.

| Ebene        | Technologie / Tool | Zweck |
|--------------|-------------------|-------|
| Markup       | **HTML5**         | Semantischer Aufbau aller Seiten |
| Styling      | **SCSS → CSS**<br>(Vanilla + Utility-Klassen) | Responsives Layout, Theme-Farben, Dark / Light-Styles |
| JS-Libs      | **jQuery**, **WOW.js**, **Owl Carousel**, **Typed.js** | Animationen, Slider, Typed-Texteffekt |
| Build        | **Ansible** (Python ∼ 3.12) | Platzhalter-Substitution, Header / Footer-Injection |
| CI           | **Jenkins** + GitLab-Webhook | Automatisches Build & Push je Sprache |
| Deployment   | **Nginx** (Static) | Auslieferung der gerenderten Branches |
| Hosting      | **KVM-Virtualisierter Server** (Debian) | 10 Gbit Uplink, off-site Backups |

## 2  Designprinzipien
1. **Trennung von Inhalt & Präsentation**  
   *HTML-Gerüst* bleibt sprach-/branding-agnostisch; *YAML* trägt den Content.
2. **„Write once – translate everywhere“**  
   Ein neues Label erfordert lediglich eine zusätzliche Zeile in jeder Sprach-YAML.
3. **CI-Safety**  
   Render-Branches werden _nur_ von der Pipeline beschrieben ⇒ keine Merge-Konflikte.
4. **Performance first**  
   Voll statische Auslieferung, HTTP/2, Gzip/Brotli via Nginx.
5. **Accessibility & SEO**  
   Platzhalter für `alt`, `title`, `meta`-Tags; Lighthouse > 90 Score.
6. **Rollback-fähig**  
   Jede gerenderte Branch-Version ist via Git einfach wiederherstellbar.

## 3  Build-Ablauf (Kurzform)
```mermaid
flowchart TD
    A[Push to "Variables"] --> B[GitLab Webhook]
    B --> C[Jenkins Job <lang>]
    C --> D[Ansible playbook replace.yml]
    D --> E[Commit to Rendered/<lang>]
    E --> F[Optional deploy.yaml ➜ nginx reload]
```

## 4  Wichtige Ordner
```
ansible/                 # Playbooks & YAML
  playbooks/vars/*.yml   # Übersetzungen
header.html, footer.html # Layout-Fragmente
Rendered/                # Pipeline-Artefakte
```

## 5  Roadmap / Ideen
- Automatische Bild-Optimierung (WebP-Generation via CI)
- Storybook für UI-Komponenten
- Playwright-Tests für Smoke-Testing pro Render-Branch
- Docker-Image für lokalen Komplett-Build

---
**Fragen?** → Erstelle ein Issue oder melde dich via <support@servermanagementpanel.com>.
