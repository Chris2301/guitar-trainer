import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-fretboard-display',
  templateUrl: './fretboard-display.html',
  styleUrl: './fretboard-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FretboardDisplayComponent {}
