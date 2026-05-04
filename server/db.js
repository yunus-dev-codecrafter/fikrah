import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const DB_PATH = process.env.SQLITE_PATH || join(DATA_DIR, 'fikrah.db')

let db

const DEMO_USERS = [
  { username: 'superadmin', role: 'super-admin', schoolId: null, fullName: 'Platform Owner' },
  { username: 'proprietor', role: 'proprietor', schoolId: 'SCH-001', fullName: 'Amina Bello' },
  { username: 'headmaster', role: 'headmaster', schoolId: 'SCH-001', fullName: 'Mr. Okoro' },
  { username: 'teacher', role: 'teacher', schoolId: 'SCH-001', fullName: 'Mrs. Adeyemi' },
  { username: 'parent', role: 'parent', schoolId: 'SCH-001', fullName: 'Mrs. Musa' },
]

function runMigrations(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      school_id TEXT,
      full_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      school_id TEXT NOT NULL,
      teacher TEXT NOT NULL,
      class_name TEXT NOT NULL,
      date TEXT NOT NULL,
      present_count INTEGER NOT NULL,
      absent_count INTEGER NOT NULL,
      client_queue_id INTEGER,
      queued_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_school_client
      ON attendance(school_id, client_queue_id)
      WHERE client_queue_id IS NOT NULL;

    CREATE TABLE IF NOT EXISTS scores (
      id TEXT PRIMARY KEY,
      school_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      ca_score REAL NOT NULL,
      exam_score REAL NOT NULL,
      total_score REAL NOT NULL,
      grade TEXT NOT NULL,
      teacher_comment TEXT NOT NULL DEFAULT '',
      headmaster_status TEXT NOT NULL DEFAULT 'pending',
      headmaster_comment TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_scores_school ON scores(school_id);
  `)
}

function seedUsers(database) {
  const count = database.prepare('SELECT COUNT(*) AS c FROM users').get().c
  if (count > 0) return

  const now = new Date().toISOString()
  const passwordHash = bcrypt.hashSync(process.env.DEMO_PASSWORD || 'demo', 10)
  const insert = database.prepare(`
    INSERT INTO users (id, username, password_hash, role, school_id, full_name, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const u of DEMO_USERS) {
    insert.run(
      randomUUID(),
      u.username,
      passwordHash,
      u.role,
      u.schoolId,
      u.fullName,
      now,
      now,
    )
  }
}

export function initDb() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  runMigrations(db)
  seedUsers(db)
  return db
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.')
  }
  return db
}
