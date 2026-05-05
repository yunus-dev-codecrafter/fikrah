import DashboardLayout from '../../components/layout/DashboardLayout'
import KpiCard from '../../components/ui/KpiCard'
import Panel from '../../components/ui/Panel'
import { useAuthStore } from '../../store/authStore'

function TeacherDashboard() {
  const user = useAuthStore((s) => s.user)
  const status = typeof navigator !== 'undefined' && navigator.onLine ? 'Online' : 'Offline'
  const assignedItems = [
    { id: 'C-01', schoolId: user?.schoolId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), className: 'JSS 1A', subject: 'Mathematics' },
    { id: 'C-02', schoolId: user?.schoolId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), className: 'SS 1', subject: 'Further Mathematics' },
  ]

  return (
    <DashboardLayout title="Teacher Dashboard">
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard 
          label="Assigned Classes" 
          value="2" 
          hint="Form + subject classes"
          trend={12}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          }
        />
        <KpiCard 
          label="Attendance Marked" 
          value="3/4" 
          hint="Today"
          trend={8}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          }
        />
        <KpiCard 
          label="Scores Entered" 
          value="68" 
          hint="Continuous assessment"
          trend={15}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          }
        />
        <KpiCard 
          label="Sync Status" 
          value={status} 
          hint="Offline queue enabled"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          }
        />
      </section>
      
      <Panel title="Assigned Classes & Subjects" subtitle="Backend-ready assignment board">
        <div className="grid gap-4">
          {assignedItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">{item.className}</h3>
                  </div>
                  <p className="text-gray-600 mb-1">{item.subject}</p>
                  <p className="text-xs text-gray-500">School ID: {item.schoolId}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </DashboardLayout>
  )
}

export default TeacherDashboard
