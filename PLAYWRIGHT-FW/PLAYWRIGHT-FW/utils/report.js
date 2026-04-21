import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { logger } from './logger.js';

/**
 * Allure Report Utility
 * Provides methods to create detailed Allure reports with steps, attachments, and screenshots
 */

class AllureReport {
  /**
   * Add step to Allure report
   * @param {string} description - Step description
   * @param {Function} stepFn - Step function to execute (optional)
   * @returns {Promise} Step execution result
   */
  static async addStep(description, stepFn) {
    try {
      logger.step('Report', `Adding step: ${description}`);
      // If no step function provided, just log the step
      if (!stepFn || typeof stepFn !== 'function') {
        return null;
      }
      return await test.step(description, stepFn);
    } catch (error) {
      logger.error(`Step failed: ${description}`, error);
      throw error;
    }
  }

  /**
   * Create a test group/suite
   * @param {string} description - Group description
   * @param {Function} groupFn - Group function containing steps
   * @returns {Promise} Group execution result
   */
  static async createGroup(description, groupFn) {
    logger.info(`📋 Creating test group: ${description}`);
    return await this.addStep(`GROUP: ${description}`, groupFn);
  }

  /**
   * Attach text content to report
   * @param {string} name - Attachment name
   * @param {string} content - Text content to attach
   * @param {string} mimeType - MIME type (default: text/plain)
   */
  static async attachText(name, content, mimeType = 'text/plain') {
    try {
      logger.debug(`Attaching text: ${name}`);
      await test.info().attach(name, {
        body: content,
        contentType: mimeType,
      });
    } catch (error) {
      logger.warn(`Failed to attach text: ${name}`);
    }
  }

  /**
   * Attach JSON content to report
   * @param {string} name - Attachment name
   * @param {Object} jsonData - JSON object to attach
   */
  static async attachJSON(name, jsonData) {
    try {
      logger.debug(`Attaching JSON: ${name}`);
      const jsonString = JSON.stringify(jsonData, null, 2);
      await this.attachText(`${name}.json`, jsonString, 'application/json');
    } catch (error) {
      logger.error(`Failed to attach JSON: ${name}`, error);
    }
  }

  /**
   * Attach screenshot to report
   * @param {Page} page - Playwright Page object
   * @param {string} name - Screenshot name
   * @returns {Promise} Screenshot attachment result
   */
  static async attachScreenshot(page, name = 'screenshot') {
    try {
      logger.debug(`Taking screenshot: ${name}`);
      const screenshotBuffer = await page.screenshot({ fullPage: false });
      await test.info().attach(name, {
        body: screenshotBuffer,
        contentType: 'image/png',
      });
      logger.info(`✓ Screenshot attached: ${name}`);
    } catch (error) {
      logger.error(`Failed to attach screenshot: ${name}`, error);
    }
  }

  /**
   * Attach full page screenshot
   * @param {Page} page - Playwright Page object
   * @param {string} name - Screenshot name
   * @returns {Promise} Screenshot attachment result
   */
  static async attachFullPageScreenshot(page, name = 'full-page-screenshot') {
    try {
      logger.debug(`Taking full page screenshot: ${name}`);
      const screenshotBuffer = await page.screenshot({ fullPage: true });
      await test.info().attach(name, {
        body: screenshotBuffer,
        contentType: 'image/png',
      });
      logger.info(`✓ Full page screenshot attached: ${name}`);
    } catch (error) {
      logger.error(`Failed to attach full page screenshot: ${name}`, error);
    }
  }

  /**
   * Attach video file to report
   * @param {string} filePath - Path to video file
   * @param {string} name - Attachment name
   */
  static async attachVideo(filePath, name = 'video') {
    try {
      if (fs.existsSync(filePath)) {
        logger.debug(`Attaching video: ${name}`);
        const videoBuffer = fs.readFileSync(filePath);
        await test.info().attach(name, {
          body: videoBuffer,
          contentType: 'video/webm',
        });
        logger.info(`✓ Video attached: ${name}`);
      }
    } catch (error) {
      logger.error(`Failed to attach video: ${name}`, error);
    }
  }

  /**
   * Attach file to report
   * @param {string} filePath - Path to file
   * @param {string} name - Attachment name
   * @param {string} mimeType - MIME type
   */
  static async attachFile(filePath, name, mimeType = 'application/octet-stream') {
    try {
      if (fs.existsSync(filePath)) {
        logger.debug(`Attaching file: ${name}`);
        const fileBuffer = fs.readFileSync(filePath);
        await test.info().attach(name, {
          body: fileBuffer,
          contentType: mimeType,
        });
        logger.info(`✓ File attached: ${name}`);
      }
    } catch (error) {
      logger.error(`Failed to attach file: ${name}`, error);
    }
  }

