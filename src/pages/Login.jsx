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
    <div className="flex min-h-dvh items-center justify-center bg-[#202940] px-4 py-6">
      <div className="w-full max-w-md rounded-2xl border border-[#9A8678] bg-[#4B4038] p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-medium text-[#CAAA98]">Fikrah School SaaS</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#f3e8df]">Sign in</h1>
          <p className="mt-1 text-sm text-[#9A8678]">
            Role-based login (demo): superadmin, proprietor, headmaster, teacher, parent
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-[#c9b7ab]">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="teacher@fikrah.app"
              className="w-full rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2.5 text-[#f3e8df] outline-none ring-[#CAAA98] focus:ring-2"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-[#c9b7ab]">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="Any value"
              className="w-full rounded-lg border border-[#9A8678] bg-[#202940]/60 px-3 py-2.5 text-[#f3e8df] outline-none ring-[#CAAA98] focus:ring-2"
            />
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <Button type="submit" className="w-full py-2.5">
            Sign in
          </Button>

          <button
            type="button"
            onClick={() => setForgotVisible((v) => !v)}
            className="text-xs font-medium text-[#9A8678] hover:text-[#CAAA98]"
          >
            Forgot password?
          </button>
        </form>

        {forgotVisible ? (
          <div className="mt-4 rounded-lg border border-[#9A8678] bg-[#202940]/60 p-3 text-xs text-[#c9b7ab]">
            Password reset integration is enabled in backend stage. Contact school admin for now.
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Login
