import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { provideRouter } from '@angular/router';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should display a hero tagline mentioning free guitar training', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const tagline = fixture.nativeElement.querySelector('[data-testid="hero-tagline"]');
    expect(tagline).toBeTruthy();
    const text = tagline.textContent.toLowerCase();
    expect(text).toContain('free');
    expect(text).toContain('guitar');
  });

  it('should display four feature highlights covering fretboard, quiz, warm-up and progression', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('[data-testid="feature-item"]');
    expect(items.length).toBe(4);

    const allText = Array.from(items)
      .map((el: any) => el.textContent.toLowerCase())
      .join(' ');

    expect(allText).toContain('fretboard');
    expect(allText).toContain('quiz');
    expect(allText).toContain('warm-up');
    expect(allText).toContain('progress');
  });

  it('should display a title and description for each feature highlight', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('[data-testid="feature-item"]');

    items.forEach((item: HTMLElement) => {
      const title = item.querySelector('.features__title');
      const description = item.querySelector('.features__description');
      expect(title).toBeTruthy();
      expect(title!.textContent!.trim().length).toBeGreaterThan(0);
      expect(description).toBeTruthy();
      expect(description!.textContent!.trim().length).toBeGreaterThan(0);
    });
  });

  it('should have a CTA link to /learn with "Start Learning" text', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const cta = fixture.nativeElement.querySelector('[data-testid="cta-learn"]');
    expect(cta).toBeTruthy();
    expect(cta.textContent.toLowerCase()).toContain('start learning');
    expect(cta.getAttribute('routerLink')).toBe('/learn');
  });
});
