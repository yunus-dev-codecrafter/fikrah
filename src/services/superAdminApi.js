import { apiPath } from './apiConfig'
import { useAuthStore } from '../store/authStore'

async function apiFetch(path) {
  const token = useAuthStore.getState().token
  const res = await fetch(apiPath(path), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.error || `Request failed (${res.status})`)
  }
  return body
}

export function fetchSuperAdminSummary() {
  return apiFetch('/api/super-admin/analytics/summary')
}

export function fetchSuperAdminSchools() {
  return apiFetch('/api/super-admin/schools')
}

export function fetchExpiringAlerts() {
  return apiFetch('/api/super-admin/alerts/expiring-subscriptions?withinDays=14')
}

