import { type Locator, type Page } from '@playwright/test';
import { BaseSignupPage } from './BaseSignupPage';

export interface VerificationPreferencesData {
  businessNumberLabel: string;
  businessNumber: string;
  countriesLabel: string;
  country: string;
  institutionTypesLabel: string;
  institutionType: string;
  certificationLabel?: string;
  certificationDetails?: string;
  documentLabel: string;
  documentPath: string;
  submitButtonName: string;
  profileUrl: string;
  profileHeading: string;
}

export class VerificationPreferencesPage extends BaseSignupPage {
  constructor(page: Page) {
    super(page);
  }

  async completeAndSubmit(data: VerificationPreferencesData): Promise<void> {
    await this.fillField(data.businessNumberLabel, data.businessNumber);
    await this.chooseOption(data.countriesLabel, data.country);
    await this.chooseOption(data.institutionTypesLabel, data.institutionType);

    if (data.certificationDetails) {
      if (!data.certificationLabel) {
        throw new Error(
          'CERTIFICATION_DETAILS_LABEL is required when certification details are configured.',
        );
      }
      await this.fillField(
        data.certificationLabel,
        data.certificationDetails,
      );
    }

    await this.uploadFile(data.documentLabel, data.documentPath);
    await this.clickButton(data.submitButtonName);
  }

  successHeading(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }

  expectedProfileUrl(url: string): string {
    if (!url.trim()) {
      throw new Error('PROFILE_SUCCESS_URL must be configured and verified.');
    }
    return url;
  }
}
