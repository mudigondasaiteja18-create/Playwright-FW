/**
 * Franklin Templeton Homepage Page Object
 * Encapsulates all business logic and user interactions on the Franklin Templeton homepage
 */

const ElementActions = require('../utils/elementActions');
const AssertionUtils = require('../utils/assertionUtils');
const Logger = require('../utils/logger');
const Report = require('../utils/report');
const FranklinTempletonSelectors = require('../selectors/franklinTempletonSelectors');

class FranklinTempletonHomePage {
  constructor(page, testData) {
    this.page = page;
    this.testData = testData;
    this.selectors = FranklinTempletonSelectors;
    this.elementActions = new ElementActions(page);
    this.assertionUtils = new AssertionUtils(page);
    this.logger = Logger;
    this.report = Report;
    this.domElements = []; // Records all clicked/validated elements
  }

  /**
   * Navigate to Franklin Templeton Homepage
   */
  async navigateToHomePage() {
    this.logger.step('Navigating to Franklin Templeton homepage');
    await Report.addStep('Navigate to Franklin Templeton Homepage');
    try {
      await this.page.goto('https://www.franklintempleton.com/', { waitUntil: 'networkidle' });
      this.logger.info('✅ Successfully navigated to Franklin Templeton homepage');
      await Report.attachScreenshot(this.page, 'Homepage_Loaded');
      this.recordDOMElement('page_load', 'navigate_to_homepage', window.location.href);
    } catch (error) {
      this.logger.error(`❌ Failed to navigate to homepage: ${error.message}`);
      await Report.attachScreenshot(this.page, 'Navigation_Failed');
      throw error;
    }
  }

  /**
   * Click on logo to validate navigation
   */
  async clickLogo() {
    this.logger.step('Clicking on Franklin Templeton logo');
    await Report.addStep('Click on Logo');
    try {
      await this.elementActions.click(this.selectors.Navigation.logo, 'Franklin Templeton Logo');
      this.recordDOMElement('click', 'logo', this.selectors.Navigation.logo);
      this.logger.info('✅ Logo clicked successfully');
    } catch (error) {
      this.logger.warn(`⚠️ Logo element not found: ${error.message}`);
    }
  }

