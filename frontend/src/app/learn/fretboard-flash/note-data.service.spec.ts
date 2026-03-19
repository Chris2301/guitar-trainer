import { TestBed } from '@angular/core/testing';
import { NoteDataService } from './note-data.service';
import { FretNote, FRET_NOTES } from './note-data';

describe('NoteDataService', () => {
  let service: NoteDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteDataService);
  });

  describe('getNotesInFretRange', () => {
    it('should return only open string notes when range is 0-0', () => {
      const result = service.getNotesInFretRange(0, 0);

      expect(result.length).toBe(6);
      for (const note of result) {
        expect(note.fret).toBe(0);
      }
    });

    it('should return notes within frets 0-3', () => {
      const result = service.getNotesInFretRange(0, 3);

      for (const note of result) {
        expect(note.fret).toBeGreaterThanOrEqual(0);
        expect(note.fret).toBeLessThanOrEqual(3);
      }
      // Should include open strings plus fret 1-3 natural notes
      expect(result.length).toBeGreaterThan(6);
    });

    it('should return notes within frets 0-5', () => {
      const result = service.getNotesInFretRange(0, 5);

      for (const note of result) {
        expect(note.fret).toBeGreaterThanOrEqual(0);
        expect(note.fret).toBeLessThanOrEqual(5);
      }
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return all notes when range is 0-15', () => {
      const result = service.getNotesInFretRange(0, 15);

      expect(result.length).toBe(FRET_NOTES.length);
    });

    it('should return notes only in frets 5-10', () => {
      const result = service.getNotesInFretRange(5, 10);

      for (const note of result) {
        expect(note.fret).toBeGreaterThanOrEqual(5);
        expect(note.fret).toBeLessThanOrEqual(10);
      }
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return an empty array when minFret exceeds maxFret', () => {
      const result = service.getNotesInFretRange(10, 5);

      expect(result).toEqual([]);
    });

    it('should return an empty array when range is outside valid frets', () => {
      const result = service.getNotesInFretRange(16, 20);

      expect(result).toEqual([]);
    });

    it('should return the correct natural notes for frets 2-4 based on guitar theory', () => {
      const result = service.getNotesInFretRange(2, 4);

      // In standard tuning (E-A-D-G-B-E), natural notes on frets 2-4:
      // Fret 2: string 3 = A, string 4 = E, string 5 = B
      // Fret 3: string 1 = G, string 2 = D, string 4 = F, string 5 = C, string 6 = G
      // Fret 4: string 3 = B
      expect(result.length).toBe(9);

      const noteMap = result.map(note => ({ s: note.string, f: note.fret, n: note.note }));
      expect(noteMap).toContainEqual({ s: 3, f: 2, n: 'A' });
      expect(noteMap).toContainEqual({ s: 4, f: 2, n: 'E' });
      expect(noteMap).toContainEqual({ s: 5, f: 2, n: 'B' });
      expect(noteMap).toContainEqual({ s: 1, f: 3, n: 'G' });
      expect(noteMap).toContainEqual({ s: 2, f: 3, n: 'D' });
      expect(noteMap).toContainEqual({ s: 4, f: 3, n: 'F' });
      expect(noteMap).toContainEqual({ s: 5, f: 3, n: 'C' });
      expect(noteMap).toContainEqual({ s: 6, f: 3, n: 'G' });
      expect(noteMap).toContainEqual({ s: 3, f: 4, n: 'B' });
    });

    it('should include correct open string notes in standard tuning for range 0-0', () => {
      const result = service.getNotesInFretRange(0, 0);
      const noteMap = new Map(result.map((note: FretNote) => [note.string, note.note]));

      expect(noteMap.get(6)).toBe('E');
      expect(noteMap.get(5)).toBe('A');
      expect(noteMap.get(4)).toBe('D');
      expect(noteMap.get(3)).toBe('G');
      expect(noteMap.get(2)).toBe('B');
      expect(noteMap.get(1)).toBe('E');
    });
  });

  describe('getNotesUpToFret', () => {
    it('should return all notes from fret 0 up to the given fret', () => {
      const result = service.getNotesUpToFret(5);

      for (const note of result) {
        expect(note.fret).toBeGreaterThanOrEqual(0);
        expect(note.fret).toBeLessThanOrEqual(5);
      }
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return only open strings for fret 0', () => {
      const result = service.getNotesUpToFret(0);

      expect(result.length).toBe(6);
      for (const note of result) {
        expect(note.fret).toBe(0);
      }
    });

    it('should return all notes for fret 15', () => {
      const result = service.getNotesUpToFret(15);

      expect(result.length).toBe(FRET_NOTES.length);
    });
  });

  describe('getNotesOnFret', () => {
    it('should return only notes on the specified fret', () => {
      const result = service.getNotesOnFret(3);

      for (const note of result) {
        expect(note.fret).toBe(3);
      }
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return 6 open string notes for fret 0', () => {
      const result = service.getNotesOnFret(0);

      expect(result.length).toBe(6);
    });

    it('should return an empty array for a fret with no natural notes', () => {
      // Fret 11 has no natural notes: all six strings produce sharps/flats
      // (D#, A#, F#, C#, G#, D# for strings 1-6 respectively)
      const result = service.getNotesOnFret(11);

      expect(result.length).toBe(0);
    });
  });
});
