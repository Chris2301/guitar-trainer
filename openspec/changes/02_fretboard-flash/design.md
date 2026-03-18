# Design: Fretboard Flash

## Overview
Een Angular page-component met een timer-gebaseerde state machine die flashcard-gameplay aanstuurt, een fretboard-afbeelding met x/y-overlay voor nootposities, en een progressieservice die de nootpool beheert.

## Key Decisions

### Fretboard rendering
**Choice:** Statische afbeelding (PNG/SVG) van een gitaarhals met CSS absolute-positioned dot overlays via x/y-coördinaten
**Rationale:** Realistisch uiterlijk zonder complexe SVG/Canvas rendering. Simpel te implementeren — één afbeelding + gepositioneerde markers. De x/y-coördinaten per noot worden als statische data opgeslagen.

### Game state management
**Choice:** Component-lokale state machine met drie states: `SHOW_NOTE`, `SHOW_ANSWER`, `IDLE`
**Rationale:** Geen complexe state management nodig (geen NgRx/signals store). Een simpele RxJS timer-flow in het component volstaat voor de v1 flashcard-loop.

### Nootdata opslag
**Choice:** Statisch TypeScript bestand met alle nootposities als array van objecten `{ string: number, fret: number, note: string, x: number, y: number }`
**Rationale:** Geen backend nodig. Data verandert niet runtime. Makkelijk te onderhouden en testen. De x/y-coördinaten worden eenmalig handmatig gemapped op de fretboard-afbeelding.

### Progressielogica
**Choice:** Service die bijhoudt welke noten in de huidige pool zitten en uitbreidt per fret wanneer alle noten minstens één keer zijn getoond
**Rationale:** Simpele uitbreidingslogica die goed aansluit bij het leerproces — eerst open noten beheersen, dan uitbreiden.

### Routing
**Choice:** Lazy-loaded child route onder `/learn/fretboard-flash`
**Rationale:** Past in de bestaande routestructuur van de Learn-pagina. Lazy loading houdt de initiële bundle klein.

## Components Affected
- **learn page** — nieuwe button/card toevoegen die naar Fretboard Flash linkt
- **fretboard-flash page component** (nieuw) — game-pagina met state machine en timer-logica
- **fretboard display component** (nieuw) — toont de fretboard-afbeelding met note-overlay
- **note-data service** (nieuw) — statische nootposities en x/y-coördinaten
- **progression service** (nieuw) — beheert de nootpool en uitbreidingslogica
- **routing module** — nieuwe child route `/learn/fretboard-flash`

## Data Model Changes
Geen database wijzigingen. Statische nootdata als TypeScript constante:

```typescript
interface FretNote {
  string: number;   // 1-6 (1 = hoge E, 6 = lage E)
  fret: number;     // 0-15 (0 = open)
  note: string;     // 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
  x: number;        // x-positie op fretboard afbeelding (px of %)
  y: number;        // y-positie op fretboard afbeelding (px of %)
}
```

## API Changes
None — pure frontend applicatie.

## Risks and Mitigations
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| x/y-coördinaten kloppen niet met afbeelding op verschillende schermformaten | High | Gebruik percentages i.p.v. pixels, test op meerdere viewports |
| Fretboard-afbeelding is te groot/traag op mobiel | Medium | Optimaliseer afbeelding, gebruik responsive image sizes |
| Timer-logica conflicteert met Angular change detection | Low | Gebruik `NgZone.runOutsideAngular` voor timers indien nodig |
| Progressie voelt te snel of te langzaam | Medium | Hardcoded in v1, configureerbaar maken in v2 |
