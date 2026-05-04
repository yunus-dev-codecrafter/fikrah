import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import { useAuthStore } from './store/authStore'

function App() {
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage)
  const validateSession = useAuthStore((s) => s.validateSession)

  useEffect(() => {
    hydrateFromStorage()
    validateSession()
  }, [hydrateFromStorage, validateSession])

  return <AppRoutes />
}

export default App
