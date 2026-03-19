# Proposal: Homepage and Learn Page

## Intent
The project does not yet have an Angular application. A landing page is needed to welcome visitors and explain what learn2play-guitar.com is, along with a learn page where guitar training exercises will eventually live. This is the foundation on which all future features will be built.

## Scope
- Set up Angular v21 project with Taiga UI, theming (light/dark) and i18n (NL, DE, EN)
- Homepage with hero section: free, ad-free, gamified guitar theory and exercises
- Learn page with placeholder content (structure for future training exercises)
- Routing between homepage and learn page
- Playwright e2e tests that serve as a visual demo of both pages
- The app runs on a VPS, accessible via VSCode Remote SSH
- Playwright tests run via `--ui` mode on the VPS; VSCode Remote SSH forwards the port so the test UI is visible in the local browser
- **Out of scope:** fretboard visualization, quizzes, backend, CI/CD pipeline, deployment to production

## Approach
Set up a new Angular v21 project with Taiga UI as the component library. Theming (light/dark) and internationalization (NL/DE/EN) are configured from the start so all future features can use them directly. The homepage gets a bunny.net-inspired style: clean, modern, lots of whitespace, blue color palette with orange accents. Playwright tests are written as a sort of "guided tour" through the app — they walk through each page and validate what's displayed.

## Decisions
- **i18n:** Angular built-in i18n (compile-time per locale)
- **Navigation:** header only, no footer
- **Animations:** no scroll animations in the first version, keep it simple
