import { TestBed } from '@angular/core/testing';
import { LOCALE_ID, signal } from '@angular/core';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { AppComponent } from './app';
import { appConfig } from './app.config';

describe('i18n Configuration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        ...appConfig.providers,
        { provide: TUI_DARK_MODE, useValue: signal(false) },
      ],
    }).compileComponents();
  });

  it('should provide a LOCALE_ID', () => {
    const localeId = TestBed.inject(LOCALE_ID);
    expect(localeId).toBeTruthy();
  });

  it('should resolve $localize tagged template literals', () => {
    const translated = $localize`:@@test.greeting:Hello`;
    expect(translated).toBe('Hello');
  });

  it('should render the i18n-marked application title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1.textContent).toBe('Guitar Trainer');
  });

  it('should mark the application title as visually hidden for accessibility', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1.visually-hidden');
    expect(h1).toBeTruthy();
  });
});