  /**
   * Add description to report
   * @param {string} description - Report description
   */
  static async addDescription(description) {
    try {
      logger.debug(`Adding description: ${description}`);
      await this.attachText('Description', description, 'text/plain');
    } catch (error) {
      logger.warn(`Failed to add description`);
    }
  }

  /**
   * Add severity to test
   * @param {string} severity - Severity level (blocker, critical, normal, minor, trivial)
   */
  static setSeverity(severity) {
    try {
      logger.debug(`Setting severity: ${severity}`);
      test.info().annotations.push({ type: 'severity', description: severity });
    } catch (error) {
      logger.warn(`Failed to set severity`);
    }
  }

  /**
   * Add issue link
   * @param {string} issueId - Issue ID or URL
   */
  static addIssueLink(issueId) {
    try {
      logger.debug(`Adding issue link: ${issueId}`);
      test.info().annotations.push({ type: 'issue', description: issueId });
    } catch (error) {
      logger.warn(`Failed to add issue link`);
    }
  }

  /**
   * Add test requirement/feature
   * @param {string} requirement - Requirement description
   */
  static addRequirement(requirement) {
    try {
      logger.debug(`Adding requirement: ${requirement}`);
      test.info().annotations.push({ type: 'requirement', description: requirement });
    } catch (error) {
      logger.warn(`Failed to add requirement`);
    }
  }

  /**
   * Create parameterized step
   * @param {string} stepName - Step name
   * @param {Object} parameters - Step parameters
   * @param {Function} stepFn - Step function
   */
  static async addParametrizedStep(stepName, parameters, stepFn) {
    try {
      const paramString = Object.entries(parameters)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ');
      const fullStepName = `${stepName} [${paramString}]`;
      logger.step('Report', `Adding parameterized step: ${fullStepName}`);
      return await this.addStep(fullStepName, stepFn);
    } catch (error) {
      logger.error(`Parameterized step failed: ${stepName}`, error);
      throw error;
    }
  }

  /**
   * Log action with screenshot
   * @param {Page} page - Playwright Page object
   * @param {string} action - Action description
   * @param {string} elementInfo - Element information that was actioned
   */
  static async logActionWithScreenshot(page, action, elementInfo) {
    try {
      await this.addStep(`${action}: ${elementInfo}`, async () => {
        await this.attachScreenshot(page, `${action}-${Date.now()}`);
      });
    } catch (error) {
      logger.error(`Failed to log action with screenshot`, error);
    }
  }

  /**
   * Create test execution report
   * @param {Object} testResult - Test result object
   * @param {string} description - Test description
   */
  static async createTestExecutionReport(testResult, description) {
    try {
      logger.info(`📊 Creating execution report for: ${description}`);
      
      const report = {
        testName: testResult.title,
        status: testResult.status,
        duration: testResult.duration,
        description: description,
        timestamp: new Date().toISOString(),
        retries: testResult.retries,
      };

      await this.attachJSON('Test Execution Report', report);
      logger.info(`✓ Execution report created`);
    } catch (error) {
      logger.error('Failed to create execution report', error);
    }
  }

  /**
   * Attach network activity (HAR format)
   * @param {Page} page - Playwright Page object
   * @param {string} name - Attachment name
   */
  static async attachNetworkActivity(page, name = 'network-activity') {
    try {
      logger.debug(`Attaching network activity: ${name}`);
      // Note: This requires recording HAR during page operations
      // This is an example of how it could be implemented
      const har = await page?.context?.routeFromHAR?.path;
      if (har) {
        await this.attachFile(har, name, 'application/json');
      }
    } catch (error) {
      logger.debug(`Network activity not available`);
    }
  }

  /**
   * Log test runtime metrics
   * @param {Object} metrics - Performance metrics
   */
  static async logMetrics(metrics) {
    try {
      await this.attachJSON('Performance Metrics', metrics);
      logger.info(`✓ Metrics logged`);
    } catch (error) {
      logger.error('Failed to log metrics', error);
    }
  }

  /**
   * Create detailed HTML report snippet
   * @param {string} title - Report title
   * @param {Object} data - Report data
   */
  static async attachDetailedReport(title, data) {
    try {
      let html = `<h2>${title}</h2>\n`;
      html += '<table border="1" cellpadding="5">\n';
      
      Object.entries(data).forEach(([key, value]) => {
        html += `<tr><td><b>${key}</b></td><td>${JSON.stringify(value)}</td></tr>\n`;
      });
      
      html += '</table>\n';
      
      await this.attachText(`${title}-Report`, html, 'text/html');
      logger.info(`✓ Detailed report attached: ${title}`);
    } catch (error) {
      logger.error(`Failed to attach detailed report: ${title}`, error);
    }
  }
}

export default AllureReport;
