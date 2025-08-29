import { Page, Locator, expect } from '@playwright/test';
import { SearchComponent } from '../components/search-component';

export class SearchResultsPage {
  private page: Page;
  private searchComponent: SearchComponent;

  constructor(page: Page) {
    this.page = page;
    this.searchComponent = new SearchComponent(page);
  }

  get searchResultsTitle(): Locator {
    return this.page.locator('h1, [data-testid="search-results-title"]');
  }

  get allHeaders(): Locator {
    // This should target ALL h1 and h2 elements
    return this.page.locator('h1, h2, [data-testid="search-header"]');
  }
  async verifySearchPerformed(): Promise<void> {
    // Only check that the main search title is visible
    await expect(this.searchResultsTitle).toBeVisible();
  }

  async verifySearchTerm(searchTerm: string): Promise<void> {
    // This should check ALL h1 AND h2 elements
    const headerElements = await this.allHeaders.all();
    
    // Check each header contains the search term
    for (let i = 0; i < headerElements.length; i++) {
      const header = headerElements[i];
      const headerText = await header.textContent();
      console.log(`Checking header ${i + 1}: "${headerText}"`);
      await expect(header).toContainText(searchTerm, { ignoreCase: true });
    }
  }

  async verifySearchResults(searchTerm?: string): Promise<void> {
    await this.verifySearchPerformed();
    await this.searchComponent.verifySearchUrl(searchTerm || '');

    if (searchTerm) {
      await this.verifySearchTerm(searchTerm);
    }
  }
}