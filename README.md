# Signup Flow — Manual and Automation QA Assignment

Execution details and the complete setup guide are in
[README_execution_steps.md](./README_execution_steps.md).

## Project overview

This repository contains my QA Engineer assignment work for the signup flow at
<https://authorized-partner.vercel.app/>.

The assignment is divided into:

- **Part A — Manual testing:** test design, 25-case execution, bug reporting,
  evidence references, and a one-page summary.
- **Part B — Automation:** TypeScript, Node.js, Playwright Test, and the Page
  Object Model (POM).

This README separates work that was verified from implementation that remains
unverified. It does not claim that the full signup automation or OTP retrieval
has passed until browser and inbox execution provide that evidence.

## Submission structure

```text
signup-automation/
├── README.md
├── README_execution_steps.md
├── manual-testing/
│   ├── test_cases.xlsm
│   ├── Test_execution_report.xlsm
│   ├── bug_reports.xlsm
│   ├── test_summary.pdf
├── automation/
│   ├── pages/
│   ├── tests/
│   └── utils/
├── reports/
│   └── html/
│       └── index.html
├── Demo Video.mp4
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

This structure reflects the actual repository. The manual workbooks use `.xlsm`
extensions and contain embedded screenshots. There is no local
`manual-testing/evidence/` folder; additional evidence and the demo recording
are provided through Google Drive links.

## Part A — Manual testing

### Test coverage

The supplied test-case workbook contains 46 designed cases and 25 executed
cases. The selected manual set covers:

- Happy-path signup.
- Invalid, empty, wrong-format, and boundary data.
- Password and Confirm Password behavior.
- Terms and navigation.
- Agency, professional, and verification steps.
- OTP behavior.
- Mobile UI and responsive concerns.
- Refresh and direct-link behavior.

Each test-case record in the available workbook includes an execution ID,
module/title, preconditions, test data, reproduction steps, expected behavior,
priority, type, actual behavior, status, and evidence reference where supplied.

### Manual execution results

The current summary records:

| Result | Count |
|---|---:|
| Passed | 22 |
| Failed | 3 |
| Blocked | 0 |
| Total selected | 25 |
| Pass rate | 88% |

The three failed cases are:

- **TC-006:** empty phone number returned incorrect or missing validation.
- **TC-017:** mobile logo appeared too close to the top edge.
- **TC-023:** empty Confirm Password did not show clear required guidance.

The execution workbook and test summary PDF should be the source used for
submission totals. The Playwright run is separate and should not be added to the
manual pass/fail counts.

### Bug reports

The bug workbook contains six reported issues:

- BUG-001 — Phone Number receives focus after Continue.
- BUG-002 — Empty Phone Number produces the wrong duplicate-number message.
- BUG-003 — Empty Phone Number shows no expected error state.
- BUG-004 — Empty Confirm Password shows missing or incorrect validation.
- BUG-005 — Logo spacing is too close to the top on mobile.
- BUG-006 — A correct OTP was reportedly marked expired after an incorrect attempt.

Each report preserves title, reproduction steps, expected result, actual result,
severity, priority, side, evidence reference, and status/notes where available.
The bug reports are user-reported; no independent root-cause determination or
retesting is claimed for them.

### Evidence and summary

`test_summary.pdf` summarizes the selected 25 cases, pass/fail/blocked totals,
top reported issues, limitations, and not-completed items.

Screenshots are embedded directly in the manual Excel workbooks:

- Screenshots in `test_cases.xlsm`
- Screenshots in `Test_execution_report.xlsm`
- Screenshots in `bug_reports.xlsm`

Additional evidence and the demo/recording are stored in Google Drive:

- Evidence folder:
  <https://drive.google.com/drive/folders/1Yc0qsHI8ErAjaQ7lBMVMf5JmwoV3t3ui?usp=sharing>
- Bug evidence file:
  <https://drive.google.com/file/d/1S_3qvMaEVo1QwsDn9A_2xSpP8sCOp7BU/view?usp=sharing>

Workbook cells and bug records also contain the Google Drive links. Embedded
screenshots are therefore available inside the Excel files; the separate Google
Drive evidence/recording folder contains additional evidence and the demo
video.

## Prerequisites and versions

- Node.js: 20.20.2 or newer
- npm: 10 or newer
- TypeScript: 7.0.2
- Playwright Test: 1.65.1
- Browser: Chromium, installed through Playwright
- Python and Java/JDK: not required

The project uses Node.js and Playwright's Desktop Chrome profile. No separate
Java or Python runtime is needed.

## Setup and installation

```bash
cd /Users/Roshan/Documents/Work/tech/signup-automation
npm install
npx playwright install chromium
cp .env.example .env
```

Store local credentials, approved test inbox settings, and full-signup approval
values in `.env`. Never add real credentials or secrets to source code,
screenshots, reports, GitHub, or submission archives.

## Page Object Model implementation

Each signup step has a page object:

- `TermsPage` — opens signup, accepts terms, and continues.
- `AccountSetupPage` — account fields, validation locators, and account actions.
- `OtpVerificationPage` — receives OTP retrieval input and enters/verifies it.
- `AgencyDetailsPage` — agency details and Next action.
- `ProfessionalExperiencePage` — experience values and Next action.
- `VerificationPreferencesPage` — business details, preferences, upload,
  submission, and final profile checks.
- `BaseSignupPage` — shared field, option, upload, and button helpers.

Locators are kept inside page classes. Test files compose page methods and
contain assertions. They do not duplicate browser selectors or browser actions.

## Test data and accounts

The negative tests use intentionally invalid or empty values and do not create
accounts:

- Invalid email: `not-an-email`.
- Empty required account fields.
- Generated mismatched password and confirmation values.

The full-signup helper is configured for approved disposable test data:

- Unique plus-addressed email generated from `TEST_EMAIL`.
- Matching generated Password and Confirm Password.
- Configurable test phone prefix and national number length.
- Fictional agency and business-registration values.
- Approved dummy document path.

No real personal account or credentials are embedded in source code. Valid
phone format, dropdown values, actual test account, and dummy document have not
been independently verified.

## Run Playwright tests

### Run only the three negative/validation tests

Headless:

```bash
npm run test:negative
```

Visible Chromium browser:

```bash
npm run test:negative -- --headed
```

The latest available negative-only run was:

- 3 passed
- 0 failed
- 0 skipped

This result is for the three validation tests and is separate from the manual
25-case execution totals.

### Run TypeScript type-check

```bash
npm run typecheck
```

### Open the automation HTML report

```bash
npm run test:report
```

The HTML report is written to `reports/html/`. The latest available report
shows the three negative tests. Failure screenshots and traces are configured
in `playwright.config.ts` when browser failures occur.

## Full signup and OTP status

`automation/tests/signup.spec.ts` implements orchestration for Terms, Account
Setup, OTP, Agency Details, Professional Experience, Verification and
Preferences, document upload, submission, and profile assertions.

The full signup test is disabled by default and requires both:

```dotenv
RUN_FULL_SIGNUP=1
REGISTRATION_APPROVED=1
```

OTP configuration requires an approved private inbox that supports IMAP and
plus-addressed mail. Required variables are listed in `.env.example`.

The OTP helper:

- Validates IMAP configuration before navigation.
- Matches the newly generated signup email alias.
- Ignores old mail and optional sender mismatches.
- Extracts a six-digit code.
- Closes the IMAP connection.
- Does not hardcode a verification code or bypass OTP.

OTP retrieval has not been executed successfully against an approved inbox.
The full signup, OTP verification, later-step selectors, dropdown choices,
document upload, and final profile confirmation are therefore not claimed as
verified.

Do not enable or run the full signup test until explicit registration approval
is available and all required test configuration is confirmed.

## Known limitations and automation gaps

- The full signup happy path is implemented but not successfully run end to end.
- Email OTP retrieval is implemented but unverified against a real inbox.
- YOPmail is not supported by the IMAP helper.
- OTP input layout and verification selector require confirmation.
- Later-step labels and button names may be candidates rather than verified
  selectors.
- Dropdown values and control types remain unverified.
- Approved test phone format and phone validation remain unverified.
- Required document count and upload control remain unverified.
- Final profile URL and heading remain unverified.
- Some screenshots are embedded in the Excel workbooks, while additional
  evidence and recording links are stored in Google Drive.
- The 21 additional manual cases beyond the selected 25 were not executed.

## Environment and submission safety

Keep `.env`, real inbox credentials, OTP secrets, personal data, and private
screenshots out of GitHub and submission archives. `.gitignore` excludes `.env`,
node modules, reports, and temporary test-result directories.

Before submission:

- Remove any real credentials from the project.
- Include only approved, fictional test data.
- Export or copy the requested manual workbooks and evidence.
- Verify report and evidence filenames.
- Review the demo video for private account details or credentials.
- Ensure the repository is publicly accessible or accessible through an anyone-
  with-the-link setting.

## Demo video

The demo file is stored locally as [Demo Video.mp4](./Demo%20Video.mp4).

**Full end-to-end automation demo status: pending/unverified.** The file should
not be described as a completed full-signup demo unless a viewer confirms that
it shows the entire signup and OTP flow passing. The complete end-to-end signup
has not been successfully executed, so the current demo does not demonstrate
that this flow works. A safe demo video can show the three passing negative
tests and clearly explain that the full signup remains unverified.
