import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const navByRole = {
  'super-admin': [
    { label: 'Overview', to: '/super-admin' },
    { label: 'Schools', to: '/super-admin' },
    { label: 'Subscriptions', to: '/super-admin' },
  ],
  proprietor: [
    { label: 'Overview', to: '/proprietor' },
    { label: 'Staff', to: '/proprietor' },
    { label: 'Classes', to: '/proprietor' },
  ],
  headmaster: [
    { label: 'Overview', to: '/headmaster' },
    { label: 'Reports', to: '/headmaster/reports' },
    { label: 'Attendance', to: '/headmaster/attendance' },
  ],
  teacher: [
    { label: 'Overview', to: '/teacher' },
    { label: 'Attendance', to: '/teacher/attendance' },
    { label: 'Scores', to: '/teacher/scores' },
  ],
  parent: [
    { label: 'Overview', to: '/parent' },
    { label: 'Report Card', to: '/parent/report-cards' },
    { label: 'Payments', to: '/parent/payments' },
  ],
}

function DashboardLayout({ title, children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const navItems = navByRole[user?.role] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fikrah SaaS</p>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200"
          >
            <span className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </span>
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 md:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl bg-white p-6 shadow-lg shadow-gray-900/5 ring-1 ring-gray-200/50 backdrop-blur-sm h-fit">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <span className="text-white font-bold text-lg">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('-', ' ')}</p>
                {user?.schoolId && (
                  <p className="text-xs text-gray-400">ID: {user.schoolId}</p>
                )}
              </div>
            </div>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.to
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {location.pathname === item.to ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  )}
                </svg>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
