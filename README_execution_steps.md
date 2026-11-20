# QA Engineer Assignment — Signup Flow

## Submission overview

This repository contains manual and automated testing work for the signup flow
at <https://authorized-partner.vercel.app/>.

The work has two parts:

- **Part A — Manual testing:** 46 designed cases, 25 selected for execution,
  22 passed, 3 failed, and 0 blocked.
- **Part B — Automation:** TypeScript, Playwright Test, and the Page Object
  Model (POM).

The project is a partial automation submission. Three negative Playwright tests
have been executed successfully. The full signup happy path and OTP integration
are implemented in code but have not been successfully executed end to end.

## Assignment structure

```text
signup-automation/
├── README.md
├── README_execution_steps.md
├── manual-testing/
│   ├── test_cases.xlsm
│   ├── Test_execution_report.xlsm
│   ├── bug_reports.xlsm
│   └── test_summary.pdf
├── automation/
│   ├── pages/
│   ├── tests/
│   └── utils/
├── reports/
│   └── html/
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── Demo Video.mp4
```

This structure matches the current repository. The manual workbooks use
`.xlsm`; they contain 46 designed/25 executed cases, execution records, bugs,
and evidence links. No local `manual-testing/evidence/` folder or screenshot
files are stored in the repository.

## Prerequisites and versions

- Node.js 20.20.2 or newer
- npm 10 or newer
- TypeScript 7.0.2
- Playwright Test 1.65.1
- Chromium installed through Playwright
- Python and Java/JDK are not required

This project uses Node.js and Playwright's Desktop Chrome profile in headless
mode by default.

## Installation and setup

From the project directory:

```bash
cd /Users/Roshan/Documents/Work/tech/signup-automation
npm install
npx playwright install chromium
cp .env.example .env
```

Configure only approved test values. Store credentials and private inbox settings
in `.env`; never commit `.env` or put secrets in source code, reports, logs,
screenshots, GitHub, or submission archives.

The default website is:

```text
https://authorized-partner.vercel.app/
```

Use only an authorized environment for test runs.

## Manual testing

### Test coverage

The test-case workbook contains 46 designed cases. Twenty-five were selected
and executed, covering:

- Happy-path signup.
- Terms and navigation.
- Empty, invalid, wrong-format, and boundary values.
- Password and Confirm Password behavior.
- Agency, professional, and verification steps.
- Email OTP behavior.
- Duplicate/existing data concerns.
- Refresh and direct-link behavior.
- Mobile UI and labels.

Each test record includes an ID, module/page, title, preconditions, test data,
reproduction steps, expected result, priority, type, actual behavior, status,
and evidence reference where supplied.

### Manual execution totals

| Result | Count |
|---|---:|
| Passed | 22 |
| Failed | 3 |
| Blocked | 0 |
| Total executed | 25 |
| Pass rate | 88% |

Failed cases:

- **TC-006:** empty phone number returned incorrect or missing validation.
- **TC-017:** mobile logo appeared too close to the top edge.
- **TC-023:** empty Confirm Password did not show clear required guidance.

The 21 additional designed cases were not executed.

### Bug reports

The bug report workbook contains six reported issues:

- BUG-001 — Phone Number receives focus after Continue.
- BUG-002 — Empty Phone Number produces the wrong duplicate-number message.
- BUG-003 — Empty Phone Number shows no expected error state.
- BUG-004 — Empty Confirm Password shows missing or incorrect validation.
- BUG-005 — Logo spacing is too close to the top on mobile.
- BUG-006 — Correct OTP reportedly marked expired after an incorrect attempt.

Each bug record includes reproduction steps, expected and actual behavior,
severity, priority, side, evidence reference, and status/notes.

The manual reports are supplied/tester-reported records. They are not claimed
as independently reproduced browser findings unless a separate execution record
proves otherwise.

### Summary and top risks

`test_summary.pdf` contains the one-page summary: 46 designed, 25 executed,
22 passed, 3 failed, 0 blocked, and an 88% pass rate.

The main unverified risks are:

1. Phone-number validation and empty-field behavior.
2. Confirm Password validation and required-field behavior.
3. OTP expiry/attempt behavior and later signup continuation.

Other limitations include mobile logo spacing and the availability of some
evidence outside the GitHub repository. No root-cause result is claimed unless
separately verified.

## Evidence locations

Screenshots are embedded in the manual Excel workbooks:

- Screenshots in `test_cases.xlsm`
- Screenshots in `Test_execution_report.xlsm`
- Screenshots in `bug_reports.xlsm`

Additional evidence and the demo/recording are stored in Google Drive:

- Evidence folder:
  <https://drive.google.com/drive/folders/1Yc0qsHI8ErAjaQ7lBMVMf5JmwoV3t3ui?usp=sharing>
- Bug evidence file:
  <https://drive.google.com/file/d/1S_3qvMaEVo1QwsDn9A_2xSpP8sCOp7BU/view?usp=sharing>

