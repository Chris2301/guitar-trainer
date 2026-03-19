import { test, expect } from '@playwright/test';

test.describe('Application Smoke Test', () => {
  test('should load the homepage and display the correct page title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('GuitarTrainer');
  });

  test('should render the app root element', async ({ page }) => {
    await page.goto('/');

    const appRoot = page.locator('app-root');
    await expect(appRoot).toBeAttached();
  });

  test('should render the Taiga UI root', async ({ page }) => {
    await page.goto('/');

    const tuiRoot = page.locator('tui-root');
    await expect(tuiRoot).toBeAttached();
  });
});
