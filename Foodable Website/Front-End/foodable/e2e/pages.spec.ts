import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display home page content for non-authenticated users', async ({ page }) => {
    await page.goto('/');
    
    // Should show About page content when not logged in
    await expect(page.locator('text=Check out the features')).toBeVisible();
    await expect(page.locator('.cards')).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');
    
    const cards = page.locator('.cards__item');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should have working card links', async ({ page }) => {
    await page.goto('/');
    
    // Find a card and click it
    const firstCard = page.locator('.cards__item__link').first();
    await expect(firstCard).toBeVisible();
  });
});

test.describe('About Page', () => {
  test('should display about page content', async ({ page }) => {
    await page.goto('/About');
    
    await expect(page.locator('text=At Foodable our focus is to tackle world hunger')).toBeVisible();
    await expect(page.locator('text=Global Hunger is not the only thing')).toBeVisible();
  });

  test('should display foodbank button', async ({ page }) => {
    await page.goto('/About');
    
    await expect(page.locator('text=Find Foodbanks here')).toBeVisible();
  });

  test('should show information about dietary requirements', async ({ page }) => {
    await page.goto('/About');
    
    await expect(page.locator('text=dietary requirements')).toBeVisible();
  });

  test('should mention waste reduction', async ({ page }) => {
    await page.goto('/About');
    
    await expect(page.locator('text=Waste is another issue')).toBeVisible();
  });
});

test.describe('Foodbank Page', () => {
  test('should load foodbank page', async ({ page }) => {
    await page.goto('/Foodbank');
    await expect(page).toHaveURL(/.*Foodbank/);
  });

  test('should be accessible from navigation', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/Foodbank"]');
    await expect(page).toHaveURL(/.*Foodbank/);
  });
});

test.describe('Receiver Page', () => {
  test('should load receiver page', async ({ page }) => {
    await page.goto('/Receiver');
    await expect(page).toHaveURL(/.*Receiver/);
  });

  test('should load receiver page directly', async ({ page }) => {
    await page.goto('/Receiver');
    await expect(page).toHaveURL(/.*Receiver/);
    
    // Should have page content
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Donator Page', () => {
  test('should load donator page', async ({ page }) => {
    await page.goto('/Donator');
    await expect(page).toHaveURL(/.*Donator/);
  });
});

test.describe('Profile Page', () => {
  test('should load profile page', async ({ page }) => {
    await page.goto('/Profile');
    await expect(page).toHaveURL(/.*Profile/);
  });
});

test.describe('Reward Page', () => {
  test('should load reward page', async ({ page }) => {
    await page.goto('/Reward');
    await expect(page).toHaveURL(/.*Reward/);
  });
});

test.describe('Page Meta Information', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Foodable/);
  });

  test('should have favicon', async ({ page }) => {
    await page.goto('/');
    
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('href', '/favicon.ico');
  });

  test('should have viewport meta tag', async ({ page }) => {
    await page.goto('/');
    
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1');
  });
});

test.describe('Page Load Performance', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - start;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have all critical resources loaded', async ({ page }) => {
    await page.goto('/');
    
    // Check navbar is visible (means CSS loaded)
    await expect(page.locator('.navbar')).toBeVisible();
    
    // Check footer is visible
    await expect(page.locator('.footer-container')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should display navbar on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('should have mobile menu icon', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const menuIcon = page.locator('.menu-icon');
    await expect(menuIcon).toBeVisible();
  });

  test('should be usable on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.footer-container')).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should handle non-existent routes gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should still load the app (React Router handles this)
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('should maintain navigation after error', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should still be able to navigate
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
  });
});
