# 🎭 Playwright Framework - Quick Reference Guide

## 📌 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
cd PLAYWRIGHT-FW
npm install
npx playwright install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your URLs and credentials
```

### 3. Run Tests
```bash
npm test                    # Run all tests
npm run test:headed        # See browser
npm run test:debug         # Debug mode
npm run test:chrome        # Specific browser
```

### 4. View Reports
```bash
npm run report             # HTML report
npm run allure:generate    # Allure report
npm run allure:open        # Open Allure
```

---

## 📁 File Structure at a Glance

```
PLAYWRIGHT-FW/
├── 📂 config/
│   ├── env.js              ← Environment configuration
│   ├── urls.json           ← URL mappings
│   ├── globalSetup.js      ← Test initialization
│   ├── globalTeardown.js   ← Test cleanup
│   └── reporters.js        ← Report settings
│
├── 📂 pageObjects/
│   └── HomePage.js         ← Page Object Model (HIGH LEVEL)
│
├── 📂 selectors/
│   └── homePageSelectors.js ← All selectors (CENTRALIZED)
│
├── 📂 utils/
│   ├── elementActions.js   ← Element interactions (REUSABLE)
│   ├── report.js          ← Allure reporting
│   ├── logger.js          ← Logging utility
│   ├── testDataUtil.js    ← Test data management
│   ├── assertionUtils.js  ← Custom assertions
│   └── index.js           ← Central exports
│
├── 📂 tests/
│   ├── home.spec.js       ← Test cases (READABLE)
│   └── fixtures.js        ← Test setup/utilities
│
├── 📂 testData/
│   ├── testData.json      ← Main test data
│   └── users.json         ← User credentials
│
├── 📂 logs/               ← Log files
├── 📂 allure-results/     ← Allure report data
├── 📂 test-reports/       ← HTML report
│
├── playwright.config.js   ← Main Playwright config
├── package.json           ← Dependencies
├── .env                   ← Local environment variables
├── .gitignore            ← Git ignore rules
├── README.md             ← Main documentation
├── FRAMEWORK_ANALYSIS.md ← Detailed architecture
└── QUICK_REFERENCE.md    ← This file
```

---

## ⚡ Common Tasks

### Task 1: Write a Simple Test
```javascript
import { test } from '@playwright/test';
import HomePage from '../pageObjects/HomePage.js';

test('TC001 - Should login successfully', async ({ page }) => {
  const homePage = new HomePage(page);
  
  // Navigate
  await homePage.navigateToHome();
  
  // Act
  await homePage.login('user@test.com', 'password');
  
  // Assert
  await homePage.verifyPageURL('/dashboard');
});
```

### Task 2: Add Reporting Details
```javascript
import AllureReport from '../utils/report.js';

await AllureReport.addStep('Perform login', async () => {
  await homePage.login('user@test.com', 'password');
  // Automatically includes screenshots
});

await AllureReport.setSeverity('critical');
await AllureReport.addIssueLink('https://github.com/issues/123');
```

### Task 3: Use Test Data
```javascript
import testDataUtil from '../utils/testDataUtil.js';

const user = testDataUtil.getUser(0);
const loginData = testDataUtil.getLoginData('Valid Login');

await homePage.login(user.email, user.password);
```

### Task 4: Add Custom Assertions
```javascript
import AssertionUtils from '../utils/assertionUtils.js';

await AssertionUtils.assertPageTitle(page, 'Dashboard | App');
await AssertionUtils.assertURL(page, '/dashboard');
await AssertionUtils.assertElementCount(locator, 5);
```

### Task 5: Add Logging
```javascript
import { logger } from '../utils/logger.js';

logger.info('Starting test');
logger.debug('Element clicked');
logger.warn('Potential issue');
logger.error('Critical failure', error);
```

### Task 6: Create New Page Object
```javascript
import ElementActions from '../utils/elementActions.js';
import AllureReport from '../utils/report.js';

class ProductPage {
  constructor(page) {
    this.page = page;
    this.elementActions = new ElementActions(page);
  }

  async selectProduct(index) {
    await AllureReport.addStep('Select product', async () => {
      await this.elementActions.click(`.product:nth-child(${index + 1})`);
    });
  }
}

