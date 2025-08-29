import { Page, Locator } from "@playwright/test";

export class CookieBanner {
    constructor(private page: Page) {}

    private get acceptAllButton(): Locator {
        return this.page.getByRole('button', { name: /alles accepteren|accept all/i });
    }

    private get cookieBanner(): Locator {
        return this.page.locator('[data-testid="cookie-banner"], .cookie-banner, #cookie-banner').first();
    }

    async isVisible(): Promise<boolean> {
        try {
            await this.acceptAllButton.waitFor({ state: 'visible', timeout: 3000 });
            return true;
        } catch {
            return false;
        }
    }

    async acceptAll(): Promise<void> {
        const isVisible = await this.isVisible();
        if (isVisible) {
            await this.acceptAllButton.click();
            await this.acceptAllButton.waitFor({ state: 'detached', timeout: 5000 });
        }
    }

    async dismiss(): Promise<void> {
        await this.acceptAll();
    }
}