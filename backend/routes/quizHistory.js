import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.post('/quiz-history', async (req, res) => {
  try {
    const record = await db.addQuizHistory(req.body);
    res.json({ success: true, record });
  } catch (err) {
    console.error('Save quiz history error:', err.message);
    res.status(500).json({ error: 'Failed to save quiz history' });
  }
});

router.get('/quiz-history/:uid', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = await db.getQuizHistory(req.params.uid, limit);
    res.json({ history });
  } catch (err) {
    console.error('Get quiz history error:', err.message);
    res.status(500).json({ error: 'Failed to fetch quiz history' });
  }
});

router.get('/quiz-stats/:uid', async (req, res) => {
  try {
    const stats = await db.getQuizStats(req.params.uid);
    res.json(stats);
  } catch (err) {
    console.error('Get quiz stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch quiz stats' });
  }
});

export default router;
