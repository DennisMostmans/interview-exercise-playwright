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

  /**
   * Handles clicking the country button if it exists
   */
  async handleCountryButton() {
    await this.clickIfVisible(this.countryBtn);
  }

  /**
   * Handles the Doorgaan overlay logic safely
   */
  async handleDoorgaanButton() {
    if (!(await this.doorgaanBtn.isVisible().catch(() => false))) {
      return;
    }

    try {
      await this.doorgaanBtn.click({ timeout: 3000 });
    } catch {
      // Last-resort click if standard actionability is flaky while overlay animates.
      await this.doorgaanBtn.click({ force: true, timeout: 2000 });
    }

    // Wait until either the button disappears or the overlay is gone, whichever comes first.
    await Promise.race([
      this.doorgaanBtn.waitFor({ state: 'hidden', timeout: 4000 }),
      this.doorgaanBtn.waitFor({ state: 'detached', timeout: 4000 }),
      this.waitForOverlaysToClose(8000),
    ]);
  }

  /**
   * Safe to call at any time — handles modal if it appears and waits for overlay to be gone
   */
  async handleLanguagePopup() {
    await this.handleCountryButton();
    await this.handleDoorgaanButton();
    await this.waitForOverlaysToClose(8000);
  }
}