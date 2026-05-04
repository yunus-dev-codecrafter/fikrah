import {
  addAttendanceRecord,
  getAttendanceQueueBySchool,
  removeAttendanceRecord,
} from '../../offline/indexedDb'

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

  // Stage 1 mock sync: in Stage 2 this will POST to backend.
  for (const item of records) {
    await removeAttendanceRecord(item.id)
  }

  return records.length
}
