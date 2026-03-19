import { TestBed } from '@angular/core/testing';
import { FretboardDisplayComponent } from './fretboard-display';

describe('FretboardDisplayComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FretboardDisplayComponent],
    }).compileComponents();
  });

  it('should display the fretboard SVG image', () => {
    const fixture = TestBed.createComponent(FretboardDisplayComponent);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('[data-testid="fretboard-image"]');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('images/fretboard.svg');
    expect(img.getAttribute('alt')).toBeTruthy();
  });

  it('should wrap the image in a relative-positioned container', () => {
    const fixture = TestBed.createComponent(FretboardDisplayComponent);
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('[data-testid="fretboard-wrapper"]');
    expect(wrapper).toBeTruthy();
    const styles = getComputedStyle(wrapper);
    expect(styles.position).toBe('relative');
  });

  it('should provide an overlay container positioned absolutely over the image', () => {
    const fixture = TestBed.createComponent(FretboardDisplayComponent);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('[data-testid="fretboard-overlay"]');
    expect(overlay).toBeTruthy();
    const styles = getComputedStyle(overlay);
    expect(styles.position).toBe('absolute');
    expect(styles.top).toBe('0px');
    expect(styles.left).toBe('0px');
    expect(styles.width).toBe('100%');
    expect(styles.height).toBe('100%');
  });

  it('should make the fretboard image fill the full width of the wrapper', () => {
    const fixture = TestBed.createComponent(FretboardDisplayComponent);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('[data-testid="fretboard-image"]');
    expect(img).toBeTruthy();
    const styles = getComputedStyle(img);
    expect(styles.width).toBe('100%');
    expect(styles.display).toBe('block');
  });
});
