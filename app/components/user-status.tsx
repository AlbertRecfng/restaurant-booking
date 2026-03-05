'use client'

import { useAuth } from './auth-provider'
import Link from 'next/link'

export default function UserStatus() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return <div className="text-sm text-gray-500">Загрузка...</div>
  }

  if (!user) {
    return (
      <Link 
        href="/auth" 
        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
      >
        Войти
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700">
        {user.email}
      </span>
      <button
        onClick={signOut}
        className="text-red-500 hover:text-red-700 text-sm font-medium"
      >
        Выйти
      </button>
    </div>
  )
}
