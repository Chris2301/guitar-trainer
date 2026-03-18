# Tasks: Homepage and Learn Page
The WHAT

# **Critical: TDD approach - tests first!**

## 1. Project Setup
- [ ] 1.1 Angular v21 project genereren met standalone components en SCSS
- [ ] 1.2 Taiga UI installeren en configureren
- [ ] 1.3 Light/dark theme opzetten met SCSS variabelen en Taiga UI theming
- [ ] 1.4 i18n configureren (NL, DE, EN) met vertaalbestanden
- [ ] 1.5 Playwright installeren en configureren met `--ui` mode (poort wordt door VSCode Remote SSH geforward naar lokale browser)

## 2. Homepage
- [ ] 2.1 Playwright test schrijven: homepage toont hero-sectie met tagline, feature highlights en CTA
- [ ] 2.2 HomeComponent aanmaken met hero-sectie (gratis, ad-free, gegamificeerde gitaartraining)
- [ ] 2.3 Feature highlights sectie (overzicht van wat de app biedt)
- [ ] 2.4 Call-to-action knop naar learn page
- [ ] 2.5 Styling toepassen: bunny.net-geïnspireerd kleurenpalet, typografie, spacing

## 3. Learn Page
- [ ] 3.1 Playwright test schrijven: learn page toont placeholder content met correcte structuur
- [ ] 3.2 LearnComponent aanmaken met placeholder tekst en structuur voor toekomstige trainingen

## 4. Navigatie en Layout
- [ ] 4.1 Playwright test schrijven: navigatie tussen home en learn werkt, header zichtbaar op beide pagina's
- [ ] 4.2 Routing configureren (`/` → home, `/learn` → learn)
- [ ] 4.3 Gedeelde header met navigatie-links, theme toggle en taalkeuze

## 5. Theming en i18n Verificatie
- [ ] 5.1 Playwright test schrijven: theme toggle wisselt tussen light en dark
- [ ] 5.2 Playwright test schrijven: taal wisselen toont vertalingen in NL, DE, EN
- [ ] 5.3 Vertalingen toevoegen voor alle zichtbare tekst op homepage en learn page
