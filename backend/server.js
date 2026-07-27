import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import initGemini from './config/gemini.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import deckRoutes from './routes/decks.js';
import cardRoutes from './routes/cards.js';
import noteRoutes from './routes/notes.js';
import taskRoutes from './routes/tasks.js';
import pomodoroRoutes from './routes/pomodoros.js';
import aiRoutes from './routes/ai.js';
import conversationRoutes from './routes/conversations.js';
import quizHistoryRoutes from './routes/quizHistory.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

await db.init();
initGemini();

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/pomodoros', pomodoroRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api', quizHistoryRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
