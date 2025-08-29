import { Page, Locator, expect } from '@playwright/test';

export class CountryLanguageModal {
  private page: Page;
  private countryBtn: Locator;
  private doorgaanBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.countryBtn = page.getByRole('button', { name: /Land België.*Taal Nederlands/i });
    this.doorgaanBtn = page.getByRole('button', { name: 'Doorgaan' });
  }

  /**
   * Waits until the modal overlay is fully gone (no visible overlays remain).
   * Uses the site-specific class that actually blocks clicks.
   */
  async waitForOverlaysToClose(timeout: number = 8000) {
    const visibleOverlay = this.page.locator('.modal__overlay:visible');
    await expect(visibleOverlay, 'Waiting for modal overlay to disappear').toHaveCount(0, { timeout });
  }

  private async clickIfVisible(locator: Locator, options: { force?: boolean } = {}) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click(options);
      return true;
    }
    return false;
  }


  async handleCountryButton() {
    await this.clickIfVisible(this.countryBtn);
  }


  async handleDoorgaanButton() {
    if (!(await this.doorgaanBtn.isVisible().catch(() => false))) {
      return;
    }

    try {
      await this.doorgaanBtn.click({ timeout: 3000 });
    } catch {

      await this.doorgaanBtn.click({ force: true, timeout: 2000 });
    }


    await Promise.race([
      this.doorgaanBtn.waitFor({ state: 'hidden', timeout: 4000 }),
      this.doorgaanBtn.waitFor({ state: 'detached', timeout: 4000 }),
      this.waitForOverlaysToClose(8000),
    ]);
  }

  async handleLanguagePopup() {
    await this.handleCountryButton();
    await this.handleDoorgaanButton();
    await this.waitForOverlaysToClose(8000);
  }
}