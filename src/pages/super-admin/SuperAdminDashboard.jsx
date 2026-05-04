import DashboardLayout from '../../components/layout/DashboardLayout'
import KpiCard from '../../components/ui/KpiCard'

function SuperAdminDashboard() {
  return (
    <DashboardLayout title="Super Admin Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Schools" value="42" hint="Across all regions" />
        <KpiCard label="Active Subscriptions" value="36" hint="6 expired this term" />
        <KpiCard label="Revenue (manual)" value="₦12.4M" hint="This academic year" />
        <KpiCard label="Total Users" value="8,942" hint="Students + Staff + Parents" />
      </section>
    </DashboardLayout>
  )
}

export default SuperAdminDashboard
