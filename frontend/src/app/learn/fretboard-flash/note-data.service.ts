import { Injectable } from '@angular/core';
import { FretNote, FRET_NOTES } from './note-data';

@Injectable()
export class NoteDataService {
  getNotesInFretRange(minFret: number, maxFret: number): FretNote[] {
    if (minFret > maxFret) {
      return [];
    }
    return FRET_NOTES.filter(note => note.fret >= minFret && note.fret <= maxFret);
  }

  getNotesUpToFret(maxFret: number): FretNote[] {
    return this.getNotesInFretRange(0, maxFret);
  }

  getNotesOnFret(fret: number): FretNote[] {
    return this.getNotesInFretRange(fret, fret);
  }
}
