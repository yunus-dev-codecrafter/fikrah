import bcrypt from 'bcryptjs'
import {
  createFinancialTransaction,
  createProprietor,
  createSchool,
  createSubscription,
  enforceExpiredSubscriptions,
  exportRowsAsCsv,
  getDashboardAnalytics,
  getExpiringAlerts,
  globalSearch,
  listAuditLogs,
  listFinancialTransactions,
  listPricingPlans,
  listProprietors,
  listSchools,
  listSubscriptions,
  logAudit,
  upsertPricingPlan,
} from '../services/superAdminService.js'
import {
  validateFinancialPayload,
  validatePricingPayload,
  validateProprietorPayload,
  validateSchoolPayload,
  validateSubscriptionPayload,
} from '../validation/superAdminValidation.js'

function fail(res, message, status = 400) {
  return res.status(status).json({ error: message })
}

export function getAnalyticsController(req, res) {
  const summary = getDashboardAnalytics()
  return res.json({ summary })
}

export function listSchoolsController(req, res) {
  return res.json({ records: listSchools(req.query) })
}

export function createSchoolController(req, res) {
  const validated = validateSchoolPayload(req.body)
  if (typeof validated === 'string') return fail(res, validated)
  const record = createSchool(validated)
  logAudit({
    actorUserId: req.user.sub,
    actorRole: req.user.role,
    action: 'school.create',
    resourceType: 'school',
    resourceId: record.id,
    schoolId: record.id,
    metadata: { status: record.status },
  })
  return res.status(201).json({ record })
}

export function listProprietorsController(req, res) {
  return res.json({ records: listProprietors(req.query) })
}

export function createProprietorController(req, res) {
  const validated = validateProprietorPayload(req.body)
  if (typeof validated === 'string') return fail(res, validated)
  const passwordHash = bcrypt.hashSync(validated.password, 10)
  const record = createProprietor({ ...validated, passwordHash })
  logAudit({
    actorUserId: req.user.sub,
    actorRole: req.user.role,
    action: 'proprietor.create',
    resourceType: 'user',
    resourceId: record.id,
    schoolId: record.schoolId,
    metadata: { username: record.username },
  })
  return res.status(201).json({ record })
}

export function listPricingController(_req, res) {
  return res.json({ records: listPricingPlans(_req.query) })
}

export function upsertPricingController(req, res) {
  const validated = validatePricingPayload(req.body)
  if (typeof validated === 'string') return fail(res, validated)
  const record = upsertPricingPlan(validated)
  logAudit({
    actorUserId: req.user.sub,
    actorRole: req.user.role,
    action: validated.id ? 'pricing.update' : 'pricing.create',
    resourceType: 'pricing_plan',
    resourceId: record.id,
    metadata: { name: record.name },
  })
  return res.json({ record })
}

export function listSubscriptionsController(req, res) {
  return res.json({ records: listSubscriptions(req.query) })
}

export function createSubscriptionController(req, res) {
  const validated = validateSubscriptionPayload(req.body)
  if (typeof validated === 'string') return fail(res, validated)
  const record = createSubscription(validated)
  logAudit({
    actorUserId: req.user.sub,
    actorRole: req.user.role,
    action: 'subscription.create',
    resourceType: 'subscription',
    resourceId: record.id,
    schoolId: record.school_id,
    metadata: { status: record.status, expiryDate: record.expiry_date },
  })
  return res.status(201).json({ record })
}

export function enforceSubscriptionsController(req, res) {
  const result = enforceExpiredSubscriptions()
  logAudit({
    actorUserId: req.user.sub,
    actorRole: req.user.role,
    action: 'subscription.enforce_expiry',
    resourceType: 'subscription',
    metadata: result,
  })
  return res.json(result)
}

export function getExpiringAlertsController(req, res) {
  const withinDays = Number(req.query.withinDays || 14)
  return res.json({ records: getExpiringAlerts({ withinDays }) })
}

export function listFinancialController(req, res) {
  return res.json({ records: listFinancialTransactions(req.query) })
}

export function createFinancialController(req, res) {
  const validated = validateFinancialPayload(req.body)
  if (typeof validated === 'string') return fail(res, validated)
  const record = createFinancialTransaction(validated)
  logAudit({
    actorUserId: req.user.sub,
    actorRole: req.user.role,
    action: 'financial.create',
    resourceType: 'financial_transaction',
    resourceId: record.id,
    schoolId: record.school_id,
    metadata: { type: record.type, status: record.status },
  })
  return res.status(201).json({ record })
}

export function listAuditController(req, res) {
  const limit = Number(req.query.limit || 100)
  return res.json({ records: listAuditLogs({ ...req.query, limit }) })
}

export function globalSearchController(req, res) {
  const q = String(req.query.q || '').trim()
  if (!q) return fail(res, 'q is required')
  return res.json(globalSearch({ q }))
}

export function exportController(req, res) {
  const type = String(req.params.type || '').trim()
  const csv = exportRowsAsCsv(type, req.query)
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${type}-export.csv"`)
  return res.send(csv)
}

