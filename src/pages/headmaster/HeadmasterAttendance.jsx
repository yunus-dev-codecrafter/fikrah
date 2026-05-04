import DashboardLayout from '../../components/layout/DashboardLayout'
import Panel from '../../components/ui/Panel'
import ViewState from '../../components/ui/ViewState'

function HeadmasterAttendance() {
  const state = 'ready'
  const trends = [
    { id: 'AT-1', schoolId: 'SCH-001', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), className: 'JSS 1A', attendanceRate: '92%' },
    { id: 'AT-2', schoolId: 'SCH-001', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), className: 'Primary 5', attendanceRate: '88%' },
  ]

  return (
    <DashboardLayout title="Headmaster Attendance Monitor">
      <Panel title="Attendance Monitor" subtitle="Track punctuality, absenteeism, and class attendance anomalies">
        {state !== 'ready' ? (
          <ViewState state={state} loadingText="Loading attendance analytics..." />
        ) : (
          <ul className="space-y-2 text-sm">
            {trends.map((item) => (
              <li key={item.id} className="rounded-lg border border-[#9A8678] bg-[#202940]/60 p-3">
                <p className="font-semibold text-[#f3e8df]">{item.className}</p>
                <p className="text-[#c9b7ab]">Attendance: {item.attendanceRate}</p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </DashboardLayout>
  )
}

export default HeadmasterAttendance
