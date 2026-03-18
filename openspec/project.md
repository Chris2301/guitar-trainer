# Project: learn2play-guitar.com

## Vision

Gratis, advertentievrije webapplicatie die gitaartheorie en oefeningen op een simpele, gegamificeerde manier aanbiedt. Beginners kunnen spelenderwijs noten, akkoorden en technieken leren via interactieve quizzen op een visueel fretboard.

## Target Audience

- **Primair:** Beginners die gitaar leren spelen
- **Secundair:** Alle niveaus — warm-up games en oefeningen voor dagelijkse practice

## Core Concepts

- **Fretboard visualisatie** — interactief gitaar fretboard dat noten en powerchords kan tonen
- **Quiz modus** — gamified oefeningen waarbij de speler noten/akkoorden moet identificeren of plaatsen
- **Warm-up games** — korte oefeningen om mee op te warmen voor een sessie
- **Progressie** — van eenvoudige nootherkenning naar complexere theorie

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular v21 |
| UI Components | Taiga UI |
| Styling | SCSS, light & dark theme |
| i18n | Nederlands, Duits, Engels |
| Testing | Playwright (e2e), Jasmine/Karma (unit) |
| Hosting | Cloudflare Pages |
| Backend | Geen — pure frontend applicatie |

## Design

### Stijl-inspiratie: bunny.net

- **Kleurenpalet:** Blauw-gebaseerd met oranje accenten
  - Primary blues: `#183d6d`, `#052740`, `#051e38`
  - Accent orange: `#fd8d32` → `#ffaf48` (gradient)
  - Neutrals: `#ffffff`, `#e6e8ea`, `#979797`
- **Typografie:** System fonts (`ui-sans-serif, system-ui, sans-serif`), grote display sizes
- **Layout:** 12-column grid, mobile-first, max-width ~1140px
- **Buttons:** Rounded (`.8rem`), shine-effect op hover
- **Cards:** Subtiele box-shadows, afwisselend wit/lichtblauw
- **Animaties:** Fade-in reveals, smooth hover transitions
- **Algemeen:** Clean, modern, veel whitespace, premium uitstraling

### Theming

- Light en dark mode via Taiga UI theming
- Kleurenpalet aangepast voor beide modes

### Internationalisatie

- Standaardtaal: Engels
- Ondersteund: Nederlands (`nl`), Duits (`de`), Engels (`en`)
- Angular i18n

## Conventions

- Geen backend — alle data en logica in de frontend
- TDD aanpak — tests eerst
- Playwright tests dienen als visuele demo van de applicatie
- Simpel en leesbaar — geen over-engineering
