import { TestBed } from '@angular/core/testing';
import { GameStateService, GameState } from './game-state.service';
import { ProgressionService } from './progression.service';
import { NoteDataService } from './note-data.service';

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
