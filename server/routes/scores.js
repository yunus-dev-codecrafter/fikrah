import { Router } from 'express'
import { randomUUID } from 'crypto'
import { getDb } from '../db.js'
import { authMiddleware, assertSchoolAccess, requireRoles } from '../middleware/auth.js'
import { enforceActiveSubscription } from '../middleware/subscriptionEnforcement.js'

const router = Router()

function letterGrade(total) {
  if (total >= 70) return 'A'
  if (total >= 60) return 'B'
  if (total >= 50) return 'C'
  if (total >= 45) return 'D'
  if (total >= 40) return 'E'
  return 'F'
}

router.use(authMiddleware)
router.use(enforceActiveSubscription)

router.post('/', requireRoles('teacher', 'headmaster', 'super-admin'), (req, res) => {
  const schoolId = req.body?.schoolId
  if (!schoolId || typeof schoolId !== 'string') {
    return res.status(400).json({ error: 'schoolId required' })
  }
  if (!assertSchoolAccess(req, schoolId)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const studentName = String(req.body?.studentName || '').trim()
  const subject = String(req.body?.subject || '').trim()
  const caScore = Number(req.body?.caScore)
  const examScore = Number(req.body?.examScore)
  const teacherComment = String(req.body?.teacherComment || '').trim()

  if (!studentName || !subject || Number.isNaN(caScore) || Number.isNaN(examScore)) {
    return res.status(400).json({ error: 'studentName, subject, caScore, examScore required' })
  }

  const totalScore = caScore + examScore
  const grade = letterGrade(totalScore)
  const now = new Date().toISOString()
  const id = randomUUID()

  getDb()
    .prepare(
      `
      INSERT INTO scores (
        id, school_id, student_name, subject, ca_score, exam_score, total_score, grade,
        teacher_comment, headmaster_status, headmaster_comment, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', '', ?, ?)
    `,
    )
    .run(id, schoolId, studentName, subject, caScore, examScore, totalScore, grade, teacherComment, now, now)

  const row = getDb().prepare('SELECT * FROM scores WHERE id = ?').get(id)
  res.status(201).json({ record: mapScoreRow(row) })
})

router.get('/', requireRoles('teacher', 'headmaster', 'proprietor', 'parent', 'super-admin'), (req, res) => {
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
      SELECT * FROM scores WHERE school_id = ?
      ORDER BY datetime(updated_at) DESC
      LIMIT 500
    `,
    )
    .all(schoolId)

  res.json({ records: rows.map(mapScoreRow) })
})

router.patch('/:id/review', requireRoles('headmaster', 'super-admin'), (req, res) => {
  const id = req.params.id
  const status = req.body?.status
  const headmasterComment = String(req.body?.headmasterComment || '').trim()

  if (status !== 'approved' && status !== 'rejected' && status !== 'pending') {
    return res.status(400).json({ error: 'status must be approved, rejected, or pending' })
  }

  const row = getDb().prepare('SELECT * FROM scores WHERE id = ?').get(id)
  if (!row) {
    return res.status(404).json({ error: 'Not found' })
  }
  if (!assertSchoolAccess(req, row.school_id)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const now = new Date().toISOString()
  getDb()
    .prepare(
      `
      UPDATE scores
      SET headmaster_status = ?, headmaster_comment = ?, updated_at = ?
      WHERE id = ?
    `,
    )
    .run(status, headmasterComment, now, id)

  const updated = getDb().prepare('SELECT * FROM scores WHERE id = ?').get(id)
  res.json({ record: mapScoreRow(updated) })
})

function mapScoreRow(row) {
  if (!row) return null
  return {
    id: row.id,
    schoolId: row.school_id,
    studentName: row.student_name,
    subject: row.subject,
    caScore: row.ca_score,
    examScore: row.exam_score,
    totalScore: row.total_score,
    grade: row.grade,
    teacherComment: row.teacher_comment,
    headmasterStatus: row.headmaster_status,
    headmasterComment: row.headmaster_comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export default router
