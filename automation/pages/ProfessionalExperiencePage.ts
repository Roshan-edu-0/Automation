import { type Page } from '@playwright/test';
import { BaseSignupPage } from './BaseSignupPage';

export interface ProfessionalExperienceData {
  yearsLabel: string;
  years: string;
  studentsLabel: string;
  students: string;
  focusLabel: string;
  focus: string;
  metricsLabel: string;
  metrics: string;
  servicesLabel: string;
  services: string;
  nextButtonName: string;
}

export class ProfessionalExperiencePage extends BaseSignupPage {
  constructor(page: Page) {
    super(page);
  }

  async complete(data: ProfessionalExperienceData): Promise<void> {
    await this.chooseOption(data.yearsLabel, data.years);
    await this.chooseOption(data.studentsLabel, data.students);
    await this.chooseOption(data.focusLabel, data.focus);
    await this.fillField(data.metricsLabel, data.metrics);
    await this.chooseOption(data.servicesLabel, data.services);
    await this.clickButton(data.nextButtonName);
  }
}
