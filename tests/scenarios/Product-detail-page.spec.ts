import {test, expect} from "@playwright/test";
import { Homepage } from "../../src/pages/homepage.ts";
import { searchScenarios } from "../Fixtures/test-data.ts";
import { ScreenshotHelper } from "../../src/helpers/screenshot-helper.ts";
import { SearchResultsPage } from "../../src/pages/search-results-page.ts";
import { Pagination } from "../../src/components/pagination.ts";
import { ProductDetailPage } from "../../src/pages/product-detail-page.ts";

test.describe('Product detail page', () => {
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

    test('check visibility of all product details, block cart actions and remain on PDP after add-to-cart click', async ({ page }) => {
        await homepage.search(searchScenarios.lego.searchTerm);
        await searchResultsPage.verifySearchResults();

        await pagination.getFirstArticleTitle();
        await pagination.clickFirstArticle();

        await productDetailPage.expectTitleVisible();
        await productDetailPage.expectPriceVisible();
        await productDetailPage.expectItemIsAvailable();
        await productDetailPage.expectAddToCartVisible();
        
        await productDetailPage.disableRoute(page.context());
        await productDetailPage.ClickAddToCartWithoutAdding();
    });
});