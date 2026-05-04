import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import KpiCard from '../../components/ui/KpiCard'
import Panel from '../../components/ui/Panel'
import StatusBadge from '../../components/ui/StatusBadge'
import { staffRecords, students } from '../../services/mockData'
import { useAuthStore } from '../../store/authStore'

function ProprietorDashboard() {
  const user = useAuthStore((s) => s.user)
  const schoolStaff = staffRecords.filter((x) => x.schoolId === user?.schoolId)
  const schoolStudents = students.filter((x) => x.schoolId === user?.schoolId)

  return (
    <DashboardLayout title="Proprietor Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Sections" value="3" hint="Main, Annex, Nursery" />
        <KpiCard label="Staff Members" value={schoolStaff.length} hint="Role-based workforce" />
        <KpiCard label="Classes" value="24" hint="All active classes" />
        <KpiCard label="Students" value={schoolStudents.length} hint="Registered in school scope" />
      </section>

      <Panel title="Staff Management" subtitle="Assign roles and monitor workforce" right={<Button>Add Staff</Button>}>
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'role', label: 'Role' },
            { key: 'schoolId', label: 'schoolId' },
            { key: 'status', label: 'Status' },
          ]}
          rows={schoolStaff.map((item) => ({ ...item, status: <StatusBadge status={item.status} /> }))}
          emptyText="No staff records found."
        />
      </Panel>
    </DashboardLayout>
  )
}

export default ProprietorDashboard
