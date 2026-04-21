# Playwright Framework for Robust E2E Testing

A comprehensive, enterprise-grade Playwright testing framework built with best practices for scalable automation testing.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Framework Features](#framework-features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Reporting](#reporting)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🏗️ Project Structure

```
project-root/
│
├── config/                          # Configuration files
│   ├── env.js                      # Environment configuration
│   ├── urls.json                   # URL configuration
│   ├── globalSetup.js              # Global test setup
│   ├── globalTeardown.js           # Global test teardown
│   └── reporters.js                # Reporter configuration
│
├── pageObjects/                    # POM Layer - Reusable page objects
│   └── HomePage.js                 # Home page object with business logic
│
├── selectors/                      # Element selectors centralization
│   └── homePageSelectors.js        # All home page selectors
│
├── tests/                          # Test specifications
│   └── home.spec.js               # Test cases using POM
│
├── testData/                       # Test data management
│   ├── testData.json              # Main test data
│   └── users.json                 # User credentials
│
├── utils/                         # Utility functions and helpers
│   ├── elementActions.js          # Reusable element interaction methods
│   ├── report.js                  # Allure reporting utilities
│   └── logger.js                  # Logging utility
│
├── allure-results/               # Allure report results
├── test-reports/                 # HTML test reports
├── logs/                         # Application logs
│
├── playwright.config.js          # Playwright configuration
├── package.json                  # Project dependencies
├── .gitignore                    # Git ignore rules
├── .env                          # Environment variables (not in repo)
└── README.md                     # Project documentation
```

## ✨ Framework Features

### 1. **Page Object Model (POM)**
- Centralized page object classes (`HomePage.js`)
- Separation of test logic from implementation
- Reusable business-level methods
- Easy maintenance and scalability

### 2. **Element Actions Utility**
- Comprehensive element interaction methods
- Built-in highlighting for visual debugging
- Automatic screenshot capture on actions
- Exception handling and logging

### 3. **Advanced Reporting**
- **Allure Reports Integration**
  - Detailed step-by-step execution
  - Screenshots and video attachments
  - Custom metrics and parameters
  - Severity levels and issue tracking
  - Network activity and performance data

### 4. **Selector Centralization**
- All selectors in one place (`homePageSelectors.js`)
- Dynamic selector generation
- XPath helpers for complex selections
- Easy selector updates

### 5. **Test Data Management**
- Centralized JSON-based test data
- Parameterized test scenarios
- Environment-specific configurations
- Multiple data sets per test case

### 6. **Logging & Debugging**
- Comprehensive logging system
- Multiple log levels (debug, info, warn, error)
- File and console logging
- Step-by-step execution tracking

### 7. **Multi-Browser Support**
- Chromium, Firefox, WebKit browsers
- Mobile browser support
- Parallel test execution
- Retry mechanism for flaky tests

### 8. **Performance Monitoring**
- Load time tracking
- Resource metrics
- Network performance
- Custom metrics logging

## 🚀 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Setup

1. **Clone/Initialize Repository**
   ```bash
   cd PLAYWRIGHT-FW
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install Browsers**
   ```bash
   npx playwright install
   ```

4. **Install Allure Commandline (Optional)**
   ```bash
   npm install -g allure-commandline
   ```

## ⚙️ Configuration

### Environment Configuration

Create a `.env` file in the project root:

```env
# Environment Setting
ENVIRONMENT=testing
BASE_URL=https://example.com
DEV_BASE_URL=http://localhost:3000
STAGING_BASE_URL=https://staging.example.com
PROD_BASE_URL=https://example.com

# Browser Settings
HEADLESS=true
SLOW_MO=0
DEVTOOLS=false

# Logging
LOG_LEVEL=info

# Timeouts
DEFAULT_TIMEOUT=30000

# Retry Configuration
MAX_RETRIES=2
```

### Browser Configuration

Edit `playwright.config.js` to customize:

```javascript
// Change workers for parallel execution
workers: process.env.CI ? 1 : 4,

// Configure timeouts
timeout: 30 * 1000,

// Set report location
reporter: [...],
```

## 📖 Usage

### Using Page Objects (HomePage.js)

```javascript
import HomePage from '../pageObjects/HomePage.js';

test('Login test', async ({ page }) => {
  const homePage = new HomePage(page);
  
  // Navigate to home
  await homePage.navigateToHome();
  
  // Perform login
  await homePage.login('user@example.com', 'password', {
    description: 'Valid user login'
  });
  
  // Verify success
  await homePage.verifyPageURL('/dashboard');
});
```

### Using Element Actions

```javascript
import ElementActions from '../utils/elementActions.js';

test('Click and verify', async ({ page }) => {
  const elementActions = new ElementActions(page);
  
  // Click with highlighting
  await elementActions.click('#button-id', { highlight: true });
  
  // Verify element
  await elementActions.verifyElementVisible('#success-message');
  
  // Get text content
  const text = await elementActions.getText('#title');
});
```

### Using Allure Reporting

```javascript
import AllureReport from '../utils/report.js';

await AllureReport.addStep('Login user', async () => {
  await page.fill('#email', 'user@test.com');
  await AllureReport.attachScreenshot(page, 'login-form');
});

await AllureReport.setSeverity('critical');
await AllureReport.attachJSON('User Data', userData);
await AllureReport.addIssueLink('https://github.com/issues/123');
```

### Parameterized Tests with Test Data

```javascript
import testData from '../testData/testData.json';

test('Login with multiple scenarios', async ({ page }) => {
  const homePage = new HomePage(page);
  
  for (const scenario of testData.loginData) {
    await homePage.login(scenario.username, scenario.password, {
      description: scenario.testCase
    });
  }
});
```

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run in Headed Mode (see browser)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### Run Specific Test File
```bash
npx playwright test tests/home.spec.js
```

### Run Tests with Grep Pattern
```bash
npx playwright test -g "TC001"
```

### Run Tests with Tags
```bash
npx playwright test -g "@critical"
npx playwright test -g "@smoke"
```

## 📊 Reporting

### HTML Report
```bash
npm run report
```

### Generate Allure Report
```bash
npm run allure:generate
```

### Open Allure Report
```bash
npm run allure:open
```

### View HTML Report
```bash
npx playwright show-report
```

## 🎯 Best Practices

### 1. **Page Object Model**
- ✅ Create separate page objects for each page
- ✅ Use descriptive method names
- ✅ Group related actions together
- ✅ Keep test data separate from logic

### 2. **Selector Strategy**
- ✅ Use data-testid attributes
- ✅ Centralize all selectors
- ✅ Use meaningful selector names
- ✅ Avoid brittle XPath when possible
- ✅ Use dynamic selectors for lists

### 3. **Test Design**
- ✅ One assertion per step (or logical group)
- ✅ Use meaningful test names (TC001, TC002)
- ✅ Include tags (@smoke, @critical, @regression)
- ✅ Parameterize repetitive tests
- ✅ Use test fixtures for setup/teardown

### 4. **Wait Strategies**
- ✅ Use implicit waits for element visibility
- ✅ Use `waitForNavigation()` for navigation
- ✅ Use `waitForLoadState()` for page load
- ✅ Avoid hardcoded `waitForTimeout()`

### 5. **Reporting & Logging**
- ✅ Add meaningful descriptions to steps
- ✅ Capture screenshots on failure
- ✅ Log important actions
- ✅ Attach test data to reports
- ✅ Set severity levels appropriately

### 6. **Error Handling**
- ✅ Use try-catch for error scenarios
- ✅ Log errors with context
- ✅ Attach failure screenshots
- ✅ Provide meaningful error messages

### 7. **Test Data Management**
- ✅ Keep test data in JSON files
- ✅ Use environment-specific configs
- ✅ Parameterize test data
- ✅ Maintain data consistency
- ✅ Use fixtures for setup data

### 8. **Performance Considerations**
- ✅ Run tests in parallel
- ✅ Limit retry attempts
- ✅ Use appropriate timeouts
- ✅ Monitor resource usage
- ✅ Cache static resources

### 9. **Maintenance**
- ✅ Update selectors when UI changes
- ✅ Keep documentation current
- ✅ Review and refactor regularly
- ✅ Use version control
- ✅ Archive old test data

### 10. **Accessibility & Cross-browser**
- ✅ Test on multiple browsers
- ✅ Verify accessibility features
- ✅ Test responsive design
- ✅ Check keyboard navigation
- ✅ Validate color contrast

## 🔎 Test Organization

### Test Naming Convention
```
TC[Number] - Should [describe expected behavior]

Examples:
- TC001 - Should load home page successfully
- TC002 - Should login with valid credentials
- TC003 - Should search for items successfully
```

### Tagging Strategy
```javascript
test('@smoke TC001 - ...', async () => {})
test('@regression TC002 - ...', async () => {})
test('@critical TC003 - ...', async () => {})
test('@flaky TC004 - ...', async () => {})
test('@performance TC005 - ...', async () => {})
test('@accessibility TC006 - ...', async () => {})
```

## 🛠️ Troubleshooting

### Issue: Tests Timing Out
**Solution:**
- Increase timeout in config
- Check element visibility
- Verify selectors are correct
- Check network connectivity

### Issue: Selectors Not Found
**Solution:**
- Verify selector exists on page
- Check page load completion
- Use dynamic selector generation
- Use browser dev tools to confirm selector

### Issue: Screenshots Not Captured
**Solution:**
- Ensure correct file path
- Check directory permissions
- Verify page object exists
- Check Allure integration

### Issue: Tests Flaky/Intermittent Failures
**Solution:**
- Add explicit waits
- Use `waitForElement()`
- Increase timeout values
- Check for race conditions
- Review network conditions

### Issue: Allure Report Generation Failed
**Solution:**
```bash
# Clear and regenerate
rm -rf allure-results/
npm run allure:generate
npm run allure:open
```

## 📚 Key Classes & Methods

### ElementActions
- `click()` - Click element with highlighting
- `fillText()` - Fill input with text
- `verifyElementVisible()` - Verify element visibility
- `takeScreenshot()` - Capture page screenshot
- `navigateTo()` - Navigate to URL
- `switchToNewWindow()` - Handle multiple windows

### HomePage
- `login()` - Perform login
- `logout()` - Perform logout
- `search()` - Search functionality
- `addProductToCart()` - Add to cart
- `verifyHomePageLoaded()` - Verify page load

### AllureReport
- `addStep()` - Add step to report
- `attachScreenshot()` - Attach screenshot
- `attachJSON()` - Attach JSON data
- `setSeverity()` - Set test severity
- `addIssueLink()` - Link to issue tracker

### Logger
- `info()` - Info level log
- `debug()` - Debug level log
- `error()` - Error level log
- `step()` - Log step execution
- `testResult()` - Log test result

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: allure-results
          path: allure-results
```

## 📞 Support & Contributing

For issues, suggestions, or contributions:
1. Check existing documentation
2. Review test examples
3. Check logs for errors
4. Review browser console output

## 📄 License

MIT License - feel free to use this framework for your projects.

## 🎓 Learning Resources

- [Playwright Documentation](https://playwright.dev)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

**Last Updated:** April 2026  
**Framework Version:** 1.0.0  
**Playwright Version:** 1.48.0+
