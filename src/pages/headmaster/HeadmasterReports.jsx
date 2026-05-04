import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Panel from '../../components/ui/Panel'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAcademicStore } from '../../store/academicStore'
import { useAuthStore } from '../../store/authStore'

function HeadmasterReports() {
  const user = useAuthStore((s) => s.user)
  const records = useAcademicStore((s) => s.scoreRecords)
  const submitHeadmasterReview = useAcademicStore((s) => s.submitHeadmasterReview)
  const fetchScoreRecords = useAcademicStore((s) => s.fetchScoreRecords)
  const loadingScores = useAcademicStore((s) => s.loadingScores)
  const scoresError = useAcademicStore((s) => s.scoresError)
  const [remarksById, setRemarksById] = useState({})
  const [message, setMessage] = useState('')

  const schoolRecords = useMemo(
    () => records.filter((record) => record.schoolId === user?.schoolId),
    [records, user?.schoolId],
  )

  const pendingCount = schoolRecords.filter((item) => item.headmasterStatus === 'pending').length

  useEffect(() => {
    if (user?.schoolId) {
      fetchScoreRecords(user.schoolId)
    }
  }, [fetchScoreRecords, user?.schoolId])

  const handleReview = async (recordId, status) => {
    setMessage('')
    const result = await submitHeadmasterReview({
      id: recordId,
      status,
      headmasterComment: remarksById[recordId] || '',
    })
    setMessage(
      result.ok
        ? `Record ${status}.`
        : (result.message || 'Could not submit review.'),
    )
  }

  return (
    <DashboardLayout title="Headmaster Reports Review">
      <Panel title="Submitted Report Cards" subtitle="Approve, reject, and annotate teacher submissions">
        <p className="mt-1 text-sm text-[#9A8678]">
          Pending approvals: <span className="font-semibold">{pendingCount}</span>
        </p>
        {message ? <p className="mt-2 text-sm text-emerald-300">{message}</p> : null}
        {scoresError ? <p className="mt-2 text-sm text-amber-300">{scoresError}</p> : null}
      </Panel>

      <Panel title="Review Queue">
        <ul className="space-y-3">
          {loadingScores ? (
            <li className="rounded-lg border border-dashed border-[#9A8678] p-3 text-sm text-[#9A8678]">
              Loading score submissions...
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
              <p className="text-[#c9b7ab]">Teacher comment: {record.teacherComment || 'No comment'}</p>
              <StatusBadge status={record.headmasterStatus} />

              <textarea
                className="mt-2 w-full rounded-lg border border-[#9A8678] bg-[#202940]/50 px-3 py-2 text-[#f3e8df]"
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
                <Button onClick={() => handleReview(record.id, 'approved')} className="text-xs">
                  Approve
                </Button>
                <Button onClick={() => handleReview(record.id, 'rejected')} variant="ghost" className="text-xs">
                  Reject
                </Button>
              </div>
            </li>
          ))}
          {schoolRecords.length === 0 ? (
            <li className="rounded-lg border border-dashed border-[#9A8678] p-3 text-sm text-[#9A8678]">
              No report submissions yet from teachers.
            </li>
          ) : null}
        </ul>
      </Panel>
    </DashboardLayout>
  )
}

export default HeadmasterReports
