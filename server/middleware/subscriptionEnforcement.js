import { getDb } from '../db.js'

function isActive(sub) {
  if (!sub) return false
  if (sub.status !== 'active') return false
  return new Date(sub.expiry_date).getTime() >= Date.now()
}

export function enforceActiveSubscription(req, res, next) {
  if (req.user?.role === 'super-admin') {
    return next()
  }

  const schoolId = req.user?.schoolId
  if (!schoolId) {
    return res.status(403).json({ error: 'Missing school context' })
  }

  const latest = getDb()
    .prepare(
      `
      SELECT * FROM subscriptions
      WHERE school_id = ?
      ORDER BY datetime(created_at) DESC
      LIMIT 1
    `,
    )
    .get(schoolId)

  if (!isActive(latest)) {
    return res.status(402).json({
      error: 'Subscription inactive or expired. Access blocked.',
      code: 'SUBSCRIPTION_BLOCKED',
    })
  }

  next()
}

