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

async disableRoute(contect: BrowserContext): Promise<void> {
    await this.page.route('**/*', async (route) => {
        const req = route.request();
        const u = new URL(req.url());

        // Abort the add-to-cart XHR/fetch
        if (
            ['xhr', 'fetch'].includes(req.resourceType()) &&
            (u.pathname.includes('addOnPage') || u.pathname.includes('addItems'))
        ) {
            await route.abort('failed');
        }
        // Block navigations to shopping cart caused by scripts
        else if (req.isNavigationRequest() && (u.pathname.includes('/winkelwagen') 
            || u.pathname.includes('/shoppingbasket') 
            || u.pathname.includes('/basket'))) {
            await route.abort();
        }
        else {
            await route.continue();
        }
    });
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
