'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { api, getToken, setToken } from './client'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  status: string
}

interface AuthContextValue {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    if (!getToken()) {
      setLoading(false)
      return
    }
    api
      .get<AdminUser>('/auth/me')
      .then((data) => {
        if (!cancelled) setUser(data)
      })
      .catch(() => {
        setToken(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<{ token: string; user: AdminUser }>(
      '/auth/login',
      { email, password },
    )
    setToken(data.token)
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
