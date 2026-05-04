import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Panel from '../../components/ui/Panel'
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
      <Panel title="Mark Attendance" subtitle="Offline-first capture and sync">
        <p className="mb-4 text-sm text-[#9A8678]">
          Works offline. Data is saved locally and can be synced later.
        </p>

        <form onSubmit={handleQueue} className="grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
            placeholder="Class (e.g. JSS 1A)"
            value={form.className}
            onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
            type="number"
            min="0"
            placeholder="Present count"
            value={form.presentCount}
            onChange={(e) => setForm((p) => ({ ...p, presentCount: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2 text-[#f3e8df]"
            type="number"
            min="0"
            placeholder="Absent count"
            value={form.absentCount}
            onChange={(e) => setForm((p) => ({ ...p, absentCount: e.target.value }))}
            required
          />

          <Button type="submit" className="sm:col-span-2">
            Save Offline
          </Button>
        </form>

        {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
      </Panel>

      <Panel title="Queued Attendance" right={<Button onClick={handleSync} variant="ghost">Sync Queue</Button>}>

        <ul className="space-y-2">
          {queuedItems.map((item) => (
            <li key={item.id} className="rounded-lg border border-[#9A8678] bg-[#202940]/60 p-3 text-sm">
              <p className="font-medium text-[#f3e8df]">
                {item.className} - {item.date}
              </p>
              <p className="text-[#c9b7ab]">
                Present: {item.presentCount} | Absent: {item.absentCount}
              </p>
            </li>
          ))}
          {queuedItems.length === 0 ? (
            <li className="rounded-lg border border-dashed border-[#9A8678] p-3 text-sm text-[#9A8678]">
              No queued records yet.
            </li>
          ) : null}
        </ul>
      </Panel>
    </DashboardLayout>
  )
}

export default TeacherAttendance
