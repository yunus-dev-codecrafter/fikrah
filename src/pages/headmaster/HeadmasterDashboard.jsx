import DashboardLayout from '../../components/layout/DashboardLayout'
import KpiCard from '../../components/ui/KpiCard'
import Panel from '../../components/ui/Panel'
import ViewState from '../../components/ui/ViewState'

function HeadmasterDashboard() {
  const risks = [
    { id: 'R1', message: '3 students absent for 3+ consecutive days', priority: 'High' },
    { id: 'R2', message: 'JSS 2B Mathematics average dropped by 11%', priority: 'Medium' },
  ]
  const viewState = risks.length ? 'ready' : 'empty'

  return (
    <DashboardLayout title="Headmaster Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Attendance Today" value="91%" hint="School-wide" />
        <KpiCard label="Late Staff" value="4" hint="Morning assembly" />
        <KpiCard label="Discipline Cases" value="2" hint="Open this week" />
        <KpiCard label="Report Cards" value="312" hint="Pending approval" />
      </section>
      <Panel title="AI-Ready Risk Suggestions" subtitle="Early warning insights for student and class performance">
        {viewState !== 'ready' ? (
          <ViewState state={viewState} emptyText="No risk signals detected." />
        ) : (
          <ul className="space-y-2 text-sm text-[#f3e8df]">
            {risks.map((risk) => (
              <li key={risk.id} className="rounded-lg border border-[#9A8678] bg-[#202940]/60 p-3">
                <p className="font-semibold">{risk.priority} Priority</p>
                <p className="text-[#c9b7ab]">{risk.message}</p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </DashboardLayout>
  )
}

export default HeadmasterDashboard
