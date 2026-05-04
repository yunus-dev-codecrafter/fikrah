import { useEffect, useMemo } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Panel from '../../components/ui/Panel'
import { useAcademicStore } from '../../store/academicStore'
import { useAuthStore } from '../../store/authStore'

function ParentReportCards() {
  const user = useAuthStore((s) => s.user)
  const records = useAcademicStore((s) => s.scoreRecords)
  const fetchScoreRecords = useAcademicStore((s) => s.fetchScoreRecords)
  const loadingScores = useAcademicStore((s) => s.loadingScores)
  const scoresError = useAcademicStore((s) => s.scoresError)

  useEffect(() => {
    if (user?.schoolId) {
      fetchScoreRecords(user.schoolId)
    }
  }, [fetchScoreRecords, user?.schoolId])

  const approvedRecords = useMemo(
    () =>
      records.filter(
        (record) => record.schoolId === user?.schoolId && record.headmasterStatus === 'approved',
      ),
    [records, user?.schoolId],
  )

  return (
    <DashboardLayout title="Parent Report Cards">
      <Panel
        title="Approved Results"
        subtitle="Only headmaster-approved records are visible to parents."
        right={
          <Button onClick={() => window.print()} variant="ghost">
            Print / Download
          </Button>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-[#9A8678]">Report cards are scoped by `schoolId`.</p>
        </div>
        {scoresError ? <p className="mt-2 text-sm text-amber-300">{scoresError}</p> : null}
      </Panel>

      <Panel title="Report Cards">
        <ul className="space-y-3">
          {loadingScores ? (
            <li className="rounded-lg border border-dashed border-[#9A8678] p-3 text-sm text-[#9A8678]">
              Loading approved records...
            </li>
          ) : null}
          {approvedRecords.map((record) => (
            <li key={record.id} className="rounded-lg border border-[#9A8678] bg-[#202940]/60 p-3 text-sm">
              <p className="font-semibold text-[#f3e8df]">
                {record.studentName} - {record.subject}
              </p>
              <p className="text-[#c9b7ab]">
                Total: {record.totalScore}/100 (Grade {record.grade})
              </p>
              <p className="text-[#c9b7ab]">Teacher: {record.teacherComment || 'No comment'}</p>
              <p className="text-[#c9b7ab]">
                Headmaster: {record.headmasterComment || 'Approved without remark'}
              </p>
            </li>
          ))}
          {approvedRecords.length === 0 ? (
            <li className="rounded-lg border border-dashed border-[#9A8678] p-3 text-sm text-[#9A8678]">
              No approved report cards yet.
            </li>
          ) : null}
        </ul>
      </Panel>
    </DashboardLayout>
  )
}

export default ParentReportCards
