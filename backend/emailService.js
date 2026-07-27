/**
 * Brevo (formerly Sendinblue) Email Service
 *
 * Usage:
 *   import emailService from './emailService.js';
 *   await emailService.sendWelcomeEmail({ to: 'user@email.com', name: 'Alex' });
 *
 * To activate: set BREVO_API_KEY and BREVO_SENDER_EMAIL in your .env file.
 */

import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL  = process.env.BREVO_SENDER_EMAIL || 'noreply@aurastudy.app';
const SENDER_NAME   = process.env.BREVO_SENDER_NAME  || 'AuraStudy';

let brevo = null;

function getClient() {
  if (!BREVO_API_KEY) return null;
  if (brevo) return brevo;
  brevo = new BrevoClient({ apiKey: BREVO_API_KEY });
  return brevo;
}

async function sendEmail({ to, toName, subject, htmlContent, textContent }) {
  const client = getClient();

  if (!client) {
    console.warn('[EmailService] BREVO_API_KEY not set — email sending is disabled.');
    console.warn(`[EmailService] Would have sent: "${subject}" → ${to}`);
    return { skipped: true, reason: 'No API key configured.' };
  }

  try {
    const result = await client.transactionalEmails.sendTransacEmail({
      subject,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to, name: toName || to }],
      htmlContent,
      textContent: textContent || undefined,
    });
    console.log(`[EmailService] Sent "${subject}" → ${to} | Message ID: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error('[EmailService] Failed to send email:', JSON.stringify(err?.response?.body || err.message));
    return { success: false, error: err?.response?.body || err.message };
  }
}

async function sendWelcomeEmail({ to, name }) {
  const displayName = name || 'there';
  return sendEmail({
    to,
    toName: name,
    subject: '✨ Welcome to AuraStudy — Your Study Journey Begins!',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0;padding:0;background:#060813;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:linear-gradient(135deg,#0f0f1a,#1a1030);border-radius:16px;overflow:hidden;border:1px solid rgba(139,92,246,0.2);">
          <tr>
            <td style="padding:48px 40px 32px;text-align:center;background:linear-gradient(180deg,rgba(139,92,246,0.15),transparent);">
              <div style="font-size:48px;margin-bottom:16px;">✨</div>
              <h1 style="color:#e2d9f3;font-size:28px;margin:0 0 8px;font-weight:700;">Welcome to AuraStudy</h1>
              <p style="color:#8b5cf6;font-size:14px;margin:0;letter-spacing:2px;text-transform:uppercase;">Elevate your study intelligence</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="color:#c4b5fd;font-size:16px;line-height:1.7;margin:0 0 24px;">
                Hey ${displayName}, welcome aboard! 🎉 Your AuraStudy workspace is ready and waiting.
              </p>
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 32px;">
                Here's what you can do right now:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
                  ['🃏', 'Flashcards', 'Build decks with spaced-repetition powered review sessions'],
                  ['🍅', 'Pomodoro Timer', 'Stay focused with structured work/break intervals'],
                  ['📝', 'Study Notes', 'Write and organize your notes with AI summarization'],
                  ['📅', 'Study Planner', 'Create tasks and track your study goals'],
                  ['🤖', 'AI Assistant', 'Ask questions, get explanations, and generate quiz cards'],
                ].map(([icon, title, desc]) => `
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(139,92,246,0.1);">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" style="font-size:22px;vertical-align:top;padding-top:2px;">${icon}</td>
                        <td>
                          <p style="color:#e2d9f3;font-size:15px;font-weight:600;margin:0 0 4px;">${title}</p>
                          <p style="color:#64748b;font-size:13px;margin:0;">${desc}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join('')}
              </table>
              <div style="text-align:center;margin-top:40px;">
                <a href="http://localhost:5173" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.5px;">
                  Open My Workspace →
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(139,92,246,0.1);text-align:center;">
              <p style="color:#334155;font-size:12px;margin:0;">
                You received this email because you registered at AuraStudy.<br>
                © ${new Date().getFullYear()} AuraStudy. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    textContent: `Welcome to AuraStudy, ${displayName}!\n\nYour workspace is ready. Visit http://localhost:5173 to get started.\n\n— The AuraStudy Team`,
  });
}

