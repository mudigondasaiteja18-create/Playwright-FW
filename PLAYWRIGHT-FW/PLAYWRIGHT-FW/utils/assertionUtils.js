import { expect } from '@playwright/test';
import AllureReport from './report.js';
import { logger } from './logger.js';

/**
 * Assertion Utility
 * Custom assertions with detailed reporting
 */

class AssertionUtils {
  /**
   * Assert element contains specific text
   * @param {Locator} element - Element locator
   * @param {string} expectedText - Expected text
   * @param {string} description - Assertion description
   */
  static async assertElementText(element, expectedText, description = '') {
    try {
      const actualText = await element.textContent();
      expect(actualText).toContain(expectedText);

      logger.info(`✓ Assertion passed: Element contains "${expectedText}" ${description}`);
      
      await AllureReport.addStep(
        `Assert: ${description || 'Element contains text'}`,
        async () => {
          await AllureReport.attachText(
            'Assertion Details',
            `Expected text: ${expectedText}\nActual text: ${actualText}`
          );
        }
      );
    } catch (error) {
      logger.error(`Assertion failed: ${description}`, error);
      throw error;
    }
  }

  /**
   * Assert multiple elements are visible
   * @param {Array} elements - Array of locators
   * @param {string} description - Assertion description
   */
  static async assertElementsVisible(elements, description = '') {
    try {
      for (const element of elements) {
        await expect(element).toBeVisible();
      }

      logger.info(`✓ Assertion passed: All elements visible ${description}`);
      
      await AllureReport.addStep(`Assert: ${description || 'Elements visible'}`, async () => {
        await AllureReport.attachText('Assertion Details', `${elements.length} elements are visible`);
      });
    } catch (error) {
      logger.error(`Assertion failed: ${description}`, error);
      throw error;
    }
  }

  /**
   * Assert element attribute equals value
   * @param {Locator} element - Element locator
   * @param {string} attributeName - Attribute name
   * @param {string} expectedValue - Expected value
   * @param {string} description - Assertion description
   */
  static async assertAttributeValue(
    element,
    attributeName,
    expectedValue,
    description = ''
  ) {
    try {
      const actualValue = await element.getAttribute(attributeName);
      expect(actualValue).toBe(expectedValue);

      logger.info(
        `✓ Assertion passed: ${attributeName}="${expectedValue}" ${description}`
      );
      
      await AllureReport.addStep(`Assert: ${description || 'Attribute value'}`, async () => {
        await AllureReport.attachText(
          'Attribute Assertion',
          `Attribute: ${attributeName}\nExpected: ${expectedValue}\nActual: ${actualValue}`
        );
      });
    } catch (error) {
      logger.error(
        `Assertion failed: ${attributeName}="${expectedValue}"`,
        error
      );
      throw error;
    }
  }

  /**
   * Assert element count equals expected
   * @param {Locator} locator - Locator for elements
   * @param {number} expectedCount - Expected count
   * @param {string} description - Assertion description
   */
  static async assertElementCount(locator, expectedCount, description = '') {
    try {
      const actualCount = await locator.count();
      expect(actualCount).toBe(expectedCount);

      logger.info(`✓ Assertion passed: ${expectedCount} elements found ${description}`);
      
      await AllureReport.addStep(`Assert: ${description || 'Element count'}`, async () => {
        await AllureReport.attachText(
          'Count Assertion',
          `Expected count: ${expectedCount}\nActual count: ${actualCount}`
        );
      });
    } catch (error) {
      logger.error(`Assertion failed: count ${expectedCount}`, error);
      throw error;
    }
  }

  /**
   * Assert URL matches pattern
   * @param {Page} page - Page object
   * @param {string | RegExp} expectedURL - Expected URL or regex
   * @param {string} description - Assertion description
   */
  static async assertURL(page, expectedURL, description = '') {
    try {
      await expect(page).toHaveURL(expectedURL);

      logger.info(`✓ Assertion passed: URL matches ${expectedURL} ${description}`);
      
      await AllureReport.addStep(`Assert: ${description || 'URL'}`, async () => {
        await AllureReport.attachText(
          'URL Assertion',
          `Expected: ${expectedURL}\nActual: ${page.url()}`
        );
      });
    } catch (error) {
      logger.error(`Assertion failed: URL mismatch ${expectedURL}`, error);
      throw error;
    }
  }

  /**
   * Assert page title matches
   * @param {Page} page - Page object
   * @param {string} expectedTitle - Expected title
   * @param {string} description - Assertion description
   */
  static async assertPageTitle(page, expectedTitle, description = '') {
    try {
      const actualTitle = await page.title();
      expect(actualTitle).toBe(expectedTitle);

      logger.info(`✓ Assertion passed: Title "${expectedTitle}" ${description}`);
      
      await AllureReport.addStep(`Assert: ${description || 'Page title'}`, async () => {
        await AllureReport.attachText(
          'Title Assertion',
          `Expected: ${expectedTitle}\nActual: ${actualTitle}`
        );
      });
    } catch (error) {
      logger.error(`Assertion failed: Title mismatch`, error);
      throw error;
    }
  }

