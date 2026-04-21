import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment Configuration
 * Reads all URLs from .env file - NO hardcoded defaults
 * Ensure .env file exists with all required environment URLs
 */

export const ENV_CONFIG = {
  beta: {
    baseURL: process.env.BETA_BASE_URL,
    apiURL: process.env.BETA_API_URL,
    timeout: 30000,
    headless: true,
    slowMo: 0,
  },
  staging: {
    baseURL: process.env.STAGING_BASE_URL,
    apiURL: process.env.STAGING_API_URL,
    timeout: 30000,
    headless: true,
    slowMo: 0,
  },
  prod: {
    baseURL: process.env.PROD_BASE_URL,
    apiURL: process.env.PROD_API_URL,
    timeout: 45000,
    headless: true,
    slowMo: 0,
  },
  development: {
    baseURL: process.env.DEV_BASE_URL,
    apiURL: process.env.DEV_API_URL,
    timeout: 30000,
    headless: false,
    slowMo: 100,
  },
};

/**
 * Get current environment configuration
 * @param {string} env - Environment name (beta, staging, prod, development)
 * @returns {Object} Environment configuration
 * @throws {Error} If environment is invalid or URLs not configured in .env
 */
export const getEnvironmentConfig = (env = process.env.ENVIRONMENT || 'staging') => {
  const config = ENV_CONFIG[env];
  
  if (!config) {
    throw new Error(`Invalid environment: ${env}. Valid options: beta, staging, prod, development`);
  }
  
  if (!config.baseURL) {
    throw new Error(`Missing ${env.toUpperCase()}_BASE_URL in .env file`);
  }
  
  return config;
};

/**
 * Get base URL for current environment
 * @param {string} env - Environment name
 * @returns {string} Base URL from .env file
 * @throws {Error} If URL not configured
 */
export const getBaseURL = (env = process.env.ENVIRONMENT || 'staging') => {
  const config = getEnvironmentConfig(env);
  if (!config.baseURL) {
    throw new Error(`${env.toUpperCase()}_BASE_URL is not set in .env file. Please copy .env.example to .env and configure URLs.`);
  }
  return config.baseURL;
};

/**
 * Validate all required environment URLs are configured
 * @throws {Error} If any required URLs are missing
 */
export const validateEnvironmentConfig = () => {
  const requiredEnvVars = [
    'BETA_BASE_URL',
    'STAGING_BASE_URL',
    'PROD_BASE_URL',
    'DEV_BASE_URL',
  ];
  
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing environment variables in .env file:\n${missing.join('\n')}\n\nPlease copy .env.example to .env and fill in all URLs.`
    );
  }
};

/**
 * Browser Configuration
 */
export const BROWSER_CONFIG = {
  chromium: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO) || 0,
    devtools: process.env.DEVTOOLS === 'true',
  },
  firefox: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO) || 0,
  },
  webkit: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO) || 0,
  },
};

/**
 * Timeout Configuration
 */
export const TIMEOUT_CONFIG = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  XLARGE: 60000,
};

/**
 * Retry Configuration
 */
export const RETRY_CONFIG = {
  maxRetries: process.env.MAX_RETRIES || 2,
  retryDelay: 1000,
};

/**
 * Logging Configuration
 */
export const LOG_CONFIG = {
  level: process.env.LOG_LEVEL || 'info',
  // 'debug' | 'info' | 'warn' | 'error'
  logToConsole: true,
  logToFile: true,
  logFilePath: './logs/',
};

export default {
  ENV_CONFIG,
  getEnvironmentConfig,
  getBaseURL,
  validateEnvironmentConfig,
  BROWSER_CONFIG,
  TIMEOUT_CONFIG,
  RETRY_CONFIG,
  LOG_CONFIG,
};
