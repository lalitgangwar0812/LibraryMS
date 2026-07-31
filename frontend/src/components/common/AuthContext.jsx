import { createContext, useContext, useMemo, useState } from 'react'
import { loginUser, registerUser } from './authService'

const AuthContext = createContext(null)

const TOKEN_STORAGE_KEY = 'authToken'
const USER_STORAGE_KEY = 'authUser'

const isTokenValid = (token) => {
  if (!token) {
    return false
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiresAt = payload.exp * 1000

    return Number.isFinite(expiresAt) ? expiresAt > Date.now() : false
  } catch {
    return false
  }
}

const getStoredUser = () => {
  const savedUser = localStorage.getItem(USER_STORAGE_KEY)

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(savedUser)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    const savedUser = getStoredUser()

    if (!savedUser || !savedToken) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
      return false
    }

    const valid = isTokenValid(savedToken)

    if (!valid) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
    }

    return valid
  })

  const login = async (credentials) => {
    const response = await loginUser(credentials)
    const nextUser = {
      email: response.data.email,
      role: response.data.role,
      fullName: response.data.fullName,
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
    setToken(response.data.token)
    setUser(nextUser)
    setIsAuthenticated(true)

    return response.data
  }

  const register = async (userData) => {
    const response = await registerUser(userData)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [isAuthenticated, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }

  return context
}
