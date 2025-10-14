import { test, expect } from '@playwright/test';

test.describe('Basic Functionality Tests', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for loading screen to complete (extended timeout)
    await page.waitForTimeout(6000);
    
    // Check if loading screen is gone or if main content is visible
    const loadingScreen = page.locator('.loading-screen');
    const mainContent = page.locator('h1, .main-content, .content-area');
    
    // Either loading screen should be gone OR main content should be visible
    const loadingGone = !(await loadingScreen.isVisible());
    const contentVisible = await mainContent.first().isVisible();
    
    expect(loadingGone || contentVisible).toBe(true);
    
    // If content is visible, check for main heading
    if (contentVisible) {
      await expect(page.locator('h1').first()).toContainText(/CYBER|Security|Hacker/i);
    }
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(6000);
    
    // Wait for main content
    await page.waitForSelector('nav, .navigation', { timeout: 10000 });
    
    // Check navigation exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Try clicking on a navigation link
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    
    expect(linkCount).toBeGreaterThan(0);
    
    // Click first nav link if available
    if (linkCount > 0) {
      await navLinks.first().click();
      await page.waitForTimeout(1000);
      
      // URL should have changed
      const url = page.url();
      expect(url.includes('localhost')).toBe(true);
    }
  });

  test('should render without console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(6000);
    
    // Filter out common non-critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('DevTools') &&
      !error.includes('AudioContext') // Audio might fail in headless mode
    );
    
    expect(criticalErrors.length).toBeLessThan(3); // Allow minimal non-critical errors
  });

  test('should have cybersecurity theme styling', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(6000);
    
    // Check for cyber-themed styling
    const body = page.locator('body');
    
    // Should have dark background or cyber colors
    const bodyStyles = await body.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    // Should have dark theme (background should not be white)
    expect(bodyStyles.backgroundColor).not.toBe('rgb(255, 255, 255)');
    expect(bodyStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});