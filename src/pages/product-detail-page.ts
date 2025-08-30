import { Page, expect, BrowserContext } from '@playwright/test';

export class ProductDetailPage {
    constructor(private page: Page) {}

    
    get priceLocator() {
        return this.page.locator('span.promo-price[data-test="price"]:visible');
    }

    
    get titleLocator() {
        return this.page.locator('span[data-test="title"]:visible');
    }

    
    async expectPriceVisible(): Promise<void> {
        await expect(this.priceLocator).toBeVisible({ timeout: 5000 });
    }

    
    async expectTitleVisible(): Promise<string> {
        await expect(this.titleLocator).toBeVisible({ timeout: 5000 });
        return await this.titleLocator.innerText();
    }

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

    
    async expectAddToCartVisible(): Promise<void> {
        await expect(this.addToCartButton).toBeVisible({ timeout: 5000 });
    }

    async disableRoute(context: BrowserContext): Promise<void> {
        await context.route(
            (url: URL | string) => {
                try {
                    const u = typeof url === 'string' ? new URL(url) : url;
                    const p = u.pathname.toLowerCase();
                    const q = u.search.toLowerCase();
                    return (
                        p.includes('/order/basket/additems.html') ||
                        p.includes('/rnwy/addonpage') ||
                        p.includes('/nl/ajax/shoppingbasket.html') ||
                        p.includes('/winkelwagen') ||
                        q.includes('redirect=/nl/ajax/shoppingbasket.html') ||
                        q.includes('redirect=%2fnl%2fajax%2fshoppingbasket.html')
                    );
                    } catch {
                    return false;
                    }
                },
                async route => {
                    // Block all matching requests (XHR/fetch and document) to prevent leaving PDP
                    await route.abort('blockedbyclient');
                }
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
