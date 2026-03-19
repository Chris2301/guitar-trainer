import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { FretNote } from './note-data';
import { ProgressionService } from './progression.service';

export enum GameState {
  IDLE = 'IDLE',
  SHOW_NOTE = 'SHOW_NOTE',
  SHOW_ANSWER = 'SHOW_ANSWER',
}

export const SHOW_NOTE_DURATION_MS = 5000;
export const SHOW_ANSWER_DURATION_MS = 3000;

@Injectable()
export class GameStateService implements OnDestroy {
  private readonly progression = inject(ProgressionService);

  private readonly _state = signal<GameState>(GameState.IDLE);
  private readonly _currentNote = signal<FretNote | null>(null);
  private timerId: ReturnType<typeof setTimeout> | null = null;

  readonly state = this._state.asReadonly();
  readonly currentNote = this._currentNote.asReadonly();

  start(): void {
    if (this._state() !== GameState.IDLE) {
      return;
    }
    this._currentNote.set(this.progression.drawNote());
    this._state.set(GameState.SHOW_NOTE);
    this.startTimer(SHOW_NOTE_DURATION_MS, () => this.showAnswer());
  }

  showAnswer(): void {
    if (this._state() !== GameState.SHOW_NOTE) {
      return;
    }
    this.clearTimer();
    this._state.set(GameState.SHOW_ANSWER);
    this.startTimer(SHOW_ANSWER_DURATION_MS, () => this.nextNote());
  }

  nextNote(): void {
    if (this._state() !== GameState.SHOW_ANSWER) {
      return;
    }
    this.clearTimer();
    this._currentNote.set(this.progression.drawNote());
    this._state.set(GameState.SHOW_NOTE);
    this.startTimer(SHOW_NOTE_DURATION_MS, () => this.showAnswer());
  }

  stop(): void {
    this.clearTimer();
    this._currentNote.set(null);
    this._state.set(GameState.IDLE);
    this.progression.reset();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private startTimer(durationMs: number, callback: () => void): void {
    this.clearTimer();
    this.timerId = setTimeout(callback, durationMs);
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
