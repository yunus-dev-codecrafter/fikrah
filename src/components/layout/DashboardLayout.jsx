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
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Fikrah SaaS</p>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="mb-3 text-xs text-slate-500">
            {user?.fullName} {user?.schoolId ? `· ${user.schoolId}` : ''}
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  location.pathname === item.to
                    ? 'bg-indigo-50 font-semibold text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="space-y-4">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
