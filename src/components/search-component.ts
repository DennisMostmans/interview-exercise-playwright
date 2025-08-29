import { Page, Locator, expect } from "@playwright/test";
import { CountryLanguageModal } from "./language-popup";
   
export class SearchComponent{
    private countryLanguageModal: CountryLanguageModal;

    constructor(private page: Page) {
        this.countryLanguageModal = new CountryLanguageModal(page);
    }

    private get searchBox(): Locator {
        return this.page.locator('[data-test="search_input_trigger"]');
    }

    private get searchButton(): Locator {
        return this.page.getByRole('button', { name: 'Zoeken' });
    }

    async search(query: string) {
    await this.searchBox.waitFor({ state: 'visible', timeout: 5000 });
    await this.searchBox.fill(query);  
    await this.searchButton.waitFor({state: 'visible', timeout: 5000 });
    try {
        await this.searchButton.click({ trial: false});
    } catch {
        console.warn("Search button blocked, falling back to Enter");
        await this.searchBox.press("Enter");
    }
}

    async verifySearchUrl(query: string) {
        const encodedQuery = encodeURIComponent(query);
        await expect(this.page).toHaveURL(new RegExp(`/s/\\?searchtext=${encodedQuery}`));
    }
}
