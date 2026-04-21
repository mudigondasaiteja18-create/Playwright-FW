import { expect } from '@playwright/test';
import AllureReport from './report.js';
import { logger } from './logger.js';
import { TIMEOUT_CONFIG } from '../config/env.js';

/**
 * Element Actions Utility
 * Simple methods for element interactions without redundancy
 * Pattern: waitFor → highlight → action → Allure report step with screenshot
 */

class ElementActions {
  constructor(page, enableHighlight = true) {
    this.page = page;
    this.enableHighlight = enableHighlight;
  }

  /**
   * Add step with screenshot to Allure report
   */
  async addStepWithScreenshot(stepDescription, screenshotName) {
    await AllureReport.addStep(stepDescription);
    await AllureReport.attachScreenshot(this.page, screenshotName);
  }

  /**
   * Highlight element on page
   */
  async highlightElement(element) {
    try {
      await this.page.locator(element).evaluate(function(el) {
        el.style.border = '3px solid red';
        el.style.backgroundColor = 'yellow';
      });

      logger.debug(`✨ Element highlighted`);
      await this.page.waitForTimeout(500);

      await this.page.locator(element).evaluate(function(el) {
        el.style.border = '';
        el.style.backgroundColor = '';
      });
    } catch (error) {
      logger.warn(`Failed to highlight element`);
    }
  }

  /**
   * Convert selector string to locator if needed
   * @param {string|Locator} selectorOrLocator - CSS selector string or Locator object
   * @returns {Locator} Playwright locator object
   */
  getLocator(selectorOrLocator) {
    if (typeof selectorOrLocator === 'string') {
      return this.page.locator(selectorOrLocator);
    }
    return selectorOrLocator;
  }

  /**
   * CLICK METHODS
   */

  async click(selectorOrLocator, description) {
    const locator = this.getLocator(selectorOrLocator);
    try {
      await this.waitForElement(locator)
      if (this.enableHighlight) {
        await this.highlightElement(locator);
      }
      await locator.click();
      await this.addStepWithScreenshot(description, `click-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to click: ${description}`, error);
      throw error;
    }
  }

  async doubleClick(locator, description) {
    try {
      await this.waitForElement(locator);
      if (this.enableHighlight) {
        await this.highlightElement(locator);
      }
      await locator.dblclick();
      await this.addStepWithScreenshot(description, `double-click-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to double click: ${description}`, error);
      throw error;
    }
  }

  async rightClick(locator, description) {
    try {
      await this.waitForElement(locator);
      if (this.enableHighlight) {
        await this.highlightElement(locator);
      }
      await locator.click({ button: 'right' });
      await this.addStepWithScreenshot(description, `right-click-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to right click: ${description}`, error);
      throw error;
    }
  }

  /**
   * FILL/INPUT METHODS
   */

  async fillText(locator, text, description) {
    try {
      await this.waitForElement(locator);
      if (this.enableHighlight) {
        await this.highlightElement(locator);
      }
      await locator.clear();
      await locator.fill(text);
      await this.addStepWithScreenshot(description, `fill-text-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to fill text: ${description}`, error);
      throw error;
    }
  }

  async typeText(locator, text, description) {
    try {
      await this.waitForElement(locator);
      if (this.enableHighlight) {
        await this.highlightElement(locator);
      }
      await locator.type(text, { delay: 50 });
      await this.addStepWithScreenshot(description, `type-text-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to type text: ${description}`, error);
      throw error;
    }
  }

  async selectOption(locator, value, description) {
    try {
      await this.waitForElement(locator);
      if (this.enableHighlight) {
        await this.highlightElement(locator);
      }
      await locator.selectOption(value);
      await this.addStepWithScreenshot(description, `select-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to select option: ${description}`, error);
      throw error;
    }
  }

  async uploadFile(locator, filePath, description) {
    try {
      await this.waitForElement(locator);
      if (this.enableHighlight) {
        await this.highlightElement(locator);
      }
      await locator.setInputFiles(filePath);
      await this.addStepWithScreenshot(description, `upload-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to upload file: ${description}`, error);
      throw error;
    }
  }

