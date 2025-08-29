// ...existing code...
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
        return this.page.locator('[data-test="search-button"]');
    }

    async search(query: string) {
        await this.countryLanguageModal.waitForOverlaysToClose();
        await expect(this.searchBox).toBeVisible();
        await this.searchBox.fill(query);
        try {
            await expect(this.searchBox).toHaveValue(query);
        } catch  {
            await this.searchBox.fill(query);
            await expect (this.searchBox).toHaveValue(query, { timeout: 2000 });
        }

        // Ensure the modal overlay is fully gone before interacting with the header

        await expect(this.searchButton).toBeVisible();
        await expect(this.searchButton).toBeEnabled();

        try {
            await this.searchButton.click({ trial: true, timeout: 8000 });
            await this.searchButton.click();
        } catch {
            await this.searchBox.focus();
            await this.searchBox.press("Enter");
        }
        const current = await this.searchBox.inputValue();
        if (current !== query) {
            await this.countryLanguageModal.waitForOverlaysToClose();
            await this.searchBox.fill(query);
            await expect(this.searchBox).toHaveValue(query, { timeout: 2000 });
        }
    }

    async verifySearchUrl(query: string) {
        const encodedQuery = encodeURIComponent(query);
        await expect(this.page).toHaveURL(new RegExp(`/s/\\?searchtext=${encodedQuery}`));
    }
}
// ...existing code...