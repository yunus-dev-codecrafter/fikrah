import { apiPath, isBackendApiEnabled } from './apiConfig'
import { useAuthStore } from '../store/authStore'

async function apiFetch(path) {
  const token = useAuthStore.getState().token
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(apiPath(path), { headers })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.error || `Request failed (${res.status})`)
  }
  return body
}

export async function fetchAttendanceBySchool(schoolId) {
  if (!isBackendApiEnabled()) return { records: [] }
  const qs = new URLSearchParams({ schoolId })
  return apiFetch(`/api/attendance?${qs.toString()}`)
}

