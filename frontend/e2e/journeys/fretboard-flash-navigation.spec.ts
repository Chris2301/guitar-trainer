import { test, expect } from '@playwright/test';

test.describe('User navigates from Learn page to Fretboard Flash', () => {
  test('should see Fretboard Flash card on Learn page, click it, and arrive at the game page', async ({ page }) => {
    // User starts at the Learn page
    await page.goto('/learn');

    // User sees the Learn section with exercises
    const learnSection = page.getByTestId('learn-section');
    await expect(learnSection).toBeVisible();

    // User sees the Fretboard Flash exercise card with title and description
    const fretboardFlashCard = page.getByTestId('exercise-fretboard-flash');
    await expect(fretboardFlashCard).toBeVisible();
    await expect(fretboardFlashCard).toContainText(/fretboard flash/i);

    const description = page.getByTestId('exercise-fretboard-flash-description');
    await expect(description).toBeVisible();

    // User clicks the Fretboard Flash card to navigate to the game
    await fretboardFlashCard.click();
    await expect(page).toHaveURL(/\/learn\/fretboard-flash/);

    // User sees the Fretboard Flash game page sentinel element
    const gamePage = page.getByTestId('fretboard-flash-page');
    await expect(gamePage).toBeVisible();
  });
});
