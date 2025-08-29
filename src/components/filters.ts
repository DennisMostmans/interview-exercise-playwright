import { Page, Locator, expect } from '@playwright/test';

export class Filter {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get categoriesHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Categorieën' });
  }

  async isCategoriesSectionVisible(): Promise<boolean> {
    try {
      await this.page.waitForTimeout(2000); 
      return await this.categoriesHeading.isVisible();
    } catch {
      return false;
    }
  }

  get categorieSpeelgoed(): Locator {
    return this.page.getByRole('link', { name: /Speelgoed/i }).first();
  }

  async isSpeelgoedVisible(): Promise<boolean> {
    try {      
      const categoriesExists = await this.isCategoriesSectionVisible();
      if (!categoriesExists) return false;
      
      const speelgoedExists = await this.categorieSpeelgoed.isVisible();

      if (!speelgoedExists) {
        const categoryElements = await this.page.locator(
          'xpath=//span[contains(text(), "Categorieën")]/following-sibling::*//a | //span[contains(text(), "Categorieën")]/following::*//a[contains(@href, "/s/")]'
        ).allTextContents();
        console.log('Available categories (first 10):', categoryElements.slice(0, 10));
      }

      return speelgoedExists;
    } catch (error) {
      console.log('Error checking Speelgoed visibility:', error);
      return false;
    }
  }

  async ClickSpeelgoed(): Promise<void> {
    const previousUrl = this.page.url();
    await this.categorieSpeelgoed.click();
    await this.page.waitForURL(url => url.toString() !== previousUrl, { timeout: 10000 });
  }

  get h1Heading(): Locator {
    return this.page.locator('h1');
  }

  async IsSpeelgoedInH1(): Promise<boolean> {
    const h1Text = await this.h1Heading.textContent();
    return h1Text?.includes('Speelgoed') ?? false;
  }

  /**
   * Unified helper to apply Speelgoed filter if available
   */
  async applySpeelgoedFilterIfAvailable(): Promise<void> {
    // Verify categories section exists
    const isCategoriesVisible = await this.isCategoriesSectionVisible();
    expect(isCategoriesVisible).toBe(true);

    // Check if Speelgoed filter is available
    const isSpeelgoedVisible = await this.isSpeelgoedVisible();

    if (isSpeelgoedVisible) {
      await this.ClickSpeelgoed();

      // Wait for H1 to update
      await expect(this.h1Heading).toContainText('Speelgoed', { timeout: 10000 });

      // Double-check H1 contains Speelgoed
      const hasSpeelgoedInH1 = await this.IsSpeelgoedInH1();
      expect(hasSpeelgoedInH1).toBe(true);
    } else {
      console.log('Speelgoed filter not available for this search, proceeding without it');
    }
  }
}
