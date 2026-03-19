import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LearnComponent } from './learn';

describe('LearnComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should display a heading mentioning learn', () => {
    const fixture = TestBed.createComponent(LearnComponent);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('[data-testid="learn-section"] h2');
    expect(heading).toBeTruthy();
    expect(heading.textContent.toLowerCase()).toContain('learn');
  });

  it('should display a Fretboard Flash card that links to /learn/fretboard-flash', () => {
    const fixture = TestBed.createComponent(LearnComponent);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('[data-testid="exercise-fretboard-flash"]');
    expect(card).toBeTruthy();
    expect(card.textContent.toLowerCase()).toContain('fretboard flash');

    const link = card.closest('a') || card.querySelector('a');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/learn/fretboard-flash');
  });

  it('should not display a placeholder message about exercises coming soon', () => {
    const fixture = TestBed.createComponent(LearnComponent);
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector('[data-testid="learn-placeholder"]');
    expect(placeholder).toBeNull();
  });

  it('should display a description for the Fretboard Flash exercise', () => {
    const fixture = TestBed.createComponent(LearnComponent);
    fixture.detectChanges();

    const description = fixture.nativeElement.querySelector('[data-testid="exercise-fretboard-flash-description"]');
    expect(description).toBeTruthy();
    expect(description.textContent.length).toBeGreaterThan(0);
  });
});
