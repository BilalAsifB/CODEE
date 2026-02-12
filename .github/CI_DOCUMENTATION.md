# CI/CD Pipeline Documentation

## Overview

This repository uses GitHub Actions for continuous integration and deployment. The CI pipelines automatically run tests, quality checks, and build verification on every push and pull request.

## Workflows

### 1. Unified CI (`ci.yml`) - **RECOMMENDED**
**Trigger:** All pushes and pull requests  
**Purpose:** Main CI workflow that runs both backend and frontend in parallel

**Jobs:**
- **Backend Job**: 
  - Install dependencies with caching
  - Run Prettier formatting check
  - Run Jest tests with coverage
  - Upload coverage artifacts
  
- **Frontend Job**:
  - Install dependencies with caching  
  - Run ESLint (if configured)
  - Run React tests with coverage
  - Build production bundle
  - Upload coverage and build artifacts
  
- **Status Check Job**:
  - Runs after backend and frontend
  - Fails if either job fails
  - Used for branch protection rules

**Runtime:** ~3-5 minutes (parallel execution)

### 2. Backend CI (`backend-ci.yml`)
**Trigger:** All pushes and pull requests  
**Purpose:** Standalone backend testing workflow

Runs the same checks as the backend job in `ci.yml` but independently.

### 3. Frontend CI (`frontend-ci.yml`)
**Trigger:** All pushes and pull requests  
**Purpose:** Standalone frontend testing workflow

Runs the same checks as the frontend job in `ci.yml` but independently.

## Configuration

### Node.js Version
All workflows use **Node.js 22.x** (current version). This is configured in the `setup-node` action:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22.x'
```

### Dependency Caching
Enabled for faster workflow runs. Caches are keyed by `package-lock.json`:

```yaml
cache: 'npm'
cache-dependency-path: './codee-backend/package-lock.json'
```

### Environment Variables

#### Backend
- `HUGGING_FACE_TOKEN` (secret) - Required for tests
- `NODE_ENV=test`
- `PORT=5000`

#### Frontend
- `CI=true` - Disables interactive mode
- `REACT_APP_API_BASE_URL=http://localhost:5000/api`
- `REACT_APP_DEBUG=false`

## Required Secrets

Add these to your GitHub repository secrets (Settings → Secrets and variables → Actions):

| Secret Name | Description | Required By |
|-------------|-------------|-------------|
| `HUGGING_FACE_TOKEN` | HuggingFace API token for model access | Backend tests |

**To add secrets:**
1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Add `HUGGING_FACE_TOKEN` with your token value

## Artifacts

### Coverage Reports
- **Name**: `backend-coverage`, `frontend-coverage`
- **Path**: `./codee-{backend|frontend}/coverage/`
- **Retention**: 30 days
- **Format**: HTML, JSON, LCOV

### Build Artifacts
- **Name**: `frontend-build`
- **Path**: `./codee-frontend/build/`
- **Retention**: 7 days
- **Contents**: Production-ready static files

## Branch Protection (Recommended)

To enforce CI checks before merging:

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select required checks:
   - `All Checks Passed` (from ci.yml)
   - Or: `Backend` and `Frontend` individually

## Troubleshooting

### Cache Issues
If dependencies seem stale, manually clear the cache:
- Go to Actions tab → Caches
- Delete caches for the branch

### Workflow Not Running
- Check if Actions are enabled (Settings → Actions → General)
- Verify workflow files are in `.github/workflows/` and have `.yml` extension
- Check workflow syntax with a YAML linter

### Failed Tests
- Review the workflow logs in the Actions tab
- Check if `HUGGING_FACE_TOKEN` secret is set correctly
- Verify `.env.test` file exists in codee-backend/

### Coverage Upload Fails
Coverage upload uses `if: always()` so it should run even if tests fail. If uploads fail:
- Check artifact paths match actual coverage output locations
- Verify workflow has write permissions

## Local Testing

Before pushing, you can run the same checks locally:

### Backend
```bash
cd codee-backend
npm ci
npx prettier --check "src/**/*.js"
npm run test:coverage
```

### Frontend
```bash
cd codee-frontend
npm ci
npx eslint src/ --max-warnings=0
npm test -- --coverage --watchAll=false
npm run build
```

## Maintenance

### Updating Node.js Version
Change `node-version` in all three workflow files:
```yaml
node-version: '22.x'  # Update this
```

### Adding New Checks
Add steps to the appropriate job in `ci.yml`:
```yaml
- name: Your new check
  run: npm run your-command
```

### Modifying Triggers
Edit the `on` section to change when workflows run:
```yaml
on:
  push:
    branches: ['main']  # Only main branch
  pull_request:
    branches: ['main']  # Only PRs to main
```

## Performance Tips

1. **Use npm ci instead of npm install** - Faster and more reliable
2. **Enable caching** - Already configured
3. **Run jobs in parallel** - Already configured in ci.yml
4. **Limit artifact retention** - Already optimized (7-30 days)
5. **Use specific paths for triggers** - Add if workflows become too frequent:
   ```yaml
   paths:
     - 'codee-backend/**'
     - '.github/workflows/backend-ci.yml'
   ```

## Monitoring

- View workflow runs: Repository → Actions tab
- Check status badges in README.md
- Monitor workflow run times to detect performance degradation
- Review coverage trends in artifacts

## Support

For issues with:
- **GitHub Actions**: [GitHub Actions Documentation](https://docs.github.com/en/actions)
- **Workflow syntax**: [Workflow syntax reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- **Node.js setup**: [setup-node action](https://github.com/actions/setup-node)
