export type NaturalNote = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

export interface FretNote {
  string: number;      // 1-6 (1 = high E, 6 = low E)
  fret: number;        // 0-15 (0 = open)
  note: NaturalNote;   // natural note name
  x: number;           // x position on fretboard image (%)
  y: number;           // y position on fretboard image (%)
}

/**
 * Chromatic scale used to derive natural notes per string.
 * Standard guitar tuning: E-A-D-G-B-E (string 6 to 1).
 */
const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

const NATURAL_NOTES: ReadonlySet<string> = new Set<NaturalNote>(['C', 'D', 'E', 'F', 'G', 'A', 'B']);

/** Open string notes in standard tuning, indexed by string number (1-6). */
const OPEN_STRING_NOTES: Record<number, NaturalNote> = {
  1: 'E', // high E
  2: 'B',
  3: 'G',
  4: 'D',
  5: 'A',
  6: 'E', // low E
};

/**
 * Y-position (%) for each string on the fretboard image.
 * String 6 (low E) is at the bottom, string 1 (high E) at the top.
 */
const STRING_Y_POSITIONS: Record<number, number> = {
  1: 8,
  2: 25,
  3: 42,
  4: 58,
  5: 75,
  6: 92,
};

/**
 * X-position (%) for each fret on the fretboard image.
 * Fret 0 (open/nut) is on the far left, fret 15 on the far right.
 * Positions approximate the midpoint of each fret space.
 */
function fretXPosition(fret: number): number {
  if (fret === 0) {
    return 1.5;
  }
  // Frets 1-15 distributed across roughly 6% to 97% of the image width
  // Real fretboard spacing decreases toward higher frets, but we use
  // approximate linear spacing since these will be fine-tuned later.
  return 3 + (fret / 15) * 94;
}

function generateFretNotes(): FretNote[] {
  const notes: FretNote[] = [];

  for (let guitarString = 1; guitarString <= 6; guitarString++) {
    const openNote = OPEN_STRING_NOTES[guitarString];
    const startIndex = CHROMATIC_SCALE.indexOf(openNote as typeof CHROMATIC_SCALE[number]);

    for (let fret = 0; fret <= 15; fret++) {
      const noteIndex = (startIndex + fret) % 12;
      const noteName = CHROMATIC_SCALE[noteIndex];

      if (NATURAL_NOTES.has(noteName)) {
        notes.push({
          string: guitarString,
          fret,
          note: noteName as NaturalNote,
          x: fretXPosition(fret),
          y: STRING_Y_POSITIONS[guitarString],
        });
      }
    }
  }

  return notes;
}

/** All natural notes (C, D, E, F, G, A, B) on frets 0-15, all 6 strings in standard tuning. */
export const FRET_NOTES: readonly FretNote[] = generateFretNotes();
