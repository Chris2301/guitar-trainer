import { TestBed } from '@angular/core/testing';
import { ProgressionService } from './progression.service';
import { NoteDataService } from './note-data.service';
import { FretNote } from './note-data';

describe('ProgressionService', () => {
  let service: ProgressionService;
  let noteDataService: NoteDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgressionService, NoteDataService],
    });
    service = TestBed.inject(ProgressionService);
    noteDataService = TestBed.inject(NoteDataService);
  });

  describe('initial state', () => {
    it('should start with open strings (fret 0) as the current pool', () => {
      const pool = service.getCurrentPool();

      expect(pool.length).toBe(6);
      for (const note of pool) {
        expect(note.fret).toBe(0);
      }
    });

    it('should match the open string notes from NoteDataService', () => {
      const pool = service.getCurrentPool();
      const expected = noteDataService.getNotesOnFret(0);

      expect(pool).toEqual(expected);
    });

    it('should start at fret level 0', () => {
      expect(service.getCurrentFret()).toBe(0);
    });

    it('should have no shown notes initially', () => {
      expect(service.getShownNoteCount()).toBe(0);
    });
  });

  describe('getRandomNote', () => {
    it('should return a note from the current pool', () => {
      const pool = service.getCurrentPool();
      const note = service.getRandomNote();

      expect(pool).toContain(note);
    });

    it('should throw an error when the pool is empty', () => {
      // Access private pool via any-cast to force an empty pool scenario
      (service as any).pool = [];

      expect(() => service.getRandomNote()).toThrowError(
        'ProgressionService: pool is empty — cannot get random note',
      );
    });

    it('should return different notes over multiple calls (statistical check)', () => {
      const notes = new Set<string>();
      for (let i = 0; i < 50; i++) {
        const note = service.getRandomNote();
        notes.add(`${note.string}-${note.fret}`);
      }
      // With 6 open strings and 50 draws, we should see more than 1 unique note
      expect(notes.size).toBeGreaterThan(1);
    });
  });

  describe('markNoteAsShown', () => {
    it('should track that a note has been shown', () => {
      const note = service.getRandomNote();
      service.markNoteAsShown(note);

      expect(service.getShownNoteCount()).toBe(1);
    });

    it('should not double-count the same note shown twice', () => {
      const pool = service.getCurrentPool();
      const note = pool[0];

      service.markNoteAsShown(note);
      service.markNoteAsShown(note);

      expect(service.getShownNoteCount()).toBe(1);
    });

    it('should count distinct notes that have been shown', () => {
      const pool = service.getCurrentPool();

      service.markNoteAsShown(pool[0]);
      service.markNoteAsShown(pool[1]);
      service.markNoteAsShown(pool[2]);

      expect(service.getShownNoteCount()).toBe(3);
    });
  });

  describe('pool expansion', () => {
    it('should expand pool when all current notes have been shown', () => {
      const openStrings = service.getCurrentPool();
      expect(openStrings.length).toBe(6);

      // Mark all open string notes as shown
      for (const note of openStrings) {
        service.markNoteAsShown(note);
      }

      // Pool should now include fret 1 notes too
      const expandedPool = service.getCurrentPool();
      const fret1Notes = noteDataService.getNotesOnFret(1);

      expect(expandedPool.length).toBe(openStrings.length + fret1Notes.length);
      expect(service.getCurrentFret()).toBe(1);
    });

    it('should keep previously learned notes in the expanded pool', () => {
      const openStrings = [...service.getCurrentPool()];

      // Mark all open string notes as shown
      for (const note of openStrings) {
        service.markNoteAsShown(note);
      }

      const expandedPool = service.getCurrentPool();
      for (const openNote of openStrings) {
        expect(expandedPool).toContain(openNote);
      }
    });

    it('should reset shown tracking after expansion', () => {
      const openStrings = service.getCurrentPool();

      // Mark all as shown to trigger expansion
      for (const note of openStrings) {
        service.markNoteAsShown(note);
      }

      // After expansion, shown count should reset to 0
      expect(service.getShownNoteCount()).toBe(0);
    });

    it('should expand through multiple frets sequentially', () => {
      // Expand through frets 0, 1, 2
      for (let targetFret = 1; targetFret <= 2; targetFret++) {
        const currentPool = service.getCurrentPool();
        for (const note of currentPool) {
          service.markNoteAsShown(note);
        }
        expect(service.getCurrentFret()).toBe(targetFret);
      }

      const finalPool = service.getCurrentPool();
      const expectedNotes = noteDataService.getNotesUpToFret(2);
      expect(finalPool.length).toBe(expectedNotes.length);
    });

    it('should skip frets that have no natural notes', () => {
      // Fret 11 has no natural notes. When expanding from fret 10,
      // it should skip to fret 12.
      // First, fast-forward to fret 10
      for (let targetFret = 1; targetFret <= 10; targetFret++) {
        const currentPool = service.getCurrentPool();
        for (const note of currentPool) {
          service.markNoteAsShown(note);
        }
      }

      expect(service.getCurrentFret()).toBe(10);

      // Now mark all current pool notes as shown
      const poolAtFret10 = service.getCurrentPool();
      for (const note of poolAtFret10) {
        service.markNoteAsShown(note);
      }

      // Should have skipped fret 11 (no natural notes) and gone to fret 12
      expect(service.getCurrentFret()).toBe(12);
    });

    it('should not expand beyond fret 15', () => {
      // Fast-forward to max fret
      for (let targetFret = 1; targetFret <= 15; targetFret++) {
        const currentPool = service.getCurrentPool();
        for (const note of currentPool) {
          service.markNoteAsShown(note);
        }
      }

      // We should be at fret 15 (or less if some frets were skipped)
      const currentFret = service.getCurrentFret();
      expect(currentFret).toBeLessThanOrEqual(15);

      // Mark all notes as shown again — should NOT crash or go beyond 15
      const finalPool = service.getCurrentPool();
      for (const note of finalPool) {
        service.markNoteAsShown(note);
      }

      expect(service.getCurrentFret()).toBeLessThanOrEqual(15);
      // Pool should contain all natural notes
      expect(service.getCurrentPool().length).toBe(noteDataService.getNotesUpToFret(15).length);
    });
  });

  describe('reset', () => {
    it('should reset to initial state with open strings only', () => {
      // Expand pool first
      const openStrings = service.getCurrentPool();
      for (const note of openStrings) {
        service.markNoteAsShown(note);
      }

      service.reset();

      expect(service.getCurrentFret()).toBe(0);
      expect(service.getCurrentPool().length).toBe(6);
      expect(service.getShownNoteCount()).toBe(0);
    });
  });
});
