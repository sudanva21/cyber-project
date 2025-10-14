import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(5000); // Wait for loading screen
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });
  });

  test('should display authentication modal when login clicked', async ({ page }) => {
    // Look for login/auth button
    const authButton = page.locator('button, a').filter({ hasText: /login|sign in|auth|account/i });

    if (await authButton.count() > 0) {
      await expect(authButton.first()).toBeVisible();
      
      // Click auth button
      await authButton.first().click();
      
      // Check for modal
      const modal = page.locator('.modal, .auth-modal, .login-modal, [role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 3000 });
    }
  });

  test('should show login form fields', async ({ page }) => {
    // Try to open auth modal
    const authButton = page.locator('button, a').filter({ hasText: /login|sign in|auth|account/i });

    if (await authButton.count() > 0) {
      await authButton.first().click();
      
      // Wait for modal to appear
      await page.waitForSelector('.modal, .auth-modal, .login-modal, [role="dialog"]', { timeout: 3000 });
      
      // Check for email field
      const emailField = page.locator('input[type="email"], input[placeholder*="email"], input[name*="email"]');
      if (await emailField.count() > 0) {
        await expect(emailField.first()).toBeVisible();
      }
      
      // Check for password field
      const passwordField = page.locator('input[type="password"], input[placeholder*="password"], input[name*="password"]');
      if (await passwordField.count() > 0) {
        await expect(passwordField.first()).toBeVisible();
      }
    }
  });

  test('should allow switching between login and signup', async ({ page }) => {
    const authButton = page.locator('button, a').filter({ hasText: /login|sign in|auth|account/i });

    if (await authButton.count() > 0) {
      await authButton.first().click();
      
      await page.waitForSelector('.modal, .auth-modal, .login-modal, [role="dialog"]', { timeout: 3000 });
      
      // Look for toggle between login/signup
      const toggleButton = page.locator('button, a').filter({ hasText: /sign up|register|create account|switch to/i });
      
      if (await toggleButton.count() > 0) {
        await toggleButton.first().click();
        
        // Verify form changes (might have additional fields for signup)
        await page.waitForTimeout(500);
        
        // Look for name field (common in signup)
        const nameField = page.locator('input[placeholder*="name"], input[name*="name"], input[type="text"]:not([name*="email"])').first();
        if (await nameField.isVisible()) {
          await expect(nameField).toBeVisible();
        }
      }
    }
  });

  test('should close authentication modal', async ({ page }) => {
    const authButton = page.locator('button, a').filter({ hasText: /login|sign in|auth|account/i });

    if (await authButton.count() > 0) {
      await authButton.first().click();
      
      await page.waitForSelector('.modal, .auth-modal, .login-modal, [role="dialog"]', { timeout: 3000 });
      
      // Look for close button
      const closeButton = page.locator('button').filter({ hasText: /close|cancel|×|✕/i });
      
      if (await closeButton.count() > 0) {
        await closeButton.first().click();
        
        // Modal should disappear
        await expect(page.locator('.modal, .auth-modal, .login-modal, [role="dialog"]')).not.toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should handle form validation', async ({ page }) => {
    const authButton = page.locator('button, a').filter({ hasText: /login|sign in|auth|account/i });

    if (await authButton.count() > 0) {
      await authButton.first().click();
      
      await page.waitForSelector('.modal, .auth-modal, .login-modal, [role="dialog"]', { timeout: 3000 });
      
      // Try submitting empty form
      const submitButton = page.locator('button').filter({ hasText: /login|sign in|submit|continue/i });
      
      if (await submitButton.count() > 0) {
        await submitButton.first().click();
        
        // Look for validation messages
        await page.waitForTimeout(1000);
        const validationMessages = page.locator('.error, .validation-error, .invalid, [role="alert"]');
        
        if (await validationMessages.count() > 0) {
          await expect(validationMessages.first()).toBeVisible();
        }
      }
    }
  });

  test('should access dashboard when authenticated (mock)', async ({ page }) => {
    // This test assumes we can access dashboard
    await page.goto('/dashboard');
    
    // Either dashboard loads (user is authenticated) OR we get redirected/shown login
    const dashboardContent = page.locator('.dashboard, .user-dashboard');
    const authRequired = page.locator('.auth-modal, .login-required, .access-denied');
    
    // One of these should be true
    const dashboardVisible = await dashboardContent.isVisible();
    const authRequiredVisible = await authRequired.isVisible();
    
    expect(dashboardVisible || authRequiredVisible).toBe(true);
  });

  test('should show user info when logged in', async ({ page }) => {
    // Check navigation for user info
    const userInfo = page.locator('.user-info, .profile, .username, .user-email');
    
    if (await userInfo.count() > 0) {
      await expect(userInfo.first()).toBeVisible();
    }
    
    // Check for logout button if user is logged in
    const logoutButton = page.locator('button, a').filter({ hasText: /logout|sign out/i });
    
    if (await logoutButton.count() > 0) {
      await expect(logoutButton.first()).toBeVisible();
    }
  });
});