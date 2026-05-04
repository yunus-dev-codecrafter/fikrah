import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { roleToPath } from '../routes/roleConfig'

function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const result = login(form)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate(roleToPath[result.role], { replace: true })
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-medium text-indigo-700">Fikrah School SaaS</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">
            Stage 1 mock login. Use demo username + any password.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Username</span>
            <input
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              placeholder="e.g. teacher"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none ring-indigo-200 focus:ring-2"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="Any value"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none ring-indigo-200 focus:ring-2"
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            Sign in
          </button>
        </form>

        <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          Demo users: superadmin, proprietor, headmaster, teacher, parent
        </div>
      </div>
    </div>
  )
}

export default Login
