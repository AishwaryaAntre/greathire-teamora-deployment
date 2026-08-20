import { logger } from "./logger.js";

// Resend is used for all transactional email — no SMTP/other providers.
// RESEND_API_KEY is optional in local dev: if it's not set, we just log the
// reset link instead of sending it, so `forgot-password` still "works" for
// local testing without requiring a Resend account.
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Teamora <onboarding@resend.dev>";

export const resendConfigured = Boolean(RESEND_API_KEY);

function passwordResetEmailHtml({ resetUrl }) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <tr>
              <td style="background-color:#111827;padding:24px 32px;">
                <span style="color:#ffffff;font-size:20px;font-weight:700;">Teamora</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;color:#111827;">Password Reset Request</h1>
                <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#374151;">Hi,</p>
                <p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#374151;">
                  We received a request to reset your Teamora account password. Click the button below to create a new password.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:8px;background-color:#4f46e5;">
                      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Reset Password</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0;font-size:13px;line-height:20px;color:#6b7280;">
                  This link will expire in 30 minutes.
                </p>
                <p style="margin:16px 0 0;font-size:13px;line-height:20px;color:#6b7280;">
                  If you did not request this password reset, you can safely ignore this email — your password will not be changed.
                </p>
                <p style="margin:24px 0 0;font-size:13px;line-height:20px;color:#9ca3af;">
                  Teamora Security Team
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Sends the password-reset email through Resend. Never throws — a delivery
 * failure must not leak whether the account exists or block the generic
 * "if an account exists" response, so failures are logged and swallowed. */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  if (!resendConfigured) {
    logger.warn(
      { to },
      `[email] RESEND_API_KEY not set — skipping send. Reset link (dev only): ${resetUrl}`
    );
    return { skipped: true };
  }

  try {
    let res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [to],
        subject: "Reset your Teamora password",
        html: passwordResetEmailHtml({ resetUrl }),
      }),
    });

    if (!res.ok) {
      let body = await res.text().catch(() => "");
      logger.error({ status: res.status, body }, "[email] Resend request failed");
      return { skipped: false, ok: false };
    }
    return { skipped: false, ok: true };
  } catch (err) {
    logger.error({ err }, "[email] Failed to send password reset email");
    return { skipped: false, ok: false };
  }
}
