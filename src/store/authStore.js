import { create } from 'zustand'

const demoAccounts = {
  superadmin: { role: 'super-admin', schoolId: null, fullName: 'Platform Owner', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  proprietor: { role: 'proprietor', schoolId: 'SCH-001', fullName: 'Amina Bello', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  headmaster: { role: 'headmaster', schoolId: 'SCH-001', fullName: 'Mr. Okoro', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  teacher: { role: 'teacher', schoolId: 'SCH-001', fullName: 'Mrs. Adeyemi', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  parent: { role: 'parent', schoolId: 'SCH-001', fullName: 'Mrs. Musa', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
}

export const useAuthStore = create((set) => ({
  user: null,
  login: ({ username }) => {
    const selected = demoAccounts[username?.toLowerCase()]
    if (!selected) {
      return { ok: false, message: 'Use demo users: superadmin, proprietor, headmaster, teacher, parent' }
    }

    set({ user: selected })
    return { ok: true, role: selected.role }
  },
  logout: () => set({ user: null }),
}))
