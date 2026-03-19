import { ChangeDetectionStrategy, Component, inject, InjectionToken, LOCALE_ID, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../theme';

const LANGUAGES = ['NL', 'DE', 'EN'] as const;
const VALID_LOCALES = ['en', 'nl', 'de'] as const;

const LOCALE_TO_LANGUAGE: Record<string, string> = {
  en: 'EN',
  nl: 'NL',
  de: 'DE',
};

/**
 * Injectable function for navigating to a URL.
 * Abstracted to allow easy testing without jsdom location restrictions.
 */
export type NavigateFn = (url: string) => void;

export const NAVIGATE_FN = new InjectionToken<NavigateFn>('NavigateFn', {
  providedIn: 'root',
  factory: () => {
    const doc = inject(DOCUMENT);
    return (url: string) => {
      const window = doc.defaultView;
      if (window) {
        window.location.href = url;
      }
    };
  },
});

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly isDark = this.themeService.isDarkMode;
  protected readonly languages = LANGUAGES;

  private readonly localeId = inject(LOCALE_ID);
  private readonly document = inject(DOCUMENT);
  private readonly navigate = inject(NAVIGATE_FN);

  protected readonly activeLanguage = signal<string>(
    LOCALE_TO_LANGUAGE[this.localeId] ?? 'EN',
  );

  selectLanguage(lang: string): void {
    const targetLocale = lang.toLowerCase();

    // Validate against known locale set to prevent open redirects
    if (!VALID_LOCALES.includes(targetLocale as typeof VALID_LOCALES[number])) {
      return;
    }

    const currentLocale = this.localeId.toLowerCase();

    if (targetLocale === currentLocale) {
      return;
    }

    const window = this.document.defaultView;
    if (!window) {
      return;
    }

    // Get the current path without the locale prefix
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(en|nl|de)(\/|$)/, '/');
    const newPath = `/${targetLocale}${pathWithoutLocale === '/' ? '/' : pathWithoutLocale}`;

    this.navigate(newPath);
  }
}
