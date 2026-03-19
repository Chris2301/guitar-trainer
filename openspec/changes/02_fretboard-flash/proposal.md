# Proposal: Fretboard Flash

## Intent
Players need an interactive way to learn notes on the guitar fretboard. There is currently no game or exercise available. Fretboard Flash offers a flashcard-style learning game where notes are taught step by step, from open strings to fret 15.

## Scope
- Fretboard image (vertical, fret 1 on the left, 6 strings, fret 1-15) with note position overlay via x/y coordinates
- Flashcard gameplay: show note letter (5s) → show answer on fretboard with dot (3s) → next note, infinite loop
- Progression system: starts with open strings, gradually expands to higher frets
- Natural notes only (C D E F G A B) in v1
- Navigation: button on Learn page → `/learn/fretboard-flash`
- Playwright e2e tests
- i18n (NL/DE/EN) and theming (light/dark) support
- **Out of scope:** sharps/flats, configurable timing/difficulty, scoring/streaks, interactive input (clicking on fretboard), backend

## Approach
An Angular component that displays an image of a guitar neck with an overlay system for note positions. The game loop is driven by a timer-based state machine: SHOW_NOTE → SHOW_ANSWER → next note. A progression service manages the note pool — starts with 6 open notes and adds new notes per fret as the player progresses. All note data (string, fret, note name, x/y coordinate) is stored as static data in the frontend.

## Open Questions
- Which image do we use for the fretboard? Stock photo, custom SVG, or AI-generated?
- Should there be a stop/pause button, or does the player just close the page?
- How do we determine when the pool expands — after X questions per fret, or after all notes in the current pool have been seen at least once?
