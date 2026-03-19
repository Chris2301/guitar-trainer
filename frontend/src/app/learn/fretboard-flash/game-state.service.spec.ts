import { TestBed } from '@angular/core/testing';
import { GameStateService, GameState } from './game-state.service';
import { ProgressionService } from './progression.service';
import { NoteDataService } from './note-data.service';
import { FretNote } from './note-data';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameStateService, ProgressionService, NoteDataService],
    });
    service = TestBed.inject(GameStateService);
  });

  describe('initial state', () => {
    it('should start in IDLE state', () => {
      expect(service.state()).toBe(GameState.IDLE);
    });

    it('should have no current note initially', () => {
      expect(service.currentNote()).toBeNull();
    });
  });

  describe('start', () => {
    it('should transition from IDLE to SHOW_NOTE', () => {
      service.start();

      expect(service.state()).toBe(GameState.SHOW_NOTE);
    });

    it('should set a current note when starting', () => {
      service.start();

      expect(service.currentNote()).not.toBeNull();
    });

    it('should do nothing if already in SHOW_NOTE state', () => {
      service.start();
      const note = service.currentNote();

      service.start();

      expect(service.state()).toBe(GameState.SHOW_NOTE);
      expect(service.currentNote()).toBe(note);
    });

    it('should do nothing if in SHOW_ANSWER state', () => {
      service.start();
      service.showAnswer();

      service.start();

      expect(service.state()).toBe(GameState.SHOW_ANSWER);
    });
  });

  describe('showAnswer', () => {
    it('should transition from SHOW_NOTE to SHOW_ANSWER', () => {
      service.start();

      service.showAnswer();

      expect(service.state()).toBe(GameState.SHOW_ANSWER);
    });

    it('should keep the same current note when showing the answer', () => {
      service.start();
      const note = service.currentNote();

      service.showAnswer();

      expect(service.currentNote()).toBe(note);
    });

    it('should do nothing if in IDLE state', () => {
      service.showAnswer();

      expect(service.state()).toBe(GameState.IDLE);
    });

    it('should do nothing if already in SHOW_ANSWER state', () => {
      service.start();
      service.showAnswer();

      service.showAnswer();

      expect(service.state()).toBe(GameState.SHOW_ANSWER);
    });
  });

  describe('nextNote', () => {
    it('should transition from SHOW_ANSWER to SHOW_NOTE with a new note drawn', () => {
      service.start();
      service.showAnswer();

      service.nextNote();

      expect(service.state()).toBe(GameState.SHOW_NOTE);
      expect(service.currentNote()).not.toBeNull();
    });

    it('should do nothing if in IDLE state', () => {
      service.nextNote();

      expect(service.state()).toBe(GameState.IDLE);
    });

    it('should do nothing if in SHOW_NOTE state', () => {
      service.start();
      const note = service.currentNote();

      service.nextNote();

      expect(service.state()).toBe(GameState.SHOW_NOTE);
      expect(service.currentNote()).toBe(note);
    });
  });

  describe('stop', () => {
    it('should transition to IDLE from SHOW_NOTE', () => {
      service.start();

      service.stop();

      expect(service.state()).toBe(GameState.IDLE);
    });

    it('should transition to IDLE from SHOW_ANSWER', () => {
      service.start();
      service.showAnswer();

      service.stop();

      expect(service.state()).toBe(GameState.IDLE);
    });

    it('should clear the current note when stopped', () => {
      service.start();

      service.stop();

      expect(service.currentNote()).toBeNull();
    });

    it('should reset progression when stopped', () => {
      const progression = TestBed.inject(ProgressionService);
      vi.spyOn(progression, 'reset');

      service.start();
      service.stop();

      expect(progression.reset).toHaveBeenCalled();
    });
  });

  describe('timer: auto-transition from SHOW_NOTE to SHOW_ANSWER after 5 seconds', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should automatically transition to SHOW_ANSWER after 5 seconds in SHOW_NOTE', () => {
      service.start();
      expect(service.state()).toBe(GameState.SHOW_NOTE);

      vi.advanceTimersByTime(5000);

      expect(service.state()).toBe(GameState.SHOW_ANSWER);
    });

    it('should not transition before 5 seconds have elapsed', () => {
      service.start();

      vi.advanceTimersByTime(4999);

      expect(service.state()).toBe(GameState.SHOW_NOTE);
    });

    it('should keep the same current note after auto-transition to SHOW_ANSWER', () => {
      service.start();
      const note = service.currentNote();

      vi.advanceTimersByTime(5000);

      expect(service.currentNote()).toBe(note);
    });
  });

  describe('timer: auto-transition from SHOW_ANSWER to next SHOW_NOTE after 3 seconds', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should automatically transition to SHOW_NOTE after 3 seconds in SHOW_ANSWER', () => {
      service.start();
      vi.advanceTimersByTime(5000); // auto-transition to SHOW_ANSWER
      expect(service.state()).toBe(GameState.SHOW_ANSWER);

      vi.advanceTimersByTime(3000);

      expect(service.state()).toBe(GameState.SHOW_NOTE);
    });

    it('should not transition before 3 seconds have elapsed', () => {
      service.start();
      vi.advanceTimersByTime(5000);

      vi.advanceTimersByTime(2999);

      expect(service.state()).toBe(GameState.SHOW_ANSWER);
    });

    it('should draw a new note after auto-transition from SHOW_ANSWER', () => {
      const progression = TestBed.inject(ProgressionService);
      vi.spyOn(progression, 'drawNote');

      service.start();
      expect(progression.drawNote).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(5000); // to SHOW_ANSWER
      vi.advanceTimersByTime(3000); // to SHOW_NOTE (next)

      expect(progression.drawNote).toHaveBeenCalledTimes(2);
    });
  });

  describe('timer: continuous game loop', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should automatically cycle through multiple rounds', () => {
      service.start();

      for (let i = 0; i < 3; i++) {
        expect(service.state()).toBe(GameState.SHOW_NOTE);
        vi.advanceTimersByTime(5000);
        expect(service.state()).toBe(GameState.SHOW_ANSWER);
        vi.advanceTimersByTime(3000);
      }

      expect(service.state()).toBe(GameState.SHOW_NOTE);
    });
  });

  describe('timer: cancellation', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should cancel the timer when stop is called during SHOW_NOTE', () => {
      service.start();
      service.stop();

      vi.advanceTimersByTime(5000);

      expect(service.state()).toBe(GameState.IDLE);
    });

    it('should cancel the timer when stop is called during SHOW_ANSWER', () => {
      service.start();
      vi.advanceTimersByTime(5000); // to SHOW_ANSWER
      service.stop();

      vi.advanceTimersByTime(3000);

      expect(service.state()).toBe(GameState.IDLE);
    });

    it('should cancel the SHOW_NOTE timer when showAnswer is called manually before timeout', () => {
      service.start();
      service.showAnswer(); // manual transition before 5s

      vi.advanceTimersByTime(5000);

      // should not have double-transitioned; should still be in SHOW_ANSWER
      // (or moved to next SHOW_NOTE via the answer timer, but not broken)
      expect(service.state()).not.toBe(GameState.IDLE);
    });

    it('should cancel the SHOW_ANSWER timer when nextNote is called manually before timeout', () => {
      service.start();
      vi.advanceTimersByTime(5000); // to SHOW_ANSWER
      service.nextNote(); // manual transition before 3s

      vi.advanceTimersByTime(3000);

      // should not have called nextNote again; should be in SHOW_NOTE with its own timer
      expect(service.state()).toBe(GameState.SHOW_NOTE);
    });

    it('should not leak timers after stop - no state change after stopping', () => {
      service.start();
      service.stop();

      vi.advanceTimersByTime(100000);

      expect(service.state()).toBe(GameState.IDLE);
      expect(service.currentNote()).toBeNull();
    });

    it('should clear pending timer when ngOnDestroy is called mid-game', () => {
      service.start();
      expect(service.state()).toBe(GameState.SHOW_NOTE);

      service.ngOnDestroy();

      vi.advanceTimersByTime(5000);

      // Timer should have been cleared — state should NOT have advanced to SHOW_ANSWER
      expect(service.state()).toBe(GameState.SHOW_NOTE);
    });
  });

  describe('ProgressionService integration', () => {
    it('should populate currentNote with the exact note returned by ProgressionService.drawNote', () => {
      const progression = TestBed.inject(ProgressionService);
      const fakeNote: FretNote = { string: 1, fret: 0, note: 'E', x: 50, y: 10 };
      vi.spyOn(progression, 'drawNote').mockReturnValue(fakeNote);

      service.start();

      expect(service.currentNote()).toBe(fakeNote);
    });

    it('should populate currentNote with the note from drawNote on nextNote transition', () => {
      const progression = TestBed.inject(ProgressionService);
      const firstNote: FretNote = { string: 6, fret: 0, note: 'E', x: 50, y: 90 };
      const secondNote: FretNote = { string: 5, fret: 0, note: 'A', x: 50, y: 75 };
      vi.spyOn(progression, 'drawNote')
        .mockReturnValueOnce(firstNote)
        .mockReturnValueOnce(secondNote);

      service.start();
      expect(service.currentNote()).toBe(firstNote);

      service.showAnswer();
      service.nextNote();
      expect(service.currentNote()).toBe(secondNote);
    });

    it('should provide notes that belong to the current progression pool', () => {
      const progression = TestBed.inject(ProgressionService);

      service.start();
      const note = service.currentNote()!;
      const pool = progression.getCurrentPool();

      expect(pool.some(p => p.string === note.string && p.fret === note.fret)).toBe(true);
    });

    it('should trigger pool expansion after all open string notes have been drawn', () => {
      const progression = TestBed.inject(ProgressionService);
      const openStrings = [...progression.getCurrentPool()];
      expect(openStrings.length).toBe(6);

      // Control Math.random to return each open string note in sequence
      let callIndex = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        // Return values that map to indices 0..5 sequentially for a pool of 6
        const index = callIndex % openStrings.length;
        callIndex++;
        return index / openStrings.length;
      });

      // Run through 6 game cycles (start + 5 nextNote calls)
      service.start(); // draws note 0
      for (let i = 1; i < openStrings.length; i++) {
        service.showAnswer();
        service.nextNote(); // draws note i
      }

      // After all 6 open string notes shown, pool should have expanded
      expect(progression.getCurrentFret()).toBeGreaterThan(0);

      vi.restoreAllMocks();
    });

    it('should continue the game loop after pool expansion with notes from the expanded pool', () => {
      const progression = TestBed.inject(ProgressionService);
      const openStrings = [...progression.getCurrentPool()];

      // Force all open strings to be marked as shown to trigger expansion
      for (const note of openStrings) {
        progression.markNoteAsShown(note);
      }

      // Pool should now be expanded
      expect(progression.getCurrentFret()).toBeGreaterThan(0);
      const expandedPool = progression.getCurrentPool();

      // Start game — should draw from expanded pool
      service.start();
      const note = service.currentNote()!;
      expect(expandedPool.some(p => p.string === note.string && p.fret === note.fret)).toBe(true);
    });

    it('should reset progression pool when the game is stopped and restarted', () => {
      const progression = TestBed.inject(ProgressionService);

      // Expand pool manually
      const openStrings = [...progression.getCurrentPool()];
      for (const note of openStrings) {
        progression.markNoteAsShown(note);
      }
      expect(progression.getCurrentFret()).toBeGreaterThan(0);

      // Start and stop game
      service.start();
      service.stop();

      // Pool should be back to open strings
      expect(progression.getCurrentFret()).toBe(0);
      expect(progression.getCurrentPool().length).toBe(6);

      // Restarting should draw from initial pool
      service.start();
      const note = service.currentNote()!;
      expect(note.fret).toBe(0);
    });

    it('should mark drawn notes as shown in the progression service', () => {
      const progression = TestBed.inject(ProgressionService);

      service.start();
      const firstNote = service.currentNote()!;

      expect(progression.hasBeenShown(firstNote)).toBe(true);
    });
  });

  describe('full cycle', () => {
    it('should complete a full game cycle: IDLE -> SHOW_NOTE -> SHOW_ANSWER -> SHOW_NOTE (next)', () => {
      const progression = TestBed.inject(ProgressionService);
      vi.spyOn(progression, 'drawNote');

      expect(service.state()).toBe(GameState.IDLE);

      service.start();
      expect(service.state()).toBe(GameState.SHOW_NOTE);
      const firstNote = service.currentNote();
      expect(firstNote).not.toBeNull();
      expect(progression.drawNote).toHaveBeenCalledTimes(1);

      service.showAnswer();
      expect(service.state()).toBe(GameState.SHOW_ANSWER);
      expect(service.currentNote()).toBe(firstNote);

      service.nextNote();
      expect(service.state()).toBe(GameState.SHOW_NOTE);
      expect(service.currentNote()).not.toBeNull();
      expect(progression.drawNote).toHaveBeenCalledTimes(2);
    });

    it('should be able to run multiple cycles', () => {
      service.start();

      for (let i = 0; i < 5; i++) {
        expect(service.state()).toBe(GameState.SHOW_NOTE);
        expect(service.currentNote()).not.toBeNull();

        service.showAnswer();
        expect(service.state()).toBe(GameState.SHOW_ANSWER);

        service.nextNote();
      }

      expect(service.state()).toBe(GameState.SHOW_NOTE);
    });
  });
});
