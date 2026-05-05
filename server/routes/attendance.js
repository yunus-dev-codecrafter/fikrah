import { Router } from 'express'
import { randomUUID } from 'crypto'
import { getDb } from '../db.js'
import { authMiddleware, assertSchoolAccess, requireRoles } from '../middleware/auth.js'
import { enforceActiveSubscription } from '../middleware/subscriptionEnforcement.js'

const router = Router()

router.use(authMiddleware)
router.use(enforceActiveSubscription)

/** Batch upload from offline queue (teachers). */
router.post(
  '/batch',
  requireRoles('teacher', 'headmaster', 'proprietor', 'super-admin'),
  (req, res) => {
    const records = req.body?.records
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'records array required' })
    }

    const db = getDb()
    const insert = db.prepare(`
      INSERT INTO attendance (
        id, school_id, teacher, class_name, date, present_count, absent_count,
        client_queue_id, queued_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    let inserted = 0
    let skipped = 0

    const run = db.transaction(() => {
      for (const raw of records) {
        const schoolId = raw.schoolId
        if (!schoolId || !assertSchoolAccess(req, schoolId)) {
          skipped += 1
          continue
        }

        const teacher = String(raw.teacher || '').trim()
        const className = String(raw.className || '').trim()
        const date = String(raw.date || '').trim()
        const presentCount = Number(raw.presentCount)
        const absentCount = Number(raw.absentCount)

        if (!teacher || !className || !date || Number.isNaN(presentCount) || Number.isNaN(absentCount)) {
          skipped += 1
          continue
        }

        const clientQueueId =
          raw.clientQueueId !== undefined && raw.clientQueueId !== null
            ? Number(raw.clientQueueId)
            : null
        const queuedAt =
          typeof raw.queuedAt === 'string' ? raw.queuedAt : new Date().toISOString()
        const createdAt = new Date().toISOString()

        try {
          insert.run(
            randomUUID(),
            schoolId,
            teacher,
            className,
            date,
            presentCount,
            absentCount,
            clientQueueId,
            queuedAt,
            createdAt,
          )
          inserted += 1
        } catch (e) {
          if (e?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            skipped += 1
          } else {
            throw e
          }
        }
      }
    })

    try {
      run()
    } catch (e) {
      return res.status(500).json({ error: 'Failed to persist attendance', detail: String(e.message) })
    }

    res.json({ inserted, skipped })
  },
)

router.get('/', requireRoles('teacher', 'headmaster', 'proprietor', 'super-admin'), (req, res) => {
  const schoolId = req.query.schoolId
  if (!schoolId || typeof schoolId !== 'string') {
    return res.status(400).json({ error: 'schoolId query required' })
  }
  if (!assertSchoolAccess(req, schoolId)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const rows = getDb()
    .prepare(
      `
      SELECT id, school_id AS schoolId, teacher, class_name AS className, date,
             present_count AS presentCount, absent_count AS absentCount,
             client_queue_id AS clientQueueId, queued_at AS queuedAt, created_at AS createdAt
      FROM attendance
      WHERE school_id = ?
      ORDER BY datetime(created_at) DESC
      LIMIT 500
    `,
    )
    .all(schoolId)

  res.json({ records: rows })
})

export default router
