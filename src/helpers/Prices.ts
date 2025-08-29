import { Page, expect } from '@playwright/test';

export class Prices {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getAllPrices(): Promise<number[]> {
        const priceElements = this.page.locator("//span[contains(text(),'De prijs van dit product')]");
        const count = await priceElements.count();
        const prices: number[] = [];

        for (let i = 0; i < count; i++) {
            const text = await priceElements.nth(i).innerText();
            const match = text.match(/'(\d+)' euro en '(\d+)' cent/);
            if (match) {
                const euros = parseInt(match[1], 10);
                const cents = parseInt(match[2], 10);
                const numericPrice = euros + cents / 100;
                prices.push(numericPrice);
            }
        }

        return Array.from(new Set(prices));
    }

    async getFirst3PricesAscending(): Promise<number[]> {
        const priceElements = this.page.locator("//span[contains(text(),'De prijs van dit product')]");

        const count = await priceElements.count();
        const prices: number[] = [];

        for (let i = 0; i < count; i++) {
            const el = priceElements.nth(i);
            if (await el.isVisible()) {  // <-- only visible elements
                const text = await el.innerText();
                const match = text.match(/'(\d+)' euro en '(\d+)' cent/);
                if (match) {
                    const euros = parseInt(match[1], 10);
                    const cents = parseInt(match[2], 10);
                    const numericPrice = euros + cents / 100;
                    prices.push(numericPrice);
                }
            }

            if (prices.length === 3) break; 
        }

        if (prices.length < 3) {
            throw new Error(`Not enough visible prices found on the page. Found: ${prices.length}`);
        }

        console.log("First 3 visible prices in DOM order:", prices);

        
        expect(prices[0]).toBeLessThanOrEqual(prices[1]);
        expect(prices[1]).toBeLessThanOrEqual(prices[2]);

        return prices;
    }


}
