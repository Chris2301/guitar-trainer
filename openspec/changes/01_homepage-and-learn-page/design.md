# Design: Homepage and Learn Page

## Overview
New Angular v21 project with Taiga UI, two routes (home and learn), SCSS theming inspired by bunny.net, and Playwright tests as a visual demo.

## Key Decisions

### Taiga UI as component library
**Choice:** Taiga UI for all UI components
**Rationale:** Explicitly chosen by the user. Provides Angular-native components, good theming support for light/dark mode, and a professional look.

### Bunny.net-inspired color palette
**Choice:** Blue-based palette with orange accents (`#183d6d`, `#052740` for blue; `#fd8d32` → `#ffaf48` for orange)
**Rationale:** The bunny.net style — clean, modern, premium appearance — fits well for a tool that aims to be free and professional.

### Playwright as e2e and visual demo
**Choice:** Playwright tests run via `npx playwright test --ui` on the VPS. VSCode Remote SSH automatically forwards the port so the Playwright UI can be opened in the local browser. Tests can be followed live step-by-step with screenshots.
**Rationale:** Dual purpose — tests validate page content, and UI mode serves as a live demo. No extra software needed (no VNC/Xvfb), works out-of-the-box with VSCode port forwarding.

### Multi-language support from day 1
**Choice:** Angular built-in i18n (compile-time per locale) with NL, DE, EN
**Rationale:** Adding i18n after the fact is a lot of work. Angular built-in i18n generates an optimized bundle per language. By setting it up immediately, future features only need to add translations.

## Components Affected
- **AppComponent** — root component with header navigation and theme toggle
- **HomeComponent** — hero section, feature highlights, call-to-action
- **LearnComponent** — placeholder page with structure for future training exercises
- **AppRoutingModule** — routes for `/` (home) and `/learn`
- **Theme** — SCSS variables and Taiga UI theme configuration for light/dark

## Data Model Changes
None — pure frontend, no data storage.

## API Changes
None — no backend.

## Risks and Mitigations
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Taiga UI compatibility with Angular v21 | Medium | Check compatibility beforehand; fall back to standalone components if needed |
| Angular i18n compile-time complexity | Low | Configure locales early; use `ng extract-i18n` for translation files |
| Bunny.net style difficult to replicate | Low | Focus on color palette and spacing, not a pixel-perfect copy |
