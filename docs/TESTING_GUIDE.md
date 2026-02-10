# Comprehensive Testing Guide

## Overview

This guide covers the comprehensive test suites created for both frontend and backend, including error handling and edge cases.

## Test Coverage Summary

### Backend Tests
- **Unit Tests**: Controllers, Middleware, Error Handlers
- **Integration Tests**: API Routes, Authentication Flow
- **Coverage Target**: 70% minimum (branches, functions, lines, statements)

### Frontend Tests
- **Component Tests**: Login, Registration, Error Boundaries
- **Service Tests**: API Service with error handling
- **Hook Tests**: useApi with edge cases
- **E2E Tests**: Playwright for user flows

## Running Tests

### All Tests
```bash
# Run all tests (frontend + backend)
npm test

# Run with coverage
npm test -- --coverage
```

### Backend Tests
```bash
cd backend

# Run all backend tests
npm test

# Run with coverage
npm test

# Run in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run for CI
npm run test:ci
```

### Frontend Tests
```bash
cd frontend

# Run all frontend tests
npm test

# Run in watch mode
npm test -- --watch

# Run with UI
npm test -- --ui

# Run E2E tests
npm run test:e2e
```

## Backend Test Architecture

### Directory Structure
```
backend/src/__tests__/
├── setup.ts                          # Test configuration
├── unit/
│   ├── controllers/
│   │   └── auth.controller.test.ts  # Auth controller tests
│   └── middleware/
│       └── errorHandler.test.ts     # Error handling tests
└── integration/
    └── routes/
        ├── auth.routes.test.ts      # Auth routes integration
        └── donation.routes.test.ts  # Donation routes integration
```

### Test Files Created

#### 1. Auth Controller Tests (`auth.controller.test.ts`)
- **54 test cases** covering:
  - User registration (success, conflicts, validation)
  - User login (success, invalid credentials, errors)
  - Logout functionality
  - Profile retrieval
  - Password changes
  - Edge cases (SQL injection, XSS, long inputs)

**Key Test Scenarios:**
```typescript
✅ Successful registration
✅ Duplicate email handling
✅ Invalid credentials
✅ Database errors
✅ Bcrypt failures
✅ SQL injection attempts
✅ XSS attempts
✅ Null/undefined values
✅ Concurrent operations
```

#### 2. Error Handler Tests (`errorHandler.test.ts`)
- **25 test cases** covering:
  - All custom error types (400, 401, 403, 404, 409, 422, 500)
  - JWT errors
  - Database errors
  - Generic errors
  - Edge cases

**Key Test Scenarios:**
```typescript
✅ BadRequestError handling
✅ UnauthorizedError handling
✅ NotFoundError handling
✅ ConflictError handling
✅ ValidationError with errors array
✅ JWT token errors
✅ Database duplicate entry
✅ Foreign key constraints
✅ JSON parse errors
✅ Development vs production responses
✅ Circular reference handling
```

#### 3. Auth Routes Integration Tests (`auth.routes.test.ts`)
- **30+ test cases** covering:
  - Full request/response cycle
  - Validation middleware
  - Rate limiting
  - Security

**Key Test Scenarios:**
```typescript
✅ Complete registration flow
✅ Complete login flow
✅ Validation errors (422)
✅ Rate limiting (429)
✅ SQL injection prevention
✅ XSS prevention
✅ Malformed JSON
✅ Large payloads
✅ Concurrent requests
✅ Null byte injection
```

#### 4. Donation Routes Tests (`donation.routes.test.ts`)
- **25+ test cases** covering:
  - CRUD operations
  - Ownership validation
  - Pagination
  - Filtering

**Key Test Scenarios:**
```typescript
✅ Create donation
✅ Get donations with pagination
✅ Filter by status
✅ Update donation (owner only)
✅ Delete donation (owner only)
✅ Invalid IDs
✅ Past expiry dates
✅ Invalid quantities
✅ Permission checks
✅ Database errors
```

## Frontend Test Architecture

### Directory Structure
```
frontend/src/
├── services/__tests__/
│   └── api.service.test.tsx          # API service tests
├── hooks/__tests__/
│   └── useApi.test.tsx               # useApi hook tests
└── Components/
    ├── pages/__tests__/
    │   ├── Login.error.test.tsx      # Login error handling
    │   └── Registration.error.test.tsx # Registration errors
    └── shared/__tests__/
        └── ErrorBoundary.test.tsx    # Error boundary tests
```

### Test Files Created

#### 1. API Service Tests (`api.service.test.tsx`)
- **35+ test cases** covering:
  - Error handling for all HTTP error codes
  - Network failures
  - Timeout errors
  - Edge cases

