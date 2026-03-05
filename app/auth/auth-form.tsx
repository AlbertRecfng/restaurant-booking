'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase'
import styles from './auth.module.css'

export default function AuthForm() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isSignUp) {
        if (!email || !login || !password) {
          setError('Все поля обязательны для регистрации')
          return
        }

        const userId = crypto.randomUUID()
        
        const userData = {
          id: userId,
          email: email,
          login: login,
          password: password,
          role: login === 'admin' ? 'admin' : 'user'
        }
        
        const { error: insertError } = await supabase
          .from('users')
          .insert(userData)
        
        if (insertError) {
          if (insertError.message.includes('duplicate key') || insertError.message.includes('unique')) {
            setError('Пользователь с таким логином уже существует')
          } else {
            setError(`Ошибка регистрации: ${insertError.message}`)
          }
          return
        }
        
        setSuccess('Регистрация успешна! Теперь вы можете войти.')
        setIsSignUp(false)
        setEmail('')
        setLogin('')
        setPassword('')
      } else {
        if (!login || !password) {
          setError('Логин и пароль обязательны')
          return
        }

        let userData, userError
        
        try {
          const result = await supabase
            .from('users')
            .select('*')
            .eq('login', login)
            .single()
          
          userData = result.data
          userError = result.error
        } catch (err) {
          console.error('Supabase query error:', err)
          setError('Ошибка подключения к базе данных')
          return
        }
        
        console.log('Search result:', { userData, userError, searchLogin: login })
        
        if (userError) {
          console.error('Database error:', userError)
          if (userError.code === 'PGRST116') {
            setError('Пользователь с таким логином не найден')
          } else {
            setError(`Ошибка поиска пользователя: ${userError.message}`)
          }
          return
        }
        
        if (!userData) {
          setError('Пользователь с таким логином не найден')
          return
        }

        if (userData.password !== password) {
          setError('Неверный пароль')
          return
        }

        const sessionData = JSON.stringify({
          id: userData.id,
          email: userData.email,
          login: userData.login,
          role: userData.role
        })
        
        sessionStorage.setItem('user', sessionData)
        document.cookie = `user_session=${sessionData}; path=/; max-age=86400`
        
        if (userData.role === 'admin') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/profile'
        }
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleAuth} className={styles.authForm}>
        <h1 className={styles.authTitle}>
          {isSignUp ? 'Регистрация' : 'Вход'}
        </h1>
        
        <div className={styles.formGroup}>
          <label htmlFor="login">Логин</label>
          <input
            id="login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="ваш логин"
            required
            disabled={loading}
          />
        </div>
        
        {isSignUp && (
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ваш@email.com"
              required
              disabled={loading}
            />
          </div>
        )}
        
        <div className={styles.formGroup}>
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="минимум 6 символов"
            required
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className={styles.authError}>{error}</div>
        )}
        
        {success && (
          <div className={styles.successMessage}>{success}</div>
        )}
        
        <button type="submit" disabled={loading}>
          {loading && <span className={styles.loadingSpinner}></span>}
          {loading ? 'Загрузка...' : (isSignUp ? 'Зарегистрироваться' : 'Войти')}
        </button>
        
        <div className={styles.authToggle}>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setSuccess('')
              setEmail('')
              setLogin('')
              setPassword('')
            }}
            disabled={loading}
          >
            {isSignUp ? 'Уже есть аккаунт? Войдите' : 'Нет аккаунта? Зарегистрируйтесь'}
          </button>
        </div>
      </form>
    </div>
  )
}
