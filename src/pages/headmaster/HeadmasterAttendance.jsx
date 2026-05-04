import DashboardLayout from '../../components/layout/DashboardLayout'

function HeadmasterAttendance() {
  return (
    <DashboardLayout title="Headmaster Attendance Monitor">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-base font-semibold text-slate-900">Attendance Monitor (Stage 1)</h2>
        <p className="mt-1 text-sm text-slate-600">
          This page will track class attendance trends and trigger absence alerts in later stages.
        </p>
      </section>
    </DashboardLayout>
  )
}

export default HeadmasterAttendance
