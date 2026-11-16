import { type Page } from '@playwright/test';
import { BaseSignupPage } from './BaseSignupPage';

export interface AgencyDetailsData {
  nameLabel: string;
  name: string;
  roleLabel: string;
  role: string;
  emailLabel: string;
  email: string;
  websiteLabel: string;
  website: string;
  addressLabel: string;
  address: string;
  regionLabel: string;
  region: string;
  nextButtonName: string;
}

export class AgencyDetailsPage extends BaseSignupPage {
  constructor(page: Page) {
    super(page);
  }

  async complete(data: AgencyDetailsData): Promise<void> {
    await this.fillField(data.nameLabel, data.name);
    await this.chooseOption(data.roleLabel, data.role);
    await this.fillField(data.emailLabel, data.email);
    await this.fillField(data.websiteLabel, data.website);
    await this.fillField(data.addressLabel, data.address);
    await this.chooseOption(data.regionLabel, data.region);
    await this.clickButton(data.nextButtonName);
  }
}
