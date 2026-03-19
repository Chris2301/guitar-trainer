import { TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { AppComponent } from '../app';
import { appConfig } from '../app.config';

describe('Theme Integration', () => {
  let darkModeSignal: WritableSignal<boolean>;

  beforeEach(async () => {
    darkModeSignal = signal(false);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        ...appConfig.providers,
        { provide: TUI_DARK_MODE, useValue: darkModeSignal },
      ],
    }).compileComponents();
  });

  it('should set tuiTheme attribute on tui-root based on dark mode signal', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const tuiRoot = fixture.nativeElement.querySelector('tui-root');
    expect(tuiRoot.getAttribute('tuiTheme')).toBe('light');
  });

  it('should switch tuiTheme to dark when dark mode signal is true', () => {
    darkModeSignal.set(true);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const tuiRoot = fixture.nativeElement.querySelector('tui-root');
    expect(tuiRoot.getAttribute('tuiTheme')).toBe('dark');
  });
});
