import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/:uid', async (req, res) => {
  try {
    const conversations = await db.getConversations(req.params.uid);
    const summaries = conversations.map(c => ({
      id: c.id,
      title: c.title,
      messageCount: (c.messages || []).length,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:uid/:convId', async (req, res) => {
  try {
    const conv = await db.getConversation(req.params.convId);
    if (!conv || conv.uid !== req.params.uid) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { uid, title } = req.body;
  if (!uid) return res.status(400).json({ error: 'uid is required' });
  try {
    const conv = await db.createConversation(uid, title);
    res.status(201).json(conv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:convId', async (req, res) => {
  try {
    await db.deleteConversation(req.params.convId);
    res.json({ message: 'Conversation deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:convId/messages', async (req, res) => {
  const { role, content } = req.body;
  if (!role || !content) return res.status(400).json({ error: 'role and content are required' });
  try {
    const conv = await db.addMessageToConversation(req.params.convId, role, content);
    res.json(conv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
