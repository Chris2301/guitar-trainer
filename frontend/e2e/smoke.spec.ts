import { test, expect } from '@playwright/test';

test.describe('Application Smoke Test', () => {
  test('should load the homepage and display the correct page title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('GuitarTrainer');
  });
});
