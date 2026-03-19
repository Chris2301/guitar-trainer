import { inject, Injectable } from '@angular/core';
import { FretNote } from './note-data';
import { NoteDataService } from './note-data.service';

const MAX_FRET = 15;

@Injectable()
export class ProgressionService {
  private readonly noteDataService = inject(NoteDataService);

  private currentFret = 0;
  private pool: FretNote[] = [];
  private shownNoteKeys = new Set<string>();

  constructor() {
    this.pool = this.noteDataService.getNotesOnFret(0);
  }

  getCurrentPool(): FretNote[] {
    return this.pool;
  }

  getCurrentFret(): number {
    return this.currentFret;
  }

  getShownNoteCount(): number {
    return this.shownNoteKeys.size;
  }

  drawNote(): FretNote {
    if (this.pool.length === 0) {
      throw new Error('ProgressionService: pool is empty — cannot draw note');
    }
    const index = Math.floor(Math.random() * this.pool.length);
    const note = this.pool[index];
    this.markNoteAsShown(note);
    return note;
  }

  hasBeenShown(note: FretNote): boolean {
    return this.shownNoteKeys.has(this.noteKey(note));
  }

  markNoteAsShown(note: FretNote): void {
    this.shownNoteKeys.add(this.noteKey(note));

    if (this.shownNoteKeys.size >= this.pool.length) {
      this.expandPool();
    }
  }

  reset(): void {
    this.currentFret = 0;
    this.pool = this.noteDataService.getNotesOnFret(0);
    this.shownNoteKeys.clear();
  }

  private expandPool(): void {
    let nextFret = this.currentFret + 1;

    while (nextFret <= MAX_FRET) {
      const newNotes = this.noteDataService.getNotesOnFret(nextFret);
      if (newNotes.length > 0) {
        this.currentFret = nextFret;
        this.pool = this.noteDataService.getNotesUpToFret(nextFret);
        this.shownNoteKeys.clear();
        return;
      }
      nextFret++;
    }

    // Already at max — reset shown tracking so the game continues cycling
    this.shownNoteKeys.clear();
  }

  private noteKey(note: FretNote): string {
    return `${note.string}-${note.fret}`;
  }
}
