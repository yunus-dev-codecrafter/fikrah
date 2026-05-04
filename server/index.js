import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initDb } from './db.js'
import authRoutes from './routes/auth.js'
import attendanceRoutes from './routes/attendance.js'
import scoresRoutes from './routes/scores.js'

initDb()

const app = express()
const PORT = Number(process.env.PORT || 3001)

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'fikrah-api', stage: 2 })
})

app.use('/api/auth', authRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/scores', scoresRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Fikrah API listening on http://localhost:${PORT}`)
  console.log(`Demo login password: ${process.env.DEMO_PASSWORD || 'demo'}`)
})
