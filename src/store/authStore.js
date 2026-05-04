import { create } from 'zustand'

const demoAccounts = {
  superadmin: { role: 'super-admin', schoolId: null, fullName: 'Platform Owner' },
  proprietor: { role: 'proprietor', schoolId: 'SCH-001', fullName: 'Amina Bello' },
  headmaster: { role: 'headmaster', schoolId: 'SCH-001', fullName: 'Mr. Okoro' },
  teacher: { role: 'teacher', schoolId: 'SCH-001', fullName: 'Mrs. Adeyemi' },
  parent: { role: 'parent', schoolId: 'SCH-001', fullName: 'Mrs. Musa' },
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
