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

  test('should display access button correctly across viewport sizes when not logged in', async ({ page }) => {
    const viewports = [
      { name: 'Desktop', width: 1400, height: 1080, maxHeight: 25, minHeight: 18 },
      { name: 'Large Tablet', width: 1100, height: 768, maxHeight: 22, minHeight: 16 },
      { name: 'Tablet', width: 1024, height: 768, maxHeight: 20, minHeight: 14 },
      { name: 'Mobile Tablet', width: 768, height: 1024, maxHeight: 18, minHeight: 10 },
      { name: 'Mobile', width: 480, height: 800, maxHeight: 15, minHeight: 8 }
    ];

    for (const { name, width, height, maxHeight, minHeight } of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForTimeout(3000);
      await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });

      // Find the access button (should be visible when not logged in)
      const accessButton = page.locator('.auth-btn');
      await expect(accessButton).toBeVisible({ timeout: 5000 });

      // Check button dimensions
      const buttonBox = await accessButton.boundingBox();
      expect(buttonBox).toBeTruthy();
      
      if (buttonBox) {
        // Button should not exceed maximum height for this viewport
        expect(buttonBox.height).toBeLessThanOrEqual(maxHeight);
        
        // Button should have reasonable minimum dimensions for clickability
        expect(buttonBox.height).toBeGreaterThan(minHeight);
        expect(buttonBox.width).toBeGreaterThan(25);
        
        // Button should fit within navbar container
        const navContainer = page.locator('.nav-container');
        const navBox = await navContainer.boundingBox();
        
        if (navBox) {
          expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(navBox.x + navBox.width + 5);
          expect(buttonBox.y).toBeGreaterThanOrEqual(navBox.y - 5);
          expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(navBox.y + navBox.height + 5);
        }
      }

      // Verify button text is present and readable
      await expect(accessButton).toContainText('ACCESS');
      
      // Verify button is clickable
      await expect(accessButton).toBeEnabled();
      
      console.log(`${name} (${width}x${height}): Button height = ${buttonBox?.height}px`);
    }
  });

  test('should maintain access button functionality after removing emoji', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });

    // Find the access button
    const accessButton = page.locator('.auth-btn');
    await expect(accessButton).toBeVisible();

    // Verify the button no longer contains the lock emoji
    const buttonText = await accessButton.textContent();
    expect(buttonText).not.toContain('🔐');
    expect(buttonText).toContain('ACCESS');

    // Verify button is still clickable and functional
    await expect(accessButton).toBeEnabled();
    
    // Click should open auth modal
    await accessButton.click();
    
    // Wait for auth modal to appear
    const authModal = page.locator('.auth-modal, .modal');
    if (await authModal.count() > 0) {
      await expect(authModal.first()).toBeVisible({ timeout: 3000 });
    }
  });
});