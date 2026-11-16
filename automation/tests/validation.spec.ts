import { expect, test } from '@playwright/test';
import { AccountSetupPage } from '../pages/AccountSetupPage';
import { openAccountSetup } from '../utils/signupTestSetup';
import { createMismatchedPasswordData } from '../utils/testData';

// Scenario 1:
test('Invalid email is rejected and cannot continue', async ({ page }) => {
  await openAccountSetup(page);
  const accountPage = new AccountSetupPage(page);

  await accountPage.fillEmail('not-an-email');
  await accountPage.clickNext();

  const emailValidity = await accountPage.getEmailValidity();
  expect(emailValidity.valid).toBe(false);
  expect(emailValidity.typeMismatch).toBe(true);
  expect(emailValidity.message).not.toBe('');
  await expect(accountPage.email).toBeFocused();
  await expect(page).toHaveURL(/\/register\?step=setup/);
});

// Scenario 2:
test('Empty account fields show the observed validation messages', async ({
  page,
}) => {
  await openAccountSetup(page);
  const accountPage = new AccountSetupPage(page);

  await accountPage.clickNext();

  await expect(accountPage.firstNameError).toBeVisible();
  await expect(accountPage.lastNameError).toBeVisible();
  await expect(accountPage.emailError).toBeVisible();
  await expect(accountPage.passwordLengthErrors).toHaveCount(2);
  await expect(page).toHaveURL(/\/register\?step=setup/);
});

// Scenario 3:
test('Mismatched passwords are rejected and cannot continue', async ({
  page,
}) => {
  await openAccountSetup(page);
  const accountPage = new AccountSetupPage(page);
  const passwords = createMismatchedPasswordData();

  await accountPage.fillPasswords(
    passwords.password,
    passwords.confirmPassword,
  );
  await accountPage.clickNext();

  await expect(accountPage.passwordMismatchError).toBeVisible();
  await expect(page).toHaveURL(/\/register\?step=setup/);
});
