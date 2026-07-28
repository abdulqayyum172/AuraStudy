import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

class SupabaseDatabase {
  constructor() {
    this.client = null;
  }

  async init() {
    const url = process.env.SUPABASE_URL;
    // Prefer the secret/service key on the backend — it bypasses RLS.
    // Fall back to the publishable key if no secret key is set.
    const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_KEY) must be set');

    this.client = createClient(url, key);
    console.log('✅ Connected to Supabase.');
  }

  // ── Decks ──────────────────────────────────────────────────────────────────

  async getDecks() {
    const { data, error } = await this.client
      .from('decks').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(this._mapDeck);
  }

  async addDeck(data) {
    const row = {
      id: crypto.randomUUID(),
      title: data.title || '',
      description: data.description || '',
      created_at: new Date().toISOString()
    };
    const { error } = await this.client.from('decks').insert(row);
    if (error) throw error;
    return this._mapDeck(row);
  }

  async deleteDeck(deckId) {
    await this.client.from('cards').delete().eq('deck_id', deckId);
    await this.client.from('decks').delete().eq('id', deckId);
  }

  // ── Cards ──────────────────────────────────────────────────────────────────

  async getCards() {
    const { data, error } = await this.client.from('cards').select('*');
    if (error) throw error;
    return (data || []).map(this._mapCard);
  }

  async getCardsByDeck(deckId) {
    const { data, error } = await this.client.from('cards').select('*').eq('deck_id', deckId);
    if (error) throw error;
    return (data || []).map(this._mapCard);
  }

  async addCard(data) {
    const row = {
      id: crypto.randomUUID(),
      deck_id: data.deckId,
      question: data.question || '',
      answer: data.answer || '',
      difficulty: Number(data.difficulty) || 3,
      next_review: data.nextReview || new Date().toISOString(),
      interval: Number(data.interval) || 0,
      ease_factor: Number(data.easeFactor) || 2.5,
      repetitions: Number(data.repetitions) || 0
    };
    const { error } = await this.client.from('cards').insert(row);
    if (error) throw error;
    return this._mapCard(row);
  }

  async updateCard(cardId, updates) {
    const patch = {};
    if (updates.deckId !== undefined) patch.deck_id = updates.deckId;
    if (updates.question !== undefined) patch.question = updates.question;
    if (updates.answer !== undefined) patch.answer = updates.answer;
    if (updates.difficulty !== undefined) patch.difficulty = updates.difficulty;
    if (updates.nextReview !== undefined) patch.next_review = updates.nextReview;
    if (updates.interval !== undefined) patch.interval = updates.interval;
    if (updates.easeFactor !== undefined) patch.ease_factor = updates.easeFactor;
    if (updates.repetitions !== undefined) patch.repetitions = updates.repetitions;

    const { data, error } = await this.client
      .from('cards').update(patch).eq('id', cardId).select().single();
    if (error) throw error;
    return this._mapCard(data);
  }

  async deleteCard(cardId) {
    await this.client.from('cards').delete().eq('id', cardId);
  }

  // ── Spaced Repetition (SM-2) ───────────────────────────────────────────────

  async reviewCard(cardId, score) {
    const { data: card, error: fetchErr } = await this.client
      .from('cards').select('*').eq('id', cardId).single();
    if (fetchErr || !card) throw new Error('Card not found');

    let { repetitions, ease_factor, interval } = card;

    if (score >= 3) {
      if (repetitions === 0)      interval = 1;
      else if (repetitions === 1) interval = 6;
      else                        interval = Math.round(interval * ease_factor);
      repetitions++;
    } else {
      repetitions = 0;
      interval = 1;
    }

    ease_factor = ease_factor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));
    if (ease_factor < 1.3) ease_factor = 1.3;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    const { data: updated, error } = await this.client
      .from('cards')
      .update({ repetitions, ease_factor, interval, next_review: nextReview.toISOString() })
      .eq('id', cardId)
      .select()
      .single();
    if (error) throw error;
    return this._mapCard(updated);
  }

  // ── Pomodoro Sessions ──────────────────────────────────────────────────────

  async getPomodoroSessions() {
    const { data, error } = await this.client
      .from('pomodoro_sessions').select('*').order('completed_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(this._mapPomodoro);
  }

  async addPomodoroSession(data) {
    const row = {
      id: crypto.randomUUID(),
      task_id: data.taskId || null,
      duration: Number(data.duration) || 25,
      completed_at: data.completedAt || new Date().toISOString()
    };
    const { error } = await this.client.from('pomodoro_sessions').insert(row);
    if (error) throw error;
    return this._mapPomodoro(row);
  }

  // ── Notes ──────────────────────────────────────────────────────────────────

  async getNotes() {
    const { data, error } = await this.client
      .from('notes').select('*').order('updated_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(this._mapNote);
  }

  async addNote(data) {
    const now = new Date().toISOString();
    const row = {
      id: crypto.randomUUID(),
      title: data.title || '',
      content: data.content || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      created_at: now,
      updated_at: now
    };
    const { error } = await this.client.from('notes').insert(row);
    if (error) throw error;
    return this._mapNote(row);
  }

  async updateNote(noteId, updates) {
    const patch = {};
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.content !== undefined) patch.content = updates.content;
    if (updates.tags !== undefined) patch.tags = updates.tags;
    patch.updated_at = new Date().toISOString();

    const { data, error } = await this.client
      .from('notes').update(patch).eq('id', noteId).select().single();
    if (error) throw error;
    return this._mapNote(data);
  }

  async deleteNote(noteId) {
    await this.client.from('notes').delete().eq('id', noteId);
  }

  // ── Tasks ──────────────────────────────────────────────────────────────────

  async getTasks() {
    const { data, error } = await this.client.from('tasks').select('*');
    if (error) throw error;
    return (data || []).map(this._mapTask);
  }

  async addTask(data) {
    const row = {
      id: crypto.randomUUID(),
      title: data.title || '',
      description: data.description || '',
      status: data.status || 'todo',
      due_date: data.dueDate || null,
      priority: data.priority || 'medium',
      estimated_pomodoros: data.estimatedPomodoros || 1,
      completed_pomodoros: data.completedPomodoros || 0
    };
    const { error } = await this.client.from('tasks').insert(row);
    if (error) throw error;
    return this._mapTask(row);
  }

  async updateTask(taskId, updates) {
    const patch = {};
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.status !== undefined) patch.status = updates.status;
    if (updates.dueDate !== undefined) patch.due_date = updates.dueDate;
    if (updates.priority !== undefined) patch.priority = updates.priority;
    if (updates.estimatedPomodoros !== undefined) patch.estimated_pomodoros = updates.estimatedPomodoros;
    if (updates.completedPomodoros !== undefined) patch.completed_pomodoros = updates.completedPomodoros;

    const { data, error } = await this.client
      .from('tasks').update(patch).eq('id', taskId).select().single();
    if (error) throw error;
    return this._mapTask(data);
  }

  async deleteTask(taskId) {
    await this.client.from('tasks').delete().eq('id', taskId);
  }

  // ── Auth ───────────────────────────────────────────────────────────────────

  async signup(username, password) {
    const normalized = username.toLowerCase().trim();
    const { data: existing } = await this.client
      .from('users').select('id').ilike('username', normalized).maybeSingle();
    if (existing) throw new Error('Username already exists');

    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const row = { id: crypto.randomUUID(), username: username.trim(), password_hash: hash, created_at: new Date().toISOString() };
    const { error } = await this.client.from('users').insert(row);
    if (error) throw error;
    return { id: row.id, username: row.username };
  }

  async login(username, password) {
    const normalized = username.toLowerCase().trim();
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const { data: user } = await this.client
      .from('users').select('*').ilike('username', normalized).eq('password_hash', hash).maybeSingle();
    if (!user) throw new Error('Invalid username or password');
    return { id: user.id, username: user.username };
  }

  // ── User Profiles ──────────────────────────────────────────────────────────

  async upsertUserProfile(uid, updates) {
    const { data: existing } = await this.client
      .from('profiles').select('*').eq('uid', uid).maybeSingle();

    const now = new Date().toISOString();

    if (!existing) {
      const row = {
        uid,
        email: updates.email || '',
        display_name: updates.displayName || '',
        class_level: updates.classLevel || '',
        stream: updates.stream || '',
        department: updates.department || '',
        course: updates.course || '',
        created_at: now,
        updated_at: now
      };
      const { error } = await this.client.from('profiles').insert(row);
      if (error) throw error;
      return this._mapProfile(row);
    }

    const patch = { updated_at: now };
    if (updates.email !== undefined) patch.email = updates.email;
    if (updates.displayName !== undefined) patch.display_name = updates.displayName;
    if (updates.classLevel) patch.class_level = updates.classLevel;
    if (updates.stream !== undefined) patch.stream = updates.stream;
    if (updates.department !== undefined) patch.department = updates.department;
    if (updates.course !== undefined) patch.course = updates.course;

    const { data, error } = await this.client
      .from('profiles').update(patch).eq('uid', uid).select().single();
    if (error) throw error;
    return this._mapProfile(data);
  }

  async getUserProfile(uid) {
    const { data } = await this.client
      .from('profiles').select('*').eq('uid', uid).maybeSingle();
    return data ? this._mapProfile(data) : null;
  }

  async deleteUserProfile(uid) {
    // Delete profile, conversations, and quiz history for this user
    await this.client.from('conversations').delete().eq('uid', uid);
    await this.client.from('quiz_history').delete().eq('uid', uid);
    await this.client.from('profiles').delete().eq('uid', uid);
  }

  // ── Quiz History ───────────────────────────────────────────────────────────

  async addQuizHistory(data) {
    const row = {
      id: crypto.randomUUID(),
      uid: data.uid,
      topic: data.topic || '',
      subject: data.subject || '',
      difficulty: data.difficulty || 'Medium',
      question_count: data.questionCount || 5,
      score: data.score || 0,
      total: data.total || 0,
      percentage: data.percentage || 0,
      questions: JSON.stringify(data.questions || []),
      answers: JSON.stringify(data.answers || {}),
      class_level: data.classLevel || '',
      stream: data.stream || '',
      course: data.course || '',
      completed_at: data.completedAt || new Date().toISOString()
    };
    const { error } = await this.client.from('quiz_history').insert(row);
    if (error) throw error;
    return this._mapQuizHistory(row);
  }

  async getQuizHistory(uid, limit = 20) {
    const { data, error } = await this.client
      .from('quiz_history').select('*')
      .eq('uid', uid)
      .order('completed_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []).map(this._mapQuizHistory);
  }

  async getQuizStats(uid) {
    const { data: results, error } = await this.client
      .from('quiz_history').select('subject, topic, percentage')
      .eq('uid', uid);
    if (error) throw error;
    if (!results || results.length === 0) return { total: 0, avgScore: 0, subjects: {} };

    let totalScore = 0;
    const subjects = {};
    for (const r of results) {
      totalScore += r.percentage;
      const subj = r.subject || r.topic;
      if (!subjects[subj]) subjects[subj] = { attempts: 0, avgPercentage: 0, totalPercentage: 0 };
      subjects[subj].attempts++;
      subjects[subj].totalPercentage += r.percentage;
    }
    for (const key of Object.keys(subjects)) {
      subjects[key].avgPercentage = Math.round(subjects[key].totalPercentage / subjects[key].attempts);
    }
    return {
      total: results.length,
      avgScore: Math.round(totalScore / results.length),
      subjects
    };
  }

  // ── Mappers (snake_case → camelCase) ───────────────────────────────────────

  _mapDeck(row) {
    if (!row) return null;
    return { id: row.id, title: row.title, description: row.description, createdAt: row.created_at };
  }

  _mapCard(row) {
    if (!row) return null;
    return {
      id: row.id, deckId: row.deck_id, question: row.question, answer: row.answer,
      difficulty: row.difficulty, nextReview: row.next_review, interval: row.interval,
      easeFactor: row.ease_factor, repetitions: row.repetitions
    };
  }

  _mapPomodoro(row) {
    if (!row) return null;
    return { id: row.id, taskId: row.task_id, duration: row.duration, completedAt: row.completed_at };
  }

  _mapNote(row) {
    if (!row) return null;
    return { id: row.id, title: row.title, content: row.content, tags: row.tags, createdAt: row.created_at, updatedAt: row.updated_at };
  }

  _mapTask(row) {
    if (!row) return null;
    return {
      id: row.id, title: row.title, description: row.description, status: row.status,
      dueDate: row.due_date, priority: row.priority,
      estimatedPomodoros: row.estimated_pomodoros, completedPomodoros: row.completed_pomodoros
    };
  }

  _mapProfile(row) {
    if (!row) return null;
    return {
      uid: row.uid, email: row.email, displayName: row.display_name,
      classLevel: row.class_level, stream: row.stream,
      department: row.department, course: row.course,
      createdAt: row.created_at, updatedAt: row.updated_at
    };
  }

  // ── Conversations (Session Memory) ─────────────────────────────────────

  async getConversations(uid, limit = 50) {
    const { data, error } = await this.client
      .from('conversations').select('*').eq('uid', uid)
      .order('updated_at', { ascending: false }).limit(limit);
    if (error) {
      // If table doesn't exist, return empty array gracefully
      if (error.message && error.message.includes('does not exist')) return [];
      throw error;
    }
    return (data || []).map(this._mapConversation);
  }

  async getConversation(convId) {
    const { data, error } = await this.client
      .from('conversations').select('*').eq('id', convId).single();
    if (error) return null;
    return this._mapConversation(data);
  }

  async createConversation(uid, title = 'New Chat') {
    const row = {
      id: crypto.randomUUID(),
      uid,
      title,
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const { error } = await this.client.from('conversations').insert(row);
    if (error) throw error;
    return this._mapConversation(row);
  }

  async updateConversation(convId, updates) {
    const setFields = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) setFields.title = updates.title;
    if (updates.messages !== undefined) setFields.messages = JSON.stringify(updates.messages);
    const { error } = await this.client.from('conversations').update(setFields).eq('id', convId);
    if (error) throw error;
    return this.getConversation(convId);
  }

  async addMessageToConversation(convId, role, content) {
    const conv = await this.getConversation(convId);
    if (!conv) throw new Error('Conversation not found');
    const messages = conv.messages || [];
    messages.push({ role, content, timestamp: new Date().toISOString() });
    const updates = { messages };
    if (messages.length === 1 && role === 'user') {
      updates.title = content.substring(0, 60) + (content.length > 60 ? '...' : '');
    }
    return this.updateConversation(convId, updates);
  }

  async deleteConversation(convId) {
    await this.client.from('conversations').delete().eq('id', convId);
  }

  _mapConversation(row) {
    if (!row) return null;
    const messages = typeof row.messages === 'string' ? JSON.parse(row.messages) : (row.messages || []);
    return {
      id: row.id, uid: row.uid, title: row.title, messages,
      createdAt: row.created_at, updatedAt: row.updated_at
    };
  }

  _mapQuizHistory(row) {
    if (!row) return null;
    return {
      id: row.id, uid: row.uid, topic: row.topic, subject: row.subject,
      difficulty: row.difficulty, questionCount: row.question_count,
      score: row.score, total: row.total, percentage: row.percentage,
      questions: typeof row.questions === 'string' ? JSON.parse(row.questions) : row.questions,
      answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers,
      classLevel: row.class_level, stream: row.stream, course: row.course,
      completedAt: row.completed_at
    };
  }
}

export default SupabaseDatabase;
