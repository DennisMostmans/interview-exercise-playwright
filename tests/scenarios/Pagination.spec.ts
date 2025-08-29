import {test, expect} from "@playwright/test";
import { Homepage } from "../../src/pages/homepage.ts";
import { searchScenarios } from "../Fixtures/test-data.ts";
import { ScreenshotHelper } from "../../src/helpers/screenshot-helper.ts";
import { SearchResultsPage } from "../../src/pages/search-results-page.ts";
import { Pagination } from "../../src/components/pagination.ts";
import { ProductDetailPage } from "../../src/pages/product-detail-page.ts";

test.describe('Verification of pagination', () => {
    let homepage: Homepage;
    let screenshotHelper: ScreenshotHelper;
    let searchResultsPage: SearchResultsPage;
    let pagination: Pagination;
    let productDetailPage: ProductDetailPage;

    test.beforeEach(async ({ page }) => {
        homepage = new Homepage(page);
        screenshotHelper = new ScreenshotHelper(page);
        searchResultsPage = new SearchResultsPage(page);
        pagination = new Pagination(page);
        productDetailPage = new ProductDetailPage(page);
        await homepage.goto();
    });

    test('Navigate to second page and compare first 5 titles.', async ({ page }) => {
    await homepage.search(searchScenarios.lego.searchTerm);
    await searchResultsPage.verifySearchResults();

    // Use new helper to get first 5 titles and take screenshot of page 2
    const { page1, page2 } = await pagination.getFirstNTitlesAcrossPages(5, 'page2');

    // Compare titles
    const duplicates = await pagination.compareTitles(page1, page2);
    expect(duplicates, `Duplicates found: ${duplicates}`).toEqual([]);

    console.log('Page 1 titles:', page1);
    console.log('Page 2 titles:', page2);
    });
});
