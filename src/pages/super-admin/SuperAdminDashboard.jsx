import { useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import KpiCard from '../../components/ui/KpiCard'
import Panel from '../../components/ui/Panel'
import StatusBadge from '../../components/ui/StatusBadge'
import { schools, subscriptions } from '../../services/mockData'

function SuperAdminDashboard() {
  const [schoolsState, setSchoolsState] = useState(() =>
    schools.map((item) => ({
      id: item.schoolId || item.id,
      schoolId: item.schoolId || item.id,
      name: item.name,
      proprietor: item.proprietor || '',
      status: item.status,
    })),
  )
  const [subscriptionsState, setSubscriptionsState] = useState(() => [...subscriptions])
  const [proprietorsState, setProprietorsState] = useState(() =>
    schools.map((item, idx) => ({
      id: `PROP-${idx + 1}`,
      fullName: item.proprietor,
      schoolId: item.schoolId || item.id,
      status: idx === 0 ? 'active' : 'pending',
    })),
  )
  const [schoolForm, setSchoolForm] = useState({ schoolId: '', name: '', proprietor: '' })
  const [editingSchoolId, setEditingSchoolId] = useState(null)
  const [proprietorForm, setProprietorForm] = useState({ fullName: '', schoolId: '' })
  const [editingProprietorId, setEditingProprietorId] = useState(null)
  const [subscriptionForm, setSubscriptionForm] = useState({
    schoolId: '',
    plan: '',
    expiryDate: '',
  })
  const [editingSubscriptionId, setEditingSubscriptionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [nowMs] = useState(() => Date.now())

  const fakeRequest = async (handler, successText) => {
    setLoading(true)
    setError('')
    setMessage('')
    await new Promise((resolve) => setTimeout(resolve, 500))
    try {
      handler()
      setMessage(successText)
    } catch (err) {
      setError(err?.message || 'Action failed.')
    } finally {
      setLoading(false)
    }
  }

  const totalSchools = schoolsState.length
  const activeSubscriptions = subscriptionsState.filter((x) => x.status === 'active').length
  const revenue = `₦${(activeSubscriptions * 250000).toLocaleString()}`
  const expiringCount = subscriptionsState.filter((sub) => {
    const msLeft = new Date(sub.expiryDate).getTime() - nowMs
    return msLeft > 0 && msLeft <= 1000 * 60 * 60 * 24 * 14
  }).length

  const alerts = useMemo(
    () =>
      subscriptionsState
        .filter((sub) => {
          const msLeft = new Date(sub.expiryDate).getTime() - nowMs
          return msLeft > 0 && msLeft <= 1000 * 60 * 60 * 24 * 14
        })
        .map((sub) => ({
          id: sub.id,
          schoolId: sub.schoolId,
          schoolName: schoolsState.find((x) => x.schoolId === sub.schoolId)?.name || 'Unknown school',
          expiryDate: sub.expiryDate,
        })),
    [nowMs, schoolsState, subscriptionsState],
  )

  const schoolTableRows = useMemo(
    () =>
      schoolsState.map((item) => ({
        ...item,
        status: <StatusBadge status={item.status} />,
        actions: (
          <div className="flex gap-2">
            <Button
              className="px-3 py-1 text-xs"
              onClick={() => {
                setEditingSchoolId(item.id)
                setSchoolForm({
                  schoolId: item.schoolId,
                  name: item.name,
                  proprietor: item.proprietor,
                })
              }}
            >
              Edit
            </Button>
            <Button
              className="px-3 py-1 text-xs"
              variant="danger"
              onClick={() =>
                fakeRequest(() => {
                  setSchoolsState((prev) => prev.filter((x) => x.id !== item.id))
                  setSubscriptionsState((prev) => prev.filter((x) => x.schoolId !== item.schoolId))
                }, 'School deleted.')
              }
            >
              Delete
            </Button>
            <Button
              className="px-3 py-1 text-xs"
              variant="ghost"
              onClick={() =>
                fakeRequest(() => {
                  setSchoolsState((prev) =>
                    prev.map((x) =>
                      x.id === item.id
                        ? { ...x, status: x.status === 'active' ? 'suspended' : 'active' }
                        : x,
                    ),
                  )
                }, `School ${item.status === 'active' ? 'deactivated' : 'activated'}.`)
              }
            >
              {item.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        ),
      })),
    [schoolsState],
  )

  const proprietorTableRows = useMemo(
    () =>
      proprietorsState.map((item) => ({
        ...item,
        status: <StatusBadge status={item.status} />,
        actions: (
          <div className="flex gap-2">
            <Button
              className="px-3 py-1 text-xs"
              onClick={() => {
                setEditingProprietorId(item.id)
                setProprietorForm({ fullName: item.fullName, schoolId: item.schoolId })
              }}
            >
              Edit
            </Button>
            <Button
              className="px-3 py-1 text-xs"
              variant="danger"
              onClick={() =>
                fakeRequest(() => {
                  setProprietorsState((prev) => prev.filter((x) => x.id !== item.id))
                }, 'Proprietor deleted.')
              }
            >
              Delete
            </Button>
            <Button
              className="px-3 py-1 text-xs"
              variant="ghost"
              onClick={() =>
                fakeRequest(() => {
                  setProprietorsState((prev) =>
                    prev.map((x) =>
                      x.id === item.id
                        ? { ...x, status: x.status === 'active' ? 'suspended' : 'active' }
                        : x,
                    ),
                  )
                }, `Proprietor ${item.status === 'active' ? 'deactivated' : 'activated'}.`)
              }
            >
              {item.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        ),
      })),
    [proprietorsState],
  )

  const subscriptionTableRows = useMemo(
    () =>
      subscriptionsState.map((item) => ({
        ...item,
        status: <StatusBadge status={item.status} />,
        actions: (
          <div className="flex gap-2">
            <Button
              className="px-3 py-1 text-xs"
              onClick={() => {
                setEditingSubscriptionId(item.id)
                setSubscriptionForm({
                  schoolId: item.schoolId,
                  plan: item.plan,
                  expiryDate: item.expiryDate,
                })
              }}
            >
              Edit
            </Button>
            <Button
              className="px-3 py-1 text-xs"
              variant="danger"
              onClick={() =>
                fakeRequest(() => {
                  setSubscriptionsState((prev) => prev.filter((x) => x.id !== item.id))
                }, 'Subscription deleted.')
              }
            >
              Delete
            </Button>
            <Button
              className="px-3 py-1 text-xs"
              variant="ghost"
              onClick={() =>
                fakeRequest(() => {
                  setSubscriptionsState((prev) =>
                    prev.map((x) =>
                      x.id === item.id
                        ? { ...x, status: x.status === 'active' ? 'blocked' : 'active' }
                        : x,
                    ),
                  )
                }, `Subscription ${item.status === 'active' ? 'deactivated' : 'activated'}.`)
              }
            >
              {item.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        ),
      })),
    [subscriptionsState],
  )

  const onSubmitSchool = (e) => {
    e.preventDefault()
    if (!schoolForm.schoolId || !schoolForm.name) {
      setError('School ID and name are required.')
      return
    }
    fakeRequest(() => {
      if (editingSchoolId) {
        setSchoolsState((prev) =>
          prev.map((x) => (x.id === editingSchoolId ? { ...x, ...schoolForm } : x)),
        )
      } else {
        setSchoolsState((prev) => [...prev, { ...schoolForm, id: schoolForm.schoolId, status: 'active' }])
      }
      setEditingSchoolId(null)
      setSchoolForm({ schoolId: '', name: '', proprietor: '' })
    }, editingSchoolId ? 'School updated.' : 'School added.')
  }

  const onSubmitProprietor = (e) => {
    e.preventDefault()
    if (!proprietorForm.fullName || !proprietorForm.schoolId) {
      setError('Proprietor name and school ID are required.')
      return
    }
    fakeRequest(() => {
      if (editingProprietorId) {
        setProprietorsState((prev) =>
          prev.map((x) => (x.id === editingProprietorId ? { ...x, ...proprietorForm } : x)),
        )
      } else {
        setProprietorsState((prev) => [
          ...prev,
          { ...proprietorForm, id: `PROP-${Date.now()}`, status: 'active' },
        ])
      }
      setEditingProprietorId(null)
      setProprietorForm({ fullName: '', schoolId: '' })
    }, editingProprietorId ? 'Proprietor updated.' : 'Proprietor added.')
  }

  const onSubmitSubscription = (e) => {
    e.preventDefault()
    if (!subscriptionForm.schoolId || !subscriptionForm.plan || !subscriptionForm.expiryDate) {
      setError('School ID, plan, and expiry date are required.')
      return
    }
    fakeRequest(() => {
      if (editingSubscriptionId) {
        setSubscriptionsState((prev) =>
          prev.map((x) => (x.id === editingSubscriptionId ? { ...x, ...subscriptionForm } : x)),
        )
      } else {
        setSubscriptionsState((prev) => [
          ...prev,
          { ...subscriptionForm, id: `SUB-${Date.now()}`, status: 'active' },
        ])
      }
      setEditingSubscriptionId(null)
      setSubscriptionForm({ schoolId: '', plan: '', expiryDate: '' })
    }, editingSubscriptionId ? 'Subscription updated.' : 'Subscription added.')
  }

  return (
    <DashboardLayout title="Super Admin Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Schools" value={totalSchools} hint="All registered schools" />
        <KpiCard label="Active Subscriptions" value={activeSubscriptions} hint="Subscription control center" />
        <KpiCard label="Revenue" value={revenue} hint="System-wide tracking" />
        <KpiCard label="Expiring Soon" value={expiringCount} hint="Subscriptions due in 14 days" />
      </section>
      {loading ? <p className="mt-3 text-sm text-[#9A8678]">Processing request...</p> : null}
      {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-amber-300">{error}</p> : null}

      <Panel title="School Management" subtitle="Add, edit, delete, and activate schools">
        <form onSubmit={onSubmitSchool} className="mb-4 grid gap-2 sm:grid-cols-4">
          <input
            value={schoolForm.schoolId}
            onChange={(e) => setSchoolForm((p) => ({ ...p, schoolId: e.target.value }))}
            placeholder="schoolId"
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
          />
          <input
            value={schoolForm.name}
            onChange={(e) => setSchoolForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="School name"
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
          />
          <input
            value={schoolForm.proprietor}
            onChange={(e) => setSchoolForm((p) => ({ ...p, proprietor: e.target.value }))}
            placeholder="Proprietor"
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
          />
          <Button type="submit">{editingSchoolId ? 'Update School' : 'Add School'}</Button>
        </form>
        <DataTable
          columns={[
            { key: 'name', label: 'School' },
            { key: 'proprietor', label: 'Proprietor' },
            { key: 'schoolId', label: 'schoolId' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={schoolTableRows}
          emptyText="No schools available."
        />
      </Panel>

      <Panel title="Proprietor Management" subtitle="Manage proprietor records and account status">
        <form onSubmit={onSubmitProprietor} className="mb-4 grid gap-2 sm:grid-cols-3">
          <input
            value={proprietorForm.fullName}
            onChange={(e) => setProprietorForm((p) => ({ ...p, fullName: e.target.value }))}
            placeholder="Full name"
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
          />
          <input
            value={proprietorForm.schoolId}
            onChange={(e) => setProprietorForm((p) => ({ ...p, schoolId: e.target.value }))}
            placeholder="schoolId"
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
          />
          <Button type="submit">{editingProprietorId ? 'Update Proprietor' : 'Add Proprietor'}</Button>
        </form>
        <DataTable
          columns={[
            { key: 'fullName', label: 'Name' },
            { key: 'schoolId', label: 'schoolId' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={proprietorTableRows}
          emptyText="No proprietors available."
        />
      </Panel>

      <Panel title="Subscription Management" subtitle="Manage school subscriptions">
        <form onSubmit={onSubmitSubscription} className="mb-4 grid gap-2 sm:grid-cols-4">
          <input
            value={subscriptionForm.schoolId}
            onChange={(e) => setSubscriptionForm((p) => ({ ...p, schoolId: e.target.value }))}
            placeholder="schoolId"
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
          />
          <input
            value={subscriptionForm.plan}
            onChange={(e) => setSubscriptionForm((p) => ({ ...p, plan: e.target.value }))}
            placeholder="Plan"
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
          />
          <input
            type="date"
            value={subscriptionForm.expiryDate}
            onChange={(e) => setSubscriptionForm((p) => ({ ...p, expiryDate: e.target.value }))}
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
          />
          <Button type="submit">{editingSubscriptionId ? 'Update Subscription' : 'Add Subscription'}</Button>
        </form>
        <DataTable
          columns={[
            { key: 'schoolId', label: 'schoolId' },
            { key: 'plan', label: 'Plan' },
            { key: 'expiryDate', label: 'Expiry' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={subscriptionTableRows}
          emptyText="No subscriptions available."
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
