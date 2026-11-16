import 'dotenv/config';

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './automation/tests',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
  ],
  outputDir: 'reports/test-results',
  use: {
    baseURL: process.env.BASE_URL ?? 'https://authorized-partner.vercel.app',
    ...devices['Desktop Chrome'],
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
