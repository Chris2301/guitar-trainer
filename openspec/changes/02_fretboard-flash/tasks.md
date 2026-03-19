# Tasks: Fretboard Flash
The WHAT

# **Critical: TDD approach - tests first!**

## 1. Note Data and Progression
- [x] 1.1 Define `FretNote` interface and static note data for all natural notes on fret 0-15
- [x] 1.2 Implement `NoteDataService` that can filter notes by fret range
- [x] 1.3 Implement `ProgressionService` — manages current note pool, starts with open strings, expands per fret
- [x] 1.4 Logic for pool expansion: track which notes have been shown, expand when all current pool notes have been seen at least once

## 2. Fretboard Display
- [x] 2.1 Create/obtain fretboard image (guitar neck, fret 1-15, 6 strings)
- [x] 2.2 Implement `FretboardDisplayComponent` — displays image with overlay container
- [x] 2.3 Note marker overlay — dot at x/y position (percentages) on top of the image
- [x] 2.4 Responsive scaling — fretboard adapts to screen size, markers scale along

## 3. Game Loop
- [x] 3.1 Implement game state machine: `SHOW_NOTE` → `SHOW_ANSWER` → next note
- [ ] 3.2 Timer logic: 5 seconds show note, 3 seconds show answer
- [ ] 3.3 Integration with `ProgressionService` — request next random note
- [ ] 3.4 `FretboardFlashPageComponent` — composition of note display, fretboard and game controls

## 4. Navigation and Routing
- [ ] 4.1 Lazy-loaded child route `/learn/fretboard-flash`
- [ ] 4.2 Button/card on Learn page linking to Fretboard Flash
- [ ] 4.3 i18n labels for all UI text (NL/DE/EN)

## 5. Styling and Theming
- [ ] 5.1 Game page layout — note letter large and centered, fretboard below
- [ ] 5.2 Light/dark theme support for all game components
- [ ] 5.3 Visual styling of note marker (color, size, animation)

## 6. E2E Tests
- [ ] 6.1 Playwright test: navigation from Learn page to Fretboard Flash
- [ ] 6.2 Playwright test: game loop — note appears, answer appears on fretboard, next note
- [ ] 6.3 Playwright test: progression — pool expands after open notes
