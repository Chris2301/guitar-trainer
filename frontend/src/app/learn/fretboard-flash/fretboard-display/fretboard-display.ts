import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FretNote } from '../note-data';

@Component({
  selector: 'app-fretboard-display',
  templateUrl: './fretboard-display.html',
  styleUrl: './fretboard-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FretboardDisplayComponent {
  readonly note = input<FretNote | null>(null);
  readonly markerSizePercent = 2;
}
