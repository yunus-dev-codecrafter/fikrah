import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import { roleToPath } from '../routes/roleConfig'

function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [forgotVisible, setForgotVisible] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const username = form.email.split('@')[0]
    const result = await login({ username, password: form.password })
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate(roleToPath[result.role], { replace: true })
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">Fikrah School SaaS</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-gray-900/5 ring-1 ring-gray-200/50 backdrop-blur-sm">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="teacher@fikrah.app"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full py-3 text-base font-semibold">
              Sign in
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setForgotVisible((v) => !v)}
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>
          </form>

          {forgotVisible && (
            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-amber-800">
                  Password reset is currently being integrated. Please contact your school administrator for assistance.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Demo Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Demo accounts: superadmin, proprietor, headmaster, teacher, parent
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
