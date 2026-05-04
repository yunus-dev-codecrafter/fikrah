import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fikrah-dev-secret-change-in-production'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' })
  }
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}

/** Super-admin can access any school; others must match schoolId on the token. */
export function assertSchoolAccess(req, schoolId) {
  if (!schoolId) return false
  if (req.user.role === 'super-admin') return true
  return req.user.schoolId === schoolId
}
