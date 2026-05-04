import { useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Panel from '../../components/ui/Panel'
import StatusBadge from '../../components/ui/StatusBadge'
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
      <Panel title="Submitted Report Cards" subtitle="Approve, reject, and annotate teacher submissions">
        <p className="mt-1 text-sm text-[#9A8678]">
          Pending approvals: <span className="font-semibold">{pendingCount}</span>
        </p>
      </Panel>

      <Panel title="Review Queue">
        <ul className="space-y-3">
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
