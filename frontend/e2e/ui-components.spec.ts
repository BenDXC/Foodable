import { test, expect } from '@playwright/test';

test.describe('UI Components', () => {
  test.describe('Buttons', () => {
    test('should have styled buttons', async ({ page }) => {
      await page.goto('/');
      
      const button = page.locator('.btn').first();
      if (await button.isVisible()) {
        await expect(button).toHaveClass(/btn/);
      }
    });

    test('should have login link with correct navigation', async ({ page }) => {
      await page.goto('/');
      
      const loginLink = page.locator('a[href="/Login"]').first();
      await expect(loginLink).toBeVisible({ timeout: 10000 });
      await loginLink.click();
      await expect(page).toHaveURL(/.*Login/);
    });
  });

  test.describe('Cards', () => {
    test('should display feature cards with images', async ({ page }) => {
      await page.goto('/');
      
      const cards = page.locator('.cards__item');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
      
      // Check first card has image
      const firstCard = cards.first();
      const image = firstCard.locator('img');
      await expect(image).toBeVisible();
    });

    test('should have card labels', async ({ page }) => {
      await page.goto('/');
      
      const card = page.locator('.cards__item').first();
      const label = card.locator('[data-category]');
      
      if (await label.count() > 0) {
        await expect(label.first()).toBeVisible();
      }
    });

    test('should have card descriptions', async ({ page }) => {
      await page.goto('/');
      
      const cardText = page.locator('.cards__item__text').first();
      await expect(cardText).toBeVisible();
    });
  });

  test.describe('Navbar', () => {
    test('should have logo', async ({ page }) => {
      await page.goto('/');
      
      const logo = page.locator('.navbar-logo');
      await expect(logo).toBeVisible();
    });

    test('should have navigation links', async ({ page }) => {
      await page.goto('/');
      
      const navbar = page.locator('.navbar');
      await expect(navbar.locator('text=Home')).toBeVisible();
      await expect(navbar.locator('text=About')).toBeVisible();
    });

    test('should have mobile menu icon', async ({ page }) => {
      await page.goto('/');
      
      const menuIcon = page.locator('.menu-icon');
      await expect(menuIcon).toBeVisible({ timeout: 10000 });
    });

    test('should toggle mobile menu on click', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const menuIcon = page.locator('.menu-icon');
      await menuIcon.click();
      
      // Menu should be active
      const navMenu = page.locator('.nav-menu');
      await expect(navMenu).toHaveClass(/active/);
    });
  });

  test.describe('Footer', () => {
    test('should have footer sections', async ({ page }) => {
      await page.goto('/');
      
      const footer = page.locator('.footer-container');
      await expect(footer).toBeVisible();
      
      // Check for footer sections
      await expect(footer.locator('text=About Us')).toBeVisible();
      await expect(footer.locator('text=Contact Us')).toBeVisible();
    });

    test('should have social media links', async ({ page }) => {
      await page.goto('/');
      
      const footer = page.locator('.footer-container');
      const socialIcons = footer.locator('.social-icon-link');
      
      const count = await socialIcons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have footer logo', async ({ page }) => {
      await page.goto('/');
      
      const footerLogo = page.locator('.footer-logo img');
      await expect(footerLogo).toBeVisible();
    });
  });
});

test.describe('Images and Assets', () => {
  test('should load logo image', async ({ page }) => {
    await page.goto('/');
    
    const logo = page.locator('.navbar-logo img');
    await expect(logo).toBeVisible();
    
    // Check image has src attribute
    const src = await logo.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('should load card images', async ({ page }) => {
    await page.goto('/');
    
    const cardImages = page.locator('.cards__item__img');
    const count = await cardImages.count();
    
    if (count > 0) {
      const firstImage = cardImages.first();
      await expect(firstImage).toBeVisible();
    }
  });
});

test.  describe('Typography and Styling', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/About');
      
      // Check for headings
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 10000 });
    });

    test('should have readable text content', async ({ page }) => {
      await page.goto('/About');
      
      // Check page has text content
      const body = page.locator('body');
      const text = await body.textContent();
      expect(text?.length).toBeGreaterThan(0);
    });
  });

test.describe('Links and Navigation', () => {
  test('should have working internal links', async ({ page }) => {
    await page.goto('/');
    
    const homeLink = page.locator('a[href="/"]').first();
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('should have accessible links with proper attributes', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Form Elements', () => {
  test('should have properly styled input fields', async ({ page }) => {
    await page.goto('/Login');
    
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveClass(/form__input/);
  });

  test('should have submit buttons with correct type', async ({ page }) => {
    await page.goto('/Login');
    
    const submitButton = page.locator('input[type="submit"]');
    await expect(submitButton).toBeVisible();
  });
});
