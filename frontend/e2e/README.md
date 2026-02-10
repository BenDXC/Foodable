# Playwright E2E Tests

Comprehensive end-to-end tests for the Foodable application using Playwright.

## 📋 Test Overview

### Test Suites

1. **Navigation Tests** (`navigation.spec.ts`)
   - Page routing and navigation
   - Footer links
   - Navbar functionality
   - Logo navigation

2. **Authentication Tests** (`authentication.spec.ts`)
   - Login form validation
   - Registration flow
   - User authentication state
   - Session management

3. **Forms Tests** (`forms.spec.ts`)
   - Contact form functionality
   - Form validation
   - Interactive elements
   - Accessibility checks

4. **Pages Tests** (`pages.spec.ts`)
   - Home page
   - About page
   - Foodbank page
   - Receiver page
   - Donator page
   - Profile page
   - Reward page
   - Page meta information
   - Performance checks
   - Responsive design
   - Error handling

5. **UI Components Tests** (`ui-components.spec.ts`)
   - Button components
   - Card components
   - Navbar functionality
   - Footer sections
   - Images and assets
   - Typography
   - Links
   - Form elements

## 🚀 Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode
```bash
npm run test:e2e:ui
```

### Run specific test file
```bash
npx playwright test navigation.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Debug tests
```bash
npx playwright test --debug
```

### View test report
```bash
npm run test:e2e:report
```

## 📊 Test Coverage

- **82 total E2E tests** covering:
  - ✅ Navigation and routing
  - ✅ Authentication flows
  - ✅ Form validation and submission
  - ✅ All page components
  - ✅ UI components
  - ✅ Responsive design
  - ✅ Accessibility
  - ✅ Performance
  - ✅ Error handling

## 🎯 Test Categories

### Critical User Flows
- User registration and login
- Food donation process
- Receiver food browsing
- Foodbank location finder
- Contact form submission

### UI/UX Validation
- Component rendering
- Interactive elements
- Mobile responsiveness
- Typography and styling

### Functional Testing
- Form validation
- Navigation links
- Button actions
- API integration points

### Accessibility Testing
- Keyboard navigation
- Form labels
- ARIA attributes
- Screen reader support

## Configuration

Tests are configured in `playwright.config.ts`:
- Base URL: `http://localhost:3000`
- Browser: Chromium
- Fully parallel execution locally, single worker on CI
- Retries: 2 on CI, 0 locally
- Screenshots: On failure only
- Videos: Retained on failure only
- Traces: On first retry
- Web server: `npm run dev` auto-started before tests

## 📝 Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Best Practices

1. **Use descriptive test names**
   ```typescript
   test('should display validation error for invalid email', ...)
   ```

2. **Wait for elements properly**
   ```typescript
   await expect(element).toBeVisible({ timeout: 5000 });
   ```

3. **Use data-testid for stable selectors**
   ```typescript
   await page.locator('[data-testid="login-button"]').click();
   ```

4. **Group related tests**
   ```typescript
   test.describe('Login Flow', () => {
     // All login-related tests
   });
   ```

5. **Clean up after tests**
   ```typescript
   test.afterEach(async ({ page }) => {
     // Cleanup
   });
   ```

## 🐛 Debugging Tests

### View test execution
```bash
npx playwright test --headed --debug
```

### Generate test code
```bash
npx playwright codegen http://localhost:3000
```

### Inspect element selectors
```bash
npx playwright inspector
```

### View trace files
```bash
npx playwright show-trace trace.zip
```

## 📊 Test Reports

After running tests, an HTML report is generated:
```bash
npx playwright show-report
```

The report includes:
- Test execution timeline
- Screenshots on failure
- Video recordings
- Trace files
- Console logs

## 🚨 Common Issues

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Tests timing out
- Increase timeout in config
- Check if dev server is running
- Verify network conditions

### Element not found
- Use `page.waitForSelector()`
- Add explicit waits
- Check element visibility
- Verify selector accuracy

## 🎨 Test Patterns

### Navigation
```typescript
await page.goto('/about');
await expect(page).toHaveURL(/.*about/);
```

### Form Filling
```typescript
await page.fill('input[name="email"]', 'test@example.com');
await page.click('button[type="submit"]');
```

### Assertions
```typescript
await expect(page.locator('.navbar')).toBeVisible();
await expect(page).toHaveTitle(/Foodable/);
```

### Mobile Testing
```typescript
await page.setViewportSize({ width: 375, height: 667 });
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Selectors Guide](https://playwright.dev/docs/selectors)

## 🤝 Contributing

When adding new tests:
1. Follow existing test structure
2. Use descriptive test names
3. Add comments for complex logic
4. Ensure tests are independent
5. Run tests locally before committing
6. Update this README if adding new suites

---

**Happy Testing! 🎭**
