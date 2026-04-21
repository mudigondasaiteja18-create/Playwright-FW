# Environment Configuration Guide

## Setup

### 1. Create `.env` file
Copy `.env.example` to `.env` and update with your actual URLs:

```bash
cp .env.example .env
```

Then update `.env` with your environment URLs:

```env
# BETA
BETA_BASE_URL=https://beta.franklintempleton.com
BETA_API_URL=https://beta-api.franklintempleton.com/api

# STAGING
STAGING_BASE_URL=https://staging.franklintempleton.com
STAGING_API_URL=https://staging-api.franklintempleton.com/api

# PRODUCTION
PROD_BASE_URL=https://www.franklintempleton.com
PROD_API_URL=https://api.franklintempleton.com/api

# DEVELOPMENT
DEV_BASE_URL=http://localhost:3000
DEV_API_URL=http://localhost:3001/api
```

## Running Tests by Environment

### Run tests on STAGING (default)
```bash
npm test
# OR
ENVIRONMENT=staging npm test
```

### Run tests on PRODUCTION
```bash
ENVIRONMENT=prod npm test
```

### Run tests on BETA
```bash
ENVIRONMENT=beta npm test
```

### Run tests on DEVELOPMENT
```bash
ENVIRONMENT=development npm test
```

## Running Specific Tests

### Run only @smoke tests on Production
```bash
ENVIRONMENT=prod npm test -- --grep @smoke
```

### Run only @critical tests on Staging
```bash
ENVIRONMENT=staging npm test -- --grep @critical
```

### Run Franklin Templeton tests on Beta
```bash
ENVIRONMENT=beta npm test tests/franklinTempletonInvestor.spec.js
```

## Available Environments

| Environment | Base URL | Use Case |
|---|---|---|
| **beta** | https://beta.franklintempleton.com | Beta features testing |
| **staging** | https://staging.franklintempleton.com | Pre-production testing |
| **prod** | https://www.franklintempleton.com | Production testing |
| **development** | http://localhost:3000 | Local development testing |

## How It Works

1. **Environment Variable** → `ENVIRONMENT` (e.g., `prod`, `staging`, `beta`)
2. **Config Lookup** → `config/env.js` reads the environment variable
3. **URL Selection** → `getBaseURL(env)` returns the correct URL
4. **Playwright Config** → `playwright.config.js` uses the selected URL
5. **Test Executes** → Tests run against the selected environment

## Example Test Runs

### Terminal Command Examples

```bash
# Test Beta environment
ENVIRONMENT=beta npx playwright test

# Test Staging with Chromium browser
ENVIRONMENT=staging npx playwright test --project=chromium

# Test Production with debug mode
ENVIRONMENT=prod npx playwright test --debug

# Test all environments sequentially
ENVIRONMENT=beta npx playwright test && \
ENVIRONMENT=staging npx playwright test && \
ENVIRONMENT=prod npx playwright test
```

### View Environment Details in Logs

When tests run, the logs show which environment is being tested:

```
🚀 Testcase Started on STAGING environment
Base URL: https://staging.franklintempleton.com
```

## Configuration Files

- **`.env.example`** - Template for environment URLs
- **`config/env.js`** - Environment configuration logic
- **`playwright.config.js`** - Playwright configuration with environment support
- **`tests/franklinTempletonInvestor.spec.js`** - Test cases using environment config

## Default Behavior

- **Default Environment**: `staging`
- **Default Timeout**: 30 seconds (45 seconds for prod)
- **Default Workers**: 4 (1 for CI)

## CI/CD Integration

For CI/CD pipelines, set the environment variable:

```yaml
# GitHub Actions example
- name: Run tests on Production
  env:
    ENVIRONMENT: prod
  run: npm test
```

```bash
# GitLab CI example
script:
  - ENVIRONMENT=prod npm test
```
