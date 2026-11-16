import { type Page } from '@playwright/test';
import {
  waitForOtp,
  type OtpInboxConfig,
} from '../utils/otpInbox';
import { BaseSignupPage } from './BaseSignupPage';

export class OtpVerificationPage extends BaseSignupPage {
  constructor(page: Page) {
    super(page);
  }

  async verifyFromInbox(
    startedAt: Date,
    recipientEmail: string,
    inputLabel: string,
    verifyButtonName: string,
    inboxConfig: OtpInboxConfig,
  ): Promise<void> {
    const code = await waitForOtp(
      startedAt,
      recipientEmail,
      inboxConfig,
    );
    if (!/^\d{6}$/.test(code)) {
      throw new Error(
        'The OTP inbox helper returned an invalid code format; the code was not entered.',
      );
    }
    await this.fillField(inputLabel, code);
    await this.clickButton(verifyButtonName);
  }
}
