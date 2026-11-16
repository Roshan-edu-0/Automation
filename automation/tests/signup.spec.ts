import { expect, test } from '@playwright/test';
import { AccountSetupPage } from '../pages/AccountSetupPage';
import { AgencyDetailsPage } from '../pages/AgencyDetailsPage';
import { OtpVerificationPage } from '../pages/OtpVerificationPage';
import { ProfessionalExperiencePage } from '../pages/ProfessionalExperiencePage';
import { TermsPage } from '../pages/TermsPage';
import { VerificationPreferencesPage } from '../pages/VerificationPreferencesPage';
import { loadFullSignupData } from '../utils/testData';

test.describe('Approved full signup', () => {
  test.use({ screenshot: 'off', trace: 'off' });

  test('Complete agency signup with email OTP', async ({ page }) => {
    test.setTimeout(360_000);
    // Safety gate: both flags are required before any signup page is opened.
    test.skip(
      process.env.RUN_FULL_SIGNUP !== '1' ||
        process.env.REGISTRATION_APPROVED !== '1',
      'Requires both RUN_FULL_SIGNUP=1 and REGISTRATION_APPROVED=1.',
    );

    // This preflight rejects unsupported OTP, mailbox, and test-data settings before navigation.
    const data = loadFullSignupData();
    const termsPage = new TermsPage(page);
    const accountPage = new AccountSetupPage(page);
    const otpPage = new OtpVerificationPage(page);
    const agencyPage = new AgencyDetailsPage(page);
    const professionalPage = new ProfessionalExperiencePage(page);
    const verificationPage = new VerificationPreferencesPage(page);

    await termsPage.open();
    await termsPage.acceptTerms();
    await termsPage.continueToAccountSetup();
    await expect(page).toHaveURL(/\/register\?step=setup/);

    // Capture the start time before requesting verification so older mail is ignored.
    const otpRequestedAt = new Date();
    await accountPage.complete(data.account);
    await otpPage.verifyFromInbox(
      otpRequestedAt,
      data.account.email,
      data.otp.inputLabel,
      data.otp.verifyButtonName,
      data.inbox,
    );

    // Continue through the remaining signup steps using their page objects.
    await agencyPage.complete(data.agency);
    await professionalPage.complete(data.professional);
    await verificationPage.completeAndSubmit(data.verification);

    await expect(page).toHaveURL(
      verificationPage.expectedProfileUrl(data.verification.profileUrl),
    );
    await expect(
      verificationPage.successHeading(data.verification.profileHeading),
    ).toBeVisible();
  });
});
