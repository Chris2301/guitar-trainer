import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FretboardFlashPageComponent } from './fretboard-flash-page';
import { GameStateService } from '../game-state.service';
import { ProgressionService } from '../progression.service';
import { FretNote } from '../note-data';

describe('FretboardFlashPageComponent', () => {
  let fixture: ComponentFixture<FretboardFlashPageComponent>;
  let nativeElement: HTMLElement;
  let gameStateService: GameStateService;
  let progressionService: ProgressionService;

  const testNote: FretNote = { string: 1, fret: 3, note: 'G', x: 22, y: 8 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FretboardFlashPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FretboardFlashPageComponent);
    nativeElement = fixture.nativeElement;
    // Services are component-provided, so retrieve from the component's injector
    gameStateService = fixture.debugElement.injector.get(GameStateService);
    progressionService = fixture.debugElement.injector.get(ProgressionService);
  });

  describe('idle state', () => {
    it('should display a start button when the game is idle', () => {
      fixture.detectChanges();

      const startButton = nativeElement.querySelector('[data-testid="start-button"]');
      expect(startButton).toBeTruthy();
    });

    it('should not display a stop button when the game is idle', () => {
      fixture.detectChanges();

      const stopButton = nativeElement.querySelector('[data-testid="stop-button"]');
      expect(stopButton).toBeNull();
    });

    it('should not display a note letter when the game is idle', () => {
      fixture.detectChanges();

      const noteDisplay = nativeElement.querySelector('[data-testid="note-display"]');
      expect(noteDisplay).toBeNull();
    });

    it('should display the fretboard component even when idle', () => {
      fixture.detectChanges();

      const fretboard = nativeElement.querySelector('app-fretboard-display');
      expect(fretboard).toBeTruthy();
    });
  });

  describe('start button', () => {
    it('should start the game when the start button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(gameStateService, 'start');

      const startButton = nativeElement.querySelector('[data-testid="start-button"]') as HTMLElement;
      startButton.click();

      expect(gameStateService.start).toHaveBeenCalled();
    });
  });

  describe('SHOW_NOTE state', () => {
    beforeEach(() => {
      vi.spyOn(progressionService, 'drawNote').mockReturnValue(testNote);
      gameStateService.start();
      fixture.detectChanges();
    });

    it('should display the current note letter prominently', () => {
      const noteDisplay = nativeElement.querySelector('[data-testid="note-display"]');
      expect(noteDisplay).toBeTruthy();
      expect(noteDisplay!.textContent!.trim()).toBe('G');
    });

    it('should not pass the note to the fretboard display during SHOW_NOTE', () => {
      const fretboard = nativeElement.querySelector('app-fretboard-display');
      expect(fretboard).toBeTruthy();
      const marker = fretboard!.querySelector('[data-testid="note-marker"]');
      expect(marker).toBeNull();
    });

    it('should display a stop button instead of start', () => {
      const startButton = nativeElement.querySelector('[data-testid="start-button"]');
      const stopButton = nativeElement.querySelector('[data-testid="stop-button"]');
      expect(startButton).toBeNull();
      expect(stopButton).toBeTruthy();
    });
  });

  describe('SHOW_ANSWER state', () => {
    beforeEach(() => {
      vi.spyOn(progressionService, 'drawNote').mockReturnValue(testNote);
      gameStateService.start();
      gameStateService.showAnswer();
      fixture.detectChanges();
    });

    it('should still display the note letter during SHOW_ANSWER', () => {
      const noteDisplay = nativeElement.querySelector('[data-testid="note-display"]');
      expect(noteDisplay).toBeTruthy();
      expect(noteDisplay!.textContent!.trim()).toBe('G');
    });

    it('should pass the note to the fretboard display so the marker is shown', () => {
      const marker = nativeElement.querySelector('[data-testid="note-marker"]');
      expect(marker).toBeTruthy();
    });

    it('should display a stop button during SHOW_ANSWER', () => {
      const stopButton = nativeElement.querySelector('[data-testid="stop-button"]');
      expect(stopButton).toBeTruthy();
    });
  });

  describe('stop button', () => {
    it('should stop the game when the stop button is clicked', () => {
      vi.spyOn(progressionService, 'drawNote').mockReturnValue(testNote);
      gameStateService.start();
      fixture.detectChanges();

      vi.spyOn(gameStateService, 'stop');
      const stopButton = nativeElement.querySelector('[data-testid="stop-button"]') as HTMLElement;
      stopButton.click();

      expect(gameStateService.stop).toHaveBeenCalled();
    });

    it('should return to idle state after stopping', () => {
      vi.spyOn(progressionService, 'drawNote').mockReturnValue(testNote);
      gameStateService.start();
      fixture.detectChanges();

      gameStateService.stop();
      fixture.detectChanges();

      const startButton = nativeElement.querySelector('[data-testid="start-button"]');
      const noteDisplay = nativeElement.querySelector('[data-testid="note-display"]');
      expect(startButton).toBeTruthy();
      expect(noteDisplay).toBeNull();
    });
  });

  describe('game page layout', () => {
    it('should always render a note area container so layout does not shift when game starts', () => {
      fixture.detectChanges();

      const noteArea = nativeElement.querySelector('[data-testid="note-area"]');
      expect(noteArea).toBeTruthy();
    });

    it('should render the note area before the fretboard in DOM order', () => {
      fixture.detectChanges();

      const noteArea = nativeElement.querySelector('[data-testid="note-area"]');
      const fretboard = nativeElement.querySelector('app-fretboard-display');
      expect(noteArea).toBeTruthy();
      expect(fretboard).toBeTruthy();

      // note-area should come before the fretboard in the DOM
      const position = noteArea!.compareDocumentPosition(fretboard!);
      expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('should render game controls after the fretboard in DOM order', () => {
      fixture.detectChanges();

      const fretboard = nativeElement.querySelector('app-fretboard-display');
      const controls = nativeElement.querySelector('[data-testid="game-controls"]');
      expect(fretboard).toBeTruthy();
      expect(controls).toBeTruthy();

      const position = fretboard!.compareDocumentPosition(controls!);
      expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('should show the note letter inside the note area when game is running', () => {
      vi.spyOn(progressionService, 'drawNote').mockReturnValue(testNote);
      gameStateService.start();
      fixture.detectChanges();

      const noteArea = nativeElement.querySelector('[data-testid="note-area"]');
      const noteDisplay = noteArea!.querySelector('[data-testid="note-display"]');
      expect(noteDisplay).toBeTruthy();
      expect(noteDisplay!.textContent!.trim()).toBe('G');
    });

    it('should show an empty note area when game is idle', () => {
      fixture.detectChanges();

      const noteArea = nativeElement.querySelector('[data-testid="note-area"]');
      expect(noteArea).toBeTruthy();
      const noteDisplay = noteArea!.querySelector('[data-testid="note-display"]');
      expect(noteDisplay).toBeNull();
    });
  });

  describe('note display updates', () => {
    it('should update the displayed note letter when the current note changes', () => {
      const firstNote: FretNote = { string: 6, fret: 0, note: 'E', x: 1.5, y: 92 };
      const secondNote: FretNote = { string: 5, fret: 0, note: 'A', x: 1.5, y: 75 };
      vi.spyOn(progressionService, 'drawNote')
        .mockReturnValueOnce(firstNote)
        .mockReturnValueOnce(secondNote);

      gameStateService.start();
      fixture.detectChanges();
      expect(nativeElement.querySelector('[data-testid="note-display"]')!.textContent!.trim()).toBe('E');

      gameStateService.showAnswer();
      gameStateService.nextNote();
      fixture.detectChanges();
      expect(nativeElement.querySelector('[data-testid="note-display"]')!.textContent!.trim()).toBe('A');
    });
  });
});