  /**
   * Assert custom condition
   * @param {boolean} condition - Condition to verify
   * @param {string} message - Error message if fails
   * @param {string} description - Assertion description
   */
  static async assertCondition(condition, message, description = '') {
    try {
      expect(condition).toBeTruthy();

      logger.info(`✓ Assertion passed: ${description}`);
      
      await AllureReport.addStep(`Assert: ${description || 'Condition'}`, async () => {
        await AllureReport.attachText('Condition Assertion', `Condition: ${message}`);
      });
    } catch (error) {
      logger.error(`Assertion failed: ${message}`, error);
      throw error;
    }
  }

  /**
   * Assert elements have specific CSS class
   * @param {Locator} element - Element locator
   * @param {string} className - CSS class name
   * @param {string} description - Assertion description
   */
  static async assertHasClass(element, className, description = '') {
    try {
      const classAttr = await element.getAttribute('class');
      expect(classAttr).toContain(className);

      logger.info(`✓ Assertion passed: Element has class "${className}" ${description}`);
      
      await AllureReport.addStep(`Assert: ${description || 'CSS class'}`, async () => {
        await AllureReport.attachText(
          'Class Assertion',
          `Class: ${className}\nElement classes: ${classAttr}`
        );
      });
    } catch (error) {
      logger.error(`Assertion failed: Class "${className}" not found`, error);
      throw error;
    }
  }

  /**
   * Assert element is disabled
   * @param {Locator} element - Element locator
   * @param {string} description - Assertion description
   */
  static async assertDisabled(element, description = '') {
    try {
      await expect(element).toBeDisabled();

      logger.info(`✓ Assertion passed: Element is disabled ${description}`);
      
      await AllureReport.addStep(`Assert: ${description || 'Element disabled'}`, async () => {
        await AllureReport.attachScreenshot(element.page(), `disabled-${Date.now()}`);
      });
    } catch (error) {
      logger.error(`Assertion failed: Element not disabled`, error);
      throw error;
    }
  }

  /**
   * Assert element is enabled
   * @param {Locator} element - Element locator
   * @param {string} description - Assertion description
   */
  static async assertEnabled(element, description = '') {
    try {
      await expect(element).toBeEnabled();

      logger.info(`✓ Assertion passed: Element is enabled ${description}`);
      
      await AllureReport.addStep(`Assert: ${description || 'Element enabled'}`, async () => {
        await AllureReport.attachScreenshot(element.page(), `enabled-${Date.now()}`);
      });
    } catch (error) {
      logger.error(`Assertion failed: Element not enabled`, error);
      throw error;
    }
  }

  /**
   * Assert element is checked
   * @param {Locator} element - Element locator
   * @param {string} description - Assertion description
   */
  static async assertChecked(element, description = '') {
    try {
      await expect(element).toBeChecked();

      logger.info(`✓ Assertion passed: Element is checked ${description}`);
      
      await AllureReport.addStep(`Assert: ${description || 'Element checked'}`, async () => {
        await AllureReport.attachScreenshot(element.page(), `checked-${Date.now()}`);
      });
    } catch (error) {
      logger.error(`Assertion failed: Element not checked`, error);
      throw error;
    }
  }

  /**
   * Assert element value
   * @param {Locator} element - Input element locator
   * @param {string} expectedValue - Expected value
   * @param {string} description - Assertion description
   */
  static async assertInputValue(element, expectedValue, description = '') {
    try {
      await expect(element).toHaveValue(expectedValue);

      logger.info(`✓ Assertion passed: Input value "${expectedValue}" ${description}`);
      
      await AllureReport.addStep(`Assert: ${description || 'Input value'}`, async () => {
        await AllureReport.attachText(
          'Value Assertion',
          `Expected: ${expectedValue}`
        );
      });
    } catch (error) {
      logger.error(`Assertion failed: Input value mismatch`, error);
      throw error;
    }
  }

  /**
   * Assert array of values
   * @param {Array} actualArray - Actual array
   * @param {Array} expectedArray - Expected array
   * @param {string} description - Assertion description
   */
  static async assertArrayEquals(actualArray, expectedArray, description = '') {
    try {
      expect(actualArray).toEqual(expectedArray);

      logger.info(`✓ Assertion passed: Arrays match ${description}`);
      
      await AllureReport.addStep(`Assert: ${description || 'Array comparison'}`, async () => {
        await AllureReport.attachJSON('Array Assertion', {
          expected: expectedArray,
          actual: actualArray,
        });
      });
    } catch (error) {
      logger.error(`Assertion failed: Arrays don't match`, error);
      throw error;
    }
  }

  /**
   * Assert object properties
   * @param {Object} actualObject - Actual object
   * @param {Object} expectedProps - Expected properties
   * @param {string} description - Assertion description
   */
  static async assertObjectProperties(actualObject, expectedProps, description = '') {
    try {
      expect(actualObject).toMatchObject(expectedProps);

      logger.info(`✓ Assertion passed: Object properties match ${description}`);
      
      await AllureReport.addStep(
        `Assert: ${description || 'Object properties'}`,
        async () => {
          await AllureReport.attachJSON('Object Assertion', {
            expected: expectedProps,
            actual: actualObject,
          });
        }
      );
    } catch (error) {
      logger.error(`Assertion failed: Object properties don't match`, error);
      throw error;
    }
  }
}

export default AssertionUtils;