async function sendAuthCodeEmail({ to, name, code, expiresInMinutes = 10 }) {
  const displayName = name || 'there';
  return sendEmail({
    to,
    toName: name,
    subject: 'Your AuraStudy authentication code',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0;padding:0;background:#060813;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#0f172a;border-radius:16px;overflow:hidden;border:1px solid rgba(139,92,246,0.25);">
          <tr>
            <td style="padding:36px 32px;text-align:center;">
              <h1 style="color:#e2d9f3;font-size:24px;margin:0 0 12px;">AuraStudy authentication code</h1>
              <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">
                Hi ${displayName}, enter this code to finish creating your AuraStudy account.
              </p>
              <div style="display:inline-block;color:#ffffff;background:#1e1b4b;border:1px solid rgba(196,181,253,0.35);border-radius:12px;padding:16px 24px;font-size:32px;font-weight:800;letter-spacing:8px;">
                ${code}
              </div>
              <p style="color:#64748b;font-size:13px;line-height:1.6;margin:28px 0 0;">
                This code expires in ${expiresInMinutes} minutes. If you did not request it, you can ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    textContent: `Your AuraStudy authentication code is ${code}. It expires in ${expiresInMinutes} minutes.`,
  });
}

async function sendPasswordResetEmail({ to, name, resetLink }) {
  return sendEmail({
    to,
    toName: name,
    subject: '🔐 Reset Your AuraStudy Password',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0;padding:0;background:#060813;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:#0f0f1a;border-radius:16px;overflow:hidden;border:1px solid rgba(139,92,246,0.2);">
          <tr>
            <td style="padding:40px;text-align:center;">
              <div style="font-size:48px;margin-bottom:16px;">🔐</div>
              <h1 style="color:#e2d9f3;font-size:24px;margin:0 0 16px;">Password Reset Request</h1>
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 32px;">
                Hi ${name || 'there'}, we received a request to reset your AuraStudy password.
                Click the button below to set a new one.
              </p>
              <a href="${resetLink || '#'}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;">
                Reset Password
              </p>
              <p style="color:#475569;font-size:13px;margin-top:24px;">
                This link expires in 1 hour. If you didn't request a reset, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px;border-top:1px solid rgba(139,92,246,0.1);text-align:center;">
              <p style="color:#334155;font-size:12px;margin:0;">© ${new Date().getFullYear()} AuraStudy</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    textContent: `Reset your AuraStudy password by visiting: ${resetLink}\n\nThis link expires in 1 hour.`,
  });
}

async function sendStreakEmail({ to, name, streak }) {
  return sendEmail({
    to,
    toName: name,
    subject: `🔥 ${streak}-Day Study Streak — Keep it up, ${name || 'Champion'}!`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0;padding:0;background:#060813;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:#0f0f1a;border-radius:16px;overflow:hidden;border:1px solid rgba(239,68,68,0.2);">
          <tr>
            <td style="padding:48px 40px;text-align:center;background:linear-gradient(180deg,rgba(239,68,68,0.1),transparent);">
              <div style="font-size:64px;margin-bottom:8px;">🔥</div>
              <h1 style="color:#fca5a5;font-size:32px;margin:0 0 8px;">${streak} Days Strong!</h1>
              <p style="color:#94a3b8;font-size:15px;margin:0;">
                Hi ${name || 'Champion'}, you've been studying consistently for <strong style="color:#f87171;">${streak} days</strong>!
                That's incredible discipline. Don't break the chain!
              </p>
              <div style="margin-top:32px;">
                <a href="http://localhost:5173" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#7c3aed);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;">
                  Continue Studying →
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px;border-top:1px solid rgba(239,68,68,0.1);text-align:center;">
              <p style="color:#334155;font-size:12px;margin:0;">© ${new Date().getFullYear()} AuraStudy</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    textContent: `🔥 ${streak}-day streak! Keep it up. Visit http://localhost:5173`,
  });
}

export default {
  sendEmail,
  sendWelcomeEmail,
  sendAuthCodeEmail,
  sendPasswordResetEmail,
  sendStreakEmail,
};
