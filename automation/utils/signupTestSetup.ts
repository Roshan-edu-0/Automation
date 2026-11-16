import { expect, type Page } from '@playwright/test';
import { TermsPage } from '../pages/TermsPage';

export async function openAccountSetup(page: Page): Promise<void> {
  const termsPage = new TermsPage(page);
  await termsPage.open();
  await termsPage.acceptTerms();
  await termsPage.continueToAccountSetup();
  await expect(page).toHaveURL(/\/register\?step=setup/);
}
