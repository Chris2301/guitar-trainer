import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display hero, features and CTA linking to learn page', async ({ page }) => {
    await page.goto('/');

    const hero = page.getByTestId('hero-section');
    await expect(hero).toBeVisible();

    // asserts English locale content
    const tagline = hero.getByTestId('hero-tagline');
    await expect(tagline).toBeVisible();
    await expect(tagline).toContainText(/free/i);
    await expect(tagline).toContainText(/guitar/i);

    const features = page.getByTestId('feature-highlights');
    await expect(features).toBeVisible();

    const featureItems = features.getByTestId('feature-item');
    await expect(featureItems).not.toHaveCount(0);

    const cta = page.getByTestId('cta-learn');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(/start learning/i);

    await cta.click();
    await expect(page).toHaveURL('/learn');
  });
});
