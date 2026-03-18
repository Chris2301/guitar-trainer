# Proposal: Homepage and Learn Page

## Intent
Het project heeft nog geen Angular applicatie. Er is een landingspagina nodig die bezoekers verwelkomt en uitlegt wat learn2play-guitar.com is, en een learn-pagina waar straks de gitaartrainingen komen. Dit is de basis waarop alle toekomstige features gebouwd worden.

## Scope
- Angular v21 project opzetten met Taiga UI, theming (light/dark) en i18n (NL, DE, EN)
- Homepage met hero-sectie: gratis, advertentievrij, gegamificeerde gitaartheorie en oefeningen
- Learn page met placeholder content (structuur voor toekomstige trainingen)
- Routing tussen homepage en learn page
- Playwright e2e tests die als visuele demo dienen van beide pagina's
- De app draait op een VPS, toegankelijk via VSCode Remote SSH
- Playwright tests draaien via `--ui` mode op de VPS; VSCode Remote SSH forwardt de poort zodat de test-UI in de lokale browser zichtbaar is
- **Out of scope:** fretboard visualisatie, quizzen, backend, CI/CD pipeline, deployment naar productie

## Approach
Een nieuw Angular v21 project opzetten met Taiga UI als component library. Theming (light/dark) en internationalisatie (NL/DE/EN) worden vanaf het begin geconfigureerd zodat alle toekomstige features hier direct gebruik van maken. De homepage krijgt een bunny.net-geïnspireerde stijl: clean, modern, veel whitespace, blauw kleurenpalet met oranje accenten. Playwright tests worden geschreven als een soort "guided tour" door de app — ze doorlopen elke pagina en valideren wat erop staat.

## Decisions
- **i18n:** Angular built-in i18n (compile-time per locale)
- **Navigatie:** alleen header, geen footer
- **Animaties:** geen scroll-animaties in eerste versie, simpel houden
