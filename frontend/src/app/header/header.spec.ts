import { TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { HeaderComponent, NAVIGATE_FN, NavigateFn } from './header';
import { ThemeService } from '../theme';
import { vi } from 'vitest';

describe('HeaderComponent', () => {
  let darkModeSignal: WritableSignal<boolean>;
  let navigateSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    darkModeSignal = signal(false);
    navigateSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: TUI_DARK_MODE, useValue: darkModeSignal },
        { provide: NAVIGATE_FN, useValue: navigateSpy },
      ],
    }).compileComponents();
  });

  it('should render a header element with the app-header test id', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('[data-testid="app-header"]');
    expect(header).toBeTruthy();
  });

  it('should render a Home navigation link', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const homeLink = fixture.nativeElement.querySelector('[data-testid="nav-home"]');
    expect(homeLink).toBeTruthy();
    expect(homeLink.textContent.trim()).toBe('Home');
  });

  it('should render a Learn navigation link', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const learnLink = fixture.nativeElement.querySelector('[data-testid="nav-learn"]');
    expect(learnLink).toBeTruthy();
    expect(learnLink.textContent.trim()).toBe('Learn');
  });

  it('should render a theme toggle button', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('[data-testid="theme-toggle"]');
    expect(toggle).toBeTruthy();
  });

  it('should toggle theme when theme toggle button is clicked', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const themeService = TestBed.inject(ThemeService);
    expect(themeService.isDarkMode()).toBe(false);

    const toggle = fixture.nativeElement.querySelector('[data-testid="theme-toggle"]');
    toggle.click();
    fixture.detectChanges();

    expect(themeService.isDarkMode()).toBe(true);
  });

  it('should render a language selector with NL, DE, EN options', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const langSelector = fixture.nativeElement.querySelector(
      '[data-testid="language-selector"]',
    );
    expect(langSelector).toBeTruthy();

    const options = fixture.nativeElement.querySelectorAll(
      '[data-testid="language-option"]',
    );
    expect(options.length).toBe(3);

    const labels = Array.from<Element>(options).map((o) => o.textContent!.trim());
    expect(labels).toContain('NL');
    expect(labels).toContain('DE');
    expect(labels).toContain('EN');
  });

  it('should highlight EN as the active language by default', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const activeOption = fixture.nativeElement.querySelector(
      '[data-testid="language-option"].active',
    );
    expect(activeOption).toBeTruthy();
    expect(activeOption.textContent.trim()).toBe('EN');
  });

  it('should navigate to the locale URL when a different language is clicked', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll(
      '[data-testid="language-option"]',
    );
    const nlButton = Array.from<Element>(options).find(
      (o) => o.textContent!.trim() === 'NL',
    ) as HTMLButtonElement;

    nlButton.click();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith('/nl/');
  });

  it('should not navigate when the already active language is clicked', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll(
      '[data-testid="language-option"]',
    );
    const enButton = Array.from<Element>(options).find(
      (o) => o.textContent!.trim() === 'EN',
    ) as HTMLButtonElement;

    enButton.click();
    fixture.detectChanges();

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should link Home to the root route', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const homeLink = fixture.nativeElement.querySelector('[data-testid="nav-home"]');
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('should link Learn to the /learn route', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const learnLink = fixture.nativeElement.querySelector('[data-testid="nav-learn"]');
    expect(learnLink.getAttribute('href')).toBe('/learn');
  });

  it('should show translatable aria-label "Switch to dark theme" when light mode is active', () => {
    darkModeSignal.set(false);
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('[data-testid="theme-toggle"]');
    expect(toggle.getAttribute('aria-label')).toBe('Switch to dark theme');
  });

  it('should show translatable aria-label "Switch to light theme" when dark mode is active', () => {
    darkModeSignal.set(true);
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('[data-testid="theme-toggle"]');
    expect(toggle.getAttribute('aria-label')).toBe('Switch to light theme');
  });
});
