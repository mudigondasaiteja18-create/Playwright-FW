import fs from 'fs';
import path from 'path';
import { logger } from './logger.js';

/**
 * Test Data Utility
 * Handles loading, managing, and providing test data
 */

class TestDataUtil {
  constructor(dataDir = './testData') {
    this.dataDir = dataDir;
    this.cache = {};
  }

  /**
   * Load test data from JSON file
   * @param {string} fileName - File name without extension
   * @returns {Object} Test data object
   */
  loadTestData(fileName) {
    try {
      if (this.cache[fileName]) {
        logger.debug(`Loading test data from cache: ${fileName}`);
        return this.cache[fileName];
      }

      const filePath = path.join(this.dataDir, `${fileName}.json`);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      this.cache[fileName] = JSON.parse(fileContent);

      logger.info(`✓ Test data loaded: ${fileName}`);
      return this.cache[fileName];
    } catch (error) {
      logger.error(`Failed to load test data: ${fileName}`, error);
      throw error;
    }
  }

  /**
   * Get specific data by key path
   * @param {string} fileName - File name
   * @param {string} keyPath - Path to data (e.g., "users.0.email")
   * @returns {*} Data value
   */
  getDataByPath(fileName, keyPath) {
    try {
      const data = this.loadTestData(fileName);
      const keys = keyPath.split('.');
      let value = data;

      for (const key of keys) {
        value = value[key];
        if (value === undefined) break;
      }

      logger.debug(`Retrieved data: ${keyPath} = ${JSON.stringify(value)}`);
      return value;
    } catch (error) {
      logger.error(`Failed to get data by path: ${keyPath}`, error);
      throw error;
    }
  }

  /**
   * Get user data by index or username
   * @param {number | string} identifier - User index or username
   * @returns {Object} User object
   */
  getUser(identifier) {
    try {
      const data = this.loadTestData('testData');
      let user;

      if (typeof identifier === 'number') {
        user = data.users[identifier];
      } else {
        user = data.users.find((u) => u.username === identifier);
      }

      if (!user) {
        throw new Error(`User not found: ${identifier}`);
      }

      logger.debug(`Retrieved user: ${user.username}`);
      return user;
    } catch (error) {
      logger.error(`Failed to get user: ${identifier}`, error);
      throw error;
    }
  }

  /**
   * Get login data by test case name
   * @param {string} testCaseName - Test case name
   * @returns {Object} Login data
   */
  getLoginData(testCaseName) {
    try {
      const data = this.loadTestData('testData');
      const loginData = data.loginData.find(
        (item) => item.testCase === testCaseName
      );

      if (!loginData) {
        throw new Error(`Login data not found: ${testCaseName}`);
      }

      logger.debug(`Retrieved login data: ${testCaseName}`);
      return loginData;
    } catch (error) {
      logger.error(`Failed to get login data: ${testCaseName}`, error);
      throw error;
    }
  }

  /**
   * Get form data by index
   * @param {number} index - Form data index
   * @returns {Object} Form data
   */
  getFormData(index = 0) {
    try {
      const data = this.loadTestData('testData');
      const formData = data.formData[index];

      if (!formData) {
        throw new Error(`Form data not found at index: ${index}`);
      }

      logger.debug(`Retrieved form data: index ${index}`);
      return formData;
    } catch (error) {
      logger.error(`Failed to get form data at index: ${index}`, error);
      throw error;
    }
  }

  /**
   * Get all test data of a type
   * @param {string} dataType - Data type (users, loginData, formData, etc.)
   * @returns {Array} Array of data
   */
  getAllData(dataType) {
    try {
      const data = this.loadTestData('testData');
      const result = data[dataType];

      if (!result) {
        throw new Error(`Data type not found: ${dataType}`);
      }

      logger.debug(`Retrieved all ${dataType}: ${result.length} items`);
      return result;
    } catch (error) {
      logger.error(`Failed to get all data: ${dataType}`, error);
      throw error;
    }
  }

  /**
   * Create test data provider for parameterized tests
   * @param {string} dataType - Data type to provide
   * @returns {Array} Array of data for parameterization
   */
  getTestDataProvider(dataType) {
    try {
      return this.getAllData(dataType);
    } catch (error) {
      logger.error(`Failed to get test data provider: ${dataType}`, error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {};
    logger.debug('Test data cache cleared');
  }

  /**
   * Merge test data
   * @param {string} fileName - File name
   * @param {Object} additionalData - Data to merge
   * @returns {Object} Merged data
   */
  mergeTestData(fileName, additionalData) {
    try {
      const data = this.loadTestData(fileName);
      const merged = { ...data, ...additionalData };
      logger.debug(`Test data merged: ${fileName}`);
      return merged;
    } catch (error) {
      logger.error(`Failed to merge test data: ${fileName}`, error);
      throw error;
    }
  }

  /**
   * Get random item from array
   * @param {string} fileName - File name
   * @param {string} dataKey - Key in data object
   * @returns {*} Random item
   */
  getRandomItem(fileName, dataKey) {
    try {
      const data = this.loadTestData(fileName);
      const array = data[dataKey];

      if (!Array.isArray(array)) {
        throw new Error(`Data is not an array: ${dataKey}`);
      }

      const randomItem = array[Math.floor(Math.random() * array.length)];
      logger.debug(`Retrieved random item from ${dataKey}`);
      return randomItem;
    } catch (error) {
      logger.error(`Failed to get random item: ${dataKey}`, error);
      throw error;
    }
  }
}

export default new TestDataUtil();
