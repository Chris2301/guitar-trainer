import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-learn',
  template: `
    <section class="learn">
      <h2>Learn</h2>
      <p>Training exercises coming soon.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
      max-width: 1140px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnComponent {}
