import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/ui/DataTable'
import KpiCard from '../../components/ui/KpiCard'
import Panel from '../../components/ui/Panel'
import StatusBadge from '../../components/ui/StatusBadge'
import { schools, subscriptions } from '../../services/mockData'
import { isBackendApiEnabled } from '../../services/apiConfig'
import { fetchExpiringAlerts, fetchSuperAdminSchools, fetchSuperAdminSummary } from '../../services/superAdminApi'

function SuperAdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [schoolRows, setSchoolRows] = useState([])
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!isBackendApiEnabled()) return
      try {
        const [summaryRes, schoolsRes, alertsRes] = await Promise.all([
          fetchSuperAdminSummary(),
          fetchSuperAdminSchools(),
          fetchExpiringAlerts(),
        ])
        if (cancelled) return
        setSummary(summaryRes.summary)
        setSchoolRows(schoolsRes.records || [])
        setAlerts(alertsRes.records || [])
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Could not load super-admin data.')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const useBackend = isBackendApiEnabled()
  const effectiveSchools = useBackend ? schoolRows : schools
  const state = effectiveSchools.length ? 'ready' : 'empty'
  const activeSubscriptions = useBackend
    ? Number(summary?.activeSubscriptions || 0)
    : subscriptions.filter((x) => x.status === 'active').length
  const totalSchools = useBackend ? Number(summary?.totalSchools || 0) : schools.length
  const revenue = useBackend ? `₦${Number(summary?.totalRevenue || 0).toLocaleString()}` : '₦12.4M'
  const expiringCount = useBackend ? Number(summary?.expiringSoon || 0) : 0
  const tableRows = useMemo(
    () =>
      effectiveSchools.map((item) => ({
        ...item,
        proprietor: item.proprietorName || item.proprietor || 'Unassigned',
        schoolId: item.schoolId || item.id,
        status: <StatusBadge status={item.status} />,
      })),
    [effectiveSchools],
  )

  return (
    <DashboardLayout title="Super Admin Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Schools" value={totalSchools} hint="All registered schools" />
        <KpiCard label="Active Subscriptions" value={activeSubscriptions} hint="Subscription control center" />
        <KpiCard label="Revenue" value={revenue} hint="System-wide tracking" />
        <KpiCard label="Expiring Soon" value={expiringCount} hint="Subscriptions due in 14 days" />
      </section>
      {error ? <p className="mt-3 text-sm text-amber-300">{error}</p> : null}
      <Panel title="Schools Overview" subtitle="Multi-tenant school visibility and proprietor mapping">
        <DataTable
          columns={[
            { key: 'name', label: 'School' },
            { key: 'proprietor', label: 'Proprietor' },
            { key: 'schoolId', label: 'schoolId' },
            { key: 'status', label: 'Status' },
          ]}
          rows={state === 'ready' ? tableRows : []}
          emptyText="No schools available."
        />
      </Panel>
      <Panel title="Expiring Alerts" subtitle="Subscriptions requiring renewal follow-up">
        <ul className="space-y-2 text-sm">
          {alerts.map((alert) => (
            <li key={alert.id} className="rounded-lg border border-[#9A8678] bg-[#202940]/60 p-3">
              {alert.schoolId} - {alert.schoolName} expires {new Date(alert.expiryDate).toLocaleDateString()}
            </li>
          ))}
          {alerts.length === 0 ? (
            <li className="rounded-lg border border-dashed border-[#9A8678] p-3 text-[#9A8678]">
              No expiring subscription alerts.
            </li>
          ) : null}
        </ul>
      </Panel>
    </DashboardLayout>
  )
}

export default SuperAdminDashboard
