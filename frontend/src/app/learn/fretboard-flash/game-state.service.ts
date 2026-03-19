import { inject, Injectable, signal } from '@angular/core';
import { FretNote } from './note-data';
import { ProgressionService } from './progression.service';

export enum GameState {
  IDLE = 'IDLE',
  SHOW_NOTE = 'SHOW_NOTE',
  SHOW_ANSWER = 'SHOW_ANSWER',
}

@Injectable()
export class GameStateService {
  private readonly progression = inject(ProgressionService);

  private readonly _state = signal<GameState>(GameState.IDLE);
  private readonly _currentNote = signal<FretNote | null>(null);

  readonly state = this._state.asReadonly();
  readonly currentNote = this._currentNote.asReadonly();

  start(): void {
    if (this._state() !== GameState.IDLE) {
      return;
    }
    this._currentNote.set(this.progression.drawNote());
    this._state.set(GameState.SHOW_NOTE);
  }

  showAnswer(): void {
    if (this._state() !== GameState.SHOW_NOTE) {
      return;
    }
    this._state.set(GameState.SHOW_ANSWER);
  }

  nextNote(): void {
    if (this._state() !== GameState.SHOW_ANSWER) {
      return;
    }
    this._currentNote.set(this.progression.drawNote());
    this._state.set(GameState.SHOW_NOTE);
  }

  stop(): void {
    this._currentNote.set(null);
    this._state.set(GameState.IDLE);
    this.progression.reset();
  }
}
