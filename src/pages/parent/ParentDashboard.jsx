import DashboardLayout from '../../components/layout/DashboardLayout'
import KpiCard from '../../components/ui/KpiCard'

function ParentDashboard() {
  return (
    <DashboardLayout title="Parent Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Children Linked" value="2" hint="Primary and secondary" />
        <KpiCard label="Average Score" value="74%" hint="Current term" />
        <KpiCard label="Attendance" value="95%" hint="Combined child attendance" />
        <KpiCard label="Payment Status" value="Pending" hint="Manual tracking enabled" />
      </section>
    </DashboardLayout>
  )
}

export default ParentDashboard
