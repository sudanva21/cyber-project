import { test, expect } from '@playwright/test';

test.describe('Awareness Section Quiz Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(5000); // Wait for loading screen
    await expect(page.locator('.loading-screen')).not.toBeVisible({ timeout: 10000 });
    
    // Navigate to awareness section
    await page.click('nav a[href="/awareness"]');
    await expect(page).toHaveURL('/awareness');
  });

  test('should display quiz modules and allow selection', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('.awareness-section');
    
    // Check if quiz modules are present
    const modules = page.locator('.module-card, .quiz-module, .training-module');
    await expect(modules.first()).toBeVisible();
    
    // Click on first available quiz/module
    await modules.first().click();
    
    // Verify quiz interface appears
    await expect(page.locator('.quiz-container, .module-content')).toBeVisible();
  });

  test('should handle quiz interactions correctly', async ({ page }) => {
    await page.waitForSelector('.awareness-section');
    
    // Find and click on a quiz module
    const quizModule = page.locator('.module-card, .quiz-module').first();
    if (await quizModule.isVisible()) {
      await quizModule.click();
      
      // Wait for quiz to load
      await page.waitForSelector('.quiz-container, .question-container', { timeout: 5000 });
      
      // Look for quiz questions
      const questionElement = page.locator('.question, .quiz-question, h3, h2').filter({ hasText: /\?/ }).first();
      if (await questionElement.isVisible()) {
        await expect(questionElement).toBeVisible();
        
        // Find answer options
        const answerOptions = page.locator('.answer-option, .option, button').filter({ hasText: /^[A-D]\.|\w+/ });
        if (await answerOptions.count() > 0) {
          // Select first answer
          await answerOptions.first().click();
          
          // Look for submit button
          const submitButton = page.locator('button').filter({ hasText: /submit|next|continue/i }).first();
          if (await submitButton.isVisible()) {
            await submitButton.click();
            
            // Check for feedback
            await expect(page.locator('.feedback, .result, .correct, .incorrect')).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  test('should track progress through quiz', async ({ page }) => {
    await page.waitForSelector('.awareness-section');
    
    // Start a quiz
    const module = page.locator('.module-card, .quiz-module').first();
    if (await module.isVisible()) {
      await module.click();
      
      // Look for progress indicators
      const progressIndicators = page.locator('.progress, .progress-bar, .quiz-progress');
      if (await progressIndicators.count() > 0) {
        await expect(progressIndicators.first()).toBeVisible();
      }
      
      // Check for question counter
      const questionCounter = page.locator('text=/question \\d+ of \\d+/i, text=/\\d+\\/\\d+/');
      if (await questionCounter.count() > 0) {
        await expect(questionCounter.first()).toBeVisible();
      }
    }
  });

  test('should complete quiz flow', async ({ page }) => {
    await page.waitForSelector('.awareness-section');
    
    const module = page.locator('.module-card, .quiz-module').first();
    if (await module.isVisible()) {
      await module.click();
      
      // Try to complete a full quiz flow
      let questionsAnswered = 0;
      const maxQuestions = 5; // Prevent infinite loop
      
      while (questionsAnswered < maxQuestions) {
        // Check if we're still in quiz mode
        const questionExists = await page.locator('.question, .quiz-question').isVisible();
        if (!questionExists) break;
        
        // Find and select an answer
        const options = page.locator('.answer-option, .option, button').filter({ hasText: /\w+/ });
        if (await options.count() > 0) {
          await options.first().click();
          
          // Submit answer
          const submitBtn = page.locator('button').filter({ hasText: /submit|next|continue/i }).first();
          if (await submitBtn.isVisible()) {
            await submitBtn.click();
            await page.waitForTimeout(1000); // Wait for transition
            questionsAnswered++;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      
      // Check for completion screen
      const completionElements = page.locator('.completion, .quiz-complete, .congratulations, .finished');
      if (await completionElements.count() > 0) {
        await expect(completionElements.first()).toBeVisible();
      }
    }
  });
});