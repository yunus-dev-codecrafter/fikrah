import { useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
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
  const addScoreRecord = useAcademicStore((s) => s.addScoreRecord)
  const records = useAcademicStore((s) => s.scoreRecords)
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

  const handleSubmit = (e) => {
    e.preventDefault()

    addScoreRecord({
      schoolId: user?.schoolId,
      studentName: form.studentName,
      subject: form.subject,
      caScore: form.caScore,
      examScore: form.examScore,
      teacherComment: form.comment,
    })
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
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-base font-semibold text-slate-900">Score Entry</h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter CA + exam score, add comment, and track headmaster approval.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Student name"
            value={form.studentName}
            onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Subject (e.g. Mathematics)"
            value={form.subject}
            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            type="number"
            min="0"
            max="40"
            placeholder="CA score (0-40)"
            value={form.caScore}
            onChange={(e) => setForm((p) => ({ ...p, caScore: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            type="number"
            min="0"
            max="60"
            placeholder="Exam score (0-60)"
            value={form.examScore}
            onChange={(e) => setForm((p) => ({ ...p, examScore: e.target.value }))}
            required
          />
          <textarea
            className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2"
            rows={3}
            placeholder="Teacher comment"
            value={form.comment}
            onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
          />

          <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
            Total: <span className="font-semibold text-slate-900">{totalScore}</span> / 100
          </div>
          <div className="rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
            Grade: <span className="font-semibold">{grade}</span>
          </div>

          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">
            Save Score
          </button>
        </form>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {gradingBands.map((band) => (
            <div key={band} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {band}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-base font-semibold text-slate-900">Saved Records (Mock)</h2>
        <ul className="mt-3 space-y-2">
          {schoolRecords.map((record) => (
            <li key={record.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold text-slate-900">
                {record.studentName} - {record.subject}
              </p>
              <p className="text-slate-700">
                CA {record.caScore} + Exam {record.examScore} = {record.totalScore} ({record.grade})
              </p>
              <p className="text-slate-600">Comment: {record.teacherComment || 'No comment'}</p>
              <p className="text-slate-600">
                Headmaster: {record.headmasterStatus === 'approved' ? 'Approved' : 'Pending'}
              </p>
            </li>
          ))}
          {schoolRecords.length === 0 ? (
            <li className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
              No score records yet.
            </li>
          ) : null}
        </ul>
      </section>
    </DashboardLayout>
  )
}

export default TeacherScores
