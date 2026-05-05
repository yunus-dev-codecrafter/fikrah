import { randomUUID } from 'crypto'
import { getDb } from '../db.js'

function nowIso() {
  return new Date().toISOString()
}

function toCsv(rows) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  for (const row of rows) {
    const line = headers
      .map((h) => {
        const raw = row[h] ?? ''
        const text = String(raw).replaceAll('"', '""')
        return `"${text}"`
      })
      .join(',')
    lines.push(line)
  }
  return lines.join('\n')
}

export function logAudit({ actorUserId, actorRole, action, resourceType, resourceId = null, schoolId = null, metadata = {} }) {
  getDb()
    .prepare(
      `
      INSERT INTO audit_logs (id, actor_user_id, actor_role, action, resource_type, resource_id, school_id, metadata_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      randomUUID(),
      actorUserId,
      actorRole,
      action,
      resourceType,
      resourceId,
      schoolId,
      JSON.stringify(metadata),
      nowIso(),
    )
}

export function getDashboardAnalytics() {
  const db = getDb()
  const totalSchools = db.prepare('SELECT COUNT(*) AS c FROM schools').get().c
  const activeSubscriptions = db.prepare("SELECT COUNT(*) AS c FROM subscriptions WHERE status = 'active'").get().c
  const mrr = db
    .prepare(
      `
      SELECT COALESCE(SUM(CASE
        WHEN billing_cycle = 'monthly' THEN amount
        WHEN billing_cycle = 'yearly' THEN amount / 12
        ELSE 0 END), 0) AS mrr
      FROM subscriptions
      WHERE status = 'active'
    `,
    )
    .get().mrr
  const totalRevenue = db
    .prepare("SELECT COALESCE(SUM(amount), 0) AS v FROM financial_transactions WHERE status = 'success'")
    .get().v
  const expiringSoon = db
    .prepare(
      `
      SELECT COUNT(*) AS c
      FROM subscriptions
      WHERE status IN ('active', 'pending')
        AND datetime(expiry_date) <= datetime('now', '+14 days')
    `,
    )
    .get().c
  return { totalSchools, activeSubscriptions, mrr, totalRevenue, expiringSoon }
}

export function listSchools({ search = '', status = '', proprietorId = '' }) {
  const db = getDb()
  let sql = `
    SELECT s.id AS schoolId, s.name, s.status, u.id AS proprietorId, u.full_name AS proprietorName,
           s.created_at AS createdAt, s.updated_at AS updatedAt
    FROM schools s
    LEFT JOIN users u ON s.proprietor_user_id = u.id
    WHERE 1 = 1
  `
  const params = []
  if (search) {
    sql += ' AND (s.name LIKE ? OR s.id LIKE ? OR COALESCE(u.full_name, \'\') LIKE ?)'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  if (status) {
    sql += ' AND s.status = ?'
    params.push(status)
  }
  if (proprietorId) {
    sql += ' AND s.proprietor_user_id = ?'
    params.push(proprietorId)
  }
  sql += ' ORDER BY datetime(s.created_at) DESC'
  return db.prepare(sql).all(...params)
}

export function createSchool({ schoolId, name, proprietorId = null, status }) {
  const now = nowIso()
  getDb()
    .prepare(
      `
      INSERT INTO schools (id, name, proprietor_user_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    )
    .run(schoolId, name, proprietorId, status, now, now)
  return getDb().prepare('SELECT * FROM schools WHERE id = ?').get(schoolId)
}

export function listProprietors({ search = '' }) {
  const db = getDb()
  let sql = `
    SELECT id, username, full_name AS fullName, school_id AS schoolId, created_at AS createdAt, updated_at AS updatedAt
    FROM users
    WHERE role = 'proprietor'
  `
  const params = []
  if (search) {
    sql += ' AND (username LIKE ? OR full_name LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
  }
  sql += ' ORDER BY datetime(created_at) DESC'
  return db.prepare(sql).all(...params)
}

export function createProprietor({ username, fullName, passwordHash, schoolId = null }) {
  const id = randomUUID()
  const now = nowIso()
  getDb()
    .prepare(
      `
      INSERT INTO users (id, username, password_hash, role, school_id, full_name, created_at, updated_at)
      VALUES (?, ?, ?, 'proprietor', ?, ?, ?, ?)
    `,
    )
    .run(id, username, passwordHash, schoolId, fullName, now, now)
  return getDb().prepare('SELECT id, username, full_name AS fullName, school_id AS schoolId FROM users WHERE id = ?').get(id)
}

export function listPricingPlans({ status = '' }) {
  let sql = `
    SELECT id, name, monthly_amount AS monthlyAmount, yearly_amount AS yearlyAmount,
           max_students AS maxStudents, status, created_at AS createdAt, updated_at AS updatedAt
    FROM pricing_plans
    WHERE 1 = 1
  `
  const params = []
  if (status) {
    sql += ' AND status = ?'
    params.push(status)
  }
  sql += ' ORDER BY monthly_amount ASC'
  return getDb().prepare(sql).all(...params)
}

export function upsertPricingPlan({ id = null, name, monthlyAmount, yearlyAmount, maxStudents, status }) {
  const now = nowIso()
  if (id) {
    getDb()
      .prepare(
        `
        UPDATE pricing_plans
        SET name = ?, monthly_amount = ?, yearly_amount = ?, max_students = ?, status = ?, updated_at = ?
        WHERE id = ?
      `,
      )
      .run(name, monthlyAmount, yearlyAmount, maxStudents, status, now, id)
    return getDb().prepare('SELECT * FROM pricing_plans WHERE id = ?').get(id)
  }
  const newId = randomUUID()
  getDb()
    .prepare(
      `
      INSERT INTO pricing_plans (id, name, monthly_amount, yearly_amount, max_students, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(newId, name, monthlyAmount, yearlyAmount, maxStudents, status, now, now)
  return getDb().prepare('SELECT * FROM pricing_plans WHERE id = ?').get(newId)
}

export function listSubscriptions({ schoolId = '', status = '', expiresBefore = '' }) {
  let sql = `
    SELECT sub.id, sub.school_id AS schoolId, s.name AS schoolName, sub.pricing_plan_id AS pricingPlanId,
           p.name AS pricingPlanName, sub.billing_cycle AS billingCycle, sub.amount,
           sub.start_date AS startDate, sub.expiry_date AS expiryDate, sub.status,
           sub.created_at AS createdAt, sub.updated_at AS updatedAt
    FROM subscriptions sub
    JOIN schools s ON s.id = sub.school_id
    JOIN pricing_plans p ON p.id = sub.pricing_plan_id
    WHERE 1 = 1
  `
  const params = []
  if (schoolId) {
    sql += ' AND sub.school_id = ?'
    params.push(schoolId)
  }
  if (status) {
    sql += ' AND sub.status = ?'
    params.push(status)
  }
  if (expiresBefore) {
    sql += ' AND datetime(sub.expiry_date) <= datetime(?)'
    params.push(expiresBefore)
  }
  sql += ' ORDER BY datetime(sub.created_at) DESC'
  return getDb().prepare(sql).all(...params)
}

export function createSubscription({ schoolId, pricingPlanId, billingCycle, amount, startDate, expiryDate, status }) {
  const id = randomUUID()
  const now = nowIso()
  getDb()
    .prepare(
      `
      INSERT INTO subscriptions (
        id, school_id, pricing_plan_id, billing_cycle, amount, start_date, expiry_date, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(id, schoolId, pricingPlanId, billingCycle, amount, startDate, expiryDate, status, now, now)
  return getDb().prepare('SELECT * FROM subscriptions WHERE id = ?').get(id)
}

export function enforceExpiredSubscriptions() {
  const now = nowIso()
  const info = getDb()
    .prepare(
      `
      UPDATE subscriptions
      SET status = 'expired', updated_at = ?
      WHERE datetime(expiry_date) < datetime('now') AND status IN ('active', 'pending')
    `,
    )
    .run(now)
  return { updated: info.changes }
}

export function getExpiringAlerts({ withinDays = 14 }) {
  return getDb()
    .prepare(
      `
      SELECT sub.id, sub.school_id AS schoolId, s.name AS schoolName, sub.expiry_date AS expiryDate, sub.status
      FROM subscriptions sub
      JOIN schools s ON s.id = sub.school_id
      WHERE sub.status IN ('active', 'pending')
        AND datetime(sub.expiry_date) <= datetime('now', '+' || ? || ' days')
      ORDER BY datetime(sub.expiry_date) ASC
    `,
    )
    .all(withinDays)
}

export function createFinancialTransaction({ schoolId, subscriptionId = null, amount, type, status, reference }) {
  const id = randomUUID()
  getDb()
    .prepare(
      `
      INSERT INTO financial_transactions (id, school_id, subscription_id, amount, currency, type, status, reference, created_at)
      VALUES (?, ?, ?, ?, 'NGN', ?, ?, ?, ?)
    `,
    )
    .run(id, schoolId, subscriptionId, amount, type, status, reference, nowIso())
  return getDb().prepare('SELECT * FROM financial_transactions WHERE id = ?').get(id)
}

export function listFinancialTransactions({ schoolId = '', status = '', fromDate = '', toDate = '' }) {
  let sql = `
    SELECT id, school_id AS schoolId, subscription_id AS subscriptionId, amount, currency, type, status, reference, created_at AS createdAt
    FROM financial_transactions
    WHERE 1 = 1
  `
  const params = []
  if (schoolId) {
    sql += ' AND school_id = ?'
    params.push(schoolId)
  }
  if (status) {
    sql += ' AND status = ?'
    params.push(status)
  }
  if (fromDate) {
    sql += ' AND datetime(created_at) >= datetime(?)'
    params.push(fromDate)
  }
  if (toDate) {
    sql += ' AND datetime(created_at) <= datetime(?)'
    params.push(toDate)
  }
  sql += ' ORDER BY datetime(created_at) DESC'
  return getDb().prepare(sql).all(...params)
}

export function listAuditLogs({ schoolId = '', actorUserId = '', action = '', limit = 100 }) {
  let sql = `
    SELECT id, actor_user_id AS actorUserId, actor_role AS actorRole, action, resource_type AS resourceType,
           resource_id AS resourceId, school_id AS schoolId, metadata_json AS metadataJson, created_at AS createdAt
    FROM audit_logs
    WHERE 1 = 1
  `
  const params = []
  if (schoolId) {
    sql += ' AND school_id = ?'
    params.push(schoolId)
  }
  if (actorUserId) {
    sql += ' AND actor_user_id = ?'
    params.push(actorUserId)
  }
  if (action) {
    sql += ' AND action = ?'
    params.push(action)
  }
  sql += ' ORDER BY datetime(created_at) DESC LIMIT ?'
  params.push(limit)
  return getDb().prepare(sql).all(...params)
}

export function globalSearch({ q }) {
  const like = `%${q}%`
  const db = getDb()
  const schools = db
    .prepare('SELECT id AS schoolId, name, status FROM schools WHERE id LIKE ? OR name LIKE ? LIMIT 10')
    .all(like, like)
  const proprietors = db
    .prepare(
      `
      SELECT id, username, full_name AS fullName
      FROM users
      WHERE role = 'proprietor' AND (username LIKE ? OR full_name LIKE ?)
      LIMIT 10
    `,
    )
    .all(like, like)
  const subscriptions = db
    .prepare(
      `
      SELECT id, school_id AS schoolId, status, expiry_date AS expiryDate
      FROM subscriptions
      WHERE id LIKE ? OR school_id LIKE ?
      LIMIT 10
    `,
    )
    .all(like, like)
  return { schools, proprietors, subscriptions }
}

export function exportRowsAsCsv(type, filters) {
  if (type === 'schools') return toCsv(listSchools(filters))
  if (type === 'subscriptions') return toCsv(listSubscriptions(filters))
  if (type === 'financial') return toCsv(listFinancialTransactions(filters))
  throw new Error('Unsupported export type')
}

