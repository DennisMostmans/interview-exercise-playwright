import {test, expect} from "@playwright/test";
import { Homepage } from "../../src/pages/homepage";
import { SearchComponent } from "../../src/components/search-component";
import { searchScenarios } from "../Fixtures/test-data";
import { ScreenshotHelper } from "../../src/helpers/screenshot-helper";
import { SearchResultsPage } from "../../src/pages/search-results-page.ts";
import { Prices } from "../../src/helpers/Prices.ts";
import { Filter } from "../../src/components/filters.ts";
import { SortDropdown } from "../../src/components/sort-dropdown.ts";

test.describe('Homepage Search Functionality', () => {
    let homepage: Homepage;
    let searchComponent: SearchComponent;
    let screenshotHelper: ScreenshotHelper;
    let searchResultsPage: SearchResultsPage;
    let prices: Prices;
    let filter: Filter;
    let sortDropdown: SortDropdown;

    test.beforeEach(async ({ page }) => {
        homepage = new Homepage(page);
        searchComponent = new SearchComponent(page);
        screenshotHelper = new ScreenshotHelper(page);
        prices = new Prices(page);
        searchResultsPage = new SearchResultsPage(page);
        filter = new Filter(page);
        sortDropdown = new SortDropdown(page);
        await homepage.goto();
    });

    test("Filter on speelgoed and put the price ascending", async ({ page }) => {
        await homepage.search(searchScenarios.lego.searchTerm);
        await searchResultsPage.verifySearchResults();
        await filter.applySpeelgoedFilterIfAvailable();
        await sortDropdown.sortByPriceAscending();
        const first3Prices = await prices.getFirst3PricesAscending();
        await screenshotHelper.takeScreenshot("Filter-Sort-Price-Ascending");
    });
});