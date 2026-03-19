import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../theme';

const LANGUAGES = ['NL', 'DE', 'EN'] as const;

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
  protected readonly activeLanguage = signal<string>('EN');

  selectLanguage(lang: string): void {
    this.activeLanguage.set(lang);
  }
}
