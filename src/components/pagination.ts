import { Page, Locator, expect } from '@playwright/test';

export class Pagination {
  constructor(private page: Page) {}

 
  get articleTitles(): Locator {
    return this.page.locator('h2.mb-1.line-clamp-2');
  }

  async getFirstArticleTitle(): Promise<string> {
    const first = this.articleTitles.first();
    await first.waitFor({ state: 'visible', timeout: 10000 });
    return await first.innerText();
  }

  async clickFirstArticle(): Promise<void> {
    await this.articleTitles.first().click();
  }

  async clickFirstArticleAndGetTitle(): Promise<string> {
    const first = this.articleTitles.first();
    const title = await first.innerText();
    await first.click();
    return title;
  }

  async getFirstNTitles(n: number): Promise<string[]> {
    const titles: string[] = [];
    const cards = this.page.locator('div[id^="9"]');
    const count = await cards.count();

    for (let i = 0; i < count && titles.length < n; i++) {
      const card = cards.nth(i);


      const isSponsored = await card.locator('button:has(span:text("Gesponsord"))').count();
      if (isSponsored > 0) continue;


      const titleLocator = card.locator('h2.mb-1.line-clamp-2');
      if (await titleLocator.count() === 0) continue;

      const title = (await titleLocator.innerText()).trim().replace(/\s+/g, ' ');
      titles.push(title);
    }

    if (titles.length < n) {
      console.warn(`Only found ${titles.length} non-sponsored titles on the page`);
    }

    return titles;
  }

  
  async goToNextPage(): Promise<void> {
    const firstNonSponsoredBefore = (await this.getFirstNTitles(1))[0] || '';

    const nextLink = this.page.getByRole('link', { name: /volgende/i });
    const nextButton = this.page.getByRole('button', { name: /volgende/i });

    const clickNext = async () => {
      if (await nextLink.isVisible().catch(() => false)) {
        await nextLink.click();
      } else {
        await nextButton.click();
      }
    };

    const oldUrl = this.page.url();

    await Promise.all([
      this.page.waitForURL(url => url.toString() !== oldUrl, { timeout: 15000 }),
      clickNext(),
    ]);

    await expect.poll(async () => {
      const firstNonSponsored = (await this.getFirstNTitles(1))[0] || '';
      return firstNonSponsored !== '' && firstNonSponsored !== firstNonSponsoredBefore;
    }, { timeout: 15000, message: 'Waiting for results to update after pagination' }).toBe(true);
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  async compareTitles(
    page1Titles: string[],
    page2Titles: string[]
  ): Promise<string[]> {
    return page2Titles.filter((t) => page1Titles.includes(t));
  }

  async getAllNonSponsoredTitles(): Promise<string[]> {
    const allTitles: string[] = [];
    const cards = this.page.locator('div[id^="9"]');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const isSponsored = await card.locator('button:has(span:text("Gesponsord"))').count();
      if (isSponsored > 0) continue;

      const titleLocator = card.locator('h2.mb-1.line-clamp-2');
      if ((await titleLocator.count()) === 0) continue;

      const title = (await titleLocator.innerText()).trim().replace(/\s+/g, ' ');
      allTitles.push(title);
    }

    return allTitles;
  }


  async getFirstNTitlesAcrossPages(n: number, _ignored?: string): Promise<{ page1: string[]; page2: string[] }> {
    const page1 = await this.getFirstNTitles(n);
    await this.takeScreenshot('page1');
    await this.goToNextPage();
    const page2 = await this.getFirstNTitles(n);
    await this.takeScreenshot('page2');
    return { page1, page2 };
  }
}