The links are embedded in `test_cases.xlsm`, `Test_execution_report.xlsm`,
and `bug_reports.xlsm`. The Excel screenshots remain inside the workbooks;
additional files, such as the demo recording, are available through Google
Drive.

## Page Object Model structure

Browser interactions are organized in `automation/pages/`:

- `TermsPage` — Terms checkbox and Continue button.
- `AccountSetupPage` — account fields and validation locators.
- `OtpVerificationPage` — OTP entry and Verify Code action.
- `AgencyDetailsPage` — agency detail fields and Next action.
- `ProfessionalExperiencePage` — experience values and Next action.
- `VerificationPreferencesPage` — business details, preferences, document
  upload, submission, and profile assertions.
- `BaseSignupPage` — shared field, option, upload, and button actions.

Test specifications coordinate page objects and assertions. Locators are not
repeated inside test files.

## Test data

The negative Playwright tests use:

- `not-an-email` for invalid email validation.
- Empty account fields for required-field validation.
- Generated mismatched Password and Confirm Password values.

The full-signup helper can generate:

- A unique plus-addressed email from an approved private inbox.
- A strong Password and matching Confirm Password.
- A configurable test phone prefix and number length.
- Fictional agency details.
- A unique fictional business-registration number.
- An approved dummy document path.

Do not use real personal data or credentials for submission tests. Valid phone
formats, dropdown choices, dummy document requirements, and final profile
selectors remain unverified.

## Run the Playwright tests

Run only the three negative/validation tests:

```bash
npm run test:negative
```

Run the same tests in visible Chromium:

```bash
npm run test:negative -- --headed
```

Latest available negative-only result:

- 3 passed
- 0 failed
- 0 skipped

The HTML report is opened with:

```bash
npm run test:report
```

The report is generated under `reports/html/`. Playwright failure screenshots
and traces are configured by `playwright.config.ts`.

Run the TypeScript check with:

```bash
npm run typecheck
```

## Full signup and OTP status

`automation/tests/signup.spec.ts` contains full-flow orchestration for Terms,
Account Setup, OTP, Agency Details, Professional Experience, Verification and
Preferences, document upload, submission, and final profile assertions.

The full signup test cannot run unless both flags are set:

```dotenv
RUN_FULL_SIGNUP=1
REGISTRATION_APPROVED=1
```

The implementation also preflights supported IMAP configuration before it
navigates to the website.

OTP requirements:

- `OTP_PROVIDER=imap`
- `OTP_TEST_INBOX_APPROVED=1`
- `OTP_TEST_EMAIL_SUPPORTS_PLUS=1`
- `TEST_EMAIL` set to an approved private inbox.
- IMAP host, port, user, password, and optional folder/sender/filter settings.

The helper polls for a new message addressed to the generated signup alias,
ignores old mail, applies the optional sender filter, extracts a six-digit code,
and closes the IMAP connection. It does not hardcode a code or bypass OTP.

OTP retrieval has not been successfully executed against an approved inbox.
The full signup, OTP verification, later-step selectors, dropdown options,
document upload, and profile confirmation are not claimed as verified.

Do not run the full signup test until explicit registration approval and all
test configuration are available.

## Known limitations and not-automated items

- Full signup and OTP are implemented but not verified end to end.
- YOPmail is not supported by the IMAP helper.
- OTP input layout and Verify Code selector require confirmation.
- Later-step labels and button names may be candidates, not verified selectors.
- Dropdown control types and option values remain unverified.
- Approved test phone format remains unverified.
- Required document count and upload control remain unverified.
- Final profile URL and heading remain unverified.
- Screenshots are embedded in the workbooks; additional evidence and recording
  links are stored in Google Drive.
- The 21 additional designed manual cases were not executed.
- A working full-signup demo video is not claimed.

## Demo video

The available video is [Demo Video.mp4](./Demo%20Video.mp4).

**Full end-to-end automation demo status: pending/unverified.** The video file
is present, but it must not be described as a completed full-signup demo until
its content has been confirmed to show the full signup and OTP flow passing.
The complete end-to-end signup has not been successfully executed. A valid
submission demo can show the three negative tests and clearly explain that full
signup and OTP remain unverified.

## GitHub and submission safety

Keep `.env`, real credentials, private inbox settings, personal data, and
unapproved screenshots out of GitHub and submission archives.

Before submitting:

- Keep or, if required by the submission format, export the manual workbooks
  from `.xlsm` to `.xlsx` without changing results or IDs.
- Confirm that Google Drive evidence links remain accessible and match the
  test-case and bug-report evidence references.
- Confirm that `test_cases.xlsm`, `Test_execution_report.xlsm`,
  `bug_reports.xlsm`, `test_summary.pdf`, and the Playwright HTML report are
  available in the repository or linked clearly.
- Keep `Demo Video.mp4` or rename it deliberately to the final submission
  filename after confirming its content.
- Exclude `.env`, `node_modules/`, report test-result directories, system
  files, and temporary files.
- Remove secrets from screenshots, video, logs, and report metadata.
- Send the public GitHub repository link to:
  - hr@vrittechnologies.com
  - bibek@vrittechnologies.com
