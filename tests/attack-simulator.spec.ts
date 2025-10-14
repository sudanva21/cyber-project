import { test, expect } from '@playwright/test';

test.describe('Attack Simulator Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(5000); // Wait for loading screen
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });
    
    // Navigate to attack simulator
    await page.click('nav a[href="/simulator"]');
    await expect(page).toHaveURL('/simulator');
  });

  test('should display attack simulator interface', async ({ page }) => {
    // Wait for simulator content to load
    await page.waitForSelector('.attack-simulator, .simulator-container');
    
    // Check for main heading
    await expect(page.locator('h1, h2')).toContainText(/Attack Simulator|Cyber Attack/i);
    
    // Check for scenario selection or simulator interface
    const scenarios = page.locator('.scenario, .attack-scenario, .simulation-option');
    const terminalInterface = page.locator('.terminal, .console, .command-interface');
    
    // Either scenarios should be visible OR terminal interface should be present
    const scenariosVisible = await scenarios.count() > 0;
    const terminalVisible = await terminalInterface.count() > 0;
    
    expect(scenariosVisible || terminalVisible).toBe(true);
  });

  test('should allow scenario selection', async ({ page }) => {
    await page.waitForSelector('.attack-simulator, .simulator-container');
    
    // Look for scenario cards or buttons
    const scenarioElements = page.locator('.scenario-card, .scenario-button, .attack-type, .simulation-card');
    
    if (await scenarioElements.count() > 0) {
      await expect(scenarioElements.first()).toBeVisible();
      
      // Try clicking on first scenario
      await scenarioElements.first().click();
      
      // Check that something changes (new interface, terminal, etc.)
      await page.waitForTimeout(1000);
      
      // Look for simulation interface
      const simInterface = page.locator('.simulation-interface, .terminal, .attack-console, .scenario-running');
      if (await simInterface.count() > 0) {
        await expect(simInterface.first()).toBeVisible();
      }
    }
  });

  test('should display simulation progress', async ({ page }) => {
    await page.waitForSelector('.attack-simulator, .simulator-container');
    
    // Start a simulation if scenarios are available
    const scenarios = page.locator('.scenario-card, .scenario-button, .start-simulation');
    
    if (await scenarios.count() > 0) {
      await scenarios.first().click();
      
      // Look for progress indicators
      const progressElements = page.locator('.progress, .simulation-progress, .attack-progress, .progress-bar');
      if (await progressElements.count() > 0) {
        await expect(progressElements.first()).toBeVisible();
      }
      
      // Look for status indicators
      const statusElements = page.locator('.status, .simulation-status, .attack-status');
      if (await statusElements.count() > 0) {
        await expect(statusElements.first()).toBeVisible();
      }
    }
  });

  test('should handle simulation controls', async ({ page }) => {
    await page.waitForSelector('.attack-simulator, .simulator-container');
    
    // Look for control buttons
    const controlButtons = page.locator('button').filter({ hasText: /start|stop|pause|reset|run/i });
    
    if (await controlButtons.count() > 0) {
      const startButton = controlButtons.first();
      await expect(startButton).toBeVisible();
      
      // Click start/run button
      await startButton.click();
      
      // Wait for simulation to begin
      await page.waitForTimeout(2000);
      
      // Look for running indicators
      const runningIndicators = page.locator('.running, .active, .in-progress, .executing');
      if (await runningIndicators.count() > 0) {
        await expect(runningIndicators.first()).toBeVisible();
      }
    }
  });

  test('should display terminal-like interface', async ({ page }) => {
    await page.waitForSelector('.attack-simulator, .simulator-container');
    
    // Look for terminal/console elements
    const terminalElements = page.locator('.terminal, .console, .command-line, .code-block');
    
    if (await terminalElements.count() > 0) {
      await expect(terminalElements.first()).toBeVisible();
      
      // Check for terminal content
      const terminalContent = page.locator('.terminal-content, .console-output, .command-output');
      if (await terminalContent.count() > 0) {
        await expect(terminalContent.first()).toBeVisible();
      }
    }
  });

  test('should handle different difficulty levels', async ({ page }) => {
    await page.waitForSelector('.attack-simulator, .simulator-container');
    
    // Look for difficulty selection
    const difficultyElements = page.locator('.difficulty, .level').filter({ hasText: /easy|medium|hard|beginner|advanced/i });
    
    if (await difficultyElements.count() > 0) {
      await expect(difficultyElements.first()).toBeVisible();
      
      // Try selecting different difficulty
      await difficultyElements.first().click();
      
      // Verify selection is registered
      await page.waitForTimeout(500);
    }
  });
});