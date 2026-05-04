import { useMemo } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAcademicStore } from '../../store/academicStore'
import { useAuthStore } from '../../store/authStore'

function ParentReportCards() {
  const user = useAuthStore((s) => s.user)
  const records = useAcademicStore((s) => s.scoreRecords)

  const approvedRecords = useMemo(
    () =>
      records.filter(
        (record) => record.schoolId === user?.schoolId && record.headmasterStatus === 'approved',
      ),
    [records, user?.schoolId],
  )

  return (
    <DashboardLayout title="Parent Report Cards">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Approved Results</h2>
            <p className="mt-1 text-sm text-slate-600">
              Only headmaster-approved records are visible to parents.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            Print / Download
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <ul className="space-y-3">
          {approvedRecords.map((record) => (
            <li key={record.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold text-slate-900">
                {record.studentName} - {record.subject}
              </p>
              <p className="text-slate-700">
                Total: {record.totalScore}/100 (Grade {record.grade})
              </p>
              <p className="text-slate-600">Teacher: {record.teacherComment || 'No comment'}</p>
              <p className="text-slate-600">
                Headmaster: {record.headmasterComment || 'Approved without remark'}
              </p>
            </li>
          ))}
          {approvedRecords.length === 0 ? (
            <li className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
              No approved report cards yet.
            </li>
          ) : null}
        </ul>
      </section>
    </DashboardLayout>
  )
}

export default ParentReportCards