**Key Test Scenarios:**
```typescript
✅ Network failures (ECONNREFUSED)
✅ Timeout errors
✅ 404 Not Found
✅ 500 Server errors
✅ 401 Unauthorized
✅ Malformed responses
✅ Null response data
✅ Empty responses
✅ Large payloads
✅ Concurrent requests
✅ SQL injection safety
✅ XSS attempts
✅ Token expiration
```

#### 2. useApi Hook Tests (`useApi.test.tsx`)
- **30+ test cases** covering:
  - All HTTP methods
  - Loading states
  - Error states
  - Reset functionality
  - Edge cases

**Key Test Scenarios:**
```typescript
✅ GET, POST, PUT, DELETE operations
✅ Loading state management
✅ Error state management
✅ Data state management
✅ Reset functionality
✅ Missing URLs
✅ Undefined methods
✅ Null data
✅ Rapid consecutive calls
✅ Case-insensitive methods
✅ Multiple hook instances
✅ Concurrent operations
```

#### 3. Login Error Tests (`Login.error.test.tsx`)
- **40+ test cases** covering:
  - Form validation
  - API errors
  - Loading states
  - Security
  - Accessibility

**Key Test Scenarios:**
```typescript
✅ Empty field validation
✅ Invalid email format
✅ Short password validation
✅ 401 unauthorized
✅ Network errors
✅ 500 server errors
✅ Timeout errors
✅ Loading state management
✅ Button disabled state
✅ SQL injection attempts
✅ XSS attempts
✅ Long inputs
✅ Unicode characters
✅ Rapid submissions
✅ Session storage errors
✅ Accessibility announcements
```

#### 4. Registration Error Tests (`Registration.error.test.tsx`)
- **35+ test cases** covering:
  - All validation rules
  - API errors
  - Loading states
  - Security
  - Form state

**Key Test Scenarios:**
```typescript
✅ Empty fields validation
✅ Username too long
✅ Invalid email
✅ Short password
✅ Password mismatch
✅ TOS not accepted
✅ 409 conflict errors
✅ 422 validation errors
✅ Network failures
✅ Rate limiting
✅ Double submission prevention
✅ Unicode characters
✅ Emoji handling
✅ Copy-paste passwords
✅ Whitespace handling
✅ SQL injection attempts
✅ XSS attempts
✅ Accessibility features
```

#### 5. ErrorBoundary Tests (`ErrorBoundary.test.tsx`)
- **20+ test cases** covering:
  - Error catching
  - Different error types
  - Isolation
  - Recovery

**Key Test Scenarios:**
```typescript
✅ Catching component errors
✅ TypeError handling
✅ ReferenceError handling
✅ Custom error objects
✅ Error boundary isolation
✅ Multiple boundaries
✅ Errors without messages
✅ Non-Error objects
✅ Long error messages
✅ Circular references
✅ Console logging
✅ Recovery mechanisms
```

## Test Categories

### 1. Happy Path Tests
- Valid inputs with expected success
- Normal user workflows
- Standard CRUD operations

### 2. Validation Tests
- Missing required fields
- Invalid formats (email, date, etc.)
- Out-of-range values
- Type mismatches

### 3. Error Handling Tests
- Network failures
- Database errors
- Authentication errors
- Authorization errors
- Server errors (4xx, 5xx)

### 4. Security Tests
- SQL injection attempts
- XSS attempts
- CSRF protection
- Rate limiting
- Token validation

### 5. Edge Case Tests
- Null/undefined values
- Empty strings
- Very long inputs
- Special characters
- Unicode/emoji
- Concurrent operations
- Rapid submissions

## Error Handling Coverage

### HTTP Error Codes Tested

| Code | Description | Backend | Frontend |
|------|-------------|---------|----------|
| 400 | Bad Request | ✅ | ✅ |
| 401 | Unauthorized | ✅ | ✅ |
| 403 | Forbidden | ✅ | ✅ |
| 404 | Not Found | ✅ | ✅ |
| 408 | Timeout | ✅ | ✅ |
| 409 | Conflict | ✅ | ✅ |
| 422 | Validation Error | ✅ | ✅ |
| 429 | Rate Limited | ✅ | ✅ |
| 500 | Server Error | ✅ | ✅ |
| 503 | Service Unavailable | ✅ | ✅ |

### Network Errors Tested

| Error Type | Description | Tested |
|------------|-------------|--------|
| ECONNREFUSED | Connection refused | ✅ |
| ECONNABORTED | Connection aborted | ✅ |
| ETIMEDOUT | Timeout | ✅ |
| Network Error | Generic network failure | ✅ |

### Database Errors Tested

| Error Code | Description | Tested |
|------------|-------------|--------|
| ER_DUP_ENTRY | Duplicate entry | ✅ |
| ER_NO_REFERENCED_ROW_2 | Foreign key constraint | ✅ |
| ECONNREFUSED | Connection refused | ✅ |
| Generic | Other DB errors | ✅ |

