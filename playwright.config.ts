import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',        // where your test files live
  timeout: 30000,
  workers: 1,                // run tests sequentially
  use: {
    headless: true,         // run with UI, helps avoid bot detection
    viewport: { width: 1280, height: 800 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    locale: 'nl-BE',         // changed to Belgian Dutch
    extraHTTPHeaders: {
      'Accept-Language': 'nl-BE,nl;q=0.9',
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  outputDir: 'test-results',
});
