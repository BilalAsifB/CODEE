# CI Test Requirements

This document describes the requirements and setup for running tests in the CI environment.

## Overview

The repository uses GitHub Actions for continuous integration with three workflow files:
- `ci.yml` - Main unified CI workflow (recommended)
- `backend-ci.yml` - Standalone backend testing
- `frontend-ci.yml` - Standalone frontend testing

## Backend Tests

### Prerequisites

1. **Node.js**: Version 22.x
2. **Dependencies**: Installed via `npm ci`
3. **Environment Variables**: The following environment variables must be set:
   - `HUGGING_FACE_TOKEN` - Required (stored as GitHub secret)
   - `NODE_ENV=test`
   - `PORT=5000`
   - `CACHE_ENABLED=true` (required for cache service tests)
   - `CACHE_TTL=3600`
   - `MODEL_ID_3B=bilalburney/qwen2.5-3b-coder-alpaca`
   - `MODEL_ID_0_5B=bilalburney/qwen2.5-0.5b-coder-alpaca`
   - `LOG_LEVEL=error`
   - `STREAMING_ENABLED=false`

### Test Commands

```bash
cd codee-backend
npm ci
npm run test:coverage
```

### Prettier Formatting

Backend code uses Prettier for formatting with the configuration in `.prettierrc`:
```bash
npx prettier --check "src/**/*.js"
```

Configuration:
- Single quotes: false (use double quotes)
- Bracket spacing: true
- Tab width: 2
- Trailing comma: ES5
- Semicolons: required

### Local Testing

For local testing, create a `.env.test` file in `codee-backend/` (this file is gitignored):

```env
HUGGING_FACE_TOKEN=test_token_placeholder
INFERENCE_API=https://api-inference.huggingface.co/models
MODEL_ID_3B=bilalburney/qwen2.5-3b-coder-alpaca
MODEL_ID_0_5B=bilalburney/qwen2.5-0.5b-coder-alpaca
REQUEST_TIMEOUT=300000
PORT=5000
NODE_ENV=test
LOG_LEVEL=error
CACHE_ENABLED=true
CACHE_TTL=3600
STREAMING_ENABLED=false
```

## Frontend Tests

### Prerequisites

1. **Node.js**: Version 22.x
2. **Dependencies**: Installed via `npm ci`
3. **Environment Variables**:
   - `CI=true` (for non-interactive test runs)
   - `REACT_APP_API_BASE_URL=http://localhost:5000/api`
   - `REACT_APP_DEBUG=false`

### Test Commands

```bash
cd codee-frontend
npm ci
npm test -- --coverage --watchAll=false --passWithNoTests
```

### ESLint

Frontend uses ESLint with custom configuration in `.eslintrc.json`:

```bash
npx eslint src/ --max-warnings=0
```

The configuration extends `react-app` and `react-app/jest` with custom overrides for test files:
- `testing-library/no-container` - Disabled for test files
- `testing-library/no-node-access` - Disabled for test files

### Production Build

The CI also validates production builds:

```bash
npm run build
```

Environment variables for build:
- `REACT_APP_API_BASE_URL=http://localhost:5000/api`
- `REACT_APP_DEBUG=false`

## Test File Organization

### Backend
- Tests are located in `codee-backend/src/__tests__/`
- Test files follow the pattern: `**/__tests__/**/*.test.js`
- Uses Jest with ES modules support (`NODE_OPTIONS=--experimental-vm-modules`)

### Frontend
- Tests are colocated with components
- Test files follow the pattern: `*.test.js` or `*.test.jsx`
- Uses React Testing Library and Jest (via react-scripts)

## Coverage Reports

Both backend and frontend tests generate coverage reports:
- Backend coverage: `codee-backend/coverage/`
- Frontend coverage: `codee-frontend/coverage/`

Coverage reports are uploaded as artifacts in CI with:
- 30-day retention for coverage reports
- 7-day retention for build artifacts

## Troubleshooting

### Backend Tests Fail with "Cannot find module 'dotenv/config'"
- Ensure dependencies are installed with `npm ci`
- The `.env.test` file is optional in CI (environment variables are set directly)

### Cache Service Tests Fail
- Ensure `CACHE_ENABLED=true` is set in environment variables
- The cache service requires this flag to be enabled for tests to pass

### Frontend Tests Fail with react-syntax-highlighter Errors
- Ensure `react-syntax-highlighter` is properly mocked in `setupTests.js`
- The mock is required to avoid import errors with refractor dependencies

### Prettier Check Fails
- Run `npx prettier --write "src/**/*.js"` to auto-format code
- Ensure `.prettierrc` configuration is correct (use `singleQuote`, not `singleQuotes`)

### ESLint Fails
- Run `npx eslint src/ --fix` to auto-fix simple issues
- Check `.eslintrc.json` for custom rule configurations
- Test files have relaxed rules for testing-library best practices

## GitHub Secrets

The following GitHub secrets must be configured:
- `HUGGING_FACE_TOKEN` - Token for HuggingFace API access (required for backend tests)

## CI Workflow Best Practices

1. **Use the unified CI workflow** (`ci.yml`) for most cases - it runs backend and frontend jobs in parallel
2. **Backend and frontend jobs are independent** - they can be run separately if needed
3. **The status-check job** ensures both backend and frontend pass before marking CI as successful
4. **Artifacts are automatically uploaded** for coverage reports and build outputs

## Memory Facts

The following facts have been verified and are important for CI:
- Backend uses Jest with ES modules support via `NODE_OPTIONS=--experimental-vm-modules`
- Backend tests require `.env.test` configuration file with `CACHE_ENABLED=true`
- Frontend tests must mock `react-syntax-highlighter` to avoid dependency errors
- Prettier configuration uses `singleQuote` (not `singleQuotes`)