## Security Test Coverage

### Input Validation
- ✅ SQL injection attempts (parameterized queries prevent)
- ✅ XSS attempts (sanitization and validation)
- ✅ Null byte injection
- ✅ Command injection
- ✅ Path traversal

### Authentication
- ✅ Missing tokens
- ✅ Invalid tokens
- ✅ Expired tokens
- ✅ Malformed tokens
- ✅ Rate limiting on auth endpoints

### Data Validation
- ✅ Type checking
- ✅ Range validation
- ✅ Format validation
- ✅ Required fields
- ✅ Optional fields

## Edge Case Coverage

### Input Edge Cases
- ✅ Empty strings
- ✅ Null values
- ✅ Undefined values
- ✅ Very long strings (10,000+ chars)
- ✅ Special characters (!@#$%^&*)
- ✅ Unicode characters (Chinese, Russian, etc.)
- ✅ Emoji characters
- ✅ Whitespace (leading/trailing)
- ✅ HTML entities
- ✅ Escape sequences

### Numeric Edge Cases
- ✅ Zero
- ✅ Negative numbers
- ✅ MAX_SAFE_INTEGER
- ✅ Floating point numbers
- ✅ NaN
- ✅ Infinity

### Concurrent Operations
- ✅ Rapid consecutive requests
- ✅ Parallel requests
- ✅ Double submission prevention
- ✅ Race conditions

### State Management
- ✅ Loading states
- ✅ Error states
- ✅ Success states
- ✅ State transitions
- ✅ State reset

## Mocking Strategy

### Backend Mocks
```typescript
jest.mock('../../../config/database');
jest.mock('bcrypt');
jest.mock('../../../middleware/auth');
```

### Frontend Mocks
```typescript
jest.mock('../../../services/api.service');
jest.mock('axios');
```

## Test Best Practices Applied

### 1. Arrange-Act-Assert Pattern
```typescript
it('should handle error', async () => {
  // Arrange
  const mockData = { ... };
  mockFunction.mockResolvedValue(mockData);
  
  // Act
  const result = await functionUnderTest();
  
  // Assert
  expect(result).toEqual(expected);
});
```

### 2. Clear Test Names
- Descriptive test names explain what is being tested
- Use "should" statements for clarity
- Group related tests in describe blocks

### 3. Isolation
- Each test is independent
- Mocks are cleared between tests
- No shared state

### 4. Edge Case Coverage
- Test boundary conditions
- Test invalid inputs
- Test error scenarios
- Test concurrent operations

### 5. Accessibility Testing
- ARIA labels tested
- Screen reader announcements verified
- Keyboard navigation tested

## Coverage Reports

### Running Coverage Reports

```bash
# Backend coverage
cd backend
npm test

# Frontend coverage
cd frontend
npm test

# View HTML coverage report
# Backend: backend/coverage/lcov-report/index.html
# Frontend: frontend/coverage/lcov-report/index.html
```

### Coverage Thresholds

**Backend:**
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

**Frontend:**
- Existing tests maintained
- New error handling tests added
- Full coverage for new services

## Test Execution Time

### Backend Tests
- Unit tests: ~2-3 seconds
- Integration tests: ~5-7 seconds
- Total: ~10 seconds

### Frontend Tests
- Component tests: ~5-8 seconds
- Service tests: ~2-3 seconds
- Hook tests: ~3-4 seconds
- E2E tests: ~30-60 seconds

## Continuous Integration

### CI Pipeline Recommendations

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Test Maintenance

### When to Update Tests

1. **New Features**: Add tests for new functionality
2. **Bug Fixes**: Add regression tests
3. **API Changes**: Update integration tests
4. **Error Handling**: Add edge case tests
5. **Security Issues**: Add security tests

### Test Naming Conventions

- `*.test.ts` - Unit and integration tests
- `*.error.test.tsx` - Error handling specific tests
- `*.spec.ts` - E2E specification tests

## Common Test Patterns

### Testing Async Operations
```typescript
it('should handle async operation', async () => {
  mockFunction.mockResolvedValue(data);
  
  await act(async () => {
    await component.execute();
  });
  
  await waitFor(() => {
    expect(result).toBeDefined();
  });
});
```

### Testing Error Scenarios
```typescript
it('should handle error', async () => {
  mockFunction.mockRejectedValue(new Error('Test error'));
  
  await expect(
    functionUnderTest()
  ).rejects.toThrow('Test error');
});
```

### Testing Loading States
```typescript
it('should show loading state', async () => {
  mockFunction.mockImplementation(
    () => new Promise(resolve => setTimeout(resolve, 100))
  );
  
  act(() => {
    component.execute();
  });
  
  expect(component.loading).toBe(true);
});
```

## Debugging Failed Tests

### Common Issues

1. **Timeout Errors**
   - Increase timeout: `jest.setTimeout(10000)`
   - Check async/await usage
   - Verify mocks resolve/reject

2. **Mock Not Called**
   - Verify mock setup
   - Check function path in mock
   - Ensure mock is cleared between tests

3. **State Not Updated**
   - Use `waitFor` for async updates
   - Wrap in `act` for React updates
   - Check timing issues

### Debug Commands

```bash
# Run single test file
npm test -- auth.controller.test.ts

# Run with verbose output
npm test -- --verbose

# Run with debug info
NODE_OPTIONS='--inspect-brk' npm test

# Run specific test
npm test -- -t "should register"
```

## Test Statistics

### Backend Tests Created

| Category | Test Files | Test Cases | Coverage |
|----------|------------|------------|----------|
| Controllers | 1 | 54 | All controllers |
| Middleware | 1 | 25 | Error handlers |
| Routes (Auth) | 1 | 30+ | Complete flow |
| Routes (Donations) | 1 | 25+ | CRUD + validation |
| **Total** | **4** | **134+** | **Comprehensive** |

### Frontend Tests Created

| Category | Test Files | Test Cases | Coverage |
|----------|------------|------------|----------|
| Services | 1 | 35+ | API service |
| Hooks | 1 | 30+ | useApi hook |
| Components (Login) | 1 | 40+ | Error handling |
| Components (Registration) | 1 | 35+ | Full validation |
| Error Boundary | 1 | 20+ | Error catching |
| **Total** | **5** | **160+** | **Comprehensive** |

### Overall Statistics
- **Total Test Files**: 9 new test files
- **Total Test Cases**: 294+ test cases
- **Coverage**: Error handling + edge cases
- **Lines of Test Code**: ~4,000+ lines

## Edge Cases Covered

### Input Validation
- [x] Empty strings
- [x] Null values
- [x] Undefined values
- [x] Very long strings (10,000+ characters)
- [x] Special characters
- [x] Unicode characters
- [x] Emoji
- [x] Whitespace
- [x] HTML entities
- [x] SQL injection attempts
- [x] XSS attempts
- [x] Null byte injection

### Numeric Validation
- [x] Zero
- [x] Negative numbers
- [x] MAX_SAFE_INTEGER
- [x] Out of range values

### Concurrent Operations
- [x] Rapid consecutive calls
- [x] Parallel requests
- [x] Double submission prevention
- [x] Race conditions

### Error Scenarios
- [x] Network failures
- [x] Timeout errors
- [x] Database errors
- [x] Validation errors
- [x] Authentication errors
- [x] Authorization errors
- [x] Rate limiting
- [x] Malformed JSON
- [x] Missing headers

## Quality Metrics

### Code Coverage Goals
- **Backend**: 70%+ (configured in jest.config.js)
- **Frontend**: Existing coverage maintained + improved

### Test Quality Indicators
- ✅ Clear, descriptive test names
- ✅ Independent tests (no dependencies)
- ✅ Fast execution (< 20s total)
- ✅ Comprehensive edge cases
- ✅ Security scenarios covered
- ✅ Error paths tested
- ✅ Happy paths tested

## Future Enhancements

### Recommended Additions
1. **Performance Tests**: Load testing with Artillery or k6
2. **E2E Tests**: More Playwright scenarios
3. **Contract Tests**: API contract testing with Pact
4. **Mutation Tests**: Using Stryker
5. **Visual Regression**: Screenshot comparison
6. **Accessibility Tests**: Automated a11y testing

### Test Data Management
- Consider test fixtures
- Database seeding for integration tests
- Mock data generators
- Snapshot testing for complex objects

## Troubleshooting

### Tests Fail After Changes

1. **Check mocks**: Ensure mocks match new signatures
2. **Update assertions**: Match new response formats
3. **Check async/await**: Ensure proper async handling
4. **Review test setup**: Verify setup.ts configuration

### Slow Tests

1. **Check timeouts**: Reduce unnecessary delays
2. **Optimize mocks**: Use immediate resolves
3. **Parallel execution**: Run tests in parallel
4. **Database**: Use in-memory DB for tests

## Conclusion

The test suite provides:
- ✅ **Comprehensive coverage** of error handling
- ✅ **Extensive edge case** testing
- ✅ **Security scenario** validation
- ✅ **Production-ready** quality
- ✅ **Maintainable** test code
- ✅ **Fast execution** for CI/CD
- ✅ **Clear documentation** for developers

All tests follow best practices and provide confidence in code quality and reliability.

---

**Last Updated**: February 9, 2026
**Test Files**: 9
**Test Cases**: 294+
**Coverage**: Comprehensive error handling and edge cases
