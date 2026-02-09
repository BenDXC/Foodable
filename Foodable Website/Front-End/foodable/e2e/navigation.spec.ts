import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Foodable/i);
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.footer-container')).toBeVisible();
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=About');
    await expect(page).toHaveURL(/.*About/);
    await expect(page.locator('text=At Foodable our focus')).toBeVisible();
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Contact');
    await expect(page).toHaveURL(/.*Contact/);
    await expect(page.locator('text=Get in touch')).toBeVisible();
  });

  test('should navigate to Login page', async ({ page }) => {
    await page.goto('/');
    
    // Click login link (could be button or nav link)
    await page.locator('a[href="/Login"]').first().click();
    await expect(page).toHaveURL(/.*Login/);
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('should navigate to Registration page from Login', async ({ page }) => {
    await page.goto('/Login');
    
    // Click registration link
    await page.locator('a[href="/Registration"]').click();
    await expect(page).toHaveURL(/.*Registration/);
  });

  test('should navigate to Foodbank page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/Foodbank"]');
    await expect(page).toHaveURL(/.*Foodbank/);
  });

  test('should display feature cards on home page', async ({ page }) => {
    await page.goto('/');
    
    // Check for feature cards
    await expect(page.locator('text=Check out the features')).toBeVisible();
    await expect(page.locator('text=Send food to a foodbank')).toBeVisible();
    await expect(page.locator('text=Find Foodbanks near you')).toBeVisible();
  });

  test('should have working navbar logo link', async ({ page }) => {
    await page.goto('/About');
    await page.click('.navbar-logo');
    await expect(page).toHaveURL('/');
  });

  test('should have responsive navigation menu', async ({ page }) => {
    await page.goto('/');
    
    // Check navbar exists
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();
    
    // Check for menu items
    await expect(navbar.locator('text=Home')).toBeVisible();
    await expect(navbar.locator('text=About')).toBeVisible();
  });
});

test.describe('Footer Links', () => {
  test('should have all footer sections', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('.footer-container');
    await expect(footer.locator('text=About Us')).toBeVisible();
    await expect(footer.locator('text=Contact Us')).toBeVisible();
    await expect(footer.locator('text=Online Services')).toBeVisible();
    await expect(footer.locator('text=Donator Rewards')).toBeVisible();
  });

  test('should navigate from footer links', async ({ page }) => {
    await page.goto('/');
    
    // Click About link in footer
    await page.locator('.footer-container >> text=About Us').first().click();
    await expect(page).toHaveURL(/.*About/);
  });

  test('should display copyright information', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('.footer-container');
    await expect(footer.locator('text=All Rights Reserved')).toBeVisible();
  });
});