  /**
   * CHECKBOX METHODS
   */

  async check(locator, description) {
    try {
      await this.waitForElement(locator);
      if (this.enableHighlight) {
        await this.highlightElement(locator);
      }
      await locator.check();
      await this.addStepWithScreenshot(description, `check-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to check: ${description}`, error);
      throw error;
    }
  }

  async uncheck(locator, description) {
    try {
      await this.waitForElement(locator);
      if (this.enableHighlight) {
        await this.highlightElement(locator);
      }
      await locator.uncheck();
      await this.addStepWithScreenshot(description, `uncheck-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to uncheck: ${description}`, error);
      throw error;
    }
  }

  /**
   * HOVER METHOD
   */

  async hover(locator, description) {
    try {
      await this.waitForElement(locator);
      if (this.enableHighlight) {
        await this.highlightElement(locator);
      }
      await locator.hover();
      await this.addStepWithScreenshot(description, `hover-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to hover: ${description}`, error);
      throw error;
    }
  }

  /**
   * ELEMENT GETTER METHODS
   */

  async getText(element) {
    try {
      const text = await this.page.locator(element).textContent();
      logger.debug(`Retrieved text: ${text}`);
      return text;
    } catch (error) {
      logger.error(`Failed to get text from element`, error);
      throw error;
    }
  }

  async getAttribute(element, attributeName) {
    try {
      const value = await this.page.locator(element).getAttribute(attributeName);
      logger.debug(`Retrieved attribute ${attributeName}: ${value}`);
      return value;
    } catch (error) {
      logger.error(`Failed to get attribute ${attributeName}`, error);
      throw error;
    }
  }

  /**
   * WAIT METHODS
   */

  async waitForElement(selectorOrLocator, description) {
    const locator = this.getLocator(selectorOrLocator);
    try {
      await locator.waitFor({ state: 'visible', timeout: 30000 });
      logger.info(`✓ Element appeared`);
      await this.addStepWithScreenshot(`Element appeared`, `wait-element-${Date.now()}`);
    } catch (error) {
      logger.error(`Element did not appear`, error);
      throw error;
    }
  }

  async waitForElementToDisappear(selectorOrLocator, description) {
    const locator = this.getLocator(selectorOrLocator);
    try {
      await locator.waitFor({ state: 'hidden', timeout: 30000 });
      logger.info(`✓ Element disappeared`);
      await this.addStepWithScreenshot(`Element disappeared`, `wait-disappear-${Date.now()}`);
    } catch (error) {
      logger.error(`Element did not disappear`, error);
      throw error;
    }
  }

  async waitForNavigation(action, options = {}) {
    const { timeout = TIMEOUT_CONFIG.LONG } = options;
    try {
      await Promise.all([
        this.page.waitForNavigation({ timeout }),
        action,
      ]);
      logger.info(`✓ Navigation completed`);
      await this.addStepWithScreenshot(`Navigation completed`, `wait-nav-${Date.now()}`);
    } catch (error) {
      logger.error(`Navigation failed`, error);
      throw error;
    }
  }

  /**
   * SCROLL METHOD
   */

  async scrollIntoView(element) {
    try {
      await this.page.locator(element).scrollIntoViewIfNeeded();
      logger.debug(`Scrolled element into view`);
    } catch (error) {
      logger.error(`Failed to scroll element into view`, error);
      throw error;
    }
  }

  /**
   * VERIFICATION METHODS
   */

  async verifyElementVisible(locator, description) {
    try {
      await this.waitForElement(locator);
      await expect(locator).toBeVisible();
      logger.info(`✓ ${description}`);
      await this.addStepWithScreenshot(description, `verify-visible-${Date.now()}`);
    } catch (error) {
      logger.error(`Verification failed: ${description}`, error);
      await AllureReport.attachScreenshot(this.page, `verify-failed-${Date.now()}`);
      throw error;
    }
  }

