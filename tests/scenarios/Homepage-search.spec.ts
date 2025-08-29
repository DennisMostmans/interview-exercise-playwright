import {test, expect} from "@playwright/test";
import { Homepage } from "../../src/pages/homepage";
import { SearchComponent } from "../../src/components/search-component";
import { searchScenarios } from "../Fixtures/test-data";
import { ScreenshotHelper } from "../../src/helpers/screenshot-helper";
import { SearchResultsPage } from "../../src/pages/search-results-page.ts";
import { Prices } from "../../src/helpers/Prices.ts";

test.describe('Homepage Search Functionality', () => {
    let homepage: Homepage;
    let searchComponent: SearchComponent;
    let screenshotHelper: ScreenshotHelper;
    let searchResultsPage: SearchResultsPage;
    let prices: Prices;

    test.beforeEach(async ({ page }) => {
        homepage = new Homepage(page);
        searchComponent = new SearchComponent(page);
        screenshotHelper = new ScreenshotHelper(page);
        prices = new Prices(page);
        searchResultsPage = new SearchResultsPage(page);
        await homepage.goto();
    });

    test('Search for lego products on homepage and check for results', async ({ page }) => {
        await homepage.search(searchScenarios.lego.searchTerm);
        await searchResultsPage.verifySearchResults();
        await prices.getAllPrices();
        await screenshotHelper.takeScreenshot("Homepage-Search");
    });
});