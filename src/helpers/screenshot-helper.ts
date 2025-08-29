import { Page } from '@playwright/test';

export class ScreenshotHelper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async takeScreenshot(fileName: string): Promise<void> {
        await this.page.screenshot({ 
            path: `test-results/screenshots/${fileName}.png`,
            fullPage: true 
        });
    }

    async takeSearchResultsScreenshot(): Promise<void> {
        await this.takeScreenshot('search-results');
    }

    async takeScreenshotWithTimestamp(baseName: string): Promise<void> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await this.takeScreenshot(`${baseName}-${timestamp}`);
    }
}