import sqlite3 from 'sqlite3';
import fs from 'fs';
import { createClient as createLibsqlClient } from '@libsql/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const defaultDbPath = join(__dirname, '../data/flinc.db');
const DB_PATH = (process.env.DB_PATH && process.env.DB_PATH.trim() !== '')
  ? process.env.DB_PATH
  : defaultDbPath;
const LIBSQL_URL = process.env.LIBSQL_URL;
const LIBSQL_AUTH_TOKEN = process.env.LIBSQL_AUTH_TOKEN;

let db;
let libsqlClient;

export function initDb() {
  return new Promise((resolve, reject) => {
    if (LIBSQL_URL) {
      try {
        libsqlClient = createLibsqlClient({
          url: LIBSQL_URL,
          authToken: LIBSQL_AUTH_TOKEN,
        });
        console.log('Connected to libSQL at', LIBSQL_URL);
        resolve(libsqlClient);
      } catch (err) {
        console.error('Error connecting to libSQL', err);
        reject(err);
      }
    } else {
      // Ensure the directory for the database exists (useful when DB_PATH points to a mounted volume)
      try {
        const dbDir = dirname(DB_PATH);
        fs.mkdirSync(dbDir, { recursive: true });
      } catch (e) {
        console.warn('Could not ensure DB directory exists:', e);
        // continue; sqlite will still attempt to create the file if path is valid
      }
      db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('Error opening database', err);
          reject(err);
        } else {
          console.log('Database initialized at', DB_PATH);
          resolve(db);
        }
      });
    }
  });
}

export function getDb() {
  return libsqlClient ?? db;
}

export function runDb(sql, params = []) {
  if (libsqlClient) {
    return libsqlClient
      .execute({ sql, args: params })
      .then((result) => {
        const id =
          // libSQL returns BigInt for lastInsertRowid when present
          result.lastInsertRowid !== undefined && result.lastInsertRowid !== null
            ? Number(result.lastInsertRowid)
            : undefined;
        const changes = result.rowsAffected ?? 0;
        return { id, changes };
      });
  }
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

export function getDb_single(sql, params = []) {
  if (libsqlClient) {
    return libsqlClient
      .execute({ sql, args: params })
      .then((result) => (result.rows && result.rows.length > 0 ? result.rows[0] : undefined));
  }
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export function getAllDb(sql, params = []) {
  if (libsqlClient) {
    return libsqlClient
      .execute({ sql, args: params })
      .then((result) => result.rows || []);
  }
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

export async function createSchema() {
  try {
    // Create Users table
    await runDb(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Games table
    await runDb(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        difficulty TEXT,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Create News table
    await runDb(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
      )
    `);

    // Create Notifications table
    await runDb(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        read INTEGER DEFAULT 0,
        related_event_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (related_event_id) REFERENCES news(id)
      )
    `);

    // Create Likes table
    await runDb(`
      CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        news_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, news_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (news_id) REFERENCES news(id)
      )
    `);

    // Create Comments table
    await runDb(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        news_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (news_id) REFERENCES news(id)
      )
    `);

    // Create Bingo Cards table
    await runDb(`
      CREATE TABLE IF NOT EXISTS bingo_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create Bingo Squares table
    await runDb(`
      CREATE TABLE IF NOT EXISTS bingo_squares (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bingo_card_id INTEGER NOT NULL,
        position INTEGER NOT NULL,
        text TEXT NOT NULL,
        checked INTEGER DEFAULT 0,
        FOREIGN KEY (bingo_card_id) REFERENCES bingo_cards(id)
      )
    `);

    // Create Quiz Scores table
    await runDb(`
      CREATE TABLE IF NOT EXISTS quiz_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER DEFAULT 5,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create Quiz Attempts table (to prevent multiple attempts per day)
    await runDb(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        attempt_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, attempt_date),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('Schema created successfully');
  } catch (error) {
    console.error('Error creating schema:', error);
    throw error;
  }
}

