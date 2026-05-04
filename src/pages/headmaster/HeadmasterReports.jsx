import { useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAcademicStore } from '../../store/academicStore'
import { useAuthStore } from '../../store/authStore'

function HeadmasterReports() {
  const user = useAuthStore((s) => s.user)
  const records = useAcademicStore((s) => s.scoreRecords)
  const updateHeadmasterReview = useAcademicStore((s) => s.updateHeadmasterReview)
  const [remarksById, setRemarksById] = useState({})

  const schoolRecords = useMemo(
    () => records.filter((record) => record.schoolId === user?.schoolId),
    [records, user?.schoolId],
  )

  const pendingCount = schoolRecords.filter((item) => item.headmasterStatus === 'pending').length

  const handleReview = (recordId, status) => {
    updateHeadmasterReview({
      id: recordId,
      status,
      headmasterComment: remarksById[recordId] || '',
    })
  }

  return (
    <DashboardLayout title="Headmaster Reports Review">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-base font-semibold text-slate-900">Submitted Report Cards</h2>
        <p className="mt-1 text-sm text-slate-600">
          Pending approvals: <span className="font-semibold">{pendingCount}</span>
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <ul className="space-y-3">
          {schoolRecords.map((record) => (
            <li key={record.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold text-slate-900">
                {record.studentName} - {record.subject}
              </p>
              <p className="text-slate-700">
                CA {record.caScore} + Exam {record.examScore} = {record.totalScore} ({record.grade})
              </p>
              <p className="text-slate-600">Teacher comment: {record.teacherComment || 'No comment'}</p>
              <p className="text-slate-600">Status: {record.headmasterStatus}</p>

              <textarea
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                rows={2}
                placeholder="Headmaster remark"
                value={remarksById[record.id] || record.headmasterComment}
                onChange={(e) =>
                  setRemarksById((prev) => ({
                    ...prev,
                    [record.id]: e.target.value,
                  }))
                }
              />

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleReview(record.id, 'approved')}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReview(record.id, 'rejected')}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
          {schoolRecords.length === 0 ? (
            <li className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
              No report submissions yet from teachers.
            </li>
          ) : null}
        </ul>
      </section>
    </DashboardLayout>
  )
}

export default HeadmasterReports
