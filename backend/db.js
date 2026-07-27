import dotenv from 'dotenv';
import JsonDatabase from './jsonDb.js';
import SupabaseDatabase from './supabaseDb.js';

dotenv.config();

// NOTE: This project standardized on Supabase as the primary database.
// The MongoDB backend was removed on 2026-07-27 — boot order is now
// Supabase → local JSON (db.json).

// ─── Database Proxy (Factory Wrapper) ──────────────────────────────────────────
class DatabaseProxy {
  constructor() {
    this.activeDb = null;
    this.backend = null; // 'supabase' | 'json'
  }

  async init() {
    // 1. Try Supabase (primary)
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const supabaseDb = new SupabaseDatabase();
        await supabaseDb.init();
        this.activeDb = supabaseDb;
        this.backend = 'supabase';
        return;
      } catch (error) {
        console.warn('⚠️ Supabase connection failed:', error.message);
      }
    }

    // 2. Fall back to local JSON database
    console.log('📂 Falling back to local JSON database (db.json)...');
    const jsonDb = new JsonDatabase();
    await jsonDb.init();
    this.activeDb = jsonDb;
    this.backend = 'json';
  }

  // Decks
  async getDecks() { return this.activeDb.getDecks(); }
  async addDeck(data) { return this.activeDb.addDeck(data); }
  async deleteDeck(deckId) { return this.activeDb.deleteDeck(deckId); }

  // Cards
  async getCards() { return this.activeDb.getCards(); }
  async getCardsByDeck(deckId) { return this.activeDb.getCardsByDeck(deckId); }
  async addCard(data) { return this.activeDb.addCard(data); }
  async updateCard(cardId, updates) { return this.activeDb.updateCard(cardId, updates); }
  async deleteCard(cardId) { return this.activeDb.deleteCard(cardId); }

  // SM-2 Spaced Repetition
  async reviewCard(cardId, score) { return this.activeDb.reviewCard(cardId, score); }

  // Pomodoro
  async getPomodoroSessions() { return this.activeDb.getPomodoroSessions(); }
  async addPomodoroSession(data) { return this.activeDb.addPomodoroSession(data); }

  // Notes
  async getNotes() { return this.activeDb.getNotes(); }
  async addNote(data) { return this.activeDb.addNote(data); }
  async updateNote(noteId, updates) { return this.activeDb.updateNote(noteId, updates); }
  async deleteNote(noteId) { return this.activeDb.deleteNote(noteId); }

  // Tasks
  async getTasks() { return this.activeDb.getTasks(); }
  async addTask(data) { return this.activeDb.addTask(data); }
  async updateTask(taskId, updates) { return this.activeDb.updateTask(taskId, updates); }
  async deleteTask(taskId) { return this.activeDb.deleteTask(taskId); }

  // Auth
  async signup(username, password) { return this.activeDb.signup(username, password); }
  async login(username, password) { return this.activeDb.login(username, password); }

  // User Profiles (class level, etc.)
  async upsertUserProfile(uid, updates) { return this.activeDb.upsertUserProfile(uid, updates); }
  async getUserProfile(uid) { return this.activeDb.getUserProfile(uid); }

  // Quiz History
  async addQuizHistory(data) { return this.activeDb.addQuizHistory(data); }
  async getQuizHistory(uid, limit) { return this.activeDb.getQuizHistory(uid, limit); }
  async getQuizStats(uid) { return this.activeDb.getQuizStats(uid); }

  // Conversations (Session Memory)
  async getConversations(uid, limit) { return this.activeDb.getConversations(uid, limit); }
  async getConversation(convId) { return this.activeDb.getConversation(convId); }
  async createConversation(uid, title) { return this.activeDb.createConversation(uid, title); }
  async updateConversation(convId, updates) { return this.activeDb.updateConversation(convId, updates); }
  async addMessageToConversation(convId, role, content) { return this.activeDb.addMessageToConversation(convId, role, content); }
  async deleteConversation(convId) { return this.activeDb.deleteConversation(convId); }
}

const db = new DatabaseProxy();
export default db;
