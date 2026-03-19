import { computed, inject, Injectable } from '@angular/core';
import { TUI_DARK_MODE } from '@taiga-ui/core';

/**
 * Clean API surface decoupling consumers from the Taiga UI TUI_DARK_MODE token.
 * Serves as the single extension point for future theme features
 * (e.g., localStorage persistence, system preference detection).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly darkMode = inject(TUI_DARK_MODE);

  readonly isDarkMode = this.darkMode.asReadonly();

  readonly themeName = computed(() => (this.darkMode() ? 'dark' : 'light'));

  toggleTheme(): void {
    this.darkMode.set(!this.darkMode());
  }
}
