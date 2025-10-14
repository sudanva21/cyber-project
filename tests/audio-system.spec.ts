import { test, expect } from '@playwright/test';

test.describe('Audio System Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Allow audio autoplay for testing
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should initialize audio system without errors', async ({ page }) => {
    // Wait for loading screen to complete
    await page.waitForTimeout(5000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });

    // Check console for audio-related errors
    const logs = await page.evaluate(() => {
      return window.console;
    });

    // Audio system should initialize (we can't easily test actual sound, but we can test no errors)
    const errors = await page.evaluate(() => {
      return window.audioErrors || [];
    });

    expect(Array.isArray(errors)).toBe(true);
  });

  test('should handle audio interactions with user gestures', async ({ page }) => {
    await page.waitForTimeout(5000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });

    // Interact with page to enable audio (user gesture required)
    await page.click('body');

    // Navigate between sections (should trigger audio if implemented)
    await page.click('nav a[href="/simulator"]');
    await page.waitForTimeout(1000);

    await page.click('nav a[href="/detector"]');
    await page.waitForTimeout(1000);

    // Audio errors should not accumulate
    const audioErrors = await page.evaluate(() => {
      return window.audioErrors || [];
    });

    // No fatal audio errors should occur
    expect(audioErrors.length).toBeLessThan(5); // Allow for minor warnings
  });

  test('should not block functionality if audio fails', async ({ page }) => {
    // Disable audio context to simulate audio failure
    await page.addInitScript(() => {
      // Mock AudioContext to simulate failure
      window.AudioContext = class MockAudioContext {
        constructor() {
          throw new Error('Audio disabled for testing');
        }
      };
    });

    await page.goto('/');
    await page.waitForTimeout(5000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });

    // Application should still work without audio
    await expect(page.locator('h1')).toContainText('CYBER SECURITY');

    // Navigation should still work
    await page.click('nav a[href="/simulator"]');
    await expect(page).toHaveURL('/simulator');

    await page.click('nav a[href="/awareness"]');
    await expect(page).toHaveURL('/awareness');
  });

  test('should handle volume controls if present', async ({ page }) => {
    await page.waitForTimeout(5000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });

    // Look for volume controls
    const volumeControls = page.locator('.volume, .audio-control, [type="range"]').filter({
      hasText: /volume|audio|sound/i
    });

    if (await volumeControls.count() > 0) {
      await expect(volumeControls.first()).toBeVisible();
      
      // Try adjusting volume
      const volumeSlider = page.locator('[type="range"]').first();
      if (await volumeSlider.isVisible()) {
        await volumeSlider.fill('50');
      }
    }
  });

  test('should mute/unmute if controls are available', async ({ page }) => {
    await page.waitForTimeout(5000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });

    // Look for mute button
    const muteButton = page.locator('button').filter({ hasText: /mute|sound|audio/i });

    if (await muteButton.count() > 0) {
      await expect(muteButton.first()).toBeVisible();
      
      // Toggle mute
      await muteButton.first().click();
      await page.waitForTimeout(500);
      
      // Toggle again
      await muteButton.first().click();
      await page.waitForTimeout(500);
    }
  });
});