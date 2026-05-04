const DB_NAME = 'fikrah-offline-db'
const DB_VERSION = 1
const ATTENDANCE_STORE = 'attendance_queue'

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(ATTENDANCE_STORE)) {
        const store = db.createObjectStore(ATTENDANCE_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        })
        store.createIndex('schoolId', 'schoolId', { unique: false })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function addAttendanceRecord(record) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ATTENDANCE_STORE, 'readwrite')
    const store = tx.objectStore(ATTENDANCE_STORE)
    const request = store.add(record)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAttendanceQueueBySchool(schoolId) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ATTENDANCE_STORE, 'readonly')
    const store = tx.objectStore(ATTENDANCE_STORE)
    const request = store.getAll()

    request.onsuccess = () => {
      const records = request.result.filter((item) => item.schoolId === schoolId)
      resolve(records)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function removeAttendanceRecord(id) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ATTENDANCE_STORE, 'readwrite')
    const store = tx.objectStore(ATTENDANCE_STORE)
    const request = store.delete(id)
    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)
  })
}
