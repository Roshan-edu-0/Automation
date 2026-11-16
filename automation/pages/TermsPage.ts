import { type Locator, type Page } from '@playwright/test';

export class TermsPage {
  private readonly termsCheckbox: Locator;
  private readonly continueButton: Locator;

  constructor(private readonly page: Page) {
    this.termsCheckbox = page.getByRole('checkbox', {
      name: 'I agree to the Terms of Service and Privacy Policy',
      exact: true,
    });
    this.continueButton = page.getByRole('button', {
      name: 'Continue',
      exact: true,
    });
  }

  async open(): Promise<void> {
    await this.page.goto('/register');
  }

  async acceptTerms(): Promise<void> {
    await this.termsCheckbox.check();
  }

  async continueToAccountSetup(): Promise<void> {
    await this.continueButton.click();
  }
}
