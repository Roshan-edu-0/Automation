import { type Locator, type Page } from '@playwright/test';

export class BaseSignupPage {
  constructor(protected readonly page: Page) {}

  protected field(label: string): Locator {
    if (!label.trim()) {
      throw new Error(
        'A candidate field label must be configured and verified against the signup form.',
      );
    }

    return this.page.getByLabel(label, { exact: true });
  }

  protected async fillField(label: string, value: string): Promise<void> {
    await this.field(label).fill(value);
  }

  protected async chooseOption(label: string, value: string): Promise<void> {
    const field = this.field(label);
    const tagName = await field.evaluate((element) =>
      element.tagName.toLowerCase(),
    );
    if (tagName === 'select') {
      await field.selectOption({ label: value });
      return;
    }

    await field.click();
    const option = this.page.getByRole('option', { name: value, exact: true });
    await option.click();
  }

  protected async uploadFile(label: string, filePath: string): Promise<void> {
    await this.field(label).setInputFiles(filePath);
  }

  protected async clickButton(name: string): Promise<void> {
    if (!name.trim()) {
      throw new Error('A verified button name must be configured.');
    }

    await this.page.getByRole('button', { name, exact: true }).click();
  }
}
