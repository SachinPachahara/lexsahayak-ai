import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let transporter;
function getTransporter() {
  if (env.MAIL_MODE !== 'smtp') return null;
  if (!transporter) transporter = nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_PORT === 465, auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } });
  return transporter;
}
export async function sendMail({ to, subject, text, html }) {
  const t = getTransporter();
  if (!t) { logger.info({ to, subject, text }, 'DEV EMAIL'); return { dev: true }; }
  return t.sendMail({ from: env.MAIL_FROM, to, subject, text, html });
}
