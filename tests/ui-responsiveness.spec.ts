import { test, expect } from '@playwright/test';

test.describe('UI Responsiveness Tests', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`should display correctly on ${name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForTimeout(5000);
      await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });

      // Check main content is visible
      await expect(page.locator('h1')).toBeVisible();
      
      // Check navigation is accessible
      const navigation = page.locator('nav');
      await expect(navigation).toBeVisible();
      
      // On mobile, navigation might be collapsed
      if (width < 768) {
        // Look for mobile menu toggle
        const mobileToggle = page.locator('.menu-toggle, .hamburger, .mobile-menu');
        if (await mobileToggle.count() > 0) {
          await expect(mobileToggle.first()).toBeVisible();
        }
      }
      
      // Check content doesn't overflow
      const body = await page.locator('body').boundingBox();
      expect(body?.width).toBeLessThanOrEqual(width + 50); // Allow small tolerance
    });
  });

  test('should handle mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(5000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });

    // Look for mobile menu toggle
    const mobileToggle = page.locator('.menu-toggle, .hamburger, .mobile-menu, .nav-toggle');
    
    if (await mobileToggle.count() > 0) {
      await expect(mobileToggle.first()).toBeVisible();
      
      // Click to open menu
      await mobileToggle.first().click();
      
      // Navigation items should become visible
      const navItems = page.locator('nav a, .nav-item');
      if (await navItems.count() > 0) {
        await expect(navItems.first()).toBeVisible();
      }
    }
  });

  test('should scale 3D background appropriately', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForTimeout(3000);

      // Check that 3D background doesn't cause performance issues
      const backgroundElement = page.locator('.background-animation, .three-canvas, canvas');
      
      if (await backgroundElement.count() > 0) {
        await expect(backgroundElement.first()).toBeVisible();
        
        // Check canvas dimensions don't exceed viewport
        const canvasBox = await backgroundElement.first().boundingBox();
        if (canvasBox) {
          expect(canvasBox.width).toBeLessThanOrEqual(viewport.width + 10);
          expect(canvasBox.height).toBeLessThanOrEqual(viewport.height + 10);
        }
      }
    }
  });

  test('should handle text scaling on different devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(5000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });

    // Check main heading is readable on mobile
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    
    const headingBox = await mainHeading.boundingBox();
    if (headingBox) {
      // Heading should not be too small or too large on mobile
      expect(headingBox.height).toBeGreaterThan(20);
      expect(headingBox.height).toBeLessThan(100);
    }

    // Check content doesn't get cut off
    const contentArea = page.locator('.content-area, main, .page-content');
    if (await contentArea.count() > 0) {
      const contentBox = await contentArea.first().boundingBox();
      if (contentBox) {
        expect(contentBox.width).toBeLessThanOrEqual(375 + 20);
      }
    }
  });

  test('should handle form inputs on touch devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(5000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });

    // Open auth modal if available
    const authButton = page.locator('button, a').filter({ hasText: /login|sign in|auth/i });
    
    if (await authButton.count() > 0) {
      await authButton.first().click();
      
      await page.waitForSelector('.modal, .auth-modal', { timeout: 3000 });
      
      // Check input fields are appropriately sized for touch
      const inputFields = page.locator('input');
      
      if (await inputFields.count() > 0) {
        const inputBox = await inputFields.first().boundingBox();
        if (inputBox) {
          // Input should be tall enough for touch interaction (minimum 44px recommended)
          expect(inputBox.height).toBeGreaterThan(35);
        }
      }
    }
  });

  test('should handle quiz interface on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/awareness');
    await page.waitForTimeout(5000);

    // Start a quiz if available
    const quizModule = page.locator('.module-card, .quiz-module').first();
    
    if (await quizModule.isVisible()) {
      await quizModule.click();
      
      // Check quiz interface is usable on mobile
      const questionElement = page.locator('.question, .quiz-question');
      if (await questionElement.count() > 0) {
        const questionBox = await questionElement.first().boundingBox();
        if (questionBox) {
          // Question should fit within mobile viewport
          expect(questionBox.width).toBeLessThanOrEqual(375 + 20);
        }
      }
      
      // Answer buttons should be touch-friendly
      const answerOptions = page.locator('.answer-option, .option, button');
      if (await answerOptions.count() > 0) {
        const optionBox = await answerOptions.first().boundingBox();
        if (optionBox) {
          expect(optionBox.height).toBeGreaterThan(35);
        }
      }
    }
  });
});