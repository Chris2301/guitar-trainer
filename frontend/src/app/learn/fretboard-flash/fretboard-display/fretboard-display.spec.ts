import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FretboardDisplayComponent } from './fretboard-display';
import { FretNote } from '../note-data';

describe('FretboardDisplayComponent', () => {
  let fixture: ComponentFixture<FretboardDisplayComponent>;
  let component: FretboardDisplayComponent;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FretboardDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FretboardDisplayComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
  });

  it('should display the fretboard SVG image with root-relative path', () => {
    fixture.detectChanges();

    const img = nativeElement.querySelector('[data-testid="fretboard-image"]');
    expect(img).toBeTruthy();
    expect(img!.getAttribute('src')).toBe('/images/fretboard.svg');
    expect(img!.getAttribute('alt')).toBeTruthy();
  });

  it('should have a relative-positioned wrapper around the image', () => {
    fixture.detectChanges();

    const wrapper = nativeElement.querySelector('[data-testid="fretboard-wrapper"]');
    expect(wrapper).toBeTruthy();
    expect(wrapper!.classList.contains('fretboard-wrapper')).toBe(true);
  });

  it('should have an overlay container positioned over the image', () => {
    fixture.detectChanges();

    const overlay = nativeElement.querySelector('[data-testid="fretboard-overlay"]');
    expect(overlay).toBeTruthy();
    expect(overlay!.classList.contains('fretboard-overlay')).toBe(true);
  });

  it('should not render a note marker when no note is provided', () => {
    fixture.detectChanges();

    const marker = nativeElement.querySelector('[data-testid="note-marker"]');
    expect(marker).toBeNull();
  });

  it('should render a note marker dot when a note is provided', () => {
    const testNote: FretNote = { string: 1, fret: 3, note: 'G', x: 22, y: 8 };
    fixture.componentRef.setInput('note', testNote);
    fixture.detectChanges();

    const marker = nativeElement.querySelector('[data-testid="note-marker"]');
    expect(marker).toBeTruthy();
  });

  it('should position the note marker at the x/y percentages from the note', () => {
    const testNote: FretNote = { string: 3, fret: 5, note: 'C', x: 36.3, y: 42 };
    fixture.componentRef.setInput('note', testNote);
    fixture.detectChanges();

    const marker = nativeElement.querySelector('[data-testid="note-marker"]') as HTMLElement;
    expect(marker).toBeTruthy();
    expect(marker.style.left).toBe('36.3%');
    expect(marker.style.top).toBe('42%');
  });

  it('should remove the note marker when the note is set to null', () => {
    const testNote: FretNote = { string: 1, fret: 0, note: 'E', x: 1.5, y: 8 };
    fixture.componentRef.setInput('note', testNote);
    fixture.detectChanges();

    expect(nativeElement.querySelector('[data-testid="note-marker"]')).toBeTruthy();

    fixture.componentRef.setInput('note', null);
    fixture.detectChanges();

    expect(nativeElement.querySelector('[data-testid="note-marker"]')).toBeNull();
  });

  it('should update the marker position when the note changes', () => {
    const firstNote: FretNote = { string: 1, fret: 3, note: 'G', x: 22, y: 8 };
    fixture.componentRef.setInput('note', firstNote);
    fixture.detectChanges();

    let marker = nativeElement.querySelector('[data-testid="note-marker"]') as HTMLElement;
    expect(marker.style.left).toBe('22%');
    expect(marker.style.top).toBe('8%');

    const secondNote: FretNote = { string: 6, fret: 10, note: 'D', x: 65.7, y: 92 };
    fixture.componentRef.setInput('note', secondNote);
    fixture.detectChanges();

    marker = nativeElement.querySelector('[data-testid="note-marker"]') as HTMLElement;
    expect(marker.style.left).toBe('65.7%');
    expect(marker.style.top).toBe('92%');
  });

  it('should place the note marker inside the overlay container', () => {
    const testNote: FretNote = { string: 2, fret: 1, note: 'C', x: 9.3, y: 25 };
    fixture.componentRef.setInput('note', testNote);
    fixture.detectChanges();

    const overlay = nativeElement.querySelector('[data-testid="fretboard-overlay"]');
    const marker = overlay!.querySelector('[data-testid="note-marker"]');
    expect(marker).toBeTruthy();
  });

  it('should apply the note-marker class to the marker element', () => {
    const testNote: FretNote = { string: 4, fret: 7, note: 'A', x: 49, y: 58 };
    fixture.componentRef.setInput('note', testNote);
    fixture.detectChanges();

    const marker = nativeElement.querySelector('[data-testid="note-marker"]');
    expect(marker!.classList.contains('note-marker')).toBe(true);
  });

  describe('theme support', () => {
    it('should use CSS custom property for the note marker background color', () => {
      const testNote: FretNote = { string: 1, fret: 3, note: 'G', x: 22, y: 8 };
      fixture.componentRef.setInput('note', testNote);
      fixture.detectChanges();

      // Verify the compiled stylesheet uses var(--gt-accent) for the marker,
      // not a hardcoded hex color like #fd8d32
      const styleSheets = Array.from(nativeElement.ownerDocument.styleSheets);
      const rules: string[] = [];
      for (const sheet of styleSheets) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            if (rule.cssText.includes('note-marker')) {
              rules.push(rule.cssText);
            }
          }
        } catch {
          // cross-origin sheets may throw
        }
      }

      const allRulesText = rules.join(' ');
      expect(allRulesText).toContain('--gt-accent');
      // Must NOT contain the hardcoded orange hex color
      expect(allRulesText).not.toContain('#fd8d32');
    });
  });

  describe('responsive scaling', () => {
    it('should apply the fretboard-image class to the image element', () => {
      fixture.detectChanges();

      const img = nativeElement.querySelector('[data-testid="fretboard-image"]') as HTMLElement;
      expect(img.classList.contains('fretboard-image')).toBe(true);
    });

    it('should use percentage-based width on the note marker for proportional scaling', () => {
      const testNote: FretNote = { string: 3, fret: 5, note: 'C', x: 36.3, y: 42 };
      fixture.componentRef.setInput('note', testNote);
      fixture.detectChanges();

      const marker = nativeElement.querySelector('[data-testid="note-marker"]') as HTMLElement;
      expect(marker.style.width).toBe('2%');
    });

    it('should not set an inline height on the marker so SCSS aspect-ratio controls the shape', () => {
      const testNote: FretNote = { string: 1, fret: 3, note: 'G', x: 22, y: 8 };
      fixture.componentRef.setInput('note', testNote);
      fixture.detectChanges();

      const marker = nativeElement.querySelector('[data-testid="note-marker"]') as HTMLElement;
      // Height is not set inline — the SCSS aspect-ratio: 1 rule ensures a circle
      expect(marker.style.height).toBe('');
    });

    it('should not use fixed pixel dimensions on the note marker', () => {
      const testNote: FretNote = { string: 2, fret: 1, note: 'C', x: 9.3, y: 25 };
      fixture.componentRef.setInput('note', testNote);
      fixture.detectChanges();

      const marker = nativeElement.querySelector('[data-testid="note-marker"]') as HTMLElement;
      // Width should be a percentage, not a pixel value
      expect(marker.style.width).not.toContain('px');
      // Height should not be set (aspect-ratio handles it)
      expect(marker.style.height).toBe('');
    });
  });
});
