import ElementActions from '../utils/elementActions.js';
import { logger } from '../utils/logger.js';
import { FranklinTempletonInvestorSelectors } from '../selectors/franklinTempletonInvestorSelectors.js';
import { getBaseURL } from '../config/env.js';

/**
 * Franklin Templeton Investor Page Object
 * Contains all business logic and interactions for the Investor page
 * Uses ElementActions for all element interactions and reporting
 */

class FranklinTempletonInvestorPage {
  constructor(page) {
    this.page = page;
    this.elementActions = new ElementActions(page);
    this.selectors = FranklinTempletonInvestorSelectors;
  }

  /**
   * Navigate to Franklin Templeton website
   * @param {string} url - URL to navigate to (uses environment base URL if not provided)
   * @returns {Promise}
   */
  async navigateToWebsite(url) {
    try {
      const targetURL = url || getBaseURL();
      await this.elementActions.navigateTo(targetURL, { waitUntil: 'networkidle' });
    } catch (error) {
      logger.error(`Failed to navigate to website`, error);
      throw error;
    }
  }

  /**
   * Accept all cookies
   * @param {string} selector - Selector for accept button (defaults to selector from config)
   * @returns {Promise}
   */
  async acceptAllCookies(selector = this.selectors.cookieAcceptAll) {
    try {

      const isVisible = await this.page.locator(this.selectors.cookieBanner).isVisible().catch(() => false);

      if (isVisible) {
        await this.elementActions.click(selector, 'Accept all cookies button');
      }
    } catch (error) {
      logger.warn('Failed to accept cookies (may not exist)', error);
    }
  }

  /**
   * Click on Investor link in navigation
   * @param {string} selector - Selector for Investor link (defaults to selector from config)
   * @returns {Promise}
   */
  async clickInvestorLink(selector = this.selectors.investorLink) {
    try {
      await this.elementActions.click(selector, 'Investor link');
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      logger.error('Failed to click Investor link', error);
      throw error;
    }
  }

  /**
   * Click on logo
   * @param {string} selector - Selector for logo (defaults to selector from config)
   * @returns {Promise}
   */
  async clickLogo(selector = this.selectors.logo) {
    try {
      await this.elementActions.click(selector, 'Franklin Templeton Logo');
    } catch (error) {
      logger.error('Failed to click logo', error);
      throw error;
    }
  }

  /**
   * Verify logo is visible
   * @param {string} selector - Selector for logo (defaults to selector from config)
   * @returns {Promise}
   */
  async verifyLogoVisible(selector = this.selectors.logo) {
    try {
      await this.elementActions.verifyElementVisible(selector, 'Franklin Templeton logo is visible');
    } catch (error) {
      logger.error('Logo visibility verification failed', error);
      throw error;
    }
  }

  /**
   * Verify Investor page is loaded
   * @param {string} selector - Selector for main content (defaults to selector from config)
   * @returns {Promise}
   */
  async verifyInvestorPageLoaded(selector = this.selectors.mainContent) {
    try {
      await this.page.waitForLoadState('networkidle');
      await this.elementActions.waitForElement(selector, 'Main content loaded');
    } catch (error) {
      logger.error('Investor page load verification failed', error);
      throw error;
    }
  }

  /**
   * Get current page URL
   * @returns {Promise<string>}
   */
  async getCurrentPageURL() {
    try {
      const url = await this.elementActions.getCurrentURL();
      return url;
    } catch (error) {
      logger.error('Failed to get current URL', error);
      throw error;
    }
  }

  /**
   * Get current page title
   * @returns {Promise<string>}
   */
  async getCurrentPageTitle() {
    try {
      const title = await this.elementActions.getPageTitle();
      return title;
    } catch (error) {
      logger.error('Failed to get page title', error);
      throw error;
    }
  }
}

export default FranklinTempletonInvestorPage;
