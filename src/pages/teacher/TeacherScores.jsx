import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Panel from '../../components/ui/Panel'
import StatusBadge from '../../components/ui/StatusBadge'
import { getLetterGrade } from '../../utils/grading'
import { useAcademicStore } from '../../store/academicStore'
import { useAuthStore } from '../../store/authStore'

const gradingBands = [
  '70-100: A',
  '60-69: B',
  '50-59: C',
  '45-49: D',
  '40-44: E',
  'Below 40: F',
]

function TeacherScores() {
  const user = useAuthStore((s) => s.user)
  const saveScoreRecord = useAcademicStore((s) => s.saveScoreRecord)
  const fetchScoreRecords = useAcademicStore((s) => s.fetchScoreRecords)
  const loadingScores = useAcademicStore((s) => s.loadingScores)
  const scoresError = useAcademicStore((s) => s.scoresError)
  const records = useAcademicStore((s) => s.scoreRecords)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    studentName: '',
    subject: '',
    caScore: '',
    examScore: '',
    comment: '',
  })

  const totalScore = useMemo(() => {
    const ca = Number(form.caScore || 0)
    const exam = Number(form.examScore || 0)
    return ca + exam
  }, [form.caScore, form.examScore])

  const grade = useMemo(() => getLetterGrade(totalScore), [totalScore])
  const schoolRecords = useMemo(
    () => records.filter((record) => record.schoolId === user?.schoolId),
    [records, user?.schoolId],
  )

  useEffect(() => {
    if (user?.schoolId) {
      fetchScoreRecords(user.schoolId)
    }
  }, [fetchScoreRecords, user?.schoolId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    const result = await saveScoreRecord({
      schoolId: user?.schoolId,
      studentName: form.studentName,
      subject: form.subject,
      caScore: form.caScore,
      examScore: form.examScore,
      teacherComment: form.comment,
    })

    if (!result.ok) {
      setMessage(result.message || 'Could not save score.')
      return
    }

    setMessage('Score saved and queued for headmaster review.')
    setForm({
      studentName: '',
      subject: '',
      caScore: '',
      examScore: '',
      comment: '',
    })
  }

  return (
    <DashboardLayout title="Teacher Scores">
      <Panel title="Score Entry" subtitle="Continuous assessment + exam grading workflow">
        <p className="mt-1 text-sm text-[#9A8678]">
          Enter CA + exam score, add comment, and track headmaster approval.
        </p>
        {message ? <p className="mt-2 text-sm text-emerald-300">{message}</p> : null}
        {scoresError ? <p className="mt-2 text-sm text-amber-300">{scoresError}</p> : null}

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
            placeholder="Student name"
            value={form.studentName}
            onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
            placeholder="Subject (e.g. Mathematics)"
            value={form.subject}
            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
            type="number"
            min="0"
            max="40"
            placeholder="CA score (0-40)"
            value={form.caScore}
            onChange={(e) => setForm((p) => ({ ...p, caScore: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
            type="number"
            min="0"
            max="60"
            placeholder="Exam score (0-60)"
            value={form.examScore}
            onChange={(e) => setForm((p) => ({ ...p, examScore: e.target.value }))}
            required
          />
          <textarea
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df] sm:col-span-2"
            rows={3}
            placeholder="Teacher comment"
            value={form.comment}
            onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
          />

          <div className="rounded-lg bg-[#202940]/70 px-3 py-2 text-sm text-[#c9b7ab]">
            Total: <span className="font-semibold text-[#f3e8df]">{totalScore}</span> / 100
          </div>
          <div className="rounded-lg bg-[#CAAA98]/20 px-3 py-2 text-sm text-[#f4d2bf]">
            Grade: <span className="font-semibold">{grade}</span>
          </div>

          <Button type="submit" className="sm:col-span-2">
            Save Score
          </Button>
        </form>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {gradingBands.map((band) => (
            <div key={band} className="rounded-lg bg-[#202940]/70 px-3 py-2 text-sm text-[#c9b7ab]">
              {band}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Saved Records" subtitle="Submitted to headmaster review queue">
        <ul className="mt-3 space-y-2">
          {loadingScores ? (
            <li className="rounded-lg border border-dashed border-[#9A8678] p-3 text-sm text-[#9A8678]">
              Loading scores...
            </li>
          ) : null}
          {schoolRecords.map((record) => (
            <li key={record.id} className="rounded-lg border border-[#9A8678] bg-[#202940]/60 p-3 text-sm">
              <p className="font-semibold text-[#f3e8df]">
                {record.studentName} - {record.subject}
              </p>
              <p className="text-[#c9b7ab]">
                CA {record.caScore} + Exam {record.examScore} = {record.totalScore} ({record.grade})
              </p>
              <p className="text-[#c9b7ab]">Comment: {record.teacherComment || 'No comment'}</p>
              <StatusBadge status={record.headmasterStatus} />
            </li>
          ))}
          {schoolRecords.length === 0 ? (
            <li className="rounded-lg border border-dashed border-[#9A8678] p-3 text-sm text-[#9A8678]">
              No score records yet.
            </li>
          ) : null}
        </ul>
      </Panel>
    </DashboardLayout>
  )
}

export default TeacherScores
