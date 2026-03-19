import { test, expect } from '@playwright/test';

test.describe('Learn Page', () => {
  test('should display placeholder content indicating training exercises coming soon', async ({ page }) => {
    await page.goto('/learn');

    const learnSection = page.getByTestId('learn-section');
    await expect(learnSection).toBeVisible();

    const heading = learnSection.locator('h2');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/learn/i);

    const placeholder = learnSection.getByTestId('learn-placeholder');
    await expect(placeholder).toBeVisible();
    await expect(placeholder).toContainText(/training exercises/i);
  });
});
