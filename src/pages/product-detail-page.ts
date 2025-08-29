import { Page, expect, BrowserContext } from '@playwright/test';

export class ProductDetailPage {
    constructor(private page: Page) {}

    /** Locator for the visible product price */
    get priceLocator() {
        return this.page.locator('span.promo-price[data-test="price"]:visible');
    }

    /** Locator for the visible product title */
    get titleLocator() {
        return this.page.locator('span[data-test="title"]:visible');
    }

    /** Assert that the product price is visible */
    async expectPriceVisible(): Promise<void> {
        await expect(this.priceLocator).toBeVisible({ timeout: 5000 });
    }

    /** Assert that the product title is visible and return its text */
    async expectTitleVisible(): Promise<string> {
        await expect(this.titleLocator).toBeVisible({ timeout: 5000 });
        return await this.titleLocator.innerText();
    }

    /** Optionally: check availability block */
    get availabilityLocator() {
        return this.page.locator('div[data-test="delivery-highlight"]:visible');
    }

    async expectItemIsAvailable(): Promise<void> {
        try {
            await expect(this.availabilityLocator).toHaveText(/Op voorraad/i, { timeout: 5000 });
        } catch {
            console.error('Item is niet op voorraad');
        }
    }

    get addToCartButton() {
        return this.page.getByRole('button', { name: 'In winkelwagen' }).first();
    }

    /** Assert that the Add to Cart button is visible */
    async expectAddToCartVisible(): Promise<void> {
        await expect(this.addToCartButton).toBeVisible({ timeout: 5000 });
    }

    async disableRoute(context: BrowserContext): Promise<void> {
        await this.page.route(
            (url) => url.pathname.includes('addOnPage') || url.pathname.includes('addItems'),
            route => route.abort()
        );
    }

    async ClickAddToCartWithoutAdding(): Promise<void> {
        await this.page.screenshot({ path:`test-results/screenshots/before-add-to-cart.png`, fullPage: true});

        await this.addToCartButton.click();

        const errorTitle = this.page.getByRole('heading', { level: 2, name: /excuses|technische fout/i });
        await errorTitle.waitFor({ state: 'attached'});
        await expect(errorTitle).toBeVisible({ timeout: 5000 });

        await errorTitle.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await expect(errorTitle).toHaveCSS('opacity', '1', { timeout: 2000 });

        await this.page.screenshot({ path:`test-results/screenshots/after-add-to-cart.png`, fullPage: true});
    }

}   
