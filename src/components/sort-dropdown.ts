import { Page, expect } from '@playwright/test';
import { Prices } from '../helpers/Prices';

export class SortDropdown {
  private page: Page;
  private prices: Prices;

  constructor(page: Page) {
    this.page = page;
    this.prices = new Prices(page);
  }

  async sortByPriceAscending(): Promise<void> {
    await this.page.selectOption('select[label="Sortering"]', 'PRICE_ASC');
    await expect.poll(async () => {
            const allPrices = await this.prices.getAllPrices();
            const first3 = allPrices.slice(0, 3);
            return first3[0] <= first3[1] && first3[1] <= first3[2];
        }, { timeout: 10000 }).toBe(true);
    }
}
