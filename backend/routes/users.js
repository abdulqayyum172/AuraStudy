import { Router } from 'express';
import db from '../db.js';
import { CLASS_LEVELS, SSS_STREAMS, DEPARTMENTS, COURSE_OPTIONS, DEPARTMENTS_WITH_COURSES, getSubjectsForClass, getCoursesForDepartment } from '../config/constants.js';

const router = Router();

router.get('/:uid/profile', async (req, res) => {
  try {
    const profile = await db.getUserProfile(req.params.uid);
    res.json(profile || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:uid/profile', async (req, res) => {
  const { classLevel, displayName, stream, department, course } = req.body;
  if (classLevel && !CLASS_LEVELS.includes(classLevel)) {
    return res.status(400).json({ error: 'Invalid class level selected.' });
  }
  if (stream && !SSS_STREAMS.includes(stream)) {
    return res.status(400).json({ error: 'Invalid stream selected.' });
  }
  if (department && !DEPARTMENTS.includes(department)) {
    return res.status(400).json({ error: 'Invalid department selected.' });
  }
  if (course && !COURSE_OPTIONS.includes(course)) {
    return res.status(400).json({ error: 'Invalid course selected.' });
  }
  if (department && course && !getCoursesForDepartment(department).includes(course)) {
    return res.status(400).json({ error: 'That course does not belong to the selected department.' });
  }
  try {
    const profile = await db.upsertUserProfile(req.params.uid, { classLevel, displayName, stream, department, course });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/courses', (req, res) => {
  const { department } = req.query;
  if (department) {
    if (!DEPARTMENTS.includes(department)) {
      return res.status(400).json({ error: 'Invalid department selected.' });
    }
    return res.json({ options: getCoursesForDepartment(department) });
  }
  res.json({ options: COURSE_OPTIONS });
});

router.get('/departments', (req, res) => {
  res.json({ departments: DEPARTMENTS_WITH_COURSES });
});

router.get('/subjects', (req, res) => {
  const { classLevel, stream, department } = req.query;
  if (classLevel && !CLASS_LEVELS.includes(classLevel)) {
    return res.status(400).json({ error: 'Invalid class level selected.' });
  }
  if (department && !DEPARTMENTS.includes(department)) {
    return res.status(400).json({ error: 'Invalid department selected.' });
  }
  res.json({ streams: SSS_STREAMS, subjects: getSubjectsForClass(classLevel, stream, department) });
});

router.get('/class-levels', (req, res) => {
  res.json({
    groups: [
      { label: 'Basic', options: CLASS_LEVELS.slice(0, 6) },
      { label: 'JSS (Junior Secondary School)', options: CLASS_LEVELS.slice(6, 9) },
      { label: 'SSS (Senior Secondary School)', options: CLASS_LEVELS.slice(9, 12) },
      { label: 'Higher Institution', options: CLASS_LEVELS.slice(12) }
    ]
  });
});

export default router;
