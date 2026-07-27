import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const decks = await db.getDecks();
    res.json(decks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newDeck = await db.addDeck(req.body);
    res.status(201).json(newDeck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:deckId', async (req, res) => {
  try {
    await db.deleteDeck(req.params.deckId);
    res.json({ message: 'Deck deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:deckId/cards', async (req, res) => {
  try {
    const cards = await db.getCardsByDeck(req.params.deckId);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
