import { test, expect } from '@playwright/test';

test.describe('Theme toggle switches between light and dark', () => {
  test('should start in light mode and switch to dark mode on toggle click', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).toBeVisible();

    // Default theme should be light
    const tuiRoot = page.locator('tui-root');
    await expect(tuiRoot).toHaveAttribute('tuitheme', 'light');

    // The toggle should offer to switch to dark
    await expect(themeToggle).toHaveAttribute('aria-label', 'Switch to dark theme');

    // Click the toggle to switch to dark theme
    await themeToggle.click();

    // Theme should now be dark
    await expect(tuiRoot).toHaveAttribute('tuitheme', 'dark');
    await expect(themeToggle).toHaveAttribute('aria-label', 'Switch to light theme');

    // Click again to switch back to light theme
    await themeToggle.click();

    // Theme should be light again
    await expect(tuiRoot).toHaveAttribute('tuitheme', 'light');
    await expect(themeToggle).toHaveAttribute('aria-label', 'Switch to dark theme');
  });

  test('should visually change CSS custom properties when toggling theme', async ({ page }) => {
    await page.goto('/');

    const tuiRoot = page.locator('tui-root');
    const themeToggle = page.getByTestId('theme-toggle');

    // Capture a theme-dependent CSS custom property in light mode
    const lightText = await tuiRoot.evaluate(
      (el) => getComputedStyle(el).getPropertyValue('--gt-text').trim(),
    );

    // Switch to dark mode
    await themeToggle.click();

    // Capture the same property in dark mode
    const darkText = await tuiRoot.evaluate(
      (el) => getComputedStyle(el).getPropertyValue('--gt-text').trim(),
    );

    // The text color variable must differ between themes
    expect(lightText).not.toEqual(darkText);
  });
});
