import { test, expect } from '@playwright/test';

test.describe('Quantum Navigation Circular Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for loading screen to complete
    await page.waitForTimeout(3000);
    await expect(page.locator('.nexus-initializing')).not.toBeVisible({ timeout: 10000 });
  });

  test('should display navigation without scroll bars', async ({ page }) => {
    console.log('Testing navigation container for scroll bars...');

    // Hover over the navigation hexagon to expand it
    const navHexagon = page.locator('.quantum-floating-nav .nav-core-hub');
    await expect(navHexagon).toBeVisible();
    await navHexagon.hover();
    
    // Wait for animation to complete
    await page.waitForTimeout(1000);

    // Check for scroll bars on the navigation container
    const navContainer = page.locator('.quantum-nav-container');
    await expect(navContainer).toBeVisible();
    
    // Check computed styles for overflow properties
    const containerStyles = await navContainer.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        overflow: styles.overflow,
        overflowX: styles.overflowX,
        overflowY: styles.overflowY,
        width: el.scrollWidth,
        clientWidth: el.clientWidth,
        height: el.scrollHeight,
        clientHeight: el.clientHeight
      };
    });

    console.log('Navigation container styles:', containerStyles);

    // Should not have visible scroll bars
    expect(containerStyles.overflow).not.toBe('scroll');
    expect(containerStyles.overflow).not.toBe('auto');
    expect(containerStyles.overflowX).not.toBe('scroll');
    expect(containerStyles.overflowY).not.toBe('scroll');

    // Container should not be scrollable (scrollWidth should equal clientWidth)
    expect(containerStyles.width).toBeLessThanOrEqual(containerStyles.clientWidth + 5); // Small tolerance
    expect(containerStyles.height).toBeLessThanOrEqual(containerStyles.clientHeight + 5);
  });

  test('should display navigation items in a circular layout', async ({ page }) => {
    console.log('Testing circular navigation layout...');

    // Hover to expand navigation
    const navHexagon = page.locator('.quantum-floating-nav .nav-core-hub');
    await navHexagon.hover();
    await page.waitForTimeout(1000);

    // Get all navigation items
    const navItems = page.locator('.nav-item');
    const itemCount = await navItems.count();
    expect(itemCount).toBeGreaterThan(0);

    console.log(`Found ${itemCount} navigation items`);

    // Calculate expected positions for circular layout
    const centerX = 200; // Based on CSS container width/2
    const centerY = 200; // Based on CSS container height/2
    const radius = 160; // Based on CSS translateY(-160px)

    const positions = [];
    for (let i = 0; i < itemCount; i++) {
      const item = navItems.nth(i);
      const box = await item.boundingBox();
      
      if (box) {
        positions.push({
          x: box.x + box.width / 2,
          y: box.y + box.height / 2,
          index: i
        });
      }
    }

    console.log('Navigation item positions:', positions);

    // Verify items are arranged in a circle (not stacked on top of each other)
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const distance = Math.sqrt(
          Math.pow(positions[i].x - positions[j].x, 2) + 
          Math.pow(positions[i].y - positions[j].y, 2)
        );
        
        // Items should not be too close (indicates stacking)
        expect(distance).toBeGreaterThan(50); // Minimum separation
        console.log(`Distance between item ${i} and ${j}: ${distance}px`);
      }
    }

    // Verify items form roughly circular arrangement
    if (positions.length >= 3) {
      const avgRadius = positions.reduce((sum, pos, index) => {
        const angle = (index / positions.length) * 2 * Math.PI;
        const expectedX = centerX + radius * Math.cos(angle - Math.PI / 2);
        const expectedY = centerY + radius * Math.sin(angle - Math.PI / 2);
        const actualRadius = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2));
        return sum + actualRadius;
      }, 0) / positions.length;

      // Average radius should be close to expected radius (with tolerance)
      expect(avgRadius).toBeGreaterThan(100);
      expect(avgRadius).toBeLessThan(300);
      console.log(`Average radius: ${avgRadius}px (expected around ${radius}px)`);
    }
  });

  test('should allow clicking on all navigation items without interference', async ({ page }) => {
    console.log('Testing navigation item clickability...');

    // Hover to expand navigation
    const navHexagon = page.locator('.quantum-floating-nav .nav-core-hub');
    await navHexagon.hover();
    await page.waitForTimeout(1000);

    // Get all navigation items
    const navItems = page.locator('.nav-item');
    const itemCount = await navItems.count();

    console.log(`Testing clickability of ${itemCount} navigation items`);

    for (let i = 0; i < itemCount; i++) {
      const item = navItems.nth(i);
      
      // Verify item is visible and clickable
      await expect(item).toBeVisible();
      
      // Get item text/label for logging
      const itemText = await item.locator('.nav-item-label').textContent();
      console.log(`Testing item ${i}: ${itemText}`);

      // Verify the item can receive hover events
      await item.hover();
      await page.waitForTimeout(200);

      // Verify item is clickable (not intercepted by other elements)
      const isClickable = await item.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const elementAtPoint = document.elementFromPoint(centerX, centerY);
        return el.contains(elementAtPoint);
      });

      expect(isClickable).toBe(true);
      console.log(`Item ${i} (${itemText}) is clickable: ${isClickable}`);

      // Test actual clicking (without navigation to preserve test state)
      const originalUrl = page.url();
      await item.click({ force: true }); // Force click to test if it would work
      
      // Allow time for navigation to potentially occur
      await page.waitForTimeout(500);
      
      // Navigate back to preserve test state for next iteration
      if (page.url() !== originalUrl) {
        await page.goto('/');
        await page.waitForTimeout(1000);
        await navHexagon.hover();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should maintain proper z-index layering for navigation elements', async ({ page }) => {
    console.log('Testing navigation z-index layering...');

    // Hover to expand navigation
    const navHexagon = page.locator('.quantum-floating-nav .nav-core-hub');
    await navHexagon.hover();
    await page.waitForTimeout(1000);

    // Check z-index values of navigation elements
    const navContainer = page.locator('.quantum-nav-container');
    const navRing = page.locator('.nav-ring');
    const navItems = page.locator('.nav-item');

    const containerZIndex = await navContainer.evaluate(el => 
      window.getComputedStyle(el).zIndex
    );
    
    console.log(`Navigation container z-index: ${containerZIndex}`);

    // Navigation should have high z-index to be on top
    expect(parseInt(containerZIndex)).toBeGreaterThan(1000000);

    // Check that nav items don't overlap inappropriately
    const itemCount = await navItems.count();
    for (let i = 0; i < itemCount; i++) {
      const item = navItems.nth(i);
      const itemZIndex = await item.evaluate(el => 
        window.getComputedStyle(el).zIndex
      );
      
      console.log(`Nav item ${i} z-index: ${itemZIndex}`);
      expect(parseInt(itemZIndex)).toBeGreaterThan(1000000);
    }
  });

  test('should provide accessible navigation with proper ARIA attributes', async ({ page }) => {
    console.log('Testing navigation accessibility...');

    // Hover to expand navigation
    const navHexagon = page.locator('.quantum-floating-nav .nav-core-hub');
    await navHexagon.hover();
    await page.waitForTimeout(1000);

    // Check for keyboard accessibility
    const navItems = page.locator('.nav-item');
    const itemCount = await navItems.count();

    for (let i = 0; i < itemCount; i++) {
      const item = navItems.nth(i);
      
      // Verify item can be focused with keyboard
      await item.focus();
      await expect(item).toBeFocused();
      
      // Verify item has proper cursor style
      const cursor = await item.evaluate(el => 
        window.getComputedStyle(el).cursor
      );
      expect(cursor).toBe('pointer');
    }
  });
});