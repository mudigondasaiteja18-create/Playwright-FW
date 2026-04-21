import fs from 'fs';
import path from 'path';
import { LOG_CONFIG } from '../config/env.js';

/**
 * Logger Utility
 * Provides centralized logging for tests and framework operations
 */

class Logger {
  constructor() {
    this.logDir = LOG_CONFIG.logFilePath;
    this.logFile = path.join(this.logDir, `test-${new Date().toISOString().split('T')[0]}.log`);
    this.initializeLogDirectory();
  }

  /**
   * Initialize log directory
   */
  initializeLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Write to log file
   * @param {string} message - Message to log
   */
  writeToFile(message) {
    if (LOG_CONFIG.logToFile) {
      fs.appendFileSync(this.logFile, `${message}\n`);
    }
  }

  /**
   * Format log message with timestamp and level
   * @param {string} level - Log level
   * @param {string} message - Message to log
   * @returns {string} Formatted message
   */
  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  /**
   * Log debug message
   * @param {string} message - Message to log
   */
  debug(message) {
    if (this.shouldLog('debug')) {
      const formatted = this.formatMessage('DEBUG', message);
      if (LOG_CONFIG.logToConsole) console.log('🔍', formatted);
      this.writeToFile(formatted);
    }
  }

  /**
   * Log info message
   * @param {string} message - Message to log
   */
  info(message) {
    if (this.shouldLog('info')) {
      const formatted = this.formatMessage('INFO', message);
      if (LOG_CONFIG.logToConsole) console.log('ℹ️', formatted);
      this.writeToFile(formatted);
    }
  }

  /**
   * Log warning message
   * @param {string} message - Message to log
   */
  warn(message) {
    if (this.shouldLog('warn')) {
      const formatted = this.formatMessage('WARN', message);
      if (LOG_CONFIG.logToConsole) console.warn('⚠️', formatted);
      this.writeToFile(formatted);
    }
  }

  /**
   * Log error message
   * @param {string} message - Message to log
   * @param {Error} error - Optional error object
   */
  error(message, error = null) {
    const formatted = this.formatMessage('ERROR', message);
    if (LOG_CONFIG.logToConsole) console.error('❌', formatted);
    this.writeToFile(formatted);
    if (error) {
      const errorFormatted = this.formatMessage('ERROR', error.stack || error.toString());
      if (LOG_CONFIG.logToConsole) console.error(errorFormatted);
      this.writeToFile(errorFormatted);
    }
  }

  /**
   * Check if message should be logged based on log level
   * @param {string} level - Log level
   * @returns {boolean}
   */
  shouldLog(level) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    const currentLevel = levels[LOG_CONFIG.level] || 1;
    return levels[level] >= currentLevel;
  }

  /**
   * Log step execution
   * @param {string} stepName - Name of the step
   * @param {string} action - Action performed
   */
  step(stepName, action) {
    const message = `🔹 STEP: ${stepName} -> ${action}`;
    if (LOG_CONFIG.logToConsole) console.log(message);
    this.writeToFile(this.formatMessage('STEP', `${stepName} -> ${action}`));
  }

  /**
   * Log test execution
   * @param {string} testName - Name of the test
   * @param {string} status - Test status (PASS/FAIL/SKIP)
   */
  testResult(testName, status) {
    const symbol = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⊘';
    const message = `${symbol} TEST ${status}: ${testName}`;
    if (LOG_CONFIG.logToConsole) console.log(message);
    this.writeToFile(this.formatMessage('TEST', `${testName} -> ${status}`));
  }

  /**
   * Log with custom context
   * @param {string} context - Context/source
   * @param {string} message - Message to log
   */
  context(context, message) {
    const formatted = `[${context}] ${message}`;
    this.info(formatted);
  }
}

export const logger = new Logger();

export default logger;
