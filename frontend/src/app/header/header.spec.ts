import { TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { HeaderComponent } from './header';
import { ThemeService } from '../theme';

describe('HeaderComponent', () => {
  let darkModeSignal: WritableSignal<boolean>;

  beforeEach(async () => {
    darkModeSignal = signal(false);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: TUI_DARK_MODE, useValue: darkModeSignal },
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

    const labels = Array.from(options).map((o: any) => o.textContent.trim());
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

  it('should update active language when a language button is clicked', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll(
      '[data-testid="language-option"]',
    );
    const nlButton = Array.from(options).find(
      (o: any) => o.textContent.trim() === 'NL',
    ) as HTMLButtonElement;

    nlButton.click();
    fixture.detectChanges();

    const activeOption = fixture.nativeElement.querySelector(
      '[data-testid="language-option"].active',
    );
    expect(activeOption).toBeTruthy();
    expect(activeOption.textContent.trim()).toBe('NL');
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
});
