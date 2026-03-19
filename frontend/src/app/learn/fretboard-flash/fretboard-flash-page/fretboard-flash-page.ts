import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GameState, GameStateService } from '../game-state.service';
import { ProgressionService } from '../progression.service';
import { NoteDataService } from '../note-data.service';
import { FretboardDisplayComponent } from '../fretboard-display/fretboard-display';

@Component({
  selector: 'app-fretboard-flash-page',
  templateUrl: './fretboard-flash-page.html',
  styleUrl: './fretboard-flash-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FretboardDisplayComponent],
  providers: [GameStateService, ProgressionService, NoteDataService],
})
export class FretboardFlashPageComponent {
  private readonly gameState = inject(GameStateService);
  private readonly progression = inject(ProgressionService);

  readonly state = this.gameState.state;
  readonly currentNote = this.gameState.currentNote;
  readonly isIdle = computed(() => this.state() === GameState.IDLE);
  readonly isShowAnswer = computed(() => this.state() === GameState.SHOW_ANSWER);
  readonly fretboardNote = computed(() => this.isShowAnswer() ? this.currentNote() : null);
  readonly currentFret = computed(() => {
    // Re-evaluate whenever the current note changes (each draw triggers a state change)
    this.currentNote();
    return this.progression.getCurrentFret();
  });

  start(): void {
    this.gameState.start();
  }

  stop(): void {
    this.gameState.stop();
  }
}