  async verifyElementHidden(selectorOrLocator, description) {
    const locator = this.getLocator(selectorOrLocator);
    try {
      await locator.waitFor({ state: 'hidden', timeout: 30000 });
      logger.info(`✓ ${description}`);
      await this.addStepWithScreenshot(description, `verify-hidden-${Date.now()}`);
    } catch (error) {
      logger.error(`Verification failed: ${description}`, error);
      await AllureReport.attachScreenshot(this.page, `verify-failed-${Date.now()}`);
      throw error;
    }
  }

  async verifyElementContainsText(locator, text, description) {
    try {
      await this.waitForElement(locator);
      await expect(locator).toContainText(text);
      logger.info(`✓ ${description}`);
      await this.addStepWithScreenshot(description, `verify-text-${Date.now()}`);
    } catch (error) {
      logger.error(`Verification failed: ${description}`, error);
      await AllureReport.attachScreenshot(this.page, `verify-failed-${Date.now()}`);
      throw error;
    }
  }

  async verifyElementHasAttribute(locator, attributeName, value, description) {
    try {
      await this.waitForElement(locator);
      await expect(locator).toHaveAttribute(attributeName, value);
      logger.info(`✓ ${description}`);
      await this.addStepWithScreenshot(description, `verify-attribute-${Date.now()}`);
    } catch (error) {
      logger.error(`Verification failed: ${description}`, error);
      await AllureReport.attachScreenshot(this.page, `verify-failed-${Date.now()}`);
      throw error;
    }
  }

  async verifyElementEnabled(locator, description) {
    try {
      await this.waitForElement(locator);
      await expect(locator).toBeEnabled();
      logger.info(`✓ ${description}`);
      await this.addStepWithScreenshot(description, `verify-enabled-${Date.now()}`);
    } catch (error) {
      logger.error(`Verification failed: ${description}`, error);
      await AllureReport.attachScreenshot(this.page, `verify-failed-${Date.now()}`);
      throw error;
    }
  }

  async verifyElementDisabled(locator, description) {
    try {
      await this.waitForElement(locator);
      await expect(locator).toBeDisabled();
      logger.info(`✓ ${description}`);
      await this.addStepWithScreenshot(description, `verify-disabled-${Date.now()}`);
    } catch (error) {
      logger.error(`Verification failed: ${description}`, error);
      await AllureReport.attachScreenshot(this.page, `verify-failed-${Date.now()}`);
      throw error;
    }
  }

  /**
   * NAVIGATION METHODS
   */

  async navigateTo(url, options = {}) {
    const { waitUntil = 'networkidle' } = options;
    try {
      logger.info(`🔗 Navigating to: ${url}`);
      await this.page.goto(url, { waitUntil });
      await this.addStepWithScreenshot(`Navigate to: ${url}`, `navigate-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to navigate to: ${url}`, error);
      throw error;
    }
  }

  async goBack() {
    try {
      logger.info(`⬅️ Going back`);
      await this.page.goBack();
      await this.addStepWithScreenshot(`Navigate back`, `back-${Date.now()}`);
    } catch (error) {
      logger.error('Failed to go back', error);
      throw error;
    }
  }

  async goForward() {
    try {
      logger.info(`➡️ Going forward`);
      await this.page.goForward();
      await this.addStepWithScreenshot(`Navigate forward`, `forward-${Date.now()}`);
    } catch (error) {
      logger.error('Failed to go forward', error);
      throw error;
    }
  }

  async refreshPage() {
    try {
      logger.info(`🔄 Refreshing page`);
      await this.page.reload();
      await this.addStepWithScreenshot(`Refresh page`, `refresh-${Date.now()}`);
    } catch (error) {
      logger.error('Failed to refresh page', error);
      throw error;
    }
  }

  /**
   * PAGE/WINDOW METHODS
   */

  async getCurrentURL() {
    try {
      const url = this.page.url();
      logger.debug(`Current URL: ${url}`);
      return url;
    } catch (error) {
      logger.error('Failed to get current URL', error);
      throw error;
    }
  }

