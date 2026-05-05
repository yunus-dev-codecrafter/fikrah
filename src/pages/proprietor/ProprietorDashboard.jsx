import { useMemo, useState } from 'react'
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
  const [staffState, setStaffState] = useState(() => staffRecords)
  const [staffForm, setStaffForm] = useState({ name: '', role: '' })
  const [editingStaffId, setEditingStaffId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const schoolStaff = useMemo(
    () => staffState.filter((x) => x.schoolId === user?.schoolId),
    [staffState, user?.schoolId],
  )
  const schoolStudents = students.filter((x) => x.schoolId === user?.schoolId)

  const fakeRequest = async (handler, successText) => {
    setLoading(true)
    setError('')
    setMessage('')
    await new Promise((resolve) => setTimeout(resolve, 450))
    try {
      handler()
      setMessage(successText)
    } catch (err) {
      setError(err?.message || 'Action failed.')
    } finally {
      setLoading(false)
    }
  }

  const submitStaff = (e) => {
    e.preventDefault()
    if (!staffForm.name || !staffForm.role) {
      setError('Name and role are required.')
      return
    }
    fakeRequest(() => {
      if (editingStaffId) {
        setStaffState((prev) =>
          prev.map((s) => (s.id === editingStaffId ? { ...s, ...staffForm } : s)),
        )
      } else {
        setStaffState((prev) => [
          ...prev,
          {
            id: `STF-${Date.now()}`,
            schoolId: user?.schoolId,
            name: staffForm.name,
            role: staffForm.role,
            status: 'active',
          },
        ])
      }
      setStaffForm({ name: '', role: '' })
      setEditingStaffId(null)
    }, editingStaffId ? 'Staff updated.' : 'Staff added.')
  }

  const staffRows = schoolStaff.map((item) => ({
    ...item,
    status: <StatusBadge status={item.status} />,
    actions: (
      <div className="flex gap-2">
        <Button
          className="px-3 py-1 text-xs"
          onClick={() => {
            setEditingStaffId(item.id)
            setStaffForm({ name: item.name, role: item.role })
          }}
        >
          Edit
        </Button>
        <Button
          className="px-3 py-1 text-xs"
          variant="danger"
          onClick={() =>
            fakeRequest(() => {
              setStaffState((prev) => prev.filter((x) => x.id !== item.id))
            }, 'Staff deleted.')
          }
        >
          Delete
        </Button>
        <Button
          className="px-3 py-1 text-xs"
          variant="ghost"
          onClick={() =>
            fakeRequest(() => {
              setStaffState((prev) =>
                prev.map((x) =>
                  x.id === item.id ? { ...x, status: x.status === 'active' ? 'suspended' : 'active' } : x,
                ),
              )
            }, `Staff ${item.status === 'active' ? 'deactivated' : 'activated'}.`)
          }
        >
          {item.status === 'active' ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    ),
  }))

  return (
    <DashboardLayout title="Proprietor Dashboard">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Sections" value="3" hint="Main, Annex, Nursery" />
        <KpiCard label="Staff Members" value={schoolStaff.length} hint="Role-based workforce" />
        <KpiCard label="Classes" value="24" hint="All active classes" />
        <KpiCard label="Students" value={schoolStudents.length} hint="Registered in school scope" />
      </section>
      {loading ? <p className="mt-3 text-sm text-[#9A8678]">Processing request...</p> : null}
      {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-amber-300">{error}</p> : null}

      <Panel title="Staff Management" subtitle="Assign roles and monitor workforce">
        <form onSubmit={submitStaff} className="mb-4 grid gap-2 sm:grid-cols-3">
          <input
            value={staffForm.name}
            onChange={(e) => setStaffForm((p) => ({ ...p, name: e.target.value }))}
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
            placeholder="Full name"
          />
          <input
            value={staffForm.role}
            onChange={(e) => setStaffForm((p) => ({ ...p, role: e.target.value }))}
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
            placeholder="Role"
          />
          <Button type="submit">{editingStaffId ? 'Update Staff' : 'Add Staff'}</Button>
        </form>
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'role', label: 'Role' },
            { key: 'schoolId', label: 'schoolId' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={staffRows}
          emptyText="No staff records found."
        />
      </Panel>
    </DashboardLayout>
  )
}

export default ProprietorDashboard
