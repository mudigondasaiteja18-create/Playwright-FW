/**
 * Global Setup for Playwright Tests
 * Runs before all tests
 */

async function globalSetup() {
  console.log('🚀 Starting global setup...');
  
  try {
    const currentEnv = process.env.ENVIRONMENT || 'staging';
    
    console.log('✓ Environment initialized');
    console.log(`✓ Testing environment: ${currentEnv.toUpperCase()}`);
    console.log('✓ URLs will be loaded from .env file');
  } catch (error) {
    console.error('❌ Configuration Error:', error.message);
    process.exit(1);
  }
  
  return async () => {
    // Cleanup if needed
  };
}

export default globalSetup;
