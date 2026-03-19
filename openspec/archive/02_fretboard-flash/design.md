# Design: Fretboard Flash

## Overview
An Angular page component with a timer-based state machine that drives flashcard gameplay, a fretboard image with x/y overlay for note positions, and a progression service that manages the note pool.

## Key Decisions

### Fretboard rendering
**Choice:** Static image (PNG/SVG) of a guitar neck with CSS absolute-positioned dot overlays via x/y coordinates
**Rationale:** Realistic appearance without complex SVG/Canvas rendering. Simple to implement — one image + positioned markers. The x/y coordinates per note are stored as static data.

### Game state management
**Choice:** Dedicated `GameStateService` using Angular Signals with three states: `SHOW_NOTE`, `SHOW_ANSWER`, `IDLE`
**Rationale:** A dedicated service with signal-based state is more testable and keeps the page component thin. The service exposes readonly signals for `state` and `currentNote`, with explicit transition methods (`start`, `showAnswer`, `nextNote`, `stop`). No NgRx Signal Store needed — plain Angular signals suffice for the v1 flashcard loop.

### Note data storage
**Choice:** Static TypeScript file with all note positions as an array of objects `{ string: number, fret: number, note: string, x: number, y: number }`
**Rationale:** No backend needed. Data doesn't change at runtime. Easy to maintain and test. The x/y coordinates are manually mapped to the fretboard image once.

### Progression logic
**Choice:** Service that tracks which notes are in the current pool and expands per fret when all notes have been shown at least once
**Rationale:** Simple expansion logic that aligns well with the learning process — master open notes first, then expand.

### Routing
**Choice:** Lazy-loaded child route under `/learn/fretboard-flash`
**Rationale:** Fits into the existing route structure of the Learn page. Lazy loading keeps the initial bundle small.

## Components Affected
- **learn page** — add new button/card linking to Fretboard Flash
- **fretboard-flash page component** (new) — game page with state machine and timer logic
- **fretboard display component** (new) — displays the fretboard image with note overlay
- **note-data service** (new) — static note positions and x/y coordinates
- **progression service** (new) — manages the note pool and expansion logic
- **routing module** — new child route `/learn/fretboard-flash`

## Data Model Changes
No database changes. Static note data as TypeScript constant:

```typescript
interface FretNote {
  string: number;   // 1-6 (1 = high E, 6 = low E)
  fret: number;     // 0-15 (0 = open)
  note: string;     // 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
  x: number;        // x position on fretboard image (%)
  y: number;        // y position on fretboard image (%)
}
```

## API Changes
None — pure frontend application.

## Risks and Mitigations
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| x/y coordinates don't match image on different screen sizes | High | Use percentages instead of pixels, test on multiple viewports |
| Fretboard image is too large/slow on mobile | Medium | Optimize image, use responsive image sizes |
| Timer logic conflicts with Angular change detection | Low | Use `NgZone.runOutsideAngular` for timers if needed |
| Progression feels too fast or too slow | Medium | Hardcoded in v1, make configurable in v2 |