  /**
   * Validate hero section visibility
   */
  async validateHeroSectionVisible() {
    this.logger.step('Validating hero section visibility');
    await Report.addStep('Validate Hero Section Visibility');
    try {
      await this.assertionUtils.assertElementVisible(
        this.selectors.HeroSection.heroContainer,
        'Hero Section'
      );
      this.recordDOMElement('validate', 'hero_section_visible', this.selectors.HeroSection.heroContainer);
      this.logger.info('✅ Hero section is visible');
    } catch (error) {
      this.logger.error(`❌ Hero section validation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get hero title text
   */
  async getHeroTitle() {
    this.logger.step('Getting hero title text');
    await Report.addStep('Get Hero Title');
    try {
      const title = await this.elementActions.getText(this.selectors.HeroSection.heroTitle);
      this.recordDOMElement('read', 'hero_title', this.selectors.HeroSection.heroTitle, title);
      this.logger.info(`Hero Title: ${title}`);
      return title;
    } catch (error) {
      this.logger.error(`❌ Failed to get hero title: ${error.message}`);
      throw error;
    }
  }

  /**
   * Click on Invest button (CTA)
   */
  async clickInvestButton() {
    this.logger.step('Clicking on Invest button');
    await Report.addStep('Click on Invest Button (CTA)');
    try {
      await this.elementActions.click(this.selectors.Navigation.investBtn, 'Invest Button');
      this.recordDOMElement('click', 'invest_button', this.selectors.Navigation.investBtn);
      this.logger.info('✅ Invest button clicked successfully');
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      this.logger.warn(`⚠️ Invest button not found: ${error.message}`);
    }
  }

  /**
   * Click on Products menu
   */
  async clickProductsMenu() {
    this.logger.step('Clicking on Products menu');
    await Report.addStep('Click on Products Menu');
    try {
      await this.elementActions.click(this.selectors.Navigation.productsMenu, 'Products Menu');
      this.recordDOMElement('click', 'products_menu', this.selectors.Navigation.productsMenu);
      this.logger.info('✅ Products menu clicked successfully');
      await this.page.waitForTimeout(500);
    } catch (error) {
      this.logger.warn(`⚠️ Products menu not found: ${error.message}`);
    }
  }

  /**
   * Click on Solutions menu
   */
  async clickSolutionsMenu() {
    this.logger.step('Clicking on Solutions menu');
    await Report.addStep('Click on Solutions Menu');
    try {
      await this.elementActions.click(this.selectors.Navigation.solutionsMenu, 'Solutions Menu');
      this.recordDOMElement('click', 'solutions_menu', this.selectors.Navigation.solutionsMenu);
      this.logger.info('✅ Solutions menu clicked successfully');
      await this.page.waitForTimeout(500);
    } catch (error) {
      this.logger.warn(`⚠️ Solutions menu not found: ${error.message}`);
    }
  }

  /**
   * Click on About menu
   */
  async clickAboutMenu() {
    this.logger.step('Clicking on About menu');
    await Report.addStep('Click on About Menu');
    try {
      await this.elementActions.click(this.selectors.Navigation.aboutMenu, 'About Menu');
      this.recordDOMElement('click', 'about_menu', this.selectors.Navigation.aboutMenu);
      this.logger.info('✅ About menu clicked successfully');
      await this.page.waitForTimeout(500);
    } catch (error) {
      this.logger.warn(`⚠️ About menu not found: ${error.message}`);
    }
  }

  /**
   * Search for a term on the homepage
   */
  async searchFor(searchTerm) {
    this.logger.step(`Searching for: ${searchTerm}`);
    await Report.addStep(`Search for: ${searchTerm}`);
    try {
      await this.elementActions.click(this.selectors.Search.searchToggle, 'Search Toggle');
      this.recordDOMElement('click', 'search_toggle', this.selectors.Search.searchToggle);
      
      await this.elementActions.fillText(this.selectors.Search.searchInput, searchTerm);
      this.recordDOMElement('fill', 'search_input', this.selectors.Search.searchInput, searchTerm);
      
      await this.elementActions.click(this.selectors.Search.searchButton, 'Search Button');
      this.recordDOMElement('click', 'search_button', this.selectors.Search.searchButton);
      
      this.logger.info(`✅ Search for "${searchTerm}" completed`);
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      this.logger.warn(`⚠️ Search functionality not fully available: ${error.message}`);
    }
  }

  /**
   * Validate product cards are visible
   */
  async validateProductCardsVisible() {
    this.logger.step('Validating product cards visibility');
    await Report.addStep('Validate Product Cards Visibility');
    try {
      await this.assertionUtils.assertElementVisible(
        this.selectors.ProductCards.productContainer,
        'Product Cards'
      );
      this.recordDOMElement('validate', 'product_cards_visible', this.selectors.ProductCards.productContainer);
      this.logger.info('✅ Product cards are visible');
    } catch (error) {
      this.logger.warn(`⚠️ Product cards not found: ${error.message}`);
    }
  }

  /**
   * Click on first product card
   */
  async clickFirstProductCard() {
    this.logger.step('Clicking on first product card');
    await Report.addStep('Click on First Product Card');
    try {
      const productCards = await this.page.$$(this.selectors.ProductCards.productContainer);
      if (productCards.length > 0) {
        await productCards[0].click();
        this.recordDOMElement('click', 'first_product_card', this.selectors.ProductCards.productContainer);
        this.logger.info('✅ First product card clicked successfully');
        await this.page.waitForLoadState('networkidle');
      } else {
        this.logger.warn('⚠️ No product cards found');
      }
    } catch (error) {
      this.logger.error(`❌ Failed to click product card: ${error.message}`);
    }
  }

  /**
   * Scroll to footer
   */
  async scrollToFooter() {
    this.logger.step('Scrolling to footer');
    await Report.addStep('Scroll to Footer');
    try {
      await this.page.locator(this.selectors.Footer.footer).scrollIntoViewIfNeeded();
      this.recordDOMElement('scroll', 'scroll_to_footer', this.selectors.Footer.footer);
      this.logger.info('✅ Scrolled to footer successfully');
      await this.page.waitForTimeout(500);
    } catch (error) {
      this.logger.warn(`⚠️ Footer not found: ${error.message}`);
    }
  }

  /**
   * Validate footer is visible
   */
  async validateFooterVisible() {
    this.logger.step('Validating footer visibility');
    await Report.addStep('Validate Footer Visibility');
    try {
      await this.assertionUtils.assertElementVisible(
        this.selectors.Footer.footer,
        'Footer'
      );
      this.recordDOMElement('validate', 'footer_visible', this.selectors.Footer.footer);
      this.logger.info('✅ Footer is visible');
    } catch (error) {
      this.logger.warn(`⚠️ Footer validation failed: ${error.message}`);
    }
  }

  /**
   * Click on footer link
   */
  async clickFooterLink(linkText) {
    this.logger.step(`Clicking on footer link: ${linkText}`);
    await Report.addStep(`Click on Footer Link: ${linkText}`);
    try {
      await this.page.locator(`footer a:has-text("${linkText}")`).click();
      this.recordDOMElement('click', `footer_link_${linkText}`, `footer a:has-text("${linkText}")`);
      this.logger.info(`✅ Footer link "${linkText}" clicked successfully`);
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      this.logger.warn(`⚠️ Footer link "${linkText}" not found: ${error.message}`);
    }
  }

  /**
   * Get page title
   */
  async getPageTitle() {
    this.logger.step('Getting page title');
    const title = await this.page.title();
    this.recordDOMElement('read', 'page_title', 'head/title', title);
    this.logger.info(`Page Title: ${title}`);
    return title;
  }

  /**
   * Record DOM element interactions for reporting
   * @param {string} action - Type of action (click, fill, validate, scroll, read)
   * @param {string} elementName - Descriptive name of the element
   * @param {string} selector - CSS selector or locator
   * @param {string} value - Optional value (for fills or reads)
   */
  recordDOMElement(action, elementName, selector, value = null) {
    const record = {
      timestamp: new Date().toISOString(),
      action,
      elementName,
      selector,
      value,
    };
    this.domElements.push(record);
    this.logger.info(`📍 Recorded: [${action.toUpperCase()}] ${elementName} - ${selector}${value ? ` = "${value}"` : ''}`);
  }

  /**
   * Get all recorded DOM elements
   */
  getDOMRecords() {
    return this.domElements;
  }

  /**
   * Generate DOM interaction report
   */
  generateDOMReport() {
    this.logger.info('\n📊 === DOM INTERACTION REPORT ===');
    this.logger.info(`Total Interactions: ${this.domElements.length}\n`);
    
    this.domElements.forEach((record, index) => {
      const value = record.value ? ` = "${record.value}"` : '';
      this.logger.info(
        `${index + 1}. [${record.action.toUpperCase()}] ${record.elementName}${value}`
      );
      this.logger.info(`   Selector: ${record.selector}`);
      this.logger.info(`   Time: ${record.timestamp}\n`);
    });

    return this.domElements;
  }

  /**
   * Attach DOM report to Allure
   */
  async attachDOMReportToAllure() {
    const report = this.generateDOMReport();
    const reportJSON = JSON.stringify(report, null, 2);
    await Report.addAttachment('DOM_Interaction_Report', reportJSON, 'application/json');
  }
}

module.exports = FranklinTempletonHomePage;
