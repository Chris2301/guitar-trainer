import { test, expect } from '@playwright/test';

test.describe('Navigation between Home and Learn', () => {
  test('should show header with navigation links on both pages and navigate between them', async ({ page }) => {
    // Start on the homepage
    await page.goto('/');

    // Header should be visible on the homepage
    const header = page.getByTestId('app-header');
    await expect(header).toBeVisible();

    // Header should contain navigation links to Home and Learn
    const homeLink = header.getByTestId('nav-home');
    const learnLink = header.getByTestId('nav-learn');
    await expect(homeLink).toBeVisible();
    await expect(learnLink).toBeVisible();

    // Navigate to the learn page by clicking the Learn link
    await learnLink.click();
    await expect(page).toHaveURL('/learn');

    // Header should still be visible on the learn page
    await expect(header).toBeVisible();
    await expect(homeLink).toBeVisible();
    await expect(learnLink).toBeVisible();

    // Navigate back to the homepage by clicking the Home link
    await homeLink.click();
    await expect(page).toHaveURL('/');

    // Header should still be visible after navigating back
    await expect(header).toBeVisible();
  });
});
