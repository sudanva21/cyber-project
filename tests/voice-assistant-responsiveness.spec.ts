import { test, expect } from '@playwright/test';

test.describe('Voice Assistant Responsiveness Tests', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  // Test voice assistant positioning and sizing on different screen sizes
  viewports.forEach(({ name, width, height }) => {
    test(`should display voice assistant correctly on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // Wait for application to load and initialization to complete
      await page.waitForTimeout(8000);
      await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 15000 });

      // Wait for AI assistant to become active
      const aiAssistant = page.locator('.ai-assistant');
      await expect(aiAssistant).toBeVisible({ timeout: 10000 });

      // Verify assistant is positioned correctly
      const assistantBox = await aiAssistant.boundingBox();
      expect(assistantBox).not.toBeNull();
      
      if (assistantBox) {
        // Assistant should be within viewport bounds
        expect(assistantBox.x).toBeGreaterThanOrEqual(0);
        expect(assistantBox.y).toBeGreaterThanOrEqual(0);
        expect(assistantBox.x + assistantBox.width).toBeLessThanOrEqual(width);
        expect(assistantBox.y + assistantBox.height).toBeLessThanOrEqual(height);
        
        // Assistant should be positioned near bottom-right or full width on mobile
        if (width < 768) {
          // Mobile: should take most of width and be near bottom
          expect(assistantBox.width).toBeGreaterThan(width * 0.8); // At least 80% of screen width
          expect(assistantBox.y + assistantBox.height).toBeGreaterThan(height * 0.7); // In lower portion
        } else {
          // Desktop/Tablet: should be in bottom-right corner
          expect(assistantBox.x + assistantBox.width).toBeGreaterThan(width * 0.7); // Right side
          expect(assistantBox.y + assistantBox.height).toBeGreaterThan(height * 0.6); // Lower portion
        }
      }
    });
  });

  test('should expand voice assistant without overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { timeout: 60000 });
    
    // Wait for application to load
    await page.waitForTimeout(8000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 15000 });

    // Wait for AI assistant to appear
    const aiAssistant = page.locator('.ai-assistant');
    await expect(aiAssistant).toBeVisible({ timeout: 10000 });

    // Check if assistant is minimized initially, if so expand it
    const aiHeader = page.locator('.ai-header');
    await expect(aiHeader).toBeVisible();
    
    // Click to expand if minimized
    await aiHeader.click();
    await page.waitForTimeout(1000); // Wait for animation

    // Check that expanded assistant doesn't overflow viewport
    const expandedAssistantBox = await aiAssistant.boundingBox();
    expect(expandedAssistantBox).not.toBeNull();
    
    if (expandedAssistantBox) {
      // Assistant should not exceed viewport dimensions
      expect(expandedAssistantBox.x + expandedAssistantBox.width).toBeLessThanOrEqual(375);
      expect(expandedAssistantBox.y + expandedAssistantBox.height).toBeLessThanOrEqual(667);
      
      // Assistant should maintain minimum margins from edges
      expect(expandedAssistantBox.x).toBeGreaterThanOrEqual(8); // 1rem margin minimum
      expect(expandedAssistantBox.y).toBeGreaterThanOrEqual(8);
      
      // Assistant should have reasonable height (not too small, not overflowing)
      expect(expandedAssistantBox.height).toBeGreaterThan(200); // Minimum usable height
      expect(expandedAssistantBox.height).toBeLessThan(650); // Leave space for margins
    }

    // Verify chat area is accessible
    const chatArea = page.locator('.chat-area');
    if (await chatArea.isVisible()) {
      const chatBox = await chatArea.boundingBox();
      if (chatBox) {
        expect(chatBox.height).toBeGreaterThan(100); // Sufficient height for messages
      }
    }

    // Verify input area is accessible
    const inputArea = page.locator('.ai-input, input[placeholder*="Ask"]');
    if (await inputArea.count() > 0) {
      await expect(inputArea.first()).toBeVisible();
      const inputBox = await inputArea.first().boundingBox();
      if (inputBox) {
        expect(inputBox.height).toBeGreaterThan(30); // Touch-friendly height
      }
    }
  });

  test('should handle voice assistant resizing between viewports', async ({ page }) => {
    // Start with desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { timeout: 60000 });
    await page.waitForTimeout(8000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 15000 });

    const aiAssistant = page.locator('.ai-assistant');
    await expect(aiAssistant).toBeVisible({ timeout: 15000 });

    // Expand the assistant
    const aiHeader = page.locator('.ai-header');
    await expect(aiHeader).toBeVisible({ timeout: 5000 });
    await aiHeader.click();
    await page.waitForTimeout(1000);

    // Get desktop dimensions
    const desktopBox = await aiAssistant.boundingBox();
    expect(desktopBox).not.toBeNull();

    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000); // Wait for responsive adjustments

    // Check mobile dimensions
    const mobileBox = await aiAssistant.boundingBox();
    expect(mobileBox).not.toBeNull();

    if (desktopBox && mobileBox) {
      // Width should adapt to mobile (should be wider relative to viewport)
      const desktopWidthRatio = desktopBox.width / 1920;
      const mobileWidthRatio = mobileBox.width / 375;
      expect(mobileWidthRatio).toBeGreaterThan(desktopWidthRatio);

      // Mobile assistant should not overflow
      expect(mobileBox.x + mobileBox.width).toBeLessThanOrEqual(375);
      expect(mobileBox.y + mobileBox.height).toBeLessThanOrEqual(667);
    }
  });

  test('should maintain voice assistant accessibility on small screens', async ({ page }) => {
    // Test on very small mobile screen
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/', { timeout: 60000 });
    await page.waitForTimeout(8000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 15000 });

    const aiAssistant = page.locator('.ai-assistant');
    await expect(aiAssistant).toBeVisible({ timeout: 10000 });

    // Expand the assistant
    const aiHeader = page.locator('.ai-header');
    await aiHeader.click();
    await page.waitForTimeout(1000);

    // Check positioning on small screen
    const assistantBox = await aiAssistant.boundingBox();
    expect(assistantBox).not.toBeNull();

    if (assistantBox) {
      // Should not overflow the small screen
      expect(assistantBox.x + assistantBox.width).toBeLessThanOrEqual(320);
      expect(assistantBox.y + assistantBox.height).toBeLessThanOrEqual(568);

      // Should maintain minimum usability
      expect(assistantBox.width).toBeGreaterThan(200); // Minimum readable width
      expect(assistantBox.height).toBeGreaterThan(150); // Minimum functional height
    }

    // Essential controls should remain accessible
    const minimizeButton = aiHeader;
    await expect(minimizeButton).toBeVisible();
    
    // Test minimizing/maximizing functionality
    await minimizeButton.click();
    await page.waitForTimeout(500);
    
    const minimizedBox = await aiAssistant.boundingBox();
    if (minimizedBox) {
      expect(minimizedBox.height).toBeLessThan(100); // Should be significantly smaller when minimized
    }
  });

  test('should handle voice assistant interaction without UI conflicts', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { timeout: 60000 });
    await page.waitForTimeout(8000);
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 15000 });

    const aiAssistant = page.locator('.ai-assistant');
    await expect(aiAssistant).toBeVisible({ timeout: 15000 });

    // Get initial minimized state
    const initialBox = await aiAssistant.boundingBox();

    // Expand the assistant
    const aiHeader = page.locator('.ai-header');
    await expect(aiHeader).toBeVisible({ timeout: 5000 });
    await aiHeader.click();
    await page.waitForTimeout(1000);

    // Get expanded state
    const expandedBox = await aiAssistant.boundingBox();

    // Test typing in the assistant
    const inputField = page.locator('.ai-assistant input, .holographic-input');
    if (await inputField.count() > 0) {
      await inputField.first().click();
      await inputField.first().fill('test message');
      
      // Ensure input field remains visible and accessible
      await expect(inputField.first()).toBeVisible();
      const inputValue = await inputField.first().inputValue();
      expect(inputValue).toBe('test message');
      
      // Test sending message
      const sendButton = page.locator('.ai-assistant button').filter({ hasText: /send/i });
      if (await sendButton.count() > 0) {
        await sendButton.first().click();
        await page.waitForTimeout(1000);
        
        // Input should be cleared after sending
        const clearedValue = await inputField.first().inputValue();
        expect(clearedValue).toBe('');
      }
    }

    // Test voice button if available
    const voiceButton = page.locator('button').filter({ hasText: '🎤' });
    if (await voiceButton.count() > 0) {
      await expect(voiceButton.first()).toBeVisible();
      // Just verify it's clickable, don't test actual voice functionality
      await voiceButton.first().click();
      await page.waitForTimeout(500);
    }

    // Verify assistant can be minimized after interaction
    await aiHeader.click();
    await page.waitForTimeout(1000);
    
    const finalBox = await aiAssistant.boundingBox();
    if (finalBox && expandedBox) {
      // Should be smaller than expanded state (more reliable than absolute height)
      expect(finalBox.height).toBeLessThan(expandedBox.height);
      // Should be close to minimized height but allow some browser variation
      expect(finalBox.height).toBeLessThan(120);
    }
  });
});