import DashboardLayout from '../../components/layout/DashboardLayout'
import KpiCard from '../../components/ui/KpiCard'
import Panel from '../../components/ui/Panel'
import { useAuthStore } from '../../store/authStore'

function TeacherDashboard() {
  const user = useAuthStore((s) => s.user)
  const status = typeof navigator !== 'undefined' && navigator.onLine ? 'Online' : 'Offline'
  const assignedItems = [
    { id: 'C-01', schoolId: user?.schoolId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), className: 'JSS 1A', subject: 'Mathematics' },
    { id: 'C-02', schoolId: user?.schoolId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), className: 'SS 1', subject: 'Further Mathematics' },
  ]

  return (
    <DashboardLayout title="Teacher Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Assigned Classes" value="2" hint="Form + subject classes" />
        <KpiCard label="Attendance Marked" value="3/4" hint="Today" />
        <KpiCard label="Scores Entered" value="68" hint="Continuous assessment" />
        <KpiCard label="Sync Status" value={status} hint="Offline queue enabled" />
      </section>
      <Panel title="Assigned Classes & Subjects" subtitle="Backend-ready assignment board">
        <ul className="space-y-2">
          {assignedItems.map((item) => (
            <li key={item.id} className="rounded-lg border border-[#9A8678] bg-[#202940]/60 p-3 text-sm">
              <p className="font-semibold text-[#f3e8df]">{item.className}</p>
              <p className="text-[#c9b7ab]">{item.subject}</p>
              <p className="text-xs text-[#9A8678]">schoolId: {item.schoolId}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </DashboardLayout>
  )
}

export default TeacherDashboard
