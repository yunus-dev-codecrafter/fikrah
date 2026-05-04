import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/ui/DataTable'
import KpiCard from '../../components/ui/KpiCard'
import Panel from '../../components/ui/Panel'
import StatusBadge from '../../components/ui/StatusBadge'
import { schools, subscriptions } from '../../services/mockData'

function SuperAdminDashboard() {
  const state = schools.length ? 'ready' : 'empty'

  return (
    <DashboardLayout title="Super Admin Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Schools" value={schools.length} hint="All registered schools" />
        <KpiCard label="Active Subscriptions" value={subscriptions.filter((x) => x.status === 'active').length} hint="Subscription control center" />
        <KpiCard label="Revenue (manual)" value="₦12.4M" hint="System-wide tracking" />
        <KpiCard label="Total Users" value="8,942" hint="Student and staff footprint" />
      </section>
      <Panel title="Schools Overview" subtitle="Multi-tenant school visibility and proprietor mapping">
        <DataTable
          columns={[
            { key: 'name', label: 'School' },
            { key: 'proprietor', label: 'Proprietor' },
            { key: 'schoolId', label: 'schoolId' },
            { key: 'status', label: 'Status' },
          ]}
          rows={state === 'ready' ? schools.map((item) => ({ ...item, status: <StatusBadge status={item.status} /> })) : []}
          emptyText="No schools available."
        />
      </Panel>
    </DashboardLayout>
  )
}

export default SuperAdminDashboard
