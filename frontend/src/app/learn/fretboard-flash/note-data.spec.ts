import { FretNote, FRET_NOTES } from './note-data';

describe('FretNote data', () => {
  const NATURAL_NOTES: readonly string[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const STRING_COUNT = 6;
  const MAX_FRET = 15;

  // Standard tuning: string 6 (low E) to string 1 (high E)
  // Expected natural notes per string (fret 0-15):
  const expectedNaturalNotes: Record<number, { fret: number; note: string }[]> = {
    6: [ // Low E string: E F . G . A . B C . D . E F . G
      { fret: 0, note: 'E' }, { fret: 1, note: 'F' }, { fret: 3, note: 'G' },
      { fret: 5, note: 'A' }, { fret: 7, note: 'B' }, { fret: 8, note: 'C' },
      { fret: 10, note: 'D' }, { fret: 12, note: 'E' }, { fret: 13, note: 'F' },
      { fret: 15, note: 'G' },
    ],
    5: [ // A string: A . B C . D . E F . G . A . B C
      { fret: 0, note: 'A' }, { fret: 2, note: 'B' }, { fret: 3, note: 'C' },
      { fret: 5, note: 'D' }, { fret: 7, note: 'E' }, { fret: 8, note: 'F' },
      { fret: 10, note: 'G' }, { fret: 12, note: 'A' }, { fret: 14, note: 'B' },
      { fret: 15, note: 'C' },
    ],
    4: [ // D string: D . E F . G . A . B C . D . E F
      { fret: 0, note: 'D' }, { fret: 2, note: 'E' }, { fret: 3, note: 'F' },
      { fret: 5, note: 'G' }, { fret: 7, note: 'A' }, { fret: 9, note: 'B' },
      { fret: 10, note: 'C' }, { fret: 12, note: 'D' }, { fret: 14, note: 'E' },
      { fret: 15, note: 'F' },
    ],
    3: [ // G string: G . A . B C . D . E F . G . A .
      { fret: 0, note: 'G' }, { fret: 2, note: 'A' }, { fret: 4, note: 'B' },
      { fret: 5, note: 'C' }, { fret: 7, note: 'D' }, { fret: 9, note: 'E' },
      { fret: 10, note: 'F' }, { fret: 12, note: 'G' }, { fret: 14, note: 'A' },
    ],
    2: [ // B string: B C . D . E F . G . A . B C . D
      { fret: 0, note: 'B' }, { fret: 1, note: 'C' }, { fret: 3, note: 'D' },
      { fret: 5, note: 'E' }, { fret: 6, note: 'F' }, { fret: 8, note: 'G' },
      { fret: 10, note: 'A' }, { fret: 12, note: 'B' }, { fret: 13, note: 'C' },
      { fret: 15, note: 'D' },
    ],
    1: [ // High E string: E F . G . A . B C . D . E F . G
      { fret: 0, note: 'E' }, { fret: 1, note: 'F' }, { fret: 3, note: 'G' },
      { fret: 5, note: 'A' }, { fret: 7, note: 'B' }, { fret: 8, note: 'C' },
      { fret: 10, note: 'D' }, { fret: 12, note: 'E' }, { fret: 13, note: 'F' },
      { fret: 15, note: 'G' },
    ],
  };

  it('should export an array of FretNote objects', () => {
    expect(Array.isArray(FRET_NOTES)).toBe(true);
    expect(FRET_NOTES.length).toBeGreaterThan(0);
  });

  it('should only contain natural notes (C, D, E, F, G, A, B)', () => {
    for (const note of FRET_NOTES) {
      expect(NATURAL_NOTES).toContain(note.note);
    }
  });

  it('should only contain valid string numbers (1-6)', () => {
    for (const note of FRET_NOTES) {
      expect(note.string).toBeGreaterThanOrEqual(1);
      expect(note.string).toBeLessThanOrEqual(STRING_COUNT);
    }
  });

  it('should only contain valid fret numbers (0-15)', () => {
    for (const note of FRET_NOTES) {
      expect(note.fret).toBeGreaterThanOrEqual(0);
      expect(note.fret).toBeLessThanOrEqual(MAX_FRET);
    }
  });

  it('should have x/y coordinates as percentages between 0 and 100', () => {
    for (const note of FRET_NOTES) {
      expect(note.x).toBeGreaterThanOrEqual(0);
      expect(note.x).toBeLessThanOrEqual(100);
      expect(note.y).toBeGreaterThanOrEqual(0);
      expect(note.y).toBeLessThanOrEqual(100);
    }
  });

  it('should cover all 6 strings', () => {
    const strings = new Set(FRET_NOTES.map((n: FretNote) => n.string));
    for (let s = 1; s <= STRING_COUNT; s++) {
      expect(strings.has(s)).toBe(true);
    }
  });

  it('should include open string notes (fret 0) for all 6 strings', () => {
    const openNotes = FRET_NOTES.filter((n: FretNote) => n.fret === 0);
    expect(openNotes.length).toBe(6);
    const openStrings = new Set(openNotes.map((n: FretNote) => n.string));
    for (let s = 1; s <= STRING_COUNT; s++) {
      expect(openStrings.has(s)).toBe(true);
    }
  });

  it('should have correct open string notes in standard tuning', () => {
    const openNotes = FRET_NOTES.filter((n: FretNote) => n.fret === 0);
    const openNoteMap = new Map(openNotes.map((n: FretNote) => [n.string, n.note]));

    expect(openNoteMap.get(6)).toBe('E'); // Low E
    expect(openNoteMap.get(5)).toBe('A');
    expect(openNoteMap.get(4)).toBe('D');
    expect(openNoteMap.get(3)).toBe('G');
    expect(openNoteMap.get(2)).toBe('B');
    expect(openNoteMap.get(1)).toBe('E'); // High E
  });

  it('should have the correct total count of natural notes across all strings', () => {
    const expectedTotal = Object.values(expectedNaturalNotes)
      .reduce((sum, notes) => sum + notes.length, 0);
    expect(FRET_NOTES.length).toBe(expectedTotal);
  });

  it('should contain exactly the correct natural notes for each string', () => {
    for (let s = 1; s <= STRING_COUNT; s++) {
      const notesOnString = FRET_NOTES
        .filter((n: FretNote) => n.string === s)
        .map((n: FretNote) => ({ fret: n.fret, note: n.note }))
        .sort((a: { fret: number }, b: { fret: number }) => a.fret - b.fret);

      const expected = [...expectedNaturalNotes[s]].sort((a, b) => a.fret - b.fret);

      expect(notesOnString).toEqual(expected);
    }
  });

  it('should have no duplicate string/fret combinations', () => {
    const keys = FRET_NOTES.map((n: FretNote) => `${n.string}-${n.fret}`);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('should have distinct x positions for notes on different frets of the same string', () => {
    const string1Notes = FRET_NOTES.filter((n: FretNote) => n.string === 1);
    const xValues = string1Notes.map((n: FretNote) => n.x);
    const uniqueX = new Set(xValues);
    expect(uniqueX.size).toBe(xValues.length);
  });

  it('should have distinct y positions for notes on different strings at the same fret', () => {
    const openNotes = FRET_NOTES.filter((n: FretNote) => n.fret === 0);
    const yValues = openNotes.map((n: FretNote) => n.y);
    const uniqueY = new Set(yValues);
    expect(uniqueY.size).toBe(yValues.length);
  });

  it('should have x positions that increase with fret number', () => {
    for (let s = 1; s <= STRING_COUNT; s++) {
      const notesOnString = FRET_NOTES
        .filter((n: FretNote) => n.string === s)
        .sort((a: FretNote, b: FretNote) => a.fret - b.fret);

      for (let i = 1; i < notesOnString.length; i++) {
        expect(notesOnString[i].x).toBeGreaterThan(notesOnString[i - 1].x);
      }
    }
  });

  it('should conform to the FretNote interface shape', () => {
    const note: FretNote = FRET_NOTES[0];
    expect(typeof note.string).toBe('number');
    expect(typeof note.fret).toBe('number');
    expect(typeof note.note).toBe('string');
    expect(typeof note.x).toBe('number');
    expect(typeof note.y).toBe('number');
  });
});
