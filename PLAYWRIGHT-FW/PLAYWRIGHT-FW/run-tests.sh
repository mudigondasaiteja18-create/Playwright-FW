#!/bin/bash

# Playwright Environment Test Runner
# Usage: ./run-tests.sh [env] [optional: test file or --grep pattern]
# Examples:
#   ./run-tests.sh prod
#   ./run-tests.sh staging tests/franklinTempletonInvestor.spec.js
#   ./run-tests.sh beta --grep @smoke

ENV=${1:-staging}
TEST_FILE=${2:-.}
EXTRA_ARGS=${@:3}

# Validate environment
case $ENV in
  beta|staging|prod|development)
    echo "🚀 Running tests on $ENV environment..."
    ;;
  *)
    echo "❌ Error: Invalid environment '$ENV'"
    echo "Valid options: beta, staging, prod, development"
    echo ""
    echo "Usage: ./run-tests.sh [env] [test-file] [extra-args]"
    echo "Examples:"
    echo "  ./run-tests.sh prod"
    echo "  ./run-tests.sh staging tests/franklinTempletonInvestor.spec.js"
    echo "  ./run-tests.sh beta --grep @smoke"
    exit 1
    ;;
esac

# Get base URL from env.js for logging
source .env 2>/dev/null

echo ""
echo "Environment: $ENV"
echo "Test File: $TEST_FILE"
echo ""

# Run tests
ENVIRONMENT=$ENV npx playwright test $TEST_FILE $EXTRA_ARGS
