import { Page, expect } from "@playwright/test";
import { CookieBanner } from "../components/cookie-banner";
import { SearchComponent } from "../components/Search-component";
import { CountryLanguageModal } from "../components/language-popup";

export class Homepage {
    private cookieBanner: CookieBanner;
    private searchComponent: SearchComponent;
    private countryLanguageModal: CountryLanguageModal;

    constructor(private page: Page) {
        this.cookieBanner = new CookieBanner(page);
        this.searchComponent = new SearchComponent(page);
        this.countryLanguageModal = new CountryLanguageModal(page);
    }

    async goto(): Promise<void> {
        await this.page.goto('https://www.bol.com/be/nl/');
        await this.cookieBanner.acceptAll();
        await this.countryLanguageModal.handleLanguagePopup();
        }
    
    async search(query: string): Promise<void> {
        await this.searchComponent.search(query);
        await this.searchComponent.verifySearchUrl(query);
    }
}
