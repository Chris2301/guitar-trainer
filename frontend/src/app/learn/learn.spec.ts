import { TestBed } from '@angular/core/testing';
import { LearnComponent } from './learn';

describe('LearnComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnComponent],
    }).compileComponents();
  });

  it('should display a heading mentioning learn', () => {
    const fixture = TestBed.createComponent(LearnComponent);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('[data-testid="learn-section"] h2');
    expect(heading).toBeTruthy();
    expect(heading.textContent.toLowerCase()).toContain('learn');
  });

  it('should display placeholder text mentioning training exercises', () => {
    const fixture = TestBed.createComponent(LearnComponent);
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector('[data-testid="learn-placeholder"]');
    expect(placeholder).toBeTruthy();
    expect(placeholder.textContent.toLowerCase()).toContain('training exercises');
  });
});
