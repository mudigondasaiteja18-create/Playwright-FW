/**
 * Franklin Templeton Investor Page Selectors
 * Contains all CSS selectors for the Investor page
 */

export const FranklinTempletonInvestorSelectors = {
  // Cookie Consent
  cookieAcceptAll: '[data-testid="cookie-accept-all"], [id*="accept"], button:has-text("Accept All")',
  cookieBanner: '[id*="cookie"], [class*="cookie"]',

  // Navigation
  logo: 'a[aria-label*="logo"], img[alt*="Franklin"], [class*="logo"]',
  investorLink: 'a[href*="investor"], nav a:has-text("Investor")',

  // Main Content
  pageTitle: 'h1, [role="heading"][aria-level="1"]',
  investorHeading: 'h1, h2:has-text("Investor")',

  // Verify Elements
  mainContent: 'main, [role="main"]',
  investorSection: '[class*="investor"], section:has-text("Investor")',
};
