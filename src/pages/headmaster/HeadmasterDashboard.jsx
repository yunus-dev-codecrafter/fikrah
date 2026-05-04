import DashboardLayout from '../../components/layout/DashboardLayout'
import KpiCard from '../../components/ui/KpiCard'

function HeadmasterDashboard() {
  return (
    <DashboardLayout title="Headmaster Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Attendance Today" value="91%" hint="School-wide" />
        <KpiCard label="Late Staff" value="4" hint="Morning assembly" />
        <KpiCard label="Discipline Cases" value="2" hint="Open this week" />
        <KpiCard label="Report Cards" value="312" hint="Pending approval" />
      </section>
    </DashboardLayout>
  )
}

export default HeadmasterDashboard
