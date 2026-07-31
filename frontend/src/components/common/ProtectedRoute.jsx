import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role?.toUpperCase())) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
