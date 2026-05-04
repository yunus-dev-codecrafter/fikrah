const now = new Date().toISOString()

export const schools = [
  { id: 'SCH-001', schoolId: 'SCH-001', name: 'Fikrah Model School', status: 'active', proprietor: 'Amina Bello', createdAt: now, updatedAt: now },
  { id: 'SCH-002', schoolId: 'SCH-002', name: 'Cedar Academy', status: 'pending', proprietor: 'Daniel Udeh', createdAt: now, updatedAt: now },
]

export const subscriptions = [
  { id: 'SUB-001', schoolId: 'SCH-001', plan: 'Premium', expiryDate: '2026-12-31', status: 'active', createdAt: now, updatedAt: now },
  { id: 'SUB-002', schoolId: 'SCH-002', plan: 'Standard', expiryDate: '2026-06-30', status: 'pending', createdAt: now, updatedAt: now },
]

export const staffRecords = [
  { id: 'STF-001', schoolId: 'SCH-001', name: 'Mr. Okoro', role: 'Headmaster', status: 'active', createdAt: now, updatedAt: now },
  { id: 'STF-002', schoolId: 'SCH-001', name: 'Mrs. Adeyemi', role: 'Teacher', status: 'active', createdAt: now, updatedAt: now },
]

export const students = [
  { id: 'STD-001', schoolId: 'SCH-001', name: 'Zainab Musa', className: 'JSS 1A', status: 'active', createdAt: now, updatedAt: now },
  { id: 'STD-002', schoolId: 'SCH-001', name: 'Faruk Musa', className: 'Primary 5', status: 'active', createdAt: now, updatedAt: now },
]
