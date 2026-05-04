import { apiPath, isBackendApiEnabled } from './apiConfig'
import { useAuthStore } from '../store/authStore'

async function apiFetch(path, options = {}) {
  const token = useAuthStore.getState().token
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  const res = await fetch(apiPath(path), { ...options, headers })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.error || `Request failed (${res.status})`)
  }
  return body
}

export async function fetchScoresBySchool(schoolId) {
  if (!isBackendApiEnabled()) return { records: [] }
  const qs = new URLSearchParams({ schoolId })
  return apiFetch(`/api/scores?${qs.toString()}`)
}

export async function createScoreRecord(payload) {
  if (!isBackendApiEnabled()) {
    throw new Error('Backend API disabled')
  }
  return apiFetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function reviewScoreRecord(id, payload) {
  if (!isBackendApiEnabled()) {
    throw new Error('Backend API disabled')
  }
  return apiFetch(`/api/scores/${encodeURIComponent(id)}/review`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

