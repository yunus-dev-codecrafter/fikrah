import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { getDb } from '../db.js'
import { signToken, authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/login', (req, res) => {
  const username = String(req.body?.username || '').trim().toLowerCase()
  const password = String(req.body?.password || '')

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' })
  }

  const row = getDb().prepare('SELECT * FROM users WHERE username = ?').get(username)
  if (!row) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  if (!bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const user = {
    id: row.id,
    role: row.role,
    schoolId: row.school_id,
    fullName: row.full_name,
    username: row.username,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  const token = signToken({
    sub: row.id,
    role: row.role,
    schoolId: row.school_id,
    fullName: row.full_name,
    username: row.username,
  })

  res.json({ token, user })
})

router.get('/me', authMiddleware, (req, res) => {
  const { sub, role, schoolId, fullName, username } = req.user
  res.json({
    user: {
      id: sub,
      role,
      schoolId: schoolId ?? null,
      fullName,
      username,
    },
  })
})

export default router
