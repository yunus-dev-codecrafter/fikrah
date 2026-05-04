import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getQueuedAttendance, queueAttendance, syncQueuedAttendance } from '../../features/attendance/attendanceQueue'
import { useAuthStore } from '../../store/authStore'

const initialForm = {
  className: '',
  date: '',
  presentCount: '',
  absentCount: '',
}

function TeacherAttendance() {
  const user = useAuthStore((s) => s.user)
  const schoolId = user?.schoolId
  const [form, setForm] = useState(initialForm)
  const [queuedItems, setQueuedItems] = useState([])
  const [message, setMessage] = useState('')

  const loadQueue = async () => {
    if (!schoolId) {
      setQueuedItems([])
      return
    }
    const records = await getQueuedAttendance(schoolId)
    setQueuedItems(records)
  }

  useEffect(() => {
    let cancelled = false

    if (!schoolId) return () => {}

    getQueuedAttendance(schoolId).then((records) => {
      if (!cancelled) {
        setQueuedItems(records)
      }
    })

    return () => {
      cancelled = true
    }
  }, [schoolId])

  const handleQueue = async (e) => {
    e.preventDefault()
    if (!schoolId) return

    await queueAttendance({
      schoolId,
      teacher: user.fullName,
      ...form,
    })

    setForm(initialForm)
    setMessage('Attendance saved to offline queue.')
    loadQueue()
  }

  const handleSync = async () => {
    if (!schoolId) return
    const syncedCount = await syncQueuedAttendance(schoolId)
    setMessage(`${syncedCount} queued attendance records synced.`)
    loadQueue()
  }

  return (
    <DashboardLayout title="Teacher Attendance">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-900">Mark Attendance</p>
        <p className="mb-4 text-sm text-slate-500">
          Works offline. Data is saved locally and can be synced later.
        </p>

        <form onSubmit={handleQueue} className="grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Class (e.g. JSS 1A)"
            value={form.className}
            onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            type="number"
            min="0"
            placeholder="Present count"
            value={form.presentCount}
            onChange={(e) => setForm((p) => ({ ...p, presentCount: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            type="number"
            min="0"
            placeholder="Absent count"
            value={form.absentCount}
            onChange={(e) => setForm((p) => ({ ...p, absentCount: e.target.value }))}
            required
          />

          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">
            Save Offline
          </button>
        </form>

        {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Queued Attendance</h2>
          <button
            onClick={handleSync}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            Sync Queue
          </button>
        </div>

        <ul className="space-y-2">
          {queuedItems.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-medium text-slate-900">
                {item.className} - {item.date}
              </p>
              <p className="text-slate-600">
                Present: {item.presentCount} | Absent: {item.absentCount}
              </p>
            </li>
          ))}
          {queuedItems.length === 0 ? (
            <li className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
              No queued records yet.
            </li>
          ) : null}
        </ul>
      </section>
    </DashboardLayout>
  )
}

export default TeacherAttendance
