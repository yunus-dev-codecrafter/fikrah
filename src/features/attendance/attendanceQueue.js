import {
  addAttendanceRecord,
  getAttendanceQueueBySchool,
  removeAttendanceRecord,
} from '../../offline/indexedDb'
import { apiPath, isBackendApiEnabled } from '../../services/apiConfig'
import { useAuthStore } from '../../store/authStore'

export async function queueAttendance(record) {
  const timestamp = new Date().toISOString()
  return addAttendanceRecord({
    ...record,
    synced: false,
    queuedAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  })
}

export async function getQueuedAttendance(schoolId) {
  return getAttendanceQueueBySchool(schoolId)
}

export async function syncQueuedAttendance(schoolId) {
  const records = await getAttendanceQueueBySchool(schoolId)

  if (!isBackendApiEnabled()) {
    for (const item of records) {
      await removeAttendanceRecord(item.id)
    }
    return records.length
  }

  const token = useAuthStore.getState().token
  if (!token) {
    throw new Error('Sign in with the API enabled to sync attendance.')
  }

  const res = await fetch(apiPath('/api/attendance/batch'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      records: records.map((r) => ({
        schoolId: r.schoolId,
        teacher: r.teacher,
        className: r.className,
        date: r.date,
        presentCount: Number(r.presentCount),
        absentCount: Number(r.absentCount),
        queuedAt: r.queuedAt,
        clientQueueId: r.id,
      })),
    }),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.error || 'Sync failed')
  }

  for (const item of records) {
    await removeAttendanceRecord(item.id)
  }

  return records.length
}
