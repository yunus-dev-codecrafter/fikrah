import { create } from 'zustand'
import { apiPath, isBackendApiEnabled } from '../services/apiConfig'

const STORAGE_KEY = 'fikrah-auth'

const demoAccounts = {
  superadmin: { role: 'super-admin', schoolId: null, fullName: 'Platform Owner', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  proprietor: { role: 'proprietor', schoolId: 'SCH-001', fullName: 'Amina Bello', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  headmaster: { role: 'headmaster', schoolId: 'SCH-001', fullName: 'Mr. Okoro', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  teacher: { role: 'teacher', schoolId: 'SCH-001', fullName: 'Mrs. Adeyemi', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  parent: { role: 'parent', schoolId: 'SCH-001', fullName: 'Mrs. Musa', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
}

function persistSession(user, token) {
  if (user && token) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
  } else {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,

  hydrateFromStorage: () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const { user, token } = JSON.parse(raw)
      if (user && token) set({ user, token })
    } catch {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  },

  validateSession: async () => {
    if (!isBackendApiEnabled()) return
    const { token } = get()
    if (!token) return
    try {
      const res = await fetch(apiPath('/api/auth/me'), {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        get().logout()
        return
      }
      const data = await res.json()
      const u = data.user
      const merged = {
        id: u.id,
        role: u.role,
        schoolId: u.schoolId ?? null,
        fullName: u.fullName,
        username: u.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      set({ user: merged, token })
      persistSession(merged, token)
    } catch {
      get().logout()
    }
  },

  login: async ({ username, password }) => {
    const key = username?.toLowerCase()

    if (!isBackendApiEnabled()) {
      const selected = demoAccounts[key]
      if (!selected) {
        return { ok: false, message: 'Use demo users: superadmin, proprietor, headmaster, teacher, parent' }
      }
      set({ user: selected, token: null })
      persistSession(null, null)
      return { ok: true, role: selected.role }
    }

    try {
      const res = await fetch(apiPath('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: key, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        return { ok: false, message: data.error || 'Login failed' }
      }
      const u = data.user
      const user = {
        id: u.id,
        role: u.role,
        schoolId: u.schoolId ?? null,
        fullName: u.fullName,
        username: u.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      set({ user, token: data.token })
      persistSession(user, data.token)
      return { ok: true, role: user.role }
    } catch {
      return { ok: false, message: 'Could not reach the API. Is the server running?' }
    }
  },

  logout: () => {
    persistSession(null, null)
    set({ user: null, token: null })
  },

  authHeaders: () => {
    const t = get().token
    return t ? { Authorization: `Bearer ${t}` } : {}
  },
}))
