import { existsSync, statSync } from 'node:fs';
import { randomBytes, randomInt, randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import {
  loadOtpInboxConfig,
  type OtpInboxConfig,
} from './otpInbox';

export interface SignupTestDataSets {
  valid: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  };
  invalid: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  empty: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  };
  boundary: {
    firstName: string;
    lastName: string;
    minimumLengthPassword: string;
  };
}

export interface FullSignupData {
  inbox: OtpInboxConfig;
  account: SignupTestDataSets['valid'];
  otp: {
    inputLabel: string;
    verifyButtonName: string;
  };
  agency: {
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
  };
  professional: {
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
  };
  verification: {
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
  };
}

export function mustGet(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required in .env for an approved full signup.`);
  }
  return value;
}

function optional(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

function positiveInteger(name: string): number {
  const value = mustGet(name);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return parsed;
}

function getApprovedDummyDocumentPath(): string {
  if (process.env.TEST_DOCUMENT_APPROVED !== '1') {
    throw new Error(
      'Set TEST_DOCUMENT_APPROVED=1 only after confirming the configured file is an approved dummy document.',
    );
  }

  const documentPath = resolve(mustGet('TEST_DOCUMENT_PATH'));
  if (!existsSync(documentPath) || !statSync(documentPath).isFile()) {
    throw new Error(
      'TEST_DOCUMENT_PATH must point to an existing approved dummy document file.',
    );
  }
  return documentPath;
}

export function createUniqueTestEmail(baseInbox: string): string {
  const match = /^([^@]+)@([^@]+)$/.exec(baseInbox.trim());
  if (!match) {
    throw new Error('TEST_EMAIL must be a valid approved inbox address.');
  }

  const [, localPart, domain] = match;
  const normalizedLocalPart = localPart.toLowerCase();
  const normalizedDomain = domain.toLowerCase();
  if (
    normalizedLocalPart.startsWith('your-approved-') ||
    normalizedLocalPart.includes('placeholder') ||
    normalizedDomain === 'yopmail.com' ||
    normalizedDomain.endsWith('.yopmail.com') ||
    /^example\.(com|org|net)$/.test(normalizedDomain)
  ) {
    throw new Error(
      'TEST_EMAIL must use an approved private inbox, not a public YOPmail inbox or placeholder domain; no browser navigation was performed.',
    );
  }

  return `${localPart}+qa-${randomUUID()}@${domain}`;
}

export function createUniqueTestPhone(): string {
  const prefix = mustGet('TEST_PHONE_PREFIX');
  if (!/^\d+$/.test(prefix)) {
    throw new Error('TEST_PHONE_PREFIX must contain digits only.');
  }

  const nationalLength = positiveInteger('TEST_PHONE_NATIONAL_LENGTH');
  const suffixLength = nationalLength - prefix.length;
  if (suffixLength < 1 || suffixLength > 12) {
    throw new Error(
      'TEST_PHONE_NATIONAL_LENGTH must exceed the prefix length and leave at most 12 generated digits.',
    );
  }

  const suffix = randomInt(0, 10 ** suffixLength)
    .toString()
    .padStart(suffixLength, '0');
  return `${prefix}${suffix}`;
}

export function createTestPassword(): string {
  const configuredPassword = optional('TEST_PASSWORD');
  if (configuredPassword) {
    if (
      configuredPassword.length < 12 ||
      !/[a-z]/.test(configuredPassword) ||
      !/[A-Z]/.test(configuredPassword) ||
      !/\d/.test(configuredPassword) ||
      !/[^A-Za-z0-9]/.test(configuredPassword)
    ) {
      throw new Error(
        'TEST_PASSWORD must be at least 12 characters with upper/lowercase letters, a digit, and a special character.',
      );
    }
    return configuredPassword;
  }

  return `Qa!${randomBytes(18).toString('base64url')}9`;
}

export function createMismatchedPasswordData(
  password = createTestPassword(),
): {
  password: string;
  confirmPassword: string;
} {
  const lastCharacter = password.at(-1);
  if (!lastCharacter) {
    throw new Error('A non-empty test password is required.');
  }

  const replacement = /[A-Z]/.test(lastCharacter)
    ? lastCharacter === 'Q'
      ? 'R'
      : 'Q'
    : /[a-z]/.test(lastCharacter)
      ? lastCharacter === 'a'
        ? 'b'
        : 'a'
      : /\d/.test(lastCharacter)
        ? lastCharacter === '0'
          ? '1'
          : '0'
        : lastCharacter === '!'
          ? '?'
          : '!';

  return {
    password,
    confirmPassword: `${password.slice(0, -1)}${replacement}`,
  };
}

export function createSignupTestDataSets(): SignupTestDataSets {
  const baseInbox = mustGet('TEST_EMAIL');
  const password = createTestPassword();
  const mismatchedPassword = createMismatchedPasswordData(password);
  return {
    valid: {
      firstName: optional('TEST_FIRST_NAME') ?? 'Jordan',
      lastName: optional('TEST_LAST_NAME') ?? 'Sample',
      email: createUniqueTestEmail(baseInbox),
      phoneNumber: createUniqueTestPhone(),
      password,
      confirmPassword: password,
    },
    invalid: {
      email: 'not-an-email',
      ...mismatchedPassword,
    },
    empty: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
    boundary: {
      firstName: 'Al',
      lastName: 'Li',
      minimumLengthPassword: `${randomBytes(3).toString('base64url').slice(0, 4)}Aa1!`,
    },
  };
}

export function loadFullSignupData(): FullSignupData {
  const inbox = loadOtpInboxConfig();
  const account = createSignupTestDataSets().valid;
  const certificationDetails = optional('CERTIFICATION_DETAILS');
  const documentPath = getApprovedDummyDocumentPath();

  return {
    inbox,
    account,
    otp: {
      inputLabel: mustGet('OTP_INPUT_LABEL'),
      verifyButtonName: mustGet('OTP_VERIFY_BUTTON_NAME'),
    },
    agency: {
      nameLabel: mustGet('AGENCY_NAME_LABEL'),
      name: optional('AGENCY_NAME') ?? 'Northstar Pathways Education',
      roleLabel: mustGet('AGENCY_ROLE_LABEL'),
      role: mustGet('AGENCY_ROLE'),
      emailLabel: mustGet('AGENCY_EMAIL_LABEL'),
      email: optional('AGENCY_EMAIL') ?? account.email,
      websiteLabel: mustGet('AGENCY_WEBSITE_LABEL'),
      website: optional('AGENCY_WEBSITE') ?? 'https://example.com',
      addressLabel: mustGet('AGENCY_ADDRESS_LABEL'),
      address: optional('AGENCY_ADDRESS') ?? '123 Example Avenue, Sample City',
      regionLabel: mustGet('AGENCY_REGION_LABEL'),
      region: mustGet('AGENCY_REGION'),
      nextButtonName: mustGet('AGENCY_NEXT_BUTTON_NAME'),
    },
    professional: {
      yearsLabel: mustGet('YEARS_OF_EXPERIENCE_LABEL'),
      years: mustGet('YEARS_OF_EXPERIENCE'),
      studentsLabel: mustGet('STUDENTS_RECRUITED_LABEL'),
      students: mustGet('STUDENTS_RECRUITED'),
      focusLabel: mustGet('FOCUS_AREA_LABEL'),
      focus: mustGet('FOCUS_AREA'),
      metricsLabel: mustGet('SUCCESS_METRICS_LABEL'),
      metrics: optional('SUCCESS_METRICS') ?? 'Fictional QA test agency profile',
      servicesLabel: mustGet('SERVICES_PROVIDED_LABEL'),
      services: mustGet('SERVICES_PROVIDED'),
      nextButtonName: mustGet('PROFESSIONAL_NEXT_BUTTON_NAME'),
    },
    verification: {
      businessNumberLabel: mustGet('BUSINESS_REGISTRATION_NUMBER_LABEL'),
      businessNumber: `QA-TEST-${randomUUID().slice(0, 8).toUpperCase()}`,
      countriesLabel: mustGet('PREFERRED_COUNTRIES_LABEL'),
      country: mustGet('PREFERRED_COUNTRY'),
      institutionTypesLabel: mustGet('PREFERRED_INSTITUTION_TYPES_LABEL'),
      institutionType: mustGet('PREFERRED_INSTITUTION_TYPE'),
      certificationLabel: certificationDetails
        ? mustGet('CERTIFICATION_DETAILS_LABEL')
        : optional('CERTIFICATION_DETAILS_LABEL'),
      certificationDetails,
      documentLabel: mustGet('DOCUMENT_INPUT_LABEL'),
      documentPath,
      submitButtonName: mustGet('SUBMIT_BUTTON_NAME'),
      profileUrl: mustGet('PROFILE_SUCCESS_URL'),
      profileHeading: mustGet('PROFILE_SUCCESS_HEADING'),
    },
  };
}
