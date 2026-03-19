/**
 * i18n E2E tests for language switching.
 *
 * Convention: this file's name must contain "language-switching" so that
 * the "i18n" project in playwright.config.ts picks it up via testMatch.
 * These tests run against the multi-locale static server on port 4201
 * (serve-i18n.mjs), NOT the default dev server on port 4200.
 */
import { test, expect } from '@playwright/test';

test.describe('Language switching shows translations in NL, DE, EN', () => {
  test('should display English text by default and switch to Dutch and German', async ({ page }) => {
    // Start on the English homepage
    await page.goto('/en/');

    // Verify English content is displayed
    const heroTagline = page.getByTestId('hero-tagline');
    await expect(heroTagline).toBeVisible();
    await expect(heroTagline).toContainText('Free, ad-free, gamified guitar training');

    const ctaButton = page.getByTestId('cta-learn');
    await expect(ctaButton).toContainText('Start Learning');

    const navHome = page.getByTestId('nav-home');
    await expect(navHome).toContainText('Home');

    const navLearn = page.getByTestId('nav-learn');
    await expect(navLearn).toContainText('Learn');

    // Switch to Dutch by clicking the NL language option
    const languageSelector = page.getByTestId('language-selector');
    await expect(languageSelector).toBeVisible();

    const nlButton = languageSelector.getByTestId('language-option').filter({ hasText: 'NL' });
    await nlButton.click();

    // Should navigate to the Dutch locale
    await expect(page).toHaveURL(/\/nl\//);

    // Verify Dutch content is displayed
    await expect(page.getByTestId('hero-tagline')).toContainText('Gratis, zonder reclame, gegamificeerde gitaartraining');
    await expect(page.getByTestId('cta-learn')).toContainText('Begin met leren');
    await expect(page.getByTestId('nav-home')).toContainText('Home');
    await expect(page.getByTestId('nav-learn')).toContainText('Leren');

    // Switch to German by clicking the DE language option
    const deButton = page.getByTestId('language-selector').getByTestId('language-option').filter({ hasText: 'DE' });
    await deButton.click();

    // Should navigate to the German locale
    await expect(page).toHaveURL(/\/de\//);

    // Verify German content is displayed
    await expect(page.getByTestId('hero-tagline')).toContainText('Kostenlos, werbefrei, spielerisches Gitarrentraining');
    await expect(page.getByTestId('cta-learn')).toContainText('Jetzt loslegen');
    await expect(page.getByTestId('nav-home')).toContainText('Startseite');
    await expect(page.getByTestId('nav-learn')).toContainText('Lernen');

    // Switch back to English
    const enButton = page.getByTestId('language-selector').getByTestId('language-option').filter({ hasText: 'EN' });
    await enButton.click();

    // Should navigate back to the English locale
    await expect(page).toHaveURL(/\/en\//);

    // Verify English content is restored
    await expect(page.getByTestId('hero-tagline')).toContainText('Free, ad-free, gamified guitar training');
    await expect(page.getByTestId('cta-learn')).toContainText('Start Learning');
  });

  test('should show translated content on the learn page when switching languages', async ({ page }) => {
    // Navigate to the English learn page
    await page.goto('/en/learn');

    const learnHeading = page.getByTestId('learn-heading');
    await expect(learnHeading).toContainText('Learn');

    // Verify the Fretboard Flash exercise card is visible
    const exerciseCard = page.getByTestId('exercise-fretboard-flash');
    await expect(exerciseCard).toBeVisible();

    // Switch to Dutch
    const nlButton = page.getByTestId('language-selector').getByTestId('language-option').filter({ hasText: 'NL' });
    await nlButton.click();

    await expect(page).toHaveURL(/\/nl\/learn/);
    await expect(page.getByTestId('learn-heading')).toContainText('Leren');

    // Switch to German
    const deButton = page.getByTestId('language-selector').getByTestId('language-option').filter({ hasText: 'DE' });
    await deButton.click();

    await expect(page).toHaveURL(/\/de\/learn/);
    await expect(page.getByTestId('learn-heading')).toContainText('Lernen');
  });
});
