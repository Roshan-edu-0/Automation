# Signup Automation QA

## Overview

This project tests signup for the Authorized Partner website:
<https://authorized-partner.vercel.app>. It uses TypeScript, Playwright Test,
and the Page Object Model (POM).

## Project structure

```text
signup-automation/
├── automation/
│   ├── pages/                 # Signup page objects
│   ├── tests/
│   │   ├── signup.spec.ts     # Guarded full-signup scenario
│   │   └── validation.spec.ts # Three negative tests
│   └── utils/                 # Test data, setup, and IMAP OTP helper
├── manual-testing/
│   ├── test_cases.xlsm        # 25 manual cases, statuses, and actual results
│   ├── bug_reports.xlsm       # Six reported bugs
│   └── test_summary.pdf
├── reports/
│   ├── html/index.html        # Playwright HTML report
│   └── test-results/          # Playwright run output
├── Demo Video.mp4
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

`node_modules/` and the local `.env` file are omitted from this overview.
Keep `.env` private and do not include it in a submission.

## Manual testing results

The manual workbook contains 25 test cases: **22 Passed, 3 Failed, and
0 Blocked** (an **88% pass rate**). The bug report workbook contains **six
reported bugs**. These are manual execution results, separate from the
Playwright results below; they are user-reported and have not been independently
retested.

## Setup

From the project directory, install dependencies, install Playwright Chromium,
and create a local environment file:

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

The tests use `BASE_URL`, which defaults to the website listed above. Use only
an authorized test environment. Store credentials and other private settings
in `.env`; never commit or share them.

## Run the negative tests

Run the three account-validation tests:

```bash
npm run test:negative
```

The three negative tests previously passed: **3 passed, 0 failed, 0 skipped**.
They cover invalid email, empty required account fields, and mismatched
passwords. This result is separate from the manual test results.

## Open the HTML report

Run the negative tests to generate or update the report, then open it:

```bash
npm run test:negative
npm run test:report
```

The HTML report is written to `reports/html/`; Playwright run output is written
to `reports/test-results/`. Review reports before sharing because they may
contain test metadata or failure evidence.

## Full signup and OTP status

The full-signup scenario is in `automation/tests/signup.spec.ts` and is
disabled by default. It requires both `RUN_FULL_SIGNUP=1` and
`REGISTRATION_APPROVED=1`, along with approved test data and inbox settings.
The full signup and IMAP OTP integration have **not been successfully executed
and verified**. Later-step selectors and options, OTP retrieval, document
upload, and final profile confirmation remain unverified. Do not treat this
scenario as a working, verified end-to-end flow.

The OTP helper requires an approved private IMAP inbox; its settings are
documented in `.env.example`. Never put inbox passwords or other secrets in
source code or shared reports. The demo recording is available at the project
root as [Demo Video.mp4](./Demo%20Video.mp4).
