import { Page, Locator, expect } from '@playwright/test';

export class CountryLanguageModal {
  private page: Page;
  private countryBtn: Locator;
  private doorgaanBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.countryBtn = page.getByRole('button', { name: /Land België.*Taal Nederlands/i });
    this.doorgaanBtn = page.getByRole('button', { name: /Doorgaan/i });
  }

  /**
   * Wait until no visible modal/overlay blocks interactions anymore
   */
  async waitForOverlaysToClose(timeout: number = 5000) {
    const visibleOverlays = this.page.locator(
      '[role="dialog"]:visible, [aria-modal="true"]:visible, .modal:visible, .overlay:visible, [data-state="open"]:visible'
    );
    await expect(visibleOverlays).toHaveCount(0, { timeout });
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
      await this.doorgaanBtn.click({ timeout: 2000 });
    } catch {
      console.warn('Normal click failed, trying fallback');
      await this.page.evaluate(() => {
        document.querySelectorAll('[role="dialog"], [data-state="open"], .modal, .overlay')
          .forEach(el => (el as HTMLElement).style.display = 'none');
      });
      await this.clickIfVisible(this.doorgaanBtn, { force: true });
    }

    // Wait until the button is gone (hidden OR detached)
    await Promise.race([
      this.doorgaanBtn.waitFor({ state: 'hidden', timeout: 4000 }),
      this.doorgaanBtn.waitFor({ state: 'detached', timeout: 4000 }),
    ]);

  // And ensure no other visible overlays remain
  await this.waitForOverlaysToClose(6000);
  }

  /**
   * Safe to call at any time — handles modal if it appears
   */
  async handleLanguagePopup() {
    await this.handleCountryButton();
    await this.handleDoorgaanButton();
  await this.waitForOverlaysToClose(6000);
  }
}
