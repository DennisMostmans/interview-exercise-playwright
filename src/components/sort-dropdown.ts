import { Page, expect } from '@playwright/test';
import { Prices } from '../helpers/Prices';

export class SortDropdown {
  private readonly page: Page;
  private readonly prices: Prices;

  constructor(page: Page) {
    this.page = page;
    this.prices = new Prices(page);
  }

  async sortByPriceAscending(): Promise<void> {
    await this.page.selectOption('select[label="Sortering"]', 'PRICE_ASC');
    await expect.poll(async () => {
      const allPrices = (await this.prices.getAllPrices()).map(Number);
      if (allPrices.length < 3) return false;
      const [first, second, third] = allPrices.slice(0, 3);
      return first <= second && second <= third;
    }, {
      timeout: 10000,
    }).toBe(true);
  }
}