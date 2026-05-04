import {
  addAttendanceRecord,
  getAttendanceQueueBySchool,
  removeAttendanceRecord,
} from '../../offline/indexedDb'

export async function queueAttendance(record) {
  return addAttendanceRecord({
    ...record,
    synced: false,
    queuedAt: new Date().toISOString(),
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
