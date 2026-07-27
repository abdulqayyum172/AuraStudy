import { Router } from 'express';
import db from '../db.js';
import emailService from '../emailService.js';
import {
  CLASS_LEVELS,
  SSS_STREAMS,
  SSS_LEVELS,
  DEPARTMENTS,
  COURSE_OPTIONS,
  HIGHER_INSTITUTION_LEVELS,
  getCoursesForDepartment,
} from '../config/constants.js';

const router = Router();

// In-memory store for verification codes: { email → { code, expiresAt } }
const verificationCodes = new Map();

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ── POST /signup ────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  try {
    const user = await db.signup(username, password);
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ── POST /login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  try {
    const user = await db.login(username, password);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ── POST /send-code ─────────────────────────────────────────────────
// Send a 6-digit verification code to the given email
router.post('/send-code', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  try {
    const code = generateCode();
    console.log(`[Auth] Sending verification code ${code} to ${email}`);
    verificationCodes.set(email, { code, expiresAt: Date.now() + 10 * 60 * 1000 });
    const result = await emailService.sendAuthCodeEmail({ to: email, code });
    console.log('[Auth] Email result:', JSON.stringify(result));
    if (result.success === false) {
      return res.status(500).json({ error: 'Failed to send verification email. Check server logs.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('[Auth] Failed to send verification code:', err);
    res.status(500).json({ error: 'Failed to send verification code.' });
  }
});

// ── POST /verify-code ───────────────────────────────────────────────
// Verify the code sent to the given email
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required.' });
  }
  const record = verificationCodes.get(email);
  if (!record) {
    return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
  }
  if (Date.now() > record.expiresAt) {
    verificationCodes.delete(email);
    return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
  }
  if (record.code !== String(code)) {
    return res.status(400).json({ error: 'Incorrect verification code.' });
  }
  verificationCodes.delete(email);
  res.json({ success: true });
});

// ── POST /firebase-sync ─────────────────────────────────────────────
// Firebase Auth sync — called by frontend after Firebase sign-in/sign-up
// Sends a welcome email only on first-ever login (new user detection)
router.post('/firebase-sync', async (req, res) => {
  const { uid, email, displayName, isNewUser, classLevel, stream, department, course } = req.body;
  if (!uid || !email) {
    return res.status(400).json({ error: 'uid and email are required.' });
  }
  if (classLevel && !CLASS_LEVELS.includes(classLevel)) {
    return res.status(400).json({ error: 'Invalid class level selected.' });
  }
  if (stream && !SSS_STREAMS.includes(stream)) {
    return res.status(400).json({ error: 'Invalid stream selected.' });
  }
  if (classLevel && SSS_LEVELS.includes(classLevel) && !stream) {
    return res.status(400).json({ error: 'A stream (Science, Art, or Commercial) is required for SSS.' });
  }
  if (department && !DEPARTMENTS.includes(department)) {
    return res.status(400).json({ error: 'Invalid department selected.' });
  }
  if (course && !COURSE_OPTIONS.includes(course)) {
    return res.status(400).json({ error: 'Invalid course selected.' });
  }
  if (classLevel && HIGHER_INSTITUTION_LEVELS.includes(classLevel)) {
    if (!department) {
      return res.status(400).json({ error: 'A department is required for Higher Institution.' });
    }
    if (!course) {
      return res.status(400).json({ error: 'A course of study is required for Higher Institution.' });
    }
    if (!getCoursesForDepartment(department).includes(course)) {
      return res.status(400).json({ error: 'That course does not belong to the selected department.' });
    }
  }
  try {
    const profile = await db.upsertUserProfile(uid, { email, displayName, classLevel, stream, department, course });

    if (isNewUser && email) {
      emailService.sendWelcomeEmail({ to: email, name: displayName || email.split('@')[0] })
        .catch(err => console.error('Welcome email error:', err));
    }
    res.json({ success: true, isNewUser: !!isNewUser, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
