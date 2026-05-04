import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { roleToPath } from './roleConfig'

function ProtectedRoute({ role, children }) {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={roleToPath[user.role] || '/login'} replace />

  return children
}

export default ProtectedRoute
