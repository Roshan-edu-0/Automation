import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export interface OtpInboxConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  folder: string;
  senderFilter?: string;
  timeoutMs: number;
  pollIntervalMs: number;
}

function requiredEnvironmentValue(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `${name} is required before starting signup; no browser navigation was performed.`,
    );
  }
  return value;
}

function positiveInteger(name: string, defaultValue: number): number {
  const configured = process.env[name]?.trim();
  if (!configured) {
    return defaultValue;
  }

  const value = Number(configured);
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(
      `${name} must be a positive integer; no browser navigation was performed.`,
    );
  }
  return value;
}

export function loadOtpInboxConfig(): OtpInboxConfig {
  if (process.env.OTP_PROVIDER?.trim().toLowerCase() !== 'imap') {
    throw new Error(
      'OTP_PROVIDER must be set to "imap". The configured OTP method is unsupported; no browser navigation was performed.',
    );
  }
  if (process.env.OTP_TEST_INBOX_APPROVED !== '1') {
    throw new Error(
      'Set OTP_TEST_INBOX_APPROVED=1 only for an authorized private inbox; no browser navigation was performed.',
    );
  }
  if (process.env.OTP_TEST_EMAIL_SUPPORTS_PLUS !== '1') {
    throw new Error(
      'Set OTP_TEST_EMAIL_SUPPORTS_PLUS=1 only after confirming the approved inbox receives plus-addressed mail; no browser navigation was performed.',
    );
  }

  return {
    host: requiredEnvironmentValue('OTP_IMAP_HOST'),
    port: positiveInteger('OTP_IMAP_PORT', 993),
    user: requiredEnvironmentValue('OTP_IMAP_USER'),
    password: requiredEnvironmentValue('OTP_IMAP_PASSWORD'),
    folder: process.env.OTP_IMAP_FOLDER?.trim() || 'INBOX',
    senderFilter: process.env.OTP_SENDER_FILTER?.trim().toLowerCase() || undefined,
    timeoutMs: positiveInteger('OTP_WAIT_TIMEOUT_MS', 180_000),
    pollIntervalMs: positiveInteger('OTP_POLL_INTERVAL_MS', 2_500),
  };
}

function recipientMatches(
  recipients: Array<{ address?: string | null }> | undefined,
  recipientEmail: string,
): boolean {
  return (
    recipients?.some((recipient) =>
      recipientEmail === recipient.address?.toLowerCase(),
    ) ?? false
  );
}

export async function waitForOtp(
  startedAt: Date,
  recipientEmail: string,
  config: OtpInboxConfig,
): Promise<string> {
  const deadline = Date.now() + config.timeoutMs;
  const targetEmail = recipientEmail.trim().toLowerCase();
  const seenUids = new Set<number>();
  const connectionTimeoutMs = Math.min(config.timeoutMs, 30_000);
  const client = new ImapFlow({
    host: config.host,
    port: config.port,
    secure: true,
    auth: { user: config.user, pass: config.password },
    logger: false,
    connectionTimeout: connectionTimeoutMs,
    greetingTimeout: connectionTimeoutMs,
    socketTimeout: connectionTimeoutMs,
  });

  let matchingEmailWithoutOtp = false;
  try {
    await client.connect();
    const lock = await client.getMailboxLock(config.folder);
    try {
      while (Date.now() < deadline) {
        for await (const message of client.fetch(
          { since: startedAt },
          {
            uid: true,
            envelope: true,
            internalDate: true,
            source: true,
          },
        )) {
          if (seenUids.has(message.uid)) {
            continue;
          }
          seenUids.add(message.uid);

          const receivedAt =
            message.internalDate instanceof Date
              ? message.internalDate.getTime()
              : message.internalDate
                ? Date.parse(message.internalDate)
                : Number.NaN;
          if (
            !Number.isFinite(receivedAt) ||
            receivedAt <= startedAt.getTime()
          ) {
            continue;
          }

          const senderAddresses =
            message.envelope?.from
              ?.map((sender) => sender.address?.toLowerCase() ?? '')
              .filter(Boolean) ?? [];
          const senderFilter = config.senderFilter;
          if (
            senderFilter &&
            !senderAddresses.some((sender) => sender.includes(senderFilter))
          ) {
            continue;
          }
          if (!recipientMatches(message.envelope?.to, targetEmail)) {
            continue;
          }
          matchingEmailWithoutOtp = true;
          if (!message.source) {
            continue;
          }

          const parsed = await simpleParser(message.source);
          const body = `${parsed.text ?? ''}\n${parsed.html ?? ''}`;
          const match = body.match(
            /(?:verification\s+code|one-time(?:\s+password|\s+code)?|otp|code)\D{0,70}(\d{6})\b/i,
          );
          if (match) {
            return match[1];
          }
        }

        const remaining = deadline - Date.now();
        if (remaining > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.min(config.pollIntervalMs, remaining)),
          );
        }
      }
    } finally {
      lock.release();
    }
  } finally {
    client.close();
  }

  if (matchingEmailWithoutOtp) {
    throw new Error(
      `A new email addressed to the signup address arrived, but no six-digit OTP was recognized within ${config.timeoutMs} ms. Verify the email format without logging its contents.`,
    );
  }

  throw new Error(
    `No new email addressed to the signup address arrived within ${config.timeoutMs} ms. Check the approved inbox and sender filter.`,
  );
}
