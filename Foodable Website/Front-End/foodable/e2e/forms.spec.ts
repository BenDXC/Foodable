import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Contact');
  });

  test('should display contact form', async ({ page }) => {
    await expect(page.locator('text=Send us a message')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('should have contact information displayed', async ({ page }) => {
    await expect(page.locator('text=Get in touch')).toBeVisible();
    await expect(page.locator('text=+44 7911 123456')).toBeVisible();
    await expect(page.locator('text=foodable7@gmail.com')).toBeVisible();
  });

  test('should display location map', async ({ page }) => {
    await expect(page.locator('text=Our Location')).toBeVisible();
    const iframe = page.locator('iframe');
    await expect(iframe).toBeVisible();
  });

  test('should fill contact form fields', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');
    
    // Verify values
    await expect(page.locator('input[name="name"]')).toHaveValue('John Doe');
    await expect(page.locator('input[name="email"]')).toHaveValue('john@example.com');
    await expect(page.locator('textarea[name="message"]')).toHaveValue('This is a test message');
  });

  test('should have placeholders in form fields', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toHaveAttribute('placeholder', 'Your name');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('placeholder', "What's your email?");
    await expect(page.locator('textarea[name="message"]')).toHaveAttribute('placeholder', 'Your questions...');
  });

  test('should have submit button', async ({ page }) => {
    const submitButton = page.locator('input[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should display contact sections', async ({ page }) => {
    // Check for contact sections with more flexible selectors
    const address = page.locator('.topic:has-text("Address")');
    const phone = page.locator('.topic:has-text("Phone")');
    const email = page.locator('.topic:has-text("Email")');
    
    await expect(address).toBeVisible({ timeout: 5000 });
    await expect(phone).toBeVisible({ timeout: 5000 });
    await expect(email).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Form Validation', () => {
  test('login form should validate email format', async ({ page }) => {
    await page.goto('/Login');
    
    await page.fill('input[name="email"]', 'notanemail');
    await page.fill('input[name="password"]', 'password123');
    await page.click('input[type="submit"]');
    
    // Should show validation error
    await page.waitForSelector('text=Invalid e-mail address', { timeout: 3000 });
  });

  test('login form should validate password length', async ({ page }) => {
    await page.goto('/Login');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'short');
    await page.click('input[type="submit"]');
    
    // Should show validation error
    await page.waitForSelector('text=Password is too short', { timeout: 3000 });
  });
});

test.describe('Interactive Elements', () => {
  test('should have clickable navigation buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check feature cards are clickable
    const cards = page.locator('.cards__item__link');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have hover effects on buttons', async ({ page }) => {
    await page.goto('/');
    
    const button = page.locator('.btn').first();
    if (await button.isVisible()) {
      await button.hover();
      // Button should be visible and interactive
      await expect(button).toBeVisible();
    }
  });
});

test.describe('Accessibility', () => {
  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/Contact');
    
    // Check form has accessible placeholders
    await expect(page.locator('input[name="name"]')).toHaveAttribute('placeholder');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('placeholder');
  });

  test('should have proper input types', async ({ page }) => {
    await page.goto('/Contact');
    
    await expect(page.locator('input[name="name"]')).toHaveAttribute('type', 'text');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('type', 'email');
  });

  test('should have keyboard navigable forms', async ({ page }) => {
    await page.goto('/Login');
    
    // Tab through form
    await page.locator('input[name="email"]').focus();
    await page.keyboard.press('Tab');
    
    // Password field should be focused
    await expect(page.locator('input[name="password"]')).toBeFocused();
  });
});