  async verifyPageURL(expectedURL) {
    try {
      await expect(this.page).toHaveURL(expectedURL);
      logger.info(`✓ Page URL verified: ${expectedURL}`);
      await this.addStepWithScreenshot(`Verify page URL: ${expectedURL}`, `url-${Date.now()}`);
    } catch (error) {
      logger.error(`URL verification failed. Expected: ${expectedURL}`, error);
      throw error;
    }
  }

  async getPageTitle() {
    try {
      const title = await this.page.title();
      logger.debug(`Page title: ${title}`);
      return title;
    } catch (error) {
      logger.error('Failed to get page title', error);
      throw error;
    }
  }

  async verifyPageTitle(expectedTitle) {
    try {
      const title = await this.getPageTitle();
      expect(title).toBe(expectedTitle);
      logger.info(`✓ Page title verified: ${expectedTitle}`);
      await this.addStepWithScreenshot(`Verify page title: ${expectedTitle}`, `title-${Date.now()}`);
    } catch (error) {
      logger.error(`Title verification failed. Expected: ${expectedTitle}`, error);
      throw error;
    }
  }

  /**
   * KEYBOARD METHODS
   */

  async pressKey(key) {
    try {
      await this.page.keyboard.press(key);
      logger.info(`✓ Pressed key: ${key}`);
      await this.addStepWithScreenshot(`Press key: ${key}`, `key-${Date.now()}`);
    } catch (error) {
      logger.error(`Failed to press key: ${key}`, error);
      throw error;
    }
  }

  /**
   * SCREENSHOT METHOD
   */

  async takeScreenshot(filename) {
    try {
      await this.page.screenshot({ path: `./test-reports/${filename}.png` });
      logger.info(`✓ Screenshot saved: ${filename}`);
      await this.addStepWithScreenshot(`Screenshot: ${filename}`, filename);
    } catch (error) {
      logger.error(`Failed to take screenshot: ${filename}`, error);
      throw error;
    }
  }

  /**
   * WINDOW HANDLE METHODS
   */

  async switchToNewWindow() {
    try {
      const context = this.page.context();
      const newPagePromise = context.waitForEvent('page');
      const newPage = await newPagePromise;
      
      logger.info(`✓ Switched to new window`);
      await this.addStepWithScreenshot(`Switch to new window`, `switch-${Date.now()}`);
      
      return newPage;
    } catch (error) {
      logger.error('Failed to switch to new window', error);
      throw error;
    }
  }

  async getAllWindowHandles() {
    try {
      const context = this.page.context();
      const pages = context.pages();
      logger.info(`Total windows: ${pages.length}`);
      return pages;
    } catch (error) {
      logger.error('Failed to get window handles', error);
      throw error;
    }
  }

  async closeWindow() {
    try {
      logger.info(`❌ Closing current window`);
      await this.page.close();
      logger.info(`✓ Window closed`);
    } catch (error) {
      logger.error('Failed to close window', error);
      throw error;
    }
  }

  /**
   * JAVASCRIPT EXECUTION METHOD
   */

  async executeScript(script, param = null) {
    try {
      logger.debug(`Executing script`);
      let result;
      if (param) {
        result = await this.page.evaluate(function(arg) {
          return eval(script);
        }, param);
      } else {
        result = await this.page.evaluate(function() {
          return eval(script);
        });
      }
      return result;
    } catch (error) {
      logger.error('Failed to execute script', error);
      throw error;
    }
  }

  /**
   * ALERT METHODS
   */

  async dismissAlert() {
    try {
      this.page.once('dialog', function(dialog) {
        dialog.dismiss();
      });
      logger.info(`✓ Alert dismissed`);
    } catch (error) {
      logger.error('Failed to dismiss alert', error);
      throw error;
    }
  }

  async acceptAlert() {
    try {
      this.page.once('dialog', function(dialog) {
        dialog.accept();
      });
      logger.info(`✓ Alert accepted`);
    } catch (error) {
      logger.error('Failed to accept alert', error);
      throw error;
    }
  }
}

export default ElementActions;
