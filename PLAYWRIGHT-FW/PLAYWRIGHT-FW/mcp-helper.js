#!/usr/bin/env node

/**
 * Playwright MCP Helper
 * Allows running Playwright commands from external tools/MCP
 * Usage: node mcp-helper.js <command> <args>
 */

const { chromium, firefox, webkit } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Simple logger
const logger = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  error: (msg, err) => console.error(`❌ ${msg}`, err ? err.message : ''),
  success: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`)
};

/**
 * Launch a URL in browser (useful for manual testing/MCP integration)
 */
async function launch(url, options = {}) {
  const {
    browser = 'chromium',
    headless = false,
    slowMo = 0,
    width = 1280,
    height = 720
  } = options;

  let browserInstance;

  try {
    const BrowserType = browser === 'firefox' ? firefox : browser === 'webkit' ? webkit : chromium;
    
    logger.info(`🚀 Launching ${browser} browser...`);
    browserInstance = await BrowserType.launch({ 
      headless,
      slowMo
    });

    const context = await browserInstance.newContext({
      viewport: { width, height }
    });

    const page = await context.newPage();
    
    logger.info(`🌐 Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });
    
    logger.success(`Launched ${url} in ${browser}`);
    logger.info(`✋ Browser is open. Close it manually to exit.`);
    
    // Keep browser open until user closes it or times out
    await page.waitForEvent('close').catch(() => {});
    
    await context.close();
    await browserInstance.close();
    
    return { success: true, message: 'Browser closed' };

  } catch (error) {
    logger.error(`Failed to launch browser`, error);
    if (browserInstance) await browserInstance.close();
    throw error;
  }
}

/**
 * Run test file
 */
async function runTest(testFile, options = {}) {
  const {
    browser = 'chromium',
    headless = true,
    timeout = 30000,
  } = options;

  let browserInstance;
  
  try {
    const BrowserType = browser === 'firefox' ? firefox : browser === 'webkit' ? webkit : chromium;
    browserInstance = await BrowserType.launch({ headless });
    
    logger.info(`📱 Browser launched: ${browser}`);
    
    const context = await browserInstance.newContext();
    const page = await context.newPage();
    
    logger.info(`✅ Page created, running test: ${testFile}`);
    
    const testPath = path.resolve(testFile);
    const testModule = require(testPath);
    
    if (testModule.default) {
      await testModule.default(page);
    } else if (typeof testModule === 'function') {
      await testModule(page);
    }
    
    logger.success(`Test completed successfully`);
    
    await context.close();
    await browserInstance.close();
    
    return { success: true, message: 'Test passed' };
    
  } catch (error) {
    logger.error(`Test failed`, error);
    if (browserInstance) await browserInstance.close();
    throw error;
  }
}

/**
 * Record browser session with video
 */
async function recordSession(url, duration = 60000) {
  let browserInstance;
  
  try {
    if (!fs.existsSync('./recordings')) {
      fs.mkdirSync('./recordings', { recursive: true });
    }

    browserInstance = await chromium.launch({ headless: false });
    const context = await browserInstance.newContext({
      recordVideo: { dir: './recordings' }
    });
    
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    
    logger.info(`🎥 Recording session for ${duration}ms...`);
    logger.info(`📍 URL: ${url}`);
    await page.waitForTimeout(duration);
    
    await context.close();
    await browserInstance.close();
    
    logger.success(`Recording saved to ./recordings`);
    return { success: true, message: 'Recording saved' };
    
  } catch (error) {
    logger.error(`Recording failed`, error);
    if (browserInstance) await browserInstance.close();
    throw error;
  }
}

/**
 * Inspect element on page
 */
async function inspectElement(url, selector) {
  let browserInstance;
  
  try {
    browserInstance = await chromium.launch();
    const page = await browserInstance.newPage();
    await page.goto(url);
    
    const element = page.locator(selector);
    const count = await element.count();
    
    if (count === 0) {
      logger.warn(`Element not found: ${selector}`);
      return { success: false, message: `Element not found: ${selector}` };
    }
    
    const boundingBox = await element.first().boundingBox();
    const attributes = await element.first().evaluate(el => ({
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      text: el.textContent?.substring(0, 100)
    }));
    
    logger.success(`Found ${count} element(s) matching: ${selector}`);
    console.log(JSON.stringify({
      selector,
      count,
      boundingBox,
      attributes
    }, null, 2));
    
    await browserInstance.close();
    
    return {
      success: true,
      data: {
        selector,
        count,
        boundingBox,
        attributes
      }
    };
    
  } catch (error) {
    logger.error(`Inspection failed`, error);
    if (browserInstance) await browserInstance.close();
    throw error;
  }
}

// CLI Handler
async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  try {
    switch (command) {
      case 'launch':
        return await launch(args[0], JSON.parse(args[1] || '{}'));
        
      case 'run-test':
        return await runTest(args[0], JSON.parse(args[1] || '{}'));
        
      case 'record':
        return await recordSession(args[0], parseInt(args[1]) || 60000);
        
      case 'inspect':
        return await inspectElement(args[0], args[1]);
        
      default:
        console.log(`
╔════════════════════════════════════════════════════════════╗
║          Playwright MCP Helper - Available Commands        ║
╚════════════════════════════════════════════════════════════╝

🚀 LAUNCH - Open website in browser for manual testing
  node mcp-helper.js launch <url> [options]
  Example:
    node mcp-helper.js launch https://www.franklintempleton.com

🧪 RUN TEST - Execute a test file
  node mcp-helper.js run-test <file> [options]
  Example:
    node mcp-helper.js run-test tests/franklinTempelteon.spec.js

🎥 RECORD - Record browser session with video
  node mcp-helper.js record <url> [duration]
  Example:
    node mcp-helper.js record https://www.franklintempleton.com 60000

🔍 INSPECT - Inspect elements on a page
  node mcp-helper.js inspect <url> <selector>
  Example:
    node mcp-helper.js inspect https://www.franklintempleton.com "button[type='submit']"

Options JSON format:
  {"browser":"chromium|firefox|webkit","headless":true/false,"slowMo":1000}
        `);
        break;
    }
  } catch (error) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { launch, runTest, recordSession, inspectElement };
