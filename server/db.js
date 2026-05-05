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

const DEMO_SCHOOLS = [
  { id: 'SCH-001', name: 'Fikrah Model School', proprietorUsername: 'proprietor', status: 'active' },
  { id: 'SCH-002', name: 'Cedar Academy', proprietorUsername: null, status: 'pending' },
]

const DEMO_PRICING = [
  { id: 'PLAN-STD', name: 'Standard', monthlyAmount: 25000, yearlyAmount: 240000, maxStudents: 300, status: 'active' },
  { id: 'PLAN-PRM', name: 'Premium', monthlyAmount: 50000, yearlyAmount: 480000, maxStudents: 1000, status: 'active' },
]

function addDays(date, days) {
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString()
}

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

    CREATE TABLE IF NOT EXISTS pricing_plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      monthly_amount REAL NOT NULL,
      yearly_amount REAL NOT NULL,
      max_students INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS schools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      proprietor_user_id TEXT,
      status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'suspended')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(proprietor_user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      school_id TEXT NOT NULL,
      pricing_plan_id TEXT NOT NULL,
      billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
      amount REAL NOT NULL,
      start_date TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'pending', 'blocked', 'cancelled')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(school_id) REFERENCES schools(id),
      FOREIGN KEY(pricing_plan_id) REFERENCES pricing_plans(id)
    );

    CREATE INDEX IF NOT EXISTS idx_subscriptions_school ON subscriptions(school_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry ON subscriptions(expiry_date);

    CREATE TABLE IF NOT EXISTS financial_transactions (
      id TEXT PRIMARY KEY,
      school_id TEXT NOT NULL,
      subscription_id TEXT,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'NGN',
      type TEXT NOT NULL CHECK (type IN ('subscription_payment', 'refund', 'adjustment')),
      status TEXT NOT NULL CHECK (status IN ('success', 'pending', 'failed')),
      reference TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(school_id) REFERENCES schools(id),
      FOREIGN KEY(subscription_id) REFERENCES subscriptions(id)
    );

    CREATE INDEX IF NOT EXISTS idx_financial_school ON financial_transactions(school_id);
    CREATE INDEX IF NOT EXISTS idx_financial_created ON financial_transactions(created_at);

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_user_id TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      action TEXT NOT NULL,
      resource_type TEXT NOT NULL,
      resource_id TEXT,
      school_id TEXT,
      metadata_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(actor_user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_audit_school ON audit_logs(school_id);
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

function seedSuperAdminData(database) {
  const now = new Date().toISOString()

  const pricingCount = database.prepare('SELECT COUNT(*) AS c FROM pricing_plans').get().c
  if (pricingCount === 0) {
    const insertPlan = database.prepare(`
      INSERT INTO pricing_plans (id, name, monthly_amount, yearly_amount, max_students, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    for (const p of DEMO_PRICING) {
      insertPlan.run(p.id, p.name, p.monthlyAmount, p.yearlyAmount, p.maxStudents, p.status, now, now)
    }
  }

  const schoolsCount = database.prepare('SELECT COUNT(*) AS c FROM schools').get().c
  if (schoolsCount === 0) {
    const proprietor = database.prepare("SELECT id FROM users WHERE username = 'proprietor'").get()
    const insertSchool = database.prepare(`
      INSERT INTO schools (id, name, proprietor_user_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    for (const school of DEMO_SCHOOLS) {
      const proprietorId = school.proprietorUsername && proprietor ? proprietor.id : null
      insertSchool.run(school.id, school.name, proprietorId, school.status, now, now)
    }
  }

  const subscriptionCount = database.prepare('SELECT COUNT(*) AS c FROM subscriptions').get().c
  if (subscriptionCount === 0) {
    const insertSub = database.prepare(`
      INSERT INTO subscriptions (
        id, school_id, pricing_plan_id, billing_cycle, amount, start_date, expiry_date, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    insertSub.run(
      'SUB-001',
      'SCH-001',
      'PLAN-PRM',
      'yearly',
      480000,
      now,
      addDays(now, 180),
      'active',
      now,
      now,
    )
    insertSub.run(
      'SUB-002',
      'SCH-002',
      'PLAN-STD',
      'monthly',
      25000,
      now,
      addDays(now, 10),
      'pending',
      now,
      now,
    )
  }

  const txCount = database.prepare('SELECT COUNT(*) AS c FROM financial_transactions').get().c
  if (txCount === 0) {
    database
      .prepare(`
        INSERT INTO financial_transactions
          (id, school_id, subscription_id, amount, currency, type, status, reference, created_at)
        VALUES (?, ?, ?, ?, 'NGN', 'subscription_payment', 'success', ?, ?)
      `)
      .run('TX-001', 'SCH-001', 'SUB-001', 480000, 'PAYSTACK-DEMO-001', now)
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
  seedSuperAdminData(db)
  return db
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.')
  }
  return db
}