export default ProductPage;
```

### Task 7: Create New Selector File
```javascript
// selectors/productPageSelectors.js
export const ProductPageSelectors = {
  productCard: '[data-testid="product-card"]',
  productName: '[data-testid="product-name"]',
  addToCart: '[data-testid="add-to-cart"]',
  price: '[data-testid="price"]',
};
```

---

## 🎯 Code Examples

### Example 1: Simple Login Test
```javascript
test('Login with valid credentials', async ({ page }) => {
  const homePage = new HomePage(page);
  
  await homePage.navigateToHome();
  await homePage.login('user@test.com', 'password');
  
  const url = await homePage.getCurrentPageURL();
  expect(url).toContain('/dashboard');
});
```

### Example 2: Search with Verification
```javascript
test('Search functionality', async ({ page }) => {
  const homePage = new HomePage(page);
  
  await homePage.navigateToHome();
  await homePage.search('Playwright');
  
  const count = await homePage.getSearchResultsCount();
  expect(count).toBeGreaterThan(0);
});
```

### Example 3: Parameterized Test
```javascript
test('Login with multiple scenarios', async ({ page }) => {
  const homePage = new HomePage(page);
  const testData = testDataUtil.getAllData('loginData');
  
  for (const scenario of testData) {
    await homePage.login(scenario.username, scenario.password);
    // Assertion logic
  }
});
```

### Example 4: Shopping Flow
```javascript
test('Complete shopping cart flow', async ({ page }) => {
  const homePage = new HomePage(page);
  
  await homePage.navigateToHome();
  
  // Add items
  await homePage.addProductToCart(0);
  await homePage.addProductToCart(1);
  
  // Open cart
  await homePage.openCart();
  
  // Verify
  const count = await homePage.getCartItemCount();
  expect(count).toBe(2);
});
```

### Example 5: With Error Handling
```javascript
test('Handle error states', async ({ page }) => {
  const homePage = new HomePage(page);
  
  try {
    await homePage.navigateToHome();
    await homePage.verifyHomePageLoaded();
  } catch (error) {
    logger.error('Home page load failed', error);
    await AllureReport.attachScreenshot(page, 'error-state');
    throw error;
  }
});
```

---

## 🛠️ Utility Methods Reference

### ElementActions
```javascript
const actions = new ElementActions(page);

// Actions
await actions.click(selector, { highlight: true });
await actions.doubleClick(selector);
await actions.rightClick(selector);
await actions.fillText(selector, 'text');
await actions.typeText(selector, 'text', { delay: 50 });
await actions.selectOption(selector, 'value');
await actions.check(selector);
await actions.uncheck(selector);
await actions.hover(selector);
await actions.uploadFile(selector, 'path/to/file');
await actions.scrollIntoView(selector);

// Get Info
const text = await actions.getText(selector);
const attr = await actions.getAttribute(selector, 'href');

// Verify
await actions.verifyElementVisible(selector);
await actions.verifyElementHidden(selector);
await actions.verifyElementContainsText(selector, 'text');
await actions.verifyElementHasAttribute(selector, 'attr', 'value');
await actions.verifyElementEnabled(selector);
await actions.verifyElementDisabled(selector);

// Navigation
await actions.navigateTo('https://example.com');
await actions.goBack();
await actions.goForward();
await actions.refreshPage();
await actions.getCurrentURL();
await actions.verifyPageURL('/path');
await actions.getPageTitle();
await actions.verifyPageTitle('Title');

// Wait
await actions.waitForElement(selector);
await actions.waitForElementToDisappear(selector);

// Window
await actions.switchToNewWindow();
await actions.getAllWindowHandles();
await actions.closeWindow();

// Other
await actions.pressKey('Enter');
await actions.takeScreenshot('name');
await actions.executeScript('return 1 + 1');
await actions.dismissAlert();
await actions.acceptAlert();
```

### AllureReport
```javascript
// Steps
await AllureReport.addStep('Step description', async () => {
  // Step code
});

// Groups
await AllureReport.createGroup('Group name', async () => {
  // Multiple steps
});

// Attachments
await AllureReport.attachText('name', 'content');
await AllureReport.attachJSON('name', { data: 'value' });
await AllureReport.attachScreenshot(page, 'name');
await AllureReport.attachFullPageScreenshot(page, 'name');
await AllureReport.attachVideo('path/to/video.webm', 'name');
await AllureReport.attachFile('path/to/file', 'name');

// Metadata
await AllureReport.addDescription('Test description');
await AllureReport.setSeverity('critical'); // blocker, critical, normal, minor, trivial
await AllureReport.addIssueLink('https://github.com/issues/123');
await AllureReport.addRequirement('REQ-001');

// Advanced
await AllureReport.addParametrizedStep('Step', { param: 'value' }, async () => {
  // Code
});
await AllureReport.logMetrics({ metric: 1000 });
await AllureReport.attachDetailedReport('Title', { key: 'value' });
```

### Logger
```javascript
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', errorObject);
logger.step('Category', 'Message');
logger.testResult('Test Name', 'PASS|FAIL|SKIP');
logger.context('Context', 'Message');
```

### TestDataUtil
```javascript
const data = testDataUtil;

// Load data
const testData = data.loadTestData('testData');

// Get by path
const email = data.getDataByPath('testData', 'users.0.email');

// Get specific
const user = data.getUser(0);  // By index
const user = data.getUser('username');  // By username
const loginData = data.getLoginData('Valid Login');
const formData = data.getFormData(0);

// Get all
const allUsers = data.getAllData('users');
const allLoginData = data.getAllData('loginData');

// Utilities
const provider = data.getTestDataProvider('loginData');
data.clearCache();
const merged = data.mergeTestData('testData', { newKey: 'value' });
const random = data.getRandomItem('testData', 'users');
```

### AssertionUtils
```javascript
// Element text
await AssertionUtils.assertElementText(element, 'text', 'description');

