import { test, expect } from '@playwright/test';
import FranklinTempletonInvestorPage from '../pageObjects/FranklinTempletonInvestorPage.js';
import { logger } from '../utils/logger.js';
import { getBaseURL } from '../config/env.js';

test.describe('Franklin Templeton Investor Page Tests', () => {
  let investorPage;

  test.beforeAll(async () => {
    const env = process.env.ENVIRONMENT || 'staging';
    logger.info(`🚀 Testcase Started on ${env.toUpperCase()} environment`);
    logger.info(`Base URL: ${getBaseURL(env)}`);
  });

  test.afterAll(async () => {
    logger.info('✅ Testcase Ended');
  });

  test.beforeEach(async ({ page }) => {
    investorPage = new FranklinTempletonInvestorPage(page);
  });

  test('Verify Investor page navigation and logo visibility', async () => {
    // Navigate to Franklin Templeton website
    await investorPage.navigateToWebsite();

    // Accept cookies
    await investorPage.acceptAllCookies();

    // Click on Investor link
    await investorPage.clickInvestorLink();

    // Verify Investor page is loaded
    await investorPage.verifyInvestorPageLoaded();

    // Verify logo is visible
    await investorPage.verifyLogoVisible();

    // Get and verify page URL and title
    const currentURL = await investorPage.getCurrentPageURL();
    const currentTitle = await investorPage.getCurrentPageTitle();

    expect(currentURL).toBeTruthy();
    expect(currentTitle).toBeTruthy();

    logger.info(`Current URL: ${currentURL}`);
    logger.info(`Current Title: ${currentTitle}`);
  });

  test('Verify logo click navigation', async () => {
    // Navigate to Franklin Templeton website
    await investorPage.navigateToWebsite();

    // Accept cookies
    await investorPage.acceptAllCookies();

    // Click on logo
    await investorPage.clickLogo();

    // Verify logo visibility
    await investorPage.verifyLogoVisible();

    logger.info('Logo navigation test completed successfully');
  });
});
