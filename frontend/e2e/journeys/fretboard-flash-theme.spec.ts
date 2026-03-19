import { test, expect } from '@playwright/test';

test.describe('Fretboard Flash game renders correctly in both light and dark themes', () => {
  test('should display the game page with theme-aware colors in light mode', async ({ page }) => {
    await page.goto('/learn/fretboard-flash');

    const gamePage = page.getByTestId('fretboard-flash-page');
    await expect(gamePage).toBeVisible();

    // The page background should use the light theme surface color
    const bgColor = await gamePage.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    // Light theme --gt-surface is #ffffff (white)
    expect(bgColor).toBe('rgb(255, 255, 255)');

    // The start button should be visible and styled with the accent color
    const startButton = page.getByTestId('start-button');
    await expect(startButton).toBeVisible();
    const buttonBg = await startButton.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    // --gt-accent is #fd8d32 = rgb(253, 141, 50)
    expect(buttonBg).toBe('rgb(253, 141, 50)');
  });

  test('should display the game page with theme-aware colors in dark mode', async ({ page }) => {
    await page.goto('/learn/fretboard-flash');

    // Switch to dark mode
    const themeToggle = page.getByTestId('theme-toggle');
    await themeToggle.click();

    const tuiRoot = page.locator('tui-root');
    await expect(tuiRoot).toHaveAttribute('tuitheme', 'dark');

    const gamePage = page.getByTestId('fretboard-flash-page');
    await expect(gamePage).toBeVisible();

    // The page background should use the dark theme surface color
    const bgColor = await gamePage.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    // Dark theme --gt-surface is #052740 = rgb(5, 39, 64)
    expect(bgColor).toBe('rgb(5, 39, 64)');

    // The start button should still use the accent color
    const startButton = page.getByTestId('start-button');
    await expect(startButton).toBeVisible();
    const buttonBg = await startButton.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    // --gt-accent is the same in both themes: #fd8d32 = rgb(253, 141, 50)
    expect(buttonBg).toBe('rgb(253, 141, 50)');
  });

  test('should display note and marker with theme-aware colors during gameplay', async ({ page }) => {
    await page.goto('/learn/fretboard-flash');

    // Start the game
    const startButton = page.getByTestId('start-button');
    await startButton.click();

    // Note display should be visible with accent color
    const noteDisplay = page.getByTestId('note-display');
    await expect(noteDisplay).toBeVisible();

    const noteColor = await noteDisplay.evaluate(
      (el) => getComputedStyle(el).color,
    );
    // Note display uses --gt-accent: #fd8d32 = rgb(253, 141, 50)
    expect(noteColor).toBe('rgb(253, 141, 50)');

    // Switch to dark mode while game is running
    const themeToggle = page.getByTestId('theme-toggle');
    await themeToggle.click();

    // Note should still be visible and styled
    await expect(noteDisplay).toBeVisible();

    const darkNoteColor = await noteDisplay.evaluate(
      (el) => getComputedStyle(el).color,
    );
    // --gt-accent is the same in dark mode
    expect(darkNoteColor).toBe('rgb(253, 141, 50)');

    // Page background should have changed to dark
    const gamePage = page.getByTestId('fretboard-flash-page');
    const darkBg = await gamePage.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    expect(darkBg).toBe('rgb(5, 39, 64)');
  });
});
