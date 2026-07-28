import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const FILE_PATH = path.resolve('db.json');

class JsonDatabase {
  constructor() {
    this.data = {
      users: [],
      profiles: [],
      decks: [],
      cards: [],
      pomodoroSessions: [],
      notes: [],
      tasks: [],
      quizHistory: []
    };
  }

  async init() {
    try {
      const exists = await fs.access(FILE_PATH).then(() => true).catch(() => false);
      if (exists) {
        const fileContent = await fs.readFile(FILE_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
        if (!this.data.users) this.data.users = [];
        if (!this.data.profiles) this.data.profiles = [];
        console.log('✅  Loaded local database from db.json');
      } else {
        console.log('🌱  db.json not found. Initializing default data...');
        await this._seed();
      }
    } catch (error) {
      console.error('Error initializing JSON database, resetting:', error);
      await this._seed();
    }
  }

  async _seed() {
    const tomorrow = new Date(Date.now() + 86400000).toISOString();
    const today = new Date().toISOString();

    const deck1Id = crypto.randomUUID();
    const deck2Id = crypto.randomUUID();

    this.data = {
      users: [],
      profiles: [],
      decks: [
        {
          id: deck1Id,
          title: 'JavaScript Fundamentals',
          description: 'Core concepts of JavaScript, ES6+, scopes, and closures.',
          createdAt: today
        },
        {
          id: deck2Id,
          title: 'Web Design & CSS',
          description: 'CSS Grid, Flexbox, transitions, and responsive layout guidelines.',
          createdAt: today
        }
      ],
      cards: [
        {
          id: crypto.randomUUID(),
          deckId: deck1Id,
          question: 'What is a closure in JavaScript?',
          answer: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives an inner function access to the outer function's scope even after the outer function has returned.",
          difficulty: 3,
          nextReview: today,
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0
        },
        {
          id: crypto.randomUUID(),
          deckId: deck1Id,
          question: 'What is the difference between "let" and "var"?',
          answer: '"var" is function-scoped and undergoes hoisting with an initial value of undefined. "let" is block-scoped and is not initialized until its definition is evaluated (meaning it is in a Temporal Dead Zone until then).',
          difficulty: 2,
          nextReview: today,
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0
        },
        {
          id: crypto.randomUUID(),
          deckId: deck2Id,
          question: 'Explain the CSS Box Model.',
          answer: 'The CSS Box Model is a container that wraps around every HTML element. It consists of: Margin (outermost space), Border, Padding (space around content), and the actual Content itself.',
          difficulty: 1,
          nextReview: today,
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0
        }
      ],
      pomodoroSessions: [],
      notes: [
        {
          id: crypto.randomUUID(),
          title: 'Study Plan Overview',
          content: '# My Study Strategy\n\n1. Use the **Pomodoro Technique** (25 mins study, 5 mins break) to maintain focus.\n2. Leverage **Spaced Repetition** for technical terms and concepts.\n3. Make active summaries rather than just passive reading.',
          createdAt: today,
          updatedAt: today,
          tags: ['meta', 'planning']
        }
      ],
      tasks: [
        {
          id: crypto.randomUUID(),
          title: 'Revise JS Scopes & Closures',
          description: 'Review the flashcard deck and read notes on closures.',
          status: 'todo',
          dueDate: tomorrow.split('T')[0],
          priority: 'high',
          estimatedPomodoros: 2,
          completedPomodoros: 0
        },
        {
          id: crypto.randomUUID(),
          title: 'Design Study App UI',
          description: 'Sketch layout and create CSS styles for dashboard.',
          status: 'in-progress',
          dueDate: today.split('T')[0],
          priority: 'medium',
          estimatedPomodoros: 4,
          completedPomodoros: 1
        }
      ]
    };

    await this._save();
    console.log('✅  Local db.json seeded successfully.');
  }

  async _save() {
    await fs.writeFile(FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // ── Decks ──────────────────────────────────────────────────────────────────

  async getDecks() {
    return [...this.data.decks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async addDeck(data) {
    const newDeck = {
      id: crypto.randomUUID(),
      title: data.title || '',
      description: data.description || '',
      createdAt: new Date().toISOString()
    };
    this.data.decks.push(newDeck);
    await this._save();
    return newDeck;
  }

  async deleteDeck(deckId) {
    this.data.decks = this.data.decks.filter(d => d.id !== deckId);
    this.data.cards = this.data.cards.filter(c => c.deckId !== deckId);
    await this._save();
  }

  // ── Cards ──────────────────────────────────────────────────────────────────

  async getCards() {
    return [...this.data.cards];
  }

  async getCardsByDeck(deckId) {
    return this.data.cards.filter(c => c.deckId === deckId);
  }

  async addCard(data) {
    const newCard = {
      id: crypto.randomUUID(),
      deckId: data.deckId,
      question: data.question || '',
      answer: data.answer || '',
      difficulty: Number(data.difficulty) || 3,
      nextReview: data.nextReview || new Date().toISOString(),
      interval: Number(data.interval) || 0,
      easeFactor: Number(data.easeFactor) || 2.5,
      repetitions: Number(data.repetitions) || 0
    };
    this.data.cards.push(newCard);
    await this._save();
    return newCard;
  }

  async updateCard(cardId, updates) {
    const index = this.data.cards.findIndex(c => c.id === cardId);
    if (index === -1) throw new Error('Card not found');

    this.data.cards[index] = {
      ...this.data.cards[index],
      ...updates
    };
    await this._save();
    return this.data.cards[index];
  }

  async deleteCard(cardId) {
    this.data.cards = this.data.cards.filter(c => c.id !== cardId);
    await this._save();
  }

  // ── Spaced Repetition (SM-2) ───────────────────────────────────────────────

  async reviewCard(cardId, score) {
    const card = this.data.cards.find(c => c.id === cardId);
    if (!card) throw new Error('Card not found');

    let { repetitions, easeFactor, interval } = card;

    if (score >= 3) {
      if (repetitions === 0)      interval = 1;
      else if (repetitions === 1) interval = 6;
      else                        interval = Math.round(interval * easeFactor);
      repetitions++;
    } else {
      repetitions = 0;
      interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    card.repetitions = repetitions;
    card.easeFactor = easeFactor;
    card.interval = interval;
    card.nextReview = nextReview.toISOString();

    await this._save();
    return { ...card };
  }

  // ── Pomodoro Sessions ──────────────────────────────────────────────────────

  async getPomodoroSessions() {
    return [...this.data.pomodoroSessions].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  async addPomodoroSession(data) {
    const newSession = {
      id: crypto.randomUUID(),
      taskId: data.taskId || null,
      duration: Number(data.duration) || 25,
      completedAt: data.completedAt || new Date().toISOString()
    };
    this.data.pomodoroSessions.push(newSession);
    await this._save();
    return newSession;
  }

  // ── Notes ──────────────────────────────────────────────────────────────────

  async getNotes() {
    return [...this.data.notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async addNote(data) {
    const now = new Date().toISOString();
    const newNote = {
      id: crypto.randomUUID(),
      title: data.title || '',
      content: data.content || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: now,
      updatedAt: now
    };
    this.data.notes.push(newNote);
    await this._save();
    return newNote;
  }

  async updateNote(noteId, updates) {
    const index = this.data.notes.findIndex(n => n.id === noteId);
    if (index === -1) throw new Error('Note not found');

    this.data.notes[index] = {
      ...this.data.notes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this._save();
    return this.data.notes[index];
  }

  async deleteNote(noteId) {
    this.data.notes = this.data.notes.filter(n => n.id !== noteId);
    await this._save();
  }

  // ── Tasks ──────────────────────────────────────────────────────────────────

  async getTasks() {
    return [...this.data.tasks];
  }

  async addTask(data) {
    const newTask = {
      id: crypto.randomUUID(),
      title: data.title || '',
      description: data.description || '',
      status: data.status || 'todo',
      dueDate: data.dueDate || null,
      priority: data.priority || 'medium',
      estimatedPomodoros: Number(data.estimatedPomodoros) || 1,
      completedPomodoros: Number(data.completedPomodoros) || 0
    };
    this.data.tasks.push(newTask);
    await this._save();
    return newTask;
  }

  async updateTask(taskId, updates) {
    const index = this.data.tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error('Task not found');

    this.data.tasks[index] = {
      ...this.data.tasks[index],
      ...updates
    };
    await this._save();
    return this.data.tasks[index];
  }

  async deleteTask(taskId) {
    this.data.tasks = this.data.tasks.filter(t => t.id !== taskId);
    await this._save();
  }

  // ── User Profiles (Firebase-authenticated users: display name, class level, course) ─

  async upsertUserProfile(uid, updates) {
    if (!this.data.profiles) this.data.profiles = [];
    const index = this.data.profiles.findIndex(p => p.uid === uid);
    const now = new Date().toISOString();
    if (index === -1) {
      const newProfile = {
        uid,
        email: updates.email || '',
        displayName: updates.displayName || '',
        classLevel: updates.classLevel || '',
        stream: updates.stream || '',
        department: updates.department || '',
        course: updates.course || '',
        createdAt: now,
        updatedAt: now
      };
      this.data.profiles.push(newProfile);
      await this._save();
      return newProfile;
    }

    const existing = this.data.profiles[index];
    this.data.profiles[index] = {
      ...existing,
      email: updates.email !== undefined ? updates.email : existing.email,
      displayName: updates.displayName !== undefined ? updates.displayName : existing.displayName,
      // Only overwrite classLevel/course when a new value is explicitly
      // provided, so we never blank out a previously-selected value on
      // subsequent logins. stream/department are allowed to clear (e.g.
      // switching from SSS to Basic), so an explicit empty string wins.
      classLevel: updates.classLevel ? updates.classLevel : existing.classLevel,
      stream: updates.stream !== undefined ? updates.stream : existing.stream,
      department: updates.department !== undefined ? updates.department : existing.department,
      course: updates.course !== undefined ? updates.course : existing.course,
      updatedAt: now
    };
    await this._save();
    return this.data.profiles[index];
  }

  async getUserProfile(uid) {
    if (!this.data.profiles) this.data.profiles = [];
    return this.data.profiles.find(p => p.uid === uid) || null;
  }

  async deleteUserProfile(uid) {
    if (this.data.profiles) this.data.profiles = this.data.profiles.filter(p => p.uid !== uid);
    if (this.data.conversations) this.data.conversations = this.data.conversations.filter(c => c.uid !== uid);
    if (this.data.quizHistory) this.data.quizHistory = this.data.quizHistory.filter(q => q.uid !== uid);
    await this._save();
  }

  // ── Quiz History ──────────────────────────────────────────────────────────

  async addQuizHistory(data) {
    if (!this.data.quizHistory) this.data.quizHistory = [];
    const record = {
      id: crypto.randomUUID(),
      uid: data.uid,
      topic: data.topic || '',
      subject: data.subject || '',
      difficulty: data.difficulty || 'Medium',
      questionCount: data.questionCount || 5,
      score: data.score || 0,
      total: data.total || 0,
      percentage: data.percentage || 0,
      questions: data.questions || [],
      answers: data.answers || {},
      classLevel: data.classLevel || '',
      stream: data.stream || '',
      course: data.course || '',
      completedAt: data.completedAt || new Date().toISOString()
    };
    this.data.quizHistory.push(record);
    await this._save();
    return record;
  }

  async getQuizHistory(uid, limit = 20) {
    if (!this.data.quizHistory) this.data.quizHistory = [];
    return this.data.quizHistory
      .filter(q => q.uid === uid)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, limit);
  }

  async getQuizStats(uid) {
    if (!this.data.quizHistory) this.data.quizHistory = [];
    const results = this.data.quizHistory.filter(q => q.uid === uid);
    if (results.length === 0) return { total: 0, avgScore: 0, subjects: {} };
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

  // ── Conversations (Session Memory) ─────────────────────────────────────

  async getConversations(uid, limit = 50) {
    if (!this.data.conversations) this.data.conversations = [];
    return this.data.conversations
      .filter(c => c.uid === uid)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit);
  }

  async getConversation(convId) {
    if (!this.data.conversations) this.data.conversations = [];
    return this.data.conversations.find(c => c.id === convId) || null;
  }

  async createConversation(uid, title = 'New Chat') {
    if (!this.data.conversations) this.data.conversations = [];
    const conv = {
      id: crypto.randomUUID(),
      uid,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.conversations.push(conv);
    await this._save();
    return conv;
  }

  async updateConversation(convId, updates) {
    if (!this.data.conversations) this.data.conversations = [];
    const index = this.data.conversations.findIndex(c => c.id === convId);
    if (index === -1) throw new Error('Conversation not found');
    this.data.conversations[index] = {
      ...this.data.conversations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this._save();
    return this.data.conversations[index];
  }

  async addMessageToConversation(convId, role, content) {
    if (!this.data.conversations) this.data.conversations = [];
    const conv = this.data.conversations.find(c => c.id === convId);
    if (!conv) throw new Error('Conversation not found');
    conv.messages.push({ role, content, timestamp: new Date().toISOString() });
    if (conv.messages.length === 1 && role === 'user') {
      conv.title = content.substring(0, 60) + (content.length > 60 ? '...' : '');
    }
    conv.updatedAt = new Date().toISOString();
    await this._save();
    return conv;
  }

  async deleteConversation(convId) {
    if (!this.data.conversations) this.data.conversations = [];
    this.data.conversations = this.data.conversations.filter(c => c.id !== convId);
    await this._save();
  }

  // ── Auth ───────────────────────────────────────────────────────────────────

  async signup(username, password) {
    if (!this.data.users) this.data.users = [];
    const normalized = username.toLowerCase().trim();
    if (this.data.users.find(u => u.username.toLowerCase() === normalized)) {
      throw new Error('Username already exists');
    }
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const newUser = {
      id: crypto.randomUUID(),
      username: username.trim(),
      passwordHash: hash,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    await this._save();
    return { id: newUser.id, username: newUser.username };
  }

  async login(username, password) {
    if (!this.data.users) this.data.users = [];
    const normalized = username.toLowerCase().trim();
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const user = this.data.users.find(u => u.username.toLowerCase() === normalized && u.passwordHash === hash);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    return { id: user.id, username: user.username };
  }
}

export default JsonDatabase;
