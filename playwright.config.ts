import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',        
  timeout: 30000,
  workers: 1,               
  use: {
    headless: true,         
    viewport: { width: 1280, height: 800 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    locale: 'nl-BE',         
    extraHTTPHeaders: {
      'Accept-Language': 'nl-BE,nl;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'connection': 'keep-alive',
    },
    
    storageState: { cookies: [], origins: [] },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      }
    }
  ],
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  outputDir: 'test-results',
});
