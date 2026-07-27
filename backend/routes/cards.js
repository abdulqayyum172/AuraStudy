import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const newCard = await db.addCard(req.body);
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:cardId', async (req, res) => {
  try {
    const updated = await db.updateCard(req.params.cardId, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cardId', async (req, res) => {
  try {
    await db.deleteCard(req.params.cardId);
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:cardId/review', async (req, res) => {
  const { score } = req.body;
  if (score === undefined || score < 0 || score > 5) {
    return res.status(400).json({ error: 'Score must be between 0 and 5 inclusive.' });
  }
  try {
    const updatedCard = await db.reviewCard(req.params.cardId, score);
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
