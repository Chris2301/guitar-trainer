# Tasks: Fretboard Flash
The WHAT

# **Critical: TDD approach - tests first!**

## 1. Nootdata en Progressie
- [ ] 1.1 Definieer `FretNote` interface en statische nootdata voor alle natuurlijke noten op fret 0-15
- [ ] 1.2 Implementeer `NoteDataService` die noten kan filteren op fret-range
- [ ] 1.3 Implementeer `ProgressionService` — beheert huidige nootpool, start met open snaren, breidt uit per fret
- [ ] 1.4 Logica voor pool-uitbreiding: track welke noten getoond zijn, breid uit wanneer alle huidige pool-noten minstens 1x gezien

## 2. Fretboard Weergave
- [ ] 2.1 Maak/verkrijg fretboard-afbeelding (gitaarhals, fret 1-15, 6 snaren)
- [ ] 2.2 Implementeer `FretboardDisplayComponent` — toont afbeelding met overlay-container
- [ ] 2.3 Note marker overlay — dot op x/y-positie (percentages) bovenop de afbeelding
- [ ] 2.4 Responsive scaling — fretboard past zich aan aan schermgrootte, markers schalen mee

## 3. Game Loop
- [ ] 3.1 Implementeer game state machine: `SHOW_NOTE` → `SHOW_ANSWER` → next note
- [ ] 3.2 Timer-logica: 5 seconden noot tonen, 3 seconden antwoord tonen
- [ ] 3.3 Integratie met `ProgressionService` — vraag volgende willekeurige noot op
- [ ] 3.4 `FretboardFlashPageComponent` — samenstelling van noot-display, fretboard en game controls

## 4. Navigatie en Routing
- [ ] 4.1 Lazy-loaded child route `/learn/fretboard-flash`
- [ ] 4.2 Button/card op Learn-pagina die naar Fretboard Flash linkt
- [ ] 4.3 i18n labels voor alle UI-tekst (NL/DE/EN)

## 5. Styling en Theming
- [ ] 5.1 Game-pagina layout — nootletter groot gecentreerd, fretboard daaronder
- [ ] 5.2 Light/dark theme support voor alle game-componenten
- [ ] 5.3 Visuele styling van note marker (kleur, grootte, animatie)

## 6. E2E Tests
- [ ] 6.1 Playwright test: navigatie van Learn-pagina naar Fretboard Flash
- [ ] 6.2 Playwright test: game-loop — noot verschijnt, antwoord verschijnt op fretboard, volgende noot
- [ ] 6.3 Playwright test: progressie — pool breidt uit na open noten
