import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for the loading screen to complete
    await page.goto('/');
    await page.waitForTimeout(5000); // Wait for loading screen animation
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });
  });

  test('should navigate between main sections correctly', async ({ page }) => {
    // Test homepage is initially loaded
    await expect(page.locator('h1')).toContainText(/CYBER|SECURITY|DEFENSE/i);
    await expect(page).toHaveURL('/');

    // Navigate to Attack Simulator
    await page.click('nav a[href="/simulator"]');
    await expect(page).toHaveURL('/simulator');
    await expect(page.locator('h1, h2')).toContainText(/Attack Simulator|Cyber Attack/i);

    // Navigate to Threat Detector
    await page.click('nav a[href="/detector"]');
    await expect(page).toHaveURL('/detector');
    await expect(page.locator('h1, h2')).toContainText(/Threat Detector|AI.*Detection/i);

    // Navigate to Training/Awareness
    await page.click('nav a[href="/awareness"]');
    await expect(page).toHaveURL('/awareness');
    await expect(page.locator('h1, h2')).toContainText(/Training|Awareness|Cyber.*Security/i);

    // Navigate to Dashboard (if accessible without auth)
    await page.click('nav a[href="/dashboard"]');
    await expect(page).toHaveURL('/dashboard');

    // Navigate back to Home
    await page.click('nav a[href="/"]');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText(/CYBER|SECURITY|DEFENSE/i);
  });

  test('should show active navigation states', async ({ page }) => {
    // Check home is active initially
    const homeNav = page.locator('nav a[href="/"]');
    await expect(homeNav).toHaveClass(/active/);

    // Navigate and check active state changes
    await page.click('nav a[href="/simulator"]');
    const simulatorNav = page.locator('nav a[href="/simulator"]');
    await expect(simulatorNav).toHaveClass(/active/);
    await expect(homeNav).not.toHaveClass(/active/);
  });

  test('should handle navigation with keyboard', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Test Enter key navigation
    await page.focus('nav a[href="/simulator"]');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/simulator');
  });
});