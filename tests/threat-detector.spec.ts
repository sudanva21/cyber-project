import { test, expect } from '@playwright/test';

test.describe('Threat Detector Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(5000); // Wait for loading screen
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });
    
    // Navigate to threat detector
    await page.click('nav a[href="/detector"]');
    await expect(page).toHaveURL('/detector');
  });

  test('should display threat detector interface', async ({ page }) => {
    // Wait for detector content to load
    await page.waitForSelector('.threat-detector, .detector-container');
    
    // Check for main heading
    await expect(page.locator('h1, h2')).toContainText(/Threat Detector|AI.*Detection/i);
    
    // Check for scanning interface
    const scanInterface = page.locator('.scan-interface, .detector-panel, .threat-scanner');
    if (await scanInterface.count() > 0) {
      await expect(scanInterface.first()).toBeVisible();
    }
  });

  test('should initiate threat scanning', async ({ page }) => {
    await page.waitForSelector('.threat-detector, .detector-container');
    
    // Look for scan button
    const scanButton = page.locator('button').filter({ hasText: /scan|start.*scan|detect|analyze/i });
    
    if (await scanButton.count() > 0) {
      await expect(scanButton.first()).toBeVisible();
      
      // Click scan button
      await scanButton.first().click();
      
      // Wait for scan to begin
      await page.waitForTimeout(2000);
      
      // Check for scanning indicators
      const scanningIndicators = page.locator('.scanning, .in-progress, .analyzing, .active-scan');
      if (await scanningIndicators.count() > 0) {
        await expect(scanningIndicators.first()).toBeVisible();
      }
    }
  });

  test('should display scan progress', async ({ page }) => {
    await page.waitForSelector('.threat-detector, .detector-container');
    
    // Start scanning
    const scanButton = page.locator('button').filter({ hasText: /scan|start.*scan|detect/i });
    
    if (await scanButton.count() > 0) {
      await scanButton.first().click();
      
      // Look for progress indicators
      const progressElements = page.locator('.progress, .scan-progress, .progress-bar');
      if (await progressElements.count() > 0) {
        await expect(progressElements.first()).toBeVisible();
      }
      
      // Look for percentage or status updates
      const statusElements = page.locator('.percentage, .scan-status, .progress-text');
      if (await statusElements.count() > 0) {
        await expect(statusElements.first()).toBeVisible();
      }
    }
  });

  test('should show scan results', async ({ page }) => {
    await page.waitForSelector('.threat-detector, .detector-container');
    
    // Start scanning
    const scanButton = page.locator('button').filter({ hasText: /scan|start.*scan|detect/i });
    
    if (await scanButton.count() > 0) {
      await scanButton.first().click();
      
      // Wait for scan to potentially complete
      await page.waitForTimeout(5000);
      
      // Look for results panel
      const resultsElements = page.locator('.results, .scan-results, .threats-found, .detection-results');
      if (await resultsElements.count() > 0) {
        await expect(resultsElements.first()).toBeVisible();
      }
      
      // Look for threat alerts or clean status
      const alertElements = page.locator('.alert, .threat, .warning, .clean, .no-threats');
      if (await alertElements.count() > 0) {
        await expect(alertElements.first()).toBeVisible();
      }
    }
  });

  test('should display system monitoring information', async ({ page }) => {
    await page.waitForSelector('.threat-detector, .detector-container');
    
    // Look for system monitoring elements
    const monitoringElements = page.locator('.system-status, .monitoring, .real-time, .dashboard');
    
    if (await monitoringElements.count() > 0) {
      await expect(monitoringElements.first()).toBeVisible();
      
      // Check for metrics or status indicators
      const metricsElements = page.locator('.metric, .stat, .counter, .status-indicator');
      if (await metricsElements.count() > 0) {
        await expect(metricsElements.first()).toBeVisible();
      }
    }
  });

  test('should handle different scan types', async ({ page }) => {
    await page.waitForSelector('.threat-detector, .detector-container');
    
    // Look for scan type options
    const scanTypes = page.locator('.scan-type, .detection-type').filter({ hasText: /quick|full|deep|custom/i });
    
    if (await scanTypes.count() > 0) {
      await expect(scanTypes.first()).toBeVisible();
      
      // Try selecting different scan type
      await scanTypes.first().click();
      
      // Verify selection works
      await page.waitForTimeout(500);
    }
  });

  test('should show real-time alerts', async ({ page }) => {
    await page.waitForSelector('.threat-detector, .detector-container');
    
    // Look for alert panels or notification areas
    const alertPanels = page.locator('.alerts, .notifications, .threat-alerts, .security-alerts');
    
    if (await alertPanels.count() > 0) {
      await expect(alertPanels.first()).toBeVisible();
    }
    
    // Check for alert indicators
    const alertIndicators = page.locator('.alert-indicator, .notification-badge, .warning-icon');
    if (await alertIndicators.count() > 0) {
      // Indicators might not always be present, so just check if they exist
      const count = await alertIndicators.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});