import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.html',
  styleUrl: './learn.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnComponent {}
