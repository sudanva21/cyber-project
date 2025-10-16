import { test, expect } from '@playwright/test'

test.describe('Quantum Controls Positioning and Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application and wait for full loading
    await page.goto('/')
    
    // Wait for the loading screen to complete
    await page.waitForSelector('.nexus-app', { timeout: 10000 })
    
    // Wait for quantum controls to be visible
    await page.waitForSelector('.quantum-controls', { timeout: 5000 })
  })

  test.describe('Desktop Layout (1280x720)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    test('should position quantum controls on the left side at mid-height', async ({ page }) => {
      const quantumControls = page.locator('.quantum-controls')
      await expect(quantumControls).toBeVisible()

      // Get the position of quantum controls
      const boundingBox = await quantumControls.boundingBox()
      expect(boundingBox).not.toBeNull()

      if (boundingBox) {
        // Should be positioned on the left side (x coordinate should be small)
        expect(boundingBox.x).toBeLessThan(200)
        
        // Should be positioned at middle height (y coordinate should be roughly centered)
        const viewportHeight = 720
        const centerY = viewportHeight / 2
        expect(boundingBox.y).toBeGreaterThan(centerY - 100)
        expect(boundingBox.y).toBeLessThan(centerY + 100)
      }
    })

    test('should display controls in vertical layout', async ({ page }) => {
      const quantumControls = page.locator('.quantum-controls')
      
      // Check that controls are in vertical layout (flex-direction: column)
      const flexDirection = await quantumControls.evaluate((el) => 
        getComputedStyle(el).flexDirection
      )
      expect(flexDirection).toBe('column')
    })

    test('should have microphone button above theme selector buttons', async ({ page }) => {
      const micButton = page.locator('.quantum-controls .voice-nav')
      const themeSelector = page.locator('.quantum-controls .theme-selector')
      
      await expect(micButton).toBeVisible()
      await expect(themeSelector).toBeVisible()

      // Get positions to verify mic button is above theme selector
      const micBox = await micButton.boundingBox()
      const themeSelectorBox = await themeSelector.boundingBox()
      
      expect(micBox).not.toBeNull()
      expect(themeSelectorBox).not.toBeNull()
      
      if (micBox && themeSelectorBox) {
        expect(micBox.y).toBeLessThan(themeSelectorBox.y)
      }
    })
  })

  test.describe('Mobile Layout (375x812)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
    })

    test('should position quantum controls on the right side at mid-height (NOT at bottom)', async ({ page }) => {
      const quantumControls = page.locator('.quantum-controls')
      await expect(quantumControls).toBeVisible()

      const boundingBox = await quantumControls.boundingBox()
      expect(boundingBox).not.toBeNull()

      if (boundingBox) {
        // Should be positioned on the right side (x > 50% of viewport width)
        const viewportWidth = 375
        expect(boundingBox.x).toBeGreaterThan(viewportWidth / 2)
        
        // Should be positioned at middle height, NOT at the bottom
        const viewportHeight = 812
        const centerY = viewportHeight / 2
        expect(boundingBox.y).toBeGreaterThan(centerY - 250)
        expect(boundingBox.y).toBeLessThan(centerY + 250)
        
        // Ensure it's NOT at the bottom (bottom third of screen)
        expect(boundingBox.y).toBeLessThan(viewportHeight * 0.8)
      }
    })

    test('should maintain vertical layout on mobile', async ({ page }) => {
      const quantumControls = page.locator('.quantum-controls')
      
      // Check that controls remain in vertical layout on mobile
      const flexDirection = await quantumControls.evaluate((el) => 
        getComputedStyle(el).flexDirection
      )
      expect(flexDirection).toBe('column')
    })

    test('should have proper mobile styling with backdrop blur', async ({ page }) => {
      const quantumControls = page.locator('.quantum-controls')
      
      // Check backdrop filter is applied
      const backdropFilter = await quantumControls.evaluate((el) => 
        getComputedStyle(el).backdropFilter
      )
      expect(backdropFilter).toContain('blur')
      
      // Check background is semi-transparent
      const backgroundColor = await quantumControls.evaluate((el) => 
        getComputedStyle(el).backgroundColor
      )
      expect(backgroundColor).toContain('rgba')
    })
  })

  test.describe('Tablet Layout (768x1024)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
    })

    test('should use desktop positioning behavior on tablet', async ({ page }) => {
      const quantumControls = page.locator('.quantum-controls')
      await expect(quantumControls).toBeVisible()

      const boundingBox = await quantumControls.boundingBox()
      expect(boundingBox).not.toBeNull()

      if (boundingBox) {
        // Should still be on the left side for tablet (since breakpoint is 480px)
        expect(boundingBox.x).toBeLessThan(300)
        
        // Should be at middle height (allowing for more flexibility)
        const viewportHeight = 1024
        const centerY = viewportHeight / 2
        expect(boundingBox.y).toBeGreaterThan(centerY - 400)
        expect(boundingBox.y).toBeLessThan(centerY + 400)
      }
    })
  })

  test.describe('Microphone Button Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    test('should toggle microphone button state on click', async ({ page }) => {
      const micButton = page.locator('.quantum-controls .voice-nav')
      await expect(micButton).toBeVisible()

      // Check initial state
      const initialActive = await micButton.getAttribute('data-active')
      
      // Click the button
      await micButton.click()
      
      // Wait for state change
      await page.waitForTimeout(500)
      
      // Check if state changed
      const newActive = await micButton.getAttribute('data-active')
      expect(newActive).not.toBe(initialActive)
    })

    test('should have proper visual feedback when active', async ({ page }) => {
      const micButton = page.locator('.quantum-controls .voice-nav')
      
      // Click to activate
      await micButton.click()
      await page.waitForTimeout(500)
      
      // Check for active styling
      const activeState = await micButton.getAttribute('data-active')
      if (activeState === 'true') {
        // When active, should have different background (danger styling)
        const backgroundColor = await micButton.evaluate((el) => 
          getComputedStyle(el).backgroundColor
        )
        // Should have some form of visual distinction (not just transparent)
        expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
      }
    })
  })

  test.describe('Theme Selector Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    test('should have all three theme buttons visible', async ({ page }) => {
      const quantumBtn = page.locator('.quantum-controls .theme-btn').nth(0)
      const neuralBtn = page.locator('.quantum-controls .theme-btn').nth(1)
      const holographicBtn = page.locator('.quantum-controls .theme-btn').nth(2)
      
      await expect(quantumBtn).toBeVisible()
      await expect(neuralBtn).toBeVisible()
      await expect(holographicBtn).toBeVisible()
    })

    test('should switch theme when clicking theme buttons', async ({ page }) => {
      // Click on neural theme button (🧠)
      const neuralBtn = page.getByRole('button', { name: '🧠' })
      await neuralBtn.click()
      
      // Verify the button becomes active
      await expect(neuralBtn).toHaveClass(/active/)
      
      // Click on holographic theme button (🔮)
      const holographicBtn = page.getByRole('button', { name: '🔮' })
      await holographicBtn.click()
      
      // Verify the button becomes active and neural is no longer active
      await expect(holographicBtn).toHaveClass(/active/)
      await expect(neuralBtn).not.toHaveClass(/active/)
    })

    test('should apply theme changes to the app container', async ({ page }) => {
      const appContainer = page.locator('.nexus-app')
      
      // Check initial theme
      const initialClass = await appContainer.getAttribute('class')
      
      // Click neural theme
      await page.getByRole('button', { name: '🧠' }).click()
      await page.waitForTimeout(500)
      
      // Check if theme class changed
      const neuralClass = await appContainer.getAttribute('class')
      expect(neuralClass).toContain('theme-neural')
      
      // Click quantum theme
      await page.getByRole('button', { name: '⚛️' }).click()
      await page.waitForTimeout(500)
      
      // Check if theme class changed again
      const quantumClass = await appContainer.getAttribute('class')
      expect(quantumClass).toContain('theme-quantum')
    })
  })

  test.describe('Cross-viewport Consistency', () => {
    const viewports = [
      { name: 'Desktop Large', width: 1920, height: 1080 },
      { name: 'Desktop Medium', width: 1280, height: 720 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile Large', width: 414, height: 896 },
      { name: 'Mobile Medium', width: 375, height: 812 },
      { name: 'Mobile Small', width: 320, height: 568 }
    ]

    viewports.forEach(viewport => {
      test(`should maintain controls visibility and functionality on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        
        // Verify controls are visible
        const quantumControls = page.locator('.quantum-controls')
        await expect(quantumControls).toBeVisible()
        
        // Verify microphone button works
        const micButton = page.locator('.quantum-controls .voice-nav')
        await expect(micButton).toBeVisible()
        await micButton.click()
        await page.waitForTimeout(300)
        
        // Verify theme buttons work
        const themeBtn = page.locator('.quantum-controls .theme-btn').first()
        await expect(themeBtn).toBeVisible()
        await themeBtn.click()
        await page.waitForTimeout(300)
        
        // All interactions should work without errors
        expect(true).toBe(true) // If we reach here, no errors occurred
      })
    })
  })

  test.describe('Regression Prevention', () => {
    test('should never position controls at the bottom on mobile devices', async ({ page }) => {
      const mobileViewports = [
        { width: 320, height: 568 },
        { width: 375, height: 812 },
        { width: 414, height: 896 },
        { width: 480, height: 854 }
      ]

      for (const viewport of mobileViewports) {
        await page.setViewportSize(viewport)
        
        const quantumControls = page.locator('.quantum-controls')
        await expect(quantumControls).toBeVisible()
        
        const boundingBox = await quantumControls.boundingBox()
        expect(boundingBox).not.toBeNull()
        
        if (boundingBox) {
          // Ensure controls are NOT positioned near the bottom
          const bottomThreshold = viewport.height - 150
          expect(boundingBox.y).toBeLessThan(bottomThreshold)
          
          // Ensure they are positioned in middle area
          const middleArea = viewport.height / 2
          expect(boundingBox.y).toBeGreaterThan(middleArea - 200)
          expect(boundingBox.y).toBeLessThan(middleArea + 200)
        }
      }
    })

    test('should maintain proper z-index stacking', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      
      const quantumControls = page.locator('.quantum-controls')
      
      // Check z-index is high enough to stay above other elements
      const zIndex = await quantumControls.evaluate((el) => 
        getComputedStyle(el).zIndex
      )
      const zIndexNumber = parseInt(zIndex)
      expect(zIndexNumber).toBeGreaterThan(99) // Should be at least 100 for proper stacking
    })

    test('should not interfere with page scrolling or content interaction', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      
      // Try scrolling the page
      await page.mouse.wheel(0, 500)
      await page.waitForTimeout(500)
      
      // Try clicking main content
      const enterButton = page.getByRole('link', { name: 'ENTER NEXUS' })
      await expect(enterButton).toBeVisible()
      
      // Controls should not block content interaction
      await enterButton.click()
      
      // Should navigate successfully
      await page.waitForURL('**/dashboard', { timeout: 5000 })
      expect(page.url()).toContain('/dashboard')
    })
  })
})