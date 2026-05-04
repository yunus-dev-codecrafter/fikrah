import DashboardLayout from '../../components/layout/DashboardLayout'
import KpiCard from '../../components/ui/KpiCard'

function TeacherDashboard() {
  const status = typeof navigator !== 'undefined' && navigator.onLine ? 'Online' : 'Offline'

  return (
    <DashboardLayout title="Teacher Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Assigned Classes" value="2" hint="Form + subject classes" />
        <KpiCard label="Attendance Marked" value="3/4" hint="Today" />
        <KpiCard label="Scores Entered" value="68" hint="Continuous assessment" />
        <KpiCard label="Sync Status" value={status} hint="Offline queue enabled" />
      </section>
    </DashboardLayout>
  )
}

export default TeacherDashboard
