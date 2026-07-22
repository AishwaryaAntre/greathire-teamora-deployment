import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!env.smtp.host) {
    // No SMTP configured (e.g. local dev) - fall back to a JSON transport
    // so emails are logged instead of failing the request.
    transporter = nodemailer.createTransport({ jsonTransport: true });
    console.warn("[email] SMTP not configured - emails will be logged, not sent.");
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
  return transporter;
}

export async function sendPasswordResetEmail({ to, resetUrl }) {
  const info = await getTransporter().sendMail({
    from: env.smtp.from,
    to,
    subject: "Reset your GreatHire WorkTrack password",
    text: `We received a request to reset your password. Use the link below (valid for a limited time):\n\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `<p>We received a request to reset your password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires soon. If you didn't request this, you can safely ignore this email.</p>`,
  });

  if (env.nodeEnv !== "production" && info.message) {
    console.log("[email:dev] password reset email (not actually sent):", info.message.toString());
  }

  return info;
}
