# CODEE Test Suite Documentation

This document describes the test infrastructure for both the backend and frontend of the CODEE project.

## Backend Tests

### Running Tests

```bash
cd codee-backend

# Run all unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run integration tests (requires server to be running)
npm run test:integration
```

### Test Structure

Tests are organized under `src/__tests__/` with the following structure:

```
src/__tests__/
├── services/
│   ├── guardrails.test.js       # 17 tests
│   └── cacheService.test.js     # 19 tests
└── middlewares/
    └── validation.test.js       # 8 tests
```

### What's Tested

#### Guardrails Service (`guardrails.test.js`)
- **validatePrompt()**: Full validation with all checks
  - Length validation (min/max)
  - Unsafe keyword detection
  - Coding relevance checking
  - Non-coding content filtering
- **quickValidatePrompt()**: Lightweight real-time validation
- **Individual check functions**: Isolated unit tests for each validation layer

#### Cache Service (`cacheService.test.js`)
- **generateCacheKey()**: Consistent SHA-256 hash generation
- **getCachedResponse()** / **setCachedResponse()**: Cache storage and retrieval
- **clearCache()**: Cache reset functionality
- **getCacheStats()**: Statistics tracking (hits, misses, hit rate)

#### Validation Middleware (`validation.test.js`)
- Request body validation
- Empty/missing prompt detection
- Type checking (string validation)
- Error response formatting

### Test Configuration

- **Framework**: Jest with ES modules support
- **Environment**: Node.js
- **Test Environment Variables**: Configured in `.env.test`
- **Coverage**: Includes all files in `src/` except `server.js`

## Frontend Tests

### Running Tests

```bash
cd codee-frontend

# Run all tests once
CI=true npm test

# Run tests in watch mode
npm test

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

Tests are colocated with their components/modules:

```
src/
├── App.test.js                                  # 2 tests
├── components/
│   ├── ErrorMessage.test.js                     # 5 tests
│   ├── InputForm.test.js                        # 16 tests
│   └── StatusIndicator.test.js                  # 8 tests
└── services/
    └── api.test.js                              # 16 tests
```

### What's Tested

#### App Component (`App.test.js`)
- Main app rendering
- CODEE title presence
- Coding assistant container presence

#### ErrorMessage Component (`ErrorMessage.test.js`)
- Error message rendering
- Icon display
- CSS class application
- Dynamic error updates
- Empty error handling

#### InputForm Component (`InputForm.test.js`)
- Textarea and button rendering
- Character count display
- User input handling
- Form submission
- Loading states
- Button disabled states (empty, loading, invalid)
- Validation icon states (success, error, loading)
- Validation message display
- Invalid CSS class application
- Keyboard shortcuts

#### StatusIndicator Component (`StatusIndicator.test.js`)
- All three stages rendering
- Active stage highlighting
- Loader icon for active stage
- Check icons for inactive stages
- Empty stage handling

#### API Service (`api.test.js`)
- **generateCode()**: Code generation API calls
- **validatePrompt()**: Full validation API calls
- **quickValidatePrompt()**: Quick validation with error handling
- **getModels()**: Model list retrieval
- **selectModel()**: Model selection
- **healthCheck()**: Server health check
- Error handling for all endpoints

### Test Configuration

- **Framework**: Jest (via Create React App)
- **Testing Library**: @testing-library/react
- **Mocking**: 
  - `react-syntax-highlighter` is mocked to avoid import issues
  - `fetch` API is mocked for service tests
- **Setup**: Custom test setup in `setupTests.js`

## Integration Tests

The backend includes a custom integration test runner in `tests.js` that tests the live API:

```bash
# Start the backend server first
npm run dev

# In another terminal, run integration tests
npm run test:integration
```

These tests validate:
- Health check endpoint
- Request validation
- Guardrails checks
- Prompt length validation
- Unsafe content detection
- Non-coding content rejection

## Test Coverage Summary

- **Backend Unit Tests**: 52 tests in 3 suites
  - Guardrails: 17 tests
  - Cache Service: 19 tests  
  - Validation Middleware: 8 tests

- **Frontend Unit Tests**: 45 tests in 5 suites
  - App: 2 tests
  - ErrorMessage: 5 tests
  - InputForm: 16 tests
  - StatusIndicator: 8 tests
  - API Service: 16 tests

- **Total**: 97 passing tests

## Best Practices

1. **Backend Tests**:
   - Use `.env.test` for test-specific environment variables
   - Mock external dependencies (HuggingFace API)
   - Test both success and error cases
   - Verify error messages and status codes

2. **Frontend Tests**:
   - Mock third-party components that have complex dependencies
   - Test user interactions with fireEvent
   - Verify accessibility with proper labels
   - Test loading, error, and success states

3. **Integration Tests**:
   - Test against a running server
   - Verify full request/response cycles
   - Test realistic user scenarios

## CI/CD Integration

Tests can be run in CI/CD pipelines:

```bash
# Backend
cd codee-backend && npm test

# Frontend  
cd codee-frontend && CI=true npm test
```

Both test suites exit with appropriate status codes for CI integration.
