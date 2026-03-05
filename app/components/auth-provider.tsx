'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  login: string
  role: string
}

interface Session {
  user: User
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = () => {
      try {
        let storedUser = sessionStorage.getItem('user')
        
        if (!storedUser) {
          const cookies = document.cookie.split(';')
          const userCookie = cookies.find(cookie => cookie.trim().startsWith('user_session='))
          if (userCookie) {
            storedUser = decodeURIComponent(userCookie.split('=')[1])
            sessionStorage.setItem('user', storedUser)
          }
        }
        
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setSession({ user: userData })
        }
      } catch (error) {
        console.error('Error parsing stored user:', error)
        sessionStorage.removeItem('user')
        document.cookie = 'user_session=; path=/; max-age=0'
      }
      setLoading(false)
    }

    checkSession()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        if (e.newValue) {
          const userData = JSON.parse(e.newValue)
          setUser(userData)
          setSession({ user: userData })
        } else {
          setUser(null)
          setSession(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const signOut = async () => {
    sessionStorage.removeItem('user')
    document.cookie = 'user_session=; path=/; max-age=0'
    setUser(null)
    setSession(null)
    window.location.href = '/'
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
