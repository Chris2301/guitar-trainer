# Design: Homepage and Learn Page

## Overview
Nieuw Angular v21 project met Taiga UI, twee routes (home en learn), SCSS theming geïnspireerd op bunny.net, en Playwright tests als visuele demo.

## Key Decisions

### Taiga UI als component library
**Choice:** Taiga UI voor alle UI componenten
**Rationale:** Expliciet gekozen door de gebruiker. Biedt Angular-native componenten, goede theming-support voor light/dark mode, en een professionele look.

### Bunny.net-geïnspireerd kleurenpalet
**Choice:** Blauw-gebaseerd palet met oranje accenten (`#183d6d`, `#052740` voor blauw; `#fd8d32` → `#ffaf48` voor oranje)
**Rationale:** De bunny.net stijl — clean, modern, premium uitstraling — past goed bij een tool die gratis en professioneel wil overkomen.

### Playwright als e2e en visuele demo
**Choice:** Playwright tests draaien via `npx playwright test --ui` op de VPS. VSCode Remote SSH forwardt de poort automatisch zodat de Playwright UI in de lokale browser te openen is. Hierin zijn de tests live stap-voor-stap te volgen met screenshots.
**Rationale:** Dubbel doel — tests valideren de pagina-inhoud, en de UI mode dient als live demo. Geen extra software nodig (geen VNC/Xvfb), werkt out-of-the-box met VSCode port forwarding.

### Multi-language support vanaf dag 1
**Choice:** Angular built-in i18n (compile-time per locale) met NL, DE, EN
**Rationale:** Achteraf toevoegen van i18n is veel werk. Angular built-in i18n genereert een geoptimaliseerde bundle per taal. Door het meteen op te zetten hoeven toekomstige features alleen vertalingen toe te voegen.

## Components Affected
- **AppComponent** — root component met header-navigatie en theme toggle
- **HomeComponent** — hero sectie, feature highlights, call-to-action
- **LearnComponent** — placeholder pagina met structuur voor toekomstige trainingen
- **AppRoutingModule** — routes voor `/` (home) en `/learn`
- **Theme** — SCSS variabelen en Taiga UI theme configuratie voor light/dark

## Data Model Changes
None — pure frontend, geen data opslag.

## API Changes
None — geen backend.

## Risks and Mitigations
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Taiga UI compatibiliteit met Angular v21 | Medium | Controleer compatibiliteit vooraf; val terug op standalone componenten indien nodig |
| Angular i18n compile-time complexiteit | Low | Configureer locales vroeg; gebruik `ng extract-i18n` voor vertaalbestanden |
| Bunny.net stijl moeilijk na te bootsen | Low | Focus op kleurenpalet en spacing, niet op pixel-perfect kopie |