// Visibility
await AssertionUtils.assertElementsVisible([elem1, elem2], 'description');

// Attributes
await AssertionUtils.assertAttributeValue(element, 'attr', 'value', 'desc');
await AssertionUtils.assertHasClass(element, 'classname', 'desc');

// Count & States
await AssertionUtils.assertElementCount(locator, 5, 'desc');
await AssertionUtils.assertDisabled(element, 'desc');
await AssertionUtils.assertEnabled(element, 'desc');
await AssertionUtils.assertChecked(element, 'desc');

// Page
await AssertionUtils.assertURL(page, '/path', 'desc');
await AssertionUtils.assertPageTitle(page, 'Title', 'desc');

// Values
await AssertionUtils.assertInputValue(input, 'value', 'desc');

// Data
await AssertionUtils.assertArrayEquals([1,2,3], [1,2,3], 'desc');
await AssertionUtils.assertObjectProperties(obj, { key: 'val' }, 'desc');

// Custom
await AssertionUtils.assertCondition(true, 'Error message', 'desc');
```

---

## 🔐 Environment Variables

### Essential Variables
```env
ENVIRONMENT=testing                    # development|staging|production|testing
BASE_URL=https://example.com          # Application URL
HEADLESS=true                         # true|false
LOG_LEVEL=info                        # debug|info|warn|error
```

### Advanced Variables
```env
DEV_BASE_URL=http://localhost:3000
STAGING_BASE_URL=https://staging.example.com
PROD_BASE_URL=https://example.com

DEV_API_URL=http://localhost:3001/api
STAGING_API_URL=https://staging-api.example.com/api
PROD_API_URL=https://api.example.com/api

SLOW_MO=0
DEVTOOLS=false
DEFAULT_TIMEOUT=30000
MAX_RETRIES=2

TEST_USER_EMAIL=testuser@example.com
TEST_USER_PASSWORD=SecurePassword123
```

---

## 🏃 Running Tests - All Options

```bash
# Basic
npm test                              # All tests, all browsers
yarn test                            # Using yarn

# Specific Browser
npm run test:chrome                  # Chromium only
npm run test:firefox                 # Firefox only
npm run test:webkit                  # WebKit only
npm run test:all-browsers            # All browsers

# Execution Modes
npm run test:headed                  # See browser
npm run test:debug                   # Debug mode with inspector

# Advanced
npx playwright test tests/home.spec.js                    # Specific file
npx playwright test tests/home.spec.js -g "TC001"         # By test name
npx playwright test tests/ -g "@smoke"                    # By tag
npx playwright test --workers=1                           # Serial execution
npx playwright test --workers=4                           # 4 parallel workers
npx playwright test --retries=2                           # Retries

# Reports
npm run report                       # HTML report
npm run allure:generate             # Generate Allure
npm run allure:open                 # Open Allure report

# Code Generation
npm run codegen                      # Record interactions
npm run trace:show                   # Show trace files
```

---

## 🐛 Debugging Tips

### Enable Debug Logging
```bash
DEBUG=pw:api npm test
```

### Use Browser DevTools
```bash
# playwright.config.js → devtools: true
npm run test:headed
# Press 'pause' button in DevTools
```

### Use Trace Files
```javascript
// playwright.config.js
trace: 'on-first-retry'

// View trace
npx playwright show-trace test-results/trace.zip
```

### Manual Debugging
```javascript
import { test } from '@playwright/test';

test.only('Debug test', async ({ page }) => {
  await page.pause();  // Pause execution
  // Use inspector to debug
});
```

---

## ✅ Checklist for New Framework User

- [ ] Installed Node.js and npm
- [ ] Installed project dependencies: `npm install`
- [ ] Installed Playwright browsers: `npx playwright install`
- [ ] Created `.env` file from `.env.example`
- [ ] Ran a test: `npm test`
- [ ] Viewed a report: `npm run report`
- [ ] Created a simple test case
- [ ] Understood POM pattern
- [ ] Used ElementActions class
- [ ] Added Allure reporting

---

## 🎓 Learning Path

1. **Week 1**: Understand structure, run existing tests
2. **Week 2**: Write simple test cases, use HomePage
3. **Week 3**: Create new page objects, add selectors
4. **Week 4**: Add complex tests, use test data, reporting

---

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Tests timing out | Increase timeout in config |
| Selectors not found | Verify selector with dev tools |
| No screenshots | Check headless mode & config |
| Flaky tests | Add explicit waits, reduce parallelization |
| Report not generating | Clear allure-results, run again |
| Modules not found | Run `npm install` again |

---

## 📚 Additional Resources

- [Playwright Docs](https://playwright.dev)
- [Allure Documentation](https://docs.qameta.io/allure/)
- [Best Practices](./README.md)
- [Framework Analysis](./FRAMEWORK_ANALYSIS.md)

---

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
