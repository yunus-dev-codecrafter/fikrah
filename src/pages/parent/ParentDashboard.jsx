import DashboardLayout from '../../components/layout/DashboardLayout'
import KpiCard from '../../components/ui/KpiCard'
import Panel from '../../components/ui/Panel'
import { students } from '../../services/mockData'
import { useAuthStore } from '../../store/authStore'

function ParentDashboard() {
  const user = useAuthStore((s) => s.user)
  const linkedChildren = students.filter((x) => x.schoolId === user?.schoolId)

  return (
    <DashboardLayout title="Parent Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Children Linked" value={linkedChildren.length} hint="Parent account mapping" />
        <KpiCard label="Average Score" value="74%" hint="Current term" />
        <KpiCard label="Attendance" value="95%" hint="Combined child attendance" />
        <KpiCard label="Payment Status" value="Pending" hint="Manual tracking enabled" />
      </section>
      <Panel title="Child Overview" subtitle="Academic and attendance quick visibility">
        <ul className="space-y-2 text-sm">
          {linkedChildren.map((child) => (
            <li key={child.id} className="rounded-lg border border-[#9A8678] bg-[#202940]/60 p-3">
              <p className="font-semibold text-[#f3e8df]">{child.name}</p>
              <p className="text-[#c9b7ab]">{child.className}</p>
              <p className="text-xs text-[#9A8678]">schoolId: {child.schoolId}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </DashboardLayout>
  )
}

export default ParentDashboard
