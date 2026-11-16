import { type Locator, type Page } from '@playwright/test';

export interface AccountSetupData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export class AccountSetupPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly phoneNumber: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly nextButton: Locator;

  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly emailError: Locator;
  readonly passwordLengthErrors: Locator;
  readonly passwordMismatchError: Locator;

  constructor(page: Page) {
    // Keep selectors in the page object so tests do not depend on page markup.
    this.firstName = page.getByLabel('First Name', { exact: true });
    this.lastName = page.getByLabel('Last Name', { exact: true });
    this.email = page.getByLabel('Email Address', { exact: true });
    this.phoneNumber = page.getByLabel('Phone Number', { exact: true });
    this.password = page.locator('input[name="password"]');
    this.confirmPassword = page.locator('input[name="confirmPassword"]');
    this.nextButton = page.getByRole('button', {
      name: 'Next',
      exact: true,
    });

    this.firstNameError = page.getByText(
      'First name must be at least 2 characters',
      { exact: true },
    );
    this.lastNameError = page.getByText(
      'Last name must be at least 2 characters',
      { exact: true },
    );
    this.emailError = page.getByText('Invalid email address', {
      exact: true,
    });
    this.passwordLengthErrors = page.getByText(
      'Password must be at least 8 characters',
      { exact: true },
    );
    this.passwordMismatchError = page.getByText('Passwords do not match', {
      exact: true,
    });
  }

  async fillEmail(value: string): Promise<void> {
    // Accepts test data from the spec; the page object owns the browser action.
    await this.email.fill(value);
  }

  async getEmailValidity(): Promise<{
    valid: boolean;
    typeMismatch: boolean;
    message: string;
  }> {
    // Read native HTML email validation without relying on browser-specific copy.
    return this.email.evaluate((element) => {
      const input = element as HTMLInputElement;
      return {
        valid: input.validity.valid,
        typeMismatch: input.validity.typeMismatch,
        message: input.validationMessage,
      };
    });
  }

  async fillPasswords(password: string, confirmation: string): Promise<void> {
    await this.password.fill(password);
    await this.confirmPassword.fill(confirmation);
  }

  async complete(data: AccountSetupData): Promise<void> {
    // Populate the account form from shared test data, then request the next step.
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.email.fill(data.email);
    await this.phoneNumber.fill(data.phoneNumber);
    await this.password.fill(data.password);
    await this.confirmPassword.fill(data.confirmPassword);
    await this.clickNext();
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }
}
