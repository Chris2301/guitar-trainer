import { test, expect } from '@playwright/test';

test.describe('Learn Page', () => {
  test('should display exercises and allow navigation to Fretboard Flash', async ({ page }) => {
    await page.goto('/learn');

    const learnSection = page.getByTestId('learn-section');
    await expect(learnSection).toBeVisible();

    const heading = learnSection.locator('h2');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/learn/i);

    // Fretboard Flash card should be visible with title and description
    const fretboardFlashCard = page.getByTestId('exercise-fretboard-flash');
    await expect(fretboardFlashCard).toBeVisible();
    await expect(fretboardFlashCard).toContainText(/fretboard flash/i);

    const description = page.getByTestId('exercise-fretboard-flash-description');
    await expect(description).toBeVisible();

    // Clicking the card navigates to /learn/fretboard-flash
    await fretboardFlashCard.click();
    await expect(page).toHaveURL(/\/learn\/fretboard-flash/);
  });
});
