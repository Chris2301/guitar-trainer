# Proposal: Fretboard Flash

## Intent
Spelers hebben een interactieve manier nodig om noten op het gitaarfretboard te leren. Er is momenteel geen game of oefening beschikbaar. Fretboard Flash biedt een flashcard-stijl leergame waarbij noten stap voor stap worden aangeleerd, van open snaren tot fret 15.

## Scope
- Fretboard-afbeelding (verticaal, fret 1 links, 6 snaren, fret 1-15) met nootpositie-overlay via x/y-coördinaten
- Flashcard gameplay: toon nootletter (5s) → toon antwoord op fretboard met stip (3s) → volgende noot, oneindige loop
- Progressiesysteem: start met open snaren, breidt stapsgewijs uit naar hogere frets
- Alleen natuurlijke noten (C D E F G A B) in v1
- Navigatie: button op Learn-pagina → `/learn/fretboard-flash`
- Playwright e2e tests
- i18n (NL/DE/EN) en theming (light/dark) support
- **Out of scope:** sharps/flats, configureerbare timing/moeilijkheid, scoring/streaks, interactieve input (klikken op fretboard), backend

## Approach
Een Angular component die een afbeelding van een gitaarhals toont met een overlay-systeem voor nootposities. De game-loop wordt aangestuurd door een timer-gebaseerde state machine: SHOW_NOTE → SHOW_ANSWER → volgende noot. Een progressieservice beheert de nootpool — begint met 6 open noten en voegt per fret nieuwe noten toe naarmate de speler vordert. Alle nootdata (snaar, fret, nootnaam, x/y-coördinaat) wordt als statische data in de frontend opgeslagen.

## Open Questions
- Welke afbeelding gebruiken we voor het fretboard? Stockfoto, custom SVG, of AI-gegenereerd?
- Moet er een stop/pauze-knop zijn, of sluit de speler gewoon de pagina?
- Hoe bepalen we wanneer de pool uitbreidt — na X vragen per fret, of na alle noten van de huidige pool minstens één keer gezien?
