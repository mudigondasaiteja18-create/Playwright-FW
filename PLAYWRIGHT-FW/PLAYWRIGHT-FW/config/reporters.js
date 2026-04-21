/**
 * Reporter Configuration
 * Defines custom reporters and reporting settings
 */

export const customReporters = [
  ['html', { outputFolder: 'test-reports', open: 'never' }],
  ['json', { outputFile: 'test-reports/results.json' }],
  ['list'],
];

export const allureReporterConfig = {
  detail: true,
  suiteTitle: true,
  categories: [
    {
      name: 'Flaky Tests',
      match: '.*@flaky.*',
      messageRegex: '.*timeout.*',
    },
    {
      name: 'Critical Tests',
      match: '.*@critical.*',
    },
    {
      name: 'UI Tests',
      match: '.*@ui.*',
    },
    {
      name: 'API Tests',
      match: '.*@api.*',
    },
  ],
};
