import { TestBed } from '@angular/core/testing';
import { WritableSignal, signal } from '@angular/core';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let darkModeSignal: WritableSignal<boolean>;

  beforeEach(() => {
    darkModeSignal = signal(false);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: TUI_DARK_MODE, useValue: darkModeSignal },
      ],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should report light mode when dark mode signal is false', () => {
    expect(service.isDarkMode()).toBe(false);
  });

  it('should report dark mode when dark mode signal is true', () => {
    darkModeSignal.set(true);
    expect(service.isDarkMode()).toBe(true);
  });

  it('should toggle from light to dark', () => {
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(true);
  });

  it('should toggle from dark to light', () => {
    darkModeSignal.set(true);
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(false);
  });

  it('should expose the theme name as a computed signal', () => {
    expect(service.themeName()).toBe('light');
    darkModeSignal.set(true);
    expect(service.themeName()).toBe('dark');
  });
});
