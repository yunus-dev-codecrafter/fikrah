import DashboardLayout from '../../components/layout/DashboardLayout'
import KpiCard from '../../components/ui/KpiCard'

function ProprietorDashboard() {
  return (
    <DashboardLayout title="Proprietor Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Sections" value="3" hint="Main, Annex, Nursery" />
        <KpiCard label="Teachers" value="57" hint="Including part-time" />
        <KpiCard label="Classes" value="24" hint="All active classes" />
        <KpiCard label="Pending Reports" value="7" hint="Awaiting review" />
      </section>
    </DashboardLayout>
  )
}

export default ProprietorDashboard
